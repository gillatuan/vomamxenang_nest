import { BaseEntity } from "@/base/entity/base.entity";
import { RegisterUserInput } from "@/modules/users/dto/create-user.input";
import { User } from "@/modules/users/entities/user.entity";
import { Field, ObjectType } from "@nestjs/graphql";
import { BeforeInsert, Column, Entity, OneToMany } from "typeorm";

/* @ObjectType()
export class RoleForeignKey {
  id: string;
  name: string;
} */

@ObjectType()
@Entity({ name: "roles" })
export class Role extends BaseEntity {
  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  description: string;

  /*   @OneToMany(() => Permission, (permission) => permission.role, { cascade: true }) 
  @Field(() => [Permission])
  @JoinTable()
  permissions: {
    id: string;
    name: string;
  }[]; */

  @Field(() => [User], { nullable: true }) // ✅ Define relation explicitly
  @Column()
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
