import { UniqueEntityId } from "src/shared/entities/unique-entity-id";
import { User } from "../entities/user.entity";

export abstract class UserRepository {
    abstract getById(id: UniqueEntityId): Promise<User | null>;
    abstract getByEmail(email: string): Promise<User | null>;
    abstract create(user: User): Promise<void>;
}