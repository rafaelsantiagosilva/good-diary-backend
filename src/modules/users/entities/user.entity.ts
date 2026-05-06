import { Entity } from "src/shared/entities/entity";
import { UniqueEntityId } from "src/shared/entities/unique-entity-id";

export type UserProps = {
    name: string;
    email: string;
    password: string;
}

export class User extends Entity<UserProps> {
    static create(props: UserProps, id?: UniqueEntityId) {
        const user = new User(props, id ?? new UniqueEntityId());
        return user;
    }

    get id(): string {
        return this.id.toString();
    }

    get name() {
        return this.props.name;
    }

    get email() {
        return this.props.email;
    }

    get password() {
        return this.props.password;
    }
}