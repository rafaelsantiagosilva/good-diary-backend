import { User as DomainUser } from "src/modules/users/entities/user.entity";
import { UniqueEntityId } from "src/shared/entities/unique-entity-id";
import { UserModel as PrismaUser } from "../generated/models/User";

export class PrismaUserMapper {
    static toDomain({ id, ...rest }: PrismaUser): DomainUser {
        return DomainUser.create({
            ...rest
        }, new UniqueEntityId(id));
    }

    static toPrisma({ id, name, email, password }: DomainUser): PrismaUser {
        return {
            id,
            name,
            email,
            password
        }
    }
}