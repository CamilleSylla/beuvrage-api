import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { RoleList } from "./role.enum";

@Entity()
export class RoleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "enum",
    enum: RoleList,
    default: RoleList.VIEWER,
  })
  name: string;
}
