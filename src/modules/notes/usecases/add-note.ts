import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UserRepository } from "src/modules/users/repositories/user.repository";
import { UniqueEntityId } from "src/shared/entities/unique-entity-id";
import { Note } from "../entities/notes.entitiy";
import { NoteRepository } from "../repositories/note.repository";

export type AddNoteUseCaseRequest = {
    userId: string;
    title: string;
    description: string;
};

@Injectable()
export class AddNoteUseCase {
    constructor(
        private userRepository: UserRepository,
        private noteRepository: NoteRepository
    ) { }

    async execute({
        userId, title, description
    }: AddNoteUseCaseRequest) {
        const user = await this.userRepository.getById(new UniqueEntityId(userId));

        if (!user)
            throw new UnauthorizedException("Usuário não encontrado.");

        const note = Note.create({
            authorId: new UniqueEntityId(userId),
            title,
            description,
            updatedAt: null
        });

        await this.noteRepository.addUserNote(note);
    }
}