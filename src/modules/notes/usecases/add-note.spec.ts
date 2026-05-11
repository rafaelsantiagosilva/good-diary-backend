import { UnauthorizedException } from "@nestjs/common";
import { User } from "src/modules/users/entities/user.entity";
import { InMemoryUserRepository } from "src/modules/users/repositories/in-memory-user.repository";
import { InMemoryNoteRepository } from "../repositories/in-memory-note.repository";
import { AddNoteUseCase } from "./add-note";
import { StubCrypter } from "src/modules/crypto/stub/stub-crypter";

describe("Add Note Use Case", () => {
    let inMemoryUserRepository: InMemoryUserRepository;
    let inMemoryNoteRepository: InMemoryNoteRepository;
    let stubCrypter: StubCrypter;
    let sut: AddNoteUseCase;

    beforeEach(() => {
        inMemoryUserRepository = new InMemoryUserRepository();
        inMemoryNoteRepository = new InMemoryNoteRepository();
        stubCrypter = new StubCrypter();
        sut = new AddNoteUseCase(
            inMemoryUserRepository,
            inMemoryNoteRepository,
            stubCrypter
        );
    });

    it("should be able to create a new note", async () => {
        const user = User.create({
            name: "John Doe",
            email: "john.doe@email.com",
            password: "pass123"
        });

        await inMemoryUserRepository.create(user);

        await sut.execute({
            authorId: user.id,
            title: "Creating note use case",
            description: "Testing the create note use case"
        });

        expect(inMemoryNoteRepository.data).toHaveLength(1);
    });

    it("should not be able to create a new note to a inexisting user", async () => {
        expect(async () => {
            await sut.execute({
                authorId: "inexisting-user-id",
                title: "Creating note use case",
                description: "Testing the create note use case"
            });
        }).rejects.toThrow(UnauthorizedException);
    });
})