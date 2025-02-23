import { BaseEntity } from "@/modules/base/entity/base.entity";
import { Column, Entity } from "typeorm";

@Entity({ name: "permissions" })
export class Permission extends BaseEntity {
  @Column()
  name: string;

  @Column()
  method: string;

  @Column()
  module: string;
}
