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

    return await this.permissionRepository.save(newPermission);
  }

  async findAll(query: string): Promise<PermissionPaginationResponse> {
    return paginate<PermissionType>(this.permissionRepository, query);
  }

  async searchTerms(regex: string) {
    return await this.findAll(regex);
  }
}
