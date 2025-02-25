import { paginate } from "@/helpers/pagination.util";
import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { isUUID } from "class-validator";
import { MongoRepository } from "typeorm";
import { v4 as uuid } from "uuid";
import { IUser } from "../users/entities/users";
import { CreatePermissionInput } from "./dto/create-permission.input";
import {
  PermissionPaginationResponse,
  PermissionType,
} from "./dto/permission.dto";
import { UpdatePermissionInput } from "./dto/update-permission.input";
import { Permission } from "./entities/permission.entity";

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: MongoRepository<Permission>
  ) {}

  async findAll(query: string): Promise<PermissionPaginationResponse> {
    const additionalQuery = 'isDeleted=false'
    query = query ? query + `&${additionalQuery}` : additionalQuery
    return paginate<PermissionType>(this.permissionRepository, query);
  }

  async searchTerms(regex: string) {
    return await this.findAll(regex);
  }

  async create(createPermissionDto: CreatePermissionInput, user: IUser) {
    const { name, method } = createPermissionDto;

    const isExist = await this.permissionRepository.findOneBy({
      name,
      method,
    });
    if (isExist) {
      throw new BadRequestException(
        `Permission với name=${name} va method=${method} đã tồn tại!`
      );
    }

    const newPermission = await this.permissionRepository.create({
      ...createPermissionDto,
      id: uuid(),
      createdBy: {
        id: user.id,
        email: user.email,
      },
    });

    return await this.permissionRepository.save(newPermission);
  }

  async checkExistItem(id) {
    if (!isUUID(id)) {
      throw new BadRequestException("Id is incorrect format");
    }

    const findItem = await this.permissionRepository.findOneBy({ id });
    if (!findItem) {
      throw new BadRequestException("Permission does not exist");
    }

    return findItem;
  }

  async updateItem(id: string, updateItemInput: UpdatePermissionInput, user: IUser) {
    const findItem = await this.checkExistItem(id);
    if (!findItem) {
      return false;
    }

    const dataNeedToUpdate = {
      ...findItem,
      ...updateItemInput,
    }

    await this.permissionRepository.updateOne(
      { id },
      {
        $set: {
          ...dataNeedToUpdate,
          updatedBy: {
            _id: user._id,
            email: user.email,
          },
        },
      }
    );

    return dataNeedToUpdate;
  }

  async remove(id: string, user: IUser) {
    const findItem = await this.checkExistItem(id);
    if (!findItem) {
      return false;
    }

    await this.permissionRepository.updateOne(
      { _id: id },
      {
        $set: {
          isDeleted: true,
          deletedBy: {
            _id: user._id,
            email: user.email,
          },
        },
      }
    );

    return true
  }
}
