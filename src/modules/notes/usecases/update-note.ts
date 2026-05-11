import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { UserRepository } from "src/modules/users/repositories/user.repository";
import { Note } from "../entities/notes.entitiy";
import { NoteRepository } from "../repositories/note.repository";
import { UniqueEntityId } from "src/shared/entities/unique-entity-id";

type UpdateNoteUseCaseRequest = {
    authorId: string;
    note: Omit<Note, "authorId" | "createdAt" | "updatedAt" | "equals">;
}

@Injectable()
export class UpdateNoteUseCase {
    constructor(
        private userRepository: UserRepository,
        private noteRepository: NoteRepository
    ) { }

    async execute({ authorId, note }: UpdateNoteUseCaseRequest) {
        const author = await this.userRepository.getById(new UniqueEntityId(authorId));
        const noteInDatabase = await this.noteRepository.getById(note.id);

        if (!noteInDatabase)
            throw new BadRequestException("Essa nota não existe.");

        if (!author || noteInDatabase.authorId !== author.id)
            throw new UnauthorizedException();

        noteInDatabase.title = note.title;
        noteInDatabase.description = note.description;

        await this.noteRepository.save(noteInDatabase);
    }
}