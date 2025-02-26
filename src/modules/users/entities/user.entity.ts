import { BaseEntity } from "@/modules/base/entity/base.entity";
import { Permission } from "@/modules/permissions/entities/permission.entity";
import { RoleType } from "@/modules/roles/dto/role.dto";
import { Role } from "@/modules/roles/entities/role.entity";
import { Field } from "@nestjs/graphql";
import { Column, Entity, ManyToOne } from "typeorm";
import { RoleEnum } from "../dto/user.dto";

@Entity({ name: "users" })
export class User extends BaseEntity {
  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  providerId?: string;

  @Column()
  phone: string;

  @Column()
  address: string;

  @Column()
  avatar: string;

  @ManyToOne(() => Role, (role) => role.users, { eager: true }) 
  @Field(() => Role)
  role: {
    id: string;
    name: string;
  };

  @Column({ default: false })
  isActive?: boolean;

  @Column()
  codeId: string;

  @Column()
  codeExpired: Date;

  @Column()
  refreshToken: string;
}
