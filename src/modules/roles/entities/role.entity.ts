import { BaseEntity } from "@/modules/base/entity/base.entity";
import { Permission } from "@/modules/permissions/entities/permission.entity";
import { User } from "@/modules/users/entities/user.entity";
import { Field, ObjectType } from "@nestjs/graphql";
import { BeforeInsert, Column, Entity, OneToMany } from "typeorm";

@ObjectType()
@Entity({ name: "roles" })
export class Role extends BaseEntity {
  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  description: string;

  @OneToMany(() => Permission, (permission) => permission.role, { eager: true })
  @Field(() => [Permission], { nullable: true })
  permissions: {
    id: string;
    name: string;
  }[];

  @OneToMany(() => User, (user) => user.role)
  users: User[];

  @Field()
  @Column()
  isActive: boolean;

  @BeforeInsert()
  setIsActive() {
    this.isActive = true;
  }
}
