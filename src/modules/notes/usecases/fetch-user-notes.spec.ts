import { UnauthorizedException } from "@nestjs/common";
import { StubCrypter } from "src/modules/crypto/stub/stub-crypter";
import { InMemoryUserRepository } from "src/modules/users/repositories/in-memory-user.repository";
import { NoteFactory } from "test/factories/note.factory";
import { UserFactory } from "test/factories/user.factory";
import { InMemoryNoteRepository } from "../repositories/in-memory-note.repository";
import { FetchUserNotesUseCase } from "./fetch-user-notes";

describe("Fetch User Notes", () => {
    let inMemoryUserRepository: InMemoryUserRepository;
    let inMemoryNoteRepository: InMemoryNoteRepository;
    let stubCrypter: StubCrypter;
    let sut: FetchUserNotesUseCase;

    beforeEach(() => {
        inMemoryUserRepository = new InMemoryUserRepository();
        inMemoryNoteRepository = new InMemoryNoteRepository();
        stubCrypter = new StubCrypter();
        sut = new FetchUserNotesUseCase(
            inMemoryUserRepository,
            inMemoryNoteRepository,
            stubCrypter
        );
    });

    it("should be able to get the user notes", async () => {
        const user = UserFactory.makeDomainUser();
        await inMemoryUserRepository.create(user);

        await inMemoryNoteRepository.addUserNote(NoteFactory.makeDomainNote(user.id));
        await inMemoryNoteRepository.addUserNote(NoteFactory.makeDomainNote(user.id));

        const response = await sut.execute({ authorId: user.id });
        expect(response).toHaveLength(2);
    });

    it("should not be able to fetch notes of a inexisting user", async () => {
        expect(async () => {
            await sut.execute({
                authorId: "inexisting-user-id",
            });
        }).rejects.toThrow(UnauthorizedException);
    });
})