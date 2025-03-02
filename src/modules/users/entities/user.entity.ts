import { BaseEntity } from '@/base/entity/base.entity';
import { Role } from '@/modules/roles/entities/role.entity';
// import { Role } from '@/modules/roles/entities/role.entity';
import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne } from 'typeorm';

@ObjectType()
@Entity({ name: 'users' })
export class User extends BaseEntity {
  @Field()
  @Column()
  email: string;

  @Field()
  @Column()
  password: string;

  @Field()
  @Column({ nullable: true })
  providerId?: string;

  @Field()
  @Column()
  phone: string;

  @Field()
  @Column()
  address: string;

  @Field()
  @Column()
  avatar: string;

  @Field(() => Role, { nullable: true }) // ✅ Define relation explicitly
  @Column()
  @ManyToOne(() => Role, (role) => role.users, { eager: true })
  role: Role;

  @Field()
  @Column({ default: false })
  isActive?: boolean;

  @Field()
  @Column()
  codeId: string;

  @Field()
  @Column()
  codeExpired: Date;

  @Field()
  @Column()
  refreshToken: string;
}
