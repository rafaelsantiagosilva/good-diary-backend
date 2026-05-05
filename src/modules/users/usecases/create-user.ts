import { ConflictException } from "@nestjs/common";
import { User } from "../entities/user.entity";
import { UserRepository } from "../repositories/user.repository";

export type CreateUserUseCaseRequest = {
    name: string;
    email: string;
    password: string;
}

export class CreateUserUseCase {
    constructor(
        private usersRepository: UserRepository
    ) {}

    async execute({
        name, email, password
    }: CreateUserUseCaseRequest) {
        const userAlreadyExists = await this.usersRepository.getByEmail(email);

        if (userAlreadyExists) 
            throw new ConflictException("Já existe um usuário com este e-mail.");

        const user = User.create({
            name,
            email,
            password
        });

        await this.usersRepository.create(user);
    }
}