import { User } from '@/modules/users/entities/user.entity';
import { UsersResolver } from '@/modules/users/users.resolver';
import { UsersService } from '@/modules/users/users.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersResolver, UsersService],
  exports: [UsersService],
})
export class UsersModule {}
