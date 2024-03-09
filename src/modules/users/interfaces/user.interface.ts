import { BaseRepositoryInterface } from "src/repositories/base/base.interface.repository";
import { User } from "../entities/user.entity";

export interface UserRepositoryInterface extends BaseRepositoryInterface<User> {
    findByEmail(email: string): Promise<User | undefined>;
}