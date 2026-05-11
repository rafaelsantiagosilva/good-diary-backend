import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { Crypter } from "src/modules/crypto/crypter";
import { UserRepository } from "src/modules/users/repositories/user.repository";
import { UniqueEntityId } from "src/shared/entities/unique-entity-id";
import { Note } from "../entities/notes.entitiy";
import { NoteRepository } from "../repositories/note.repository";

type UpdateNoteUseCaseRequest = {
    authorId: string;
    note: Omit<Note, "authorId" | "createdAt" | "updatedAt" | "equals">;
}

@Injectable()
export class UpdateNoteUseCase {
    constructor(
        private userRepository: UserRepository,
        private noteRepository: NoteRepository,
        private crypter: Crypter
    ) { }

    async execute({ authorId, note }: UpdateNoteUseCaseRequest) {
        const author = await this.userRepository.getById(new UniqueEntityId(authorId));
        const noteInDatabase = await this.noteRepository.getById(note.id);

        if (!noteInDatabase)
            throw new BadRequestException("Essa nota não existe.");

        if (!author || noteInDatabase.authorId !== author.id)
            throw new UnauthorizedException();

        noteInDatabase.title = this.crypter.encrypt(note.title, authorId);
        noteInDatabase.description = note.description.length > 0 ? this.crypter.encrypt(note.description, authorId) : "";

        await this.noteRepository.save(noteInDatabase);
    }
}