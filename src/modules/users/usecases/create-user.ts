import { BadRequestException, ConflictException, Injectable } from "@nestjs/common";
import { Hasher } from "src/modules/crypto/hasher";
import { z } from "zod";
import { User } from "../entities/user.entity";
import { UserRepository } from "../repositories/user.repository";

export type CreateUserUseCaseRequest = {
    name: string;
    email: string;
    password: string;
}

@Injectable()
export class CreateUserUseCase {
    constructor(
        private usersRepository: UserRepository,
        private hasher: Hasher
    ) { }

    async execute({
        name, email, password
    }: CreateUserUseCaseRequest) {
        const { success: isEmailValid, error } = z.email().safeParse(email);

        if (!isEmailValid)
            throw new BadRequestException(error.message);

        const userAlreadyExists = await this.usersRepository.getByEmail(email);

        if (userAlreadyExists)
            throw new ConflictException("Já existe um usuário com este e-mail.");

        const user = User.create({
            name,
            email,
            password: await this.hasher.hash(password)
        });

        await this.usersRepository.create(user);
    }
}