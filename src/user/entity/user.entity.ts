import { Role } from "src/role/entity/role.entity";
import { RoleList } from "src/role/entity/role.enum";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Users {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: false, type: String})
    fistName: string;
    
    @Column({nullable: false, type: String})
    lastName: string;

    @ManyToMany(() => Role, {
        nullable: false,
    })
    @JoinTable()
    role: RoleList[]
}