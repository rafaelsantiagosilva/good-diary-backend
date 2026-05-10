import { Note, NoteProps } from "src/modules/notes/entities/notes.entitiy";
import { UniqueEntityId } from "src/shared/entities/unique-entity-id";

export class NoteFactory {
    static makeDomainNote(authorId: string, props?: Omit<NoteProps, "authorId">): Note {
        return Note.create({
            title: props?.title ?? "New Note To",
            description: props?.description ?? "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod magni voluptate obcaecati repellat culpa distinctio, sed maxime aut rem cumque temporibus consequuntur ut deserunt rerum accusamus, quis magnam. Quo, reiciendis!",
            createdAt: props?.createdAt ?? new Date(),
            updatedAt: props?.updatedAt ?? null,
            authorId: new UniqueEntityId(authorId),
        });
    }
}