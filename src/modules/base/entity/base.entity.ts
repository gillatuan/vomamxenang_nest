import { Field, ObjectType } from "@nestjs/graphql";
import { IsUUID } from "class-validator";
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  ObjectId,
  ObjectIdColumn,
} from "typeorm";
import { v4 as uuid } from "uuid";

ObjectType();
export class BaseEntity {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column({ nullable: true })
  @IsUUID()
  id?: string; // Sau này sẽ dùng với class-transformer để serialize dữ liệu response

  @Column()
  @CreateDateColumn({ type: "timestamp" }) // Auto set on insert
  createdAt: Date;
  @Column()
  createdBy: {
    _id: ObjectId;
    email: string;
  };

  @Column()
  @CreateDateColumn({ type: "timestamp" }) // Auto set on insert
  updatedAt: Date;
  @Column()
  updatedBy: {
    _id: ObjectId;
    email: string;
  };

  @Column({ default: null })
  @CreateDateColumn({ type: "timestamp" }) // Auto set on insert
  deletedAt?: Date;

  @Column({ default: false })
  isDeleted: boolean;

  @Column()
  deletedBy: {
    _id: ObjectId;
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
