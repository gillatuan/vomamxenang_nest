import { ObjectType } from "@nestjs/graphql";
import { IsUUID } from "class-validator";
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  ObjectId,
  ObjectIdColumn,
  PrimaryColumn,
} from "typeorm";
import { v4 as uuid } from "uuid";

@ObjectType()
@Entity()
export class BaseEntity {
  @ObjectIdColumn()
  _id: ObjectId;

  @PrimaryColumn()
  @IsUUID()
  id: string; // Sau này sẽ dùng với class-transformer để serialize dữ liệu response

  @Column()
  @CreateDateColumn({ type: "timestamp" }) // Auto set on insert
  createdAt: Date;
  @Column()
  createdBy: {
    id: string;
    email: string;
  };

  @Column()
  @CreateDateColumn({ type: "timestamp" }) // Auto set on insert
  updatedAt: Date;
  @Column()
  updatedBy: {
    id: string;
    email: string;
  };

  @Column({ default: null })
  @CreateDateColumn({ type: "timestamp" }) // Auto set on insert
  deletedAt?: Date;

  @Column({ default: false })
  isDeleted: boolean;

  @Column()
  deletedBy: {
    id: string;
    email: string;
  };

  @BeforeInsert()
  setCreatedAt() {
    this.id = uuid();
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.isDeleted = false;
  }

  @BeforeUpdate()
  setUpdatedAt() {
    this.updatedAt = new Date();
  }
}
