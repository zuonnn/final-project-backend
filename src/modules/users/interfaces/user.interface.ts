import { BaseRepositoryInterface } from "src/base/repositories/base.interface.repository";
import { User } from "../entities/user.entity";

export interface UserRepositoryInterface extends BaseRepositoryInterface<User> {
}