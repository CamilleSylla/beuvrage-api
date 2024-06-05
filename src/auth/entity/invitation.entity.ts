import { UsersEntity } from "src/user/entity/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, Generated, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class InvitationEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @Generated("uuid")
    uuid: string;

    @CreateDateColumn()
    createdAt: Date

    @OneToOne(() => UsersEntity, user => user.invitation)
    user: UsersEntity;
}