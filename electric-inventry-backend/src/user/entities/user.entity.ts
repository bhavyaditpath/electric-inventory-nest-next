import { BaseEntityClass } from "../../shared/base.entity";
import { UserRole } from "../../shared/enums/role.enum";
import { Column, Entity } from "typeorm";

@Entity("users")
export class User extends BaseEntityClass {

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({
    type: "enum",
    enum: UserRole,
  })
  role: UserRole;

  branchId: number;
}
