import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UserRepository } from "src/modules/users/repositories/user.repository";
import { UniqueEntityId } from "src/shared/entities/unique-entity-id";
import { NoteRepository } from "../repositories/note.repository";
import { Crypter } from "src/modules/crypto/crypter";
import { Note } from "../entities/notes.entitiy";

type FetchUserNotesUseCaseRequest = {
    authorId: string
}

@Injectable()
export class FetchUserNotesUseCase {
    constructor(
        private userRepository: UserRepository,
        private noteRepository: NoteRepository,
        private crypter: Crypter
    ) { }

    async execute({ authorId }: FetchUserNotesUseCaseRequest) {
        const author = await this.userRepository.getById(new UniqueEntityId(authorId));

        if (!author)
            throw new UnauthorizedException();

        const notes = await this.noteRepository.getAllUserNotes(author);
        return notes.map(note => Note.create({
            title: this.crypter.decrypt(note.title, note.authorId),
            description: note.description.length > 0 ? this.crypter.decrypt(note.description, note.authorId) : "",
            authorId: new UniqueEntityId(note.authorId),
            createdAt: note.createdAt,
            updatedAt: note.updatedAt
        },
            new UniqueEntityId(note.id)
        ));
    }
}