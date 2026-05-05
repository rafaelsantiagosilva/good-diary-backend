import { User } from "../entities/user.entity";

export interface UserRepository {
    getByEmail(email: string): Promise<User | null>;
    create(user: User): Promise<void>;
}