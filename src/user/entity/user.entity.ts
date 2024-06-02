import { RoleOutput } from "src/role/dto/role.output";
import { RoleEntity } from "src/role/entity/role.entity";
import { RoleList } from "src/role/entity/role.enum";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class UsersEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: false, type: String})
    firstName: string;
    
    @Column({nullable: false, type: String})
    lastName: string;

    @ManyToMany(() => RoleEntity, {
        nullable: false,
        cascade: true
    })
    @JoinTable()
    role: RoleOutput[]
}