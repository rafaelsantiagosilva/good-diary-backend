import { BadRequestException, UnauthorizedException } from "@nestjs/common";
import { InMemoryUserRepository } from "src/modules/users/repositories/in-memory-user.repository";
import { NoteFactory } from "test/factories/note.factory";
import { UserFactory } from "test/factories/user.factory";
import { InMemoryNoteRepository } from "../repositories/in-memory-note.repository";
import { DeleteNoteUseCase } from "./delete-note";

describe("Delete Note Use Case", () => {
    let inMemoryUserRepository: InMemoryUserRepository;
    let inMemoryNoteRepository: InMemoryNoteRepository;
    let sut: DeleteNoteUseCase;

    beforeEach(() => {
        inMemoryUserRepository = new InMemoryUserRepository();
        inMemoryNoteRepository = new InMemoryNoteRepository();
        sut = new DeleteNoteUseCase(inMemoryUserRepository, inMemoryNoteRepository);
    });

    it("should be to delete a note", async () => {
        const user = UserFactory.makeDomainUser()
        await inMemoryUserRepository.create(user);

        const note = NoteFactory.makeDomainNote(user.id);
        await inMemoryNoteRepository.addUserNote(note);

        await sut.execute({
            authorId: user.id,
            noteId: note.id
        });

        expect(inMemoryNoteRepository.data).toHaveLength(0);
    });

    it("should not be able to delete an inexisting note", async () => {
        const user = UserFactory.makeDomainUser()
        await inMemoryUserRepository.create(user);

        const note = NoteFactory.makeDomainNote(user.id);

        expect(async () => {
            await sut.execute({
                authorId: user.id,
                noteId: note.id
            });
        }).rejects.toThrow(BadRequestException);
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
                noteId: note.id
            });
        }).rejects.toThrow(UnauthorizedException);
    });
})