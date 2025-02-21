import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PermissionsModule } from "../permissions/permissions.module";
import { Role } from "./entities/role.entity";
import { RolesResolver } from "./roles.resolver";
import { RolesService } from "./roles.service";

@Module({
  imports: [TypeOrmModule.forFeature([Role]), PermissionsModule],
  providers: [RolesResolver, RolesService],
  exports: [RolesService],
})
export class RolesModule {}
