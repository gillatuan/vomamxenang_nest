import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MongoRepository } from "typeorm";
import { IUser } from "../users/entities/users";
import { CreateRoleInput } from "./dto/create-role.input";
import { Role } from "./entities/role.entity";

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: MongoRepository<Role>
  ) {}

  async create(createItemInput: CreateRoleInput, user: IUser) {
    const { name, description, isActive } = createItemInput;

    const isExist = await this.roleRepository.findOneBy({ name });
    if (isExist) {
      throw new BadRequestException(`Role với name="${name}" đã tồn tại!`);
    }

    /* const newRole = await this.roleRepository.create({
      name,
      description,
      isActive,
      permissions,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });

    return {
      _id: newRole?._id,
      createdAt: newRole?.createdAt,
    }; */

    return {
      name,
      description,
    };
  }
}
