import { UnauthorizedException } from "@nestjs/common";
import { InMemoryUserRepository } from "src/modules/users/repositories/in-memory-user.repository";
import { UserFactory } from "test/factories/user.factory";
import { InMemoryNoteRepository } from "../repositories/in-memory-note.repository";
import { FetchUserNotesUseCase } from "./fetch-user-notes";
import { NoteFactory } from "test/factories/note.factory";

describe("Fetch User Notes", () => {
    let inMemoryUserRepository: InMemoryUserRepository;
    let inMemoryNoteRepository: InMemoryNoteRepository;
    let sut: FetchUserNotesUseCase;

    beforeEach(() => {
        inMemoryUserRepository = new InMemoryUserRepository();
        inMemoryNoteRepository = new InMemoryNoteRepository();
        sut = new FetchUserNotesUseCase(inMemoryUserRepository, inMemoryNoteRepository);
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