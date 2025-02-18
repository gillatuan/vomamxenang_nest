import { paginate } from '@/helpers/pagination.util';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import aqp from 'api-query-params';
import { MongoRepository } from 'typeorm';
import { UserType } from '../users/dto/user.dto';
import { IUser } from '../users/entities/users';
import { CreatePermissionInput } from './dto/create-permission.input';
import { PermissionPaginationResponse, PermissionType } from './dto/permission.dto';
import { UpdatePermissionInput } from './dto/update-permission.input';
import { Permission } from './entities/permission.entity';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: MongoRepository<Permission>,
  ) {}

  async create(createPermissionDto: CreatePermissionInput, user: IUser) {
    const { name, apiPath, method, module } = createPermissionDto;

    const isExist = await this.permissionRepository.findOneBy({
      apiPath,
      method,
    });
    if (isExist) {
      throw new BadRequestException(
        `Permission với apiPath=${apiPath} , method=${method} đã tồn tại!`,
      );
    }

    const newPermission = await this.permissionRepository.create({
      name,
      apiPath,
      method,
      module,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });

    return {
      _id: newPermission?._id,
      createdAt: newPermission?.createdAt,
    };
  }

  async findAll(query: string): Promise<PermissionPaginationResponse> {
    return paginate<PermissionType>(this.permissionRepository, query);
  }

  findOne(id: number) {
    return `This action returns a #${id} permission`;
  }

  update(id: number, updatePermissionInput: UpdatePermissionInput) {
    return `This action updates a #${id} permission`;
  }

  remove(id: number) {
    return `This action removes a #${id} permission`;
  }
}
