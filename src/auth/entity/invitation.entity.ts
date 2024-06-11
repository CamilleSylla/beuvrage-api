import { UsersEntity } from 'src/user/entity/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class InvitationEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  @Generated('uuid')
  uuid: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToOne(() => UsersEntity, (user) => user.invitation)
  user: UsersEntity;
}
