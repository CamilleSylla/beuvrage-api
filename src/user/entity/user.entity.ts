import { InvitationEntity } from 'src/auth/entity/invitation.entity';
import { RoleOutput } from 'src/role/dto/role.output';
import { RoleEntity } from 'src/role/entity/role.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class UsersEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ nullable: false, type: String })
  firstName: string;

  @Column({ nullable: false, type: String })
  lastName: string;

  @Column({ nullable: false, type: String, unique: true })
  email: string;

  @Column({ nullable: true, type: String, default: null, select: false })
  password: string;

  @ManyToMany(() => RoleEntity, {
    nullable: false,
    cascade: true,
  })
  @JoinTable()
  role: RoleOutput[];

  @Column({ nullable: false, default: false })
  verify: boolean;

  @OneToOne(() => InvitationEntity, { cascade: true, onDelete: 'SET NULL' })
  @JoinColumn()
  invitation: InvitationEntity;

  @Column({ type: Date, nullable: true, default: null, select: false })
  last_login: Date;
}
