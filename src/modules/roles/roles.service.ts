import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { isUUID } from "class-validator";
import { MongoRepository } from "typeorm";
import { IUser } from "../users/entities/users";
import { CreateRoleInput } from "./dto/create-role.input";
import { UpdateRoleInput } from "./dto/update-role.input";
import { Role } from "./entities/role.entity";

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: MongoRepository<Role>
  ) {}

  async create(createRoleInput: CreateRoleInput, user: IUser) {
    const { name, description, isActive } = createRoleInput;

    const isExist = await this.roleRepository.findOneBy({ name });
    if (isExist) {
      throw new BadRequestException(`Role với name="${name}" đã tồn tại!`);
    }
    
    const newRole = await this.roleRepository.create({
      name,
      description,
      isActive,
      permissions: [],
      createdBy: {
        _id: user._id,
        email: user.email
      }
    });

    return await this.roleRepository.save(newRole);
  }

  async checkExistItem(id) {
    if (!isUUID(id)) {
      return `Id is incorrect format`;
    }

    const findItem = await this.roleRepository.findOneBy({ id });
    if (!findItem) {
      throw new BadRequestException("Permission does not exist");
    }

    return findItem;
  }

  async updateItem(id: string, updateItemInput: UpdateRoleInput, user: IUser) {
    if (!this.checkExistItem(id)) {
      return false;
    }

    await this.roleRepository.updateOne(
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
}
