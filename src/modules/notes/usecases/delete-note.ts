import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { UserRepository } from "src/modules/users/repositories/user.repository";
import { UniqueEntityId } from "src/shared/entities/unique-entity-id";
import { NoteRepository } from "../repositories/note.repository";

type DeleteNoteUseCaseRequest = {
    authorId: string;
    noteId: string;
}

@Injectable()
export class DeleteNoteUseCase {
    constructor(
        private userRepository: UserRepository,
        private noteRepository: NoteRepository
    ) { }

    async execute({ authorId, noteId }: DeleteNoteUseCaseRequest) {
        const author = await this.userRepository.getById(new UniqueEntityId(authorId));
        const note = await this.noteRepository.getById(noteId);

        if (!note)
            throw new BadRequestException("Essa nota não existe.");

        if (!author || author.id !== note.authorId)
            throw new UnauthorizedException();

        await this.noteRepository.deleteNote(note);
    }
}