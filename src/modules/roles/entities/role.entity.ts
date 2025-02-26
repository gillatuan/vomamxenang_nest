import { BaseEntity } from "@/modules/base/entity/base.entity";
import { PermissionTypeToValidate } from "@/modules/permissions/dto/permission.dto";
import { Permission } from "@/modules/permissions/entities/permission.entity";
import { User } from "@/modules/users/entities/user.entity";
import { Field, ObjectType } from "@nestjs/graphql";
import { BeforeInsert, Column, Entity, JoinTable, OneToMany } from "typeorm";

@ObjectType()
@Entity({ name: "roles" })
export class Role extends BaseEntity {
  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  description: string;

  @OneToMany(() => Permission, (permission) => permission.role, { cascade: true }) 
  @Field(() => [Permission])
  @JoinTable()
  permissions: {
    id: string;
    name: string;
  }[];

  @Field(() => [Permission], { nullable: true })
  @Column()
  users: User[];

  @Field()
  @Column()
  isActive: boolean;

  @BeforeInsert()
  setIsActive() {
    this.isActive = true;
  }
}
