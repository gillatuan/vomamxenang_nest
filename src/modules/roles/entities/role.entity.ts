import { BaseEntity } from "@/modules/base/entity/base.entity";
import { Column, Entity, ObjectId } from "typeorm";

@Entity({ name: "roles" })
export class Role extends BaseEntity {
  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  isActive: boolean;

/*   @Column(() => ObjectId)
  permissions: ObjectId[]; */
}
