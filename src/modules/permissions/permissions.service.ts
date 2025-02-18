import { paginate } from "@/helpers/pagination.util";
import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { isUUID } from "class-validator";
import { MongoRepository } from "typeorm";
import { v4 as uuid } from "uuid";
import { IUser } from "../users/entities/users";
import { CreateItemInput } from "./dto/create-permission.input";
import {
  PermissionPaginationResponse,
  PermissionType,
} from "./dto/permission.dto";
import { UpdateItemInput } from "./dto/update-permission.input";
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

  async create(createPermissionDto: CreateItemInput, user: IUser) {
    const { name, apiPath, method } = createPermissionDto;

    const isExist = await this.permissionRepository.findOneBy({
      name,
      apiPath,
      method,
    });
    if (isExist) {
      throw new BadRequestException(
        `Permission với name=${name}, apiPath=${apiPath} va method=${method} đã tồn tại!`
      );
    }

    const newPermission = await this.permissionRepository.create({
      ...createPermissionDto,
      id: uuid(),
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });

    return await this.permissionRepository.save(newPermission);
  }

  async checkExistItem(id) {
    if (!isUUID(id)) {
      return `not found user`;
    }

    const findItem = await this.permissionRepository.findOneBy({ id });
    if (!findItem) {
      throw new BadRequestException("Permission does not exist");
    }

    return findItem;
  }

  async updateItem(id: string, updateItemInput: UpdateItemInput, user: IUser) {
    if (!this.checkExistItem(id)) {
      return false;
    }

    await this.permissionRepository.updateOne(
      { id },
      {
        $set: {
          ...updateItemInput,
          updatedBy: {
            _id: user._id,
            email: user.email,
          },
        },
      }
    );

    return updateItemInput;
  }

  async remove(id: string, user: IUser) {
    if (!this.checkExistItem(id)) {
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
