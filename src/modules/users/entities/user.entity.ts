import { Entity } from "src/shared/entities/entity";
import { UniqueEntityId } from "src/shared/entities/unique-entity-id";

export type UserProps = {
    name: string;
    email: string;
    password: string;
}

export class User extends Entity<UserProps> {
    static create(props: UserProps, id?: UniqueEntityId) {
        const user = new User(props, id);
        return user;
    }
}