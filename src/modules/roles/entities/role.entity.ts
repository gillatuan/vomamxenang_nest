import { BaseEntity } from "@/modules/base/entity/base.entity";
import { Permission } from "@/modules/permissions/entities/permission.entity";
import { ObjectType } from "@nestjs/graphql";
import { BeforeInsert, Column, Entity, JoinTable, ObjectId, OneToMany } from "typeorm";

@ObjectType()
@Entity({ name: "roles" })
export class Role extends BaseEntity {
  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  permissions: Permission[];

  @Column()
  isActive: boolean;

  @BeforeInsert()
  setIsActive() {
    this.isActive = true;
  }
}
