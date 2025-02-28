import { User } from '@/modules/users/entities/user.entity';
import { UsersResolver } from '@/modules/users/users.resolver';
import { UsersService } from '@/modules/users/users.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from '../roles/entities/role.entity';
import { RolesModule } from '../roles/roles.module';
// import { Role } from '../roles/entities/role.entity';
// import { RolesModule } from '../roles/roles.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role])],
  providers: [UsersResolver, UsersService],
  exports: [UsersService],
})
export class UsersModule {}
