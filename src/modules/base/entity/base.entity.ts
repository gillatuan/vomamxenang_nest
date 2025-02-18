import { Field, ObjectType } from "@nestjs/graphql";
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  ObjectId,
  ObjectIdColumn,
} from "typeorm";

ObjectType();
export class BaseEntity {
  @ObjectIdColumn()
  _id: ObjectId;

  @Field()
  @Column()
  id: string; // Sau này sẽ dùng với class-transformer để serialize dữ liệu response

  @Column({ default: null })
  @Field()
  @CreateDateColumn({ type: "timestamp" }) // Auto set on insert
  createdAt: Date;
  @Column()
  createdBy: {
    _id: ObjectId;
    email: string;
  };

  @Column({ default: null })
  @Field()
  @CreateDateColumn({ type: "timestamp" }) // Auto set on insert
  updatedAt: Date;
  @Column()
  updatedBy: {
    _id: ObjectId;
    email: string;
  };

  @Column({ default: null })
  @Field()
  @CreateDateColumn({ type: "timestamp" }) // Auto set on insert
  deletedAt: Date;
  @Column()
  isDeleted: boolean;
  @Column()
  deletedBy: {
    _id: ObjectId;
    email: string;
  };

  @BeforeInsert()
  setCreatedAt() {
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  @BeforeUpdate()
  setUpdatedAt() {
    this.updatedAt = new Date();
  }
}
