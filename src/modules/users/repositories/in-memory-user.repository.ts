import { UniqueEntityId } from "src/shared/entities/unique-entity-id";
import { User } from "../entities/user.entity";
import { UserRepository } from "./user.repository";

export class InMemoryUserRepository implements UserRepository {
    private data: User[] = [];

    async getById(id: UniqueEntityId): Promise<User | null> {
        return this.data.find(user => user.id === id.toString()) ?? null;
    }

    async getByEmail(email: string): Promise<User | null> {
        return this.data.find(user => user.email === email) ?? null;
    }

    async create(user: User): Promise<void> {
        this.data.push(user);
    }

}