import { BaseEntity } from "@/modules/base/entity/base.entity";
import { Role } from "@/modules/roles/entities/role.entity";
import { Field } from "@nestjs/graphql";
import { Column, Entity, ManyToOne } from "typeorm";

@Entity({ name: "permissions" })
export class Permission extends BaseEntity {
  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  method: string;

  @Field()
  @Column()
  module: string;

  @ManyToOne(() => Role, (role) => role.permissions, { onDelete: "CASCADE" })
  @Field(() => Role)
  role: Role;
}
