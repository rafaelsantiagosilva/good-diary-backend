import { ConflictException } from "@nestjs/common";
import { InMemoryUserRepository } from "../repositories/in-memory-user.repository"
import { CreateUserUseCase } from "./create-user";

describe("Create User Use Case", () => {
    let inMemoryUserRepository: InMemoryUserRepository;
    let sut: CreateUserUseCase;

    beforeEach(() => {
        inMemoryUserRepository = new InMemoryUserRepository();
        sut = new CreateUserUseCase(inMemoryUserRepository);
    });

    it("should be able to create an user", async () => {
        await sut.execute({
            name: "John Doe",
            email: "john.doe@email.com",
            password: "pass123"
        });

        expect(inMemoryUserRepository.data).toHaveLength(1);
    });

    it("should not be able to create a user with the same email from another user", async () => {
        const email = "john.doe@email.com";
        await sut.execute({
            name: "John Doe",
            email,
            password: "pass123"
        });

        await expect(async () => {
            await sut.execute({
                name: "John Doe",
                email,
                password: "pass123"
            });
        }).rejects.toThrow(ConflictException);
    })
})