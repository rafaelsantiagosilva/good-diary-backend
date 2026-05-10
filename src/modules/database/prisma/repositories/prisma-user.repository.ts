import { User } from "src/modules/users/entities/user.entity";
import { UserRepository } from "src/modules/users/repositories/user.repository";
import { UniqueEntityId } from "src/shared/entities/unique-entity-id";
import { PrismaUserMapper } from "../mappers/prisma-user.mapper";
import { PrismaService } from "../prisma.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PrismaUserRepository extends UserRepository {
    constructor(private prisma: PrismaService) {
        super();
    }

    async getById(id: UniqueEntityId): Promise<User | null> {
        const prismaUser = await this.prisma.client.user.findUnique({
            where: {
                id: id.toString()
            }
        });

        if (!prismaUser)
            return null;

        return PrismaUserMapper.toDomain(prismaUser);
    }

    async getByEmail(email: string): Promise<User | null> {
        const prismaUser = await this.prisma.client.user.findUnique({
            where: {
                email
            }
        });

        if (!prismaUser)
            return null;

        return PrismaUserMapper.toDomain(prismaUser);
    }

    async create(user: User): Promise<void> {
        await this.prisma.client.user.create({
            data: PrismaUserMapper.toPrisma(user)
        });
    }
}