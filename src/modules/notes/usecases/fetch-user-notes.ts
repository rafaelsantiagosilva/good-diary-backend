import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UserRepository } from "src/modules/users/repositories/user.repository";
import { UniqueEntityId } from "src/shared/entities/unique-entity-id";
import { NoteRepository } from "../repositories/note.repository";

type FetchUserNotesUseCaseRequest = {
    authorId: string
}

@Injectable()
export class FetchUserNotesUseCase {
    constructor(
        private userRepository: UserRepository,
        private noteRepository: NoteRepository
    ) { }

    async execute({ authorId }: FetchUserNotesUseCaseRequest) {
        const author = await this.userRepository.getById(new UniqueEntityId(authorId));

        if (!author)
            throw new UnauthorizedException();

        const notes = this.noteRepository.getAllUserNotes(author);
        return notes;
    }
}