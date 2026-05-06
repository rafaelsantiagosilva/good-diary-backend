import { UniqueEntityId } from "src/shared/entities/unique-entity-id";
import { User } from "../entities/user.entity";

export interface UserRepository {
    getById(id: UniqueEntityId): Promise<User | null>;
    getByEmail(email: string): Promise<User | null>;
    create(user: User): Promise<void>;
}