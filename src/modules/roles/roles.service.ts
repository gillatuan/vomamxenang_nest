import { BadRequestException, Injectable } from '@nestjs/common';
import { IUser } from '../users/entities/users';
import { CreateRoleInput } from '@/modules/roles/dto/create-role.input';
import { UpdateRoleInput } from '@/modules/roles/dto/update-role.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>
  ) {}
  
  async create(createRoleInput: CreateRoleInput, currentUser: IUser) {
    const { name, description, isActive } = createRoleInput;

    const isExist = await this.roleRepository.findOneBy({ name });
    if (isExist) {
      throw new BadRequestException(`Role với name="${name}" đã tồn tại!`);
    }

    const newRole = await this.roleRepository.create({
      name,
      description,
      isActive,
      createdBy: {
        id: currentUser.id,
        email: currentUser.email,
      },
    });

    await this.roleRepository.save(newRole);
    return newRole
  }

  findAll() {
    return `This action returns all roles`;
  }

  findOne(id: number) {
    return `This action returns a #${id} role`;
  }

  update(id: number, updateRoleInput: UpdateRoleInput) {
    return `This action updates a #${id} role`;
  }

  remove(id: number) {
    return `This action removes a #${id} role`;
  }
}
