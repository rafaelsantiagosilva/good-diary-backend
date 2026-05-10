import { User, UserProps } from "src/modules/users/entities/user.entity";

export class UserFactory {
    static makeDomainUser(props?: UserProps): User {
        return User.create({
            name: props?.name ?? "John Doe",
            email: props?.email ?? "john.doe@email.com",
            password: props?.password ?? "pass1234"
        });
    }
}