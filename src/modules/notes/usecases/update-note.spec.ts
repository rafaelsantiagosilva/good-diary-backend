import { UnauthorizedException } from "@nestjs/common";
import { InMemoryUserRepository } from "src/modules/users/repositories/in-memory-user.repository";
import { NoteFactory } from "test/factories/note.factory";
import { UserFactory } from "test/factories/user.factory";
import { InMemoryNoteRepository } from "../repositories/in-memory-note.repository";
import { UpdateNoteUseCase } from "./update-note";

describe("Update Note Use Case", () => {
    let inMemoryUserRepository: InMemoryUserRepository;
    let inMemoryNoteRepository: InMemoryNoteRepository;
    let sut: UpdateNoteUseCase;

    beforeEach(() => {
        inMemoryUserRepository = new InMemoryUserRepository();
        inMemoryNoteRepository = new InMemoryNoteRepository();
        sut = new UpdateNoteUseCase(inMemoryUserRepository, inMemoryNoteRepository);
    });

    it("should be to update a note", async () => {
        const user = UserFactory.makeDomainUser()
        await inMemoryUserRepository.create(user);

        const note = NoteFactory.makeDomainNote(user.id);
        await inMemoryNoteRepository.addUserNote(note);

        note.title = "A new title";

        await sut.execute({
            authorId: user.id,
            note: note
        });

        expect(inMemoryNoteRepository.data[0].title).toEqual(note.title);
        expect(inMemoryNoteRepository.data[0].updatedAt).toEqual(note.updatedAt);
    });

    it("should not be able to update an inexisting note", async () => {
        const user = UserFactory.makeDomainUser()
        await inMemoryUserRepository.create(user);

        const note = NoteFactory.makeDomainNote(user.id);
        note.title = "A new title";

        expect(async () => {
            await sut.execute({
                authorId: user.id,
                note: note
            });
        }).rejects.toThrow(UnauthorizedException);
    });

    it("should not be able to update a note from another user", async () => {
        const user = UserFactory.makeDomainUser()
        await inMemoryUserRepository.create(user);

        const note = NoteFactory.makeDomainNote(user.id);
        await inMemoryNoteRepository.addUserNote(note);

        note.title = "A new title";

        const newUser = UserFactory.makeDomainUser();

        expect(async () => {
            await sut.execute({
                authorId: newUser.id,
                note: note
            });
        }).rejects.toThrow(UnauthorizedException);
    });
})