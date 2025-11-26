import { BaseEntityClass } from "src/shared/base.entity";
import { UserRole } from "src/shared/enums/role.enum";
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
    default: UserRole.BRANCH,
  })
  role: UserRole;
}
