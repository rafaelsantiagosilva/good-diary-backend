import { Note as DomainNote } from "src/modules/notes/entities/notes.entitiy";
import { UniqueEntityId } from "src/shared/entities/unique-entity-id";
import { NoteModel as PrismaNote } from "../generated/models";

export class PrismaNoteMapper {
    static toDomain({ id, createdAt, authorId, ...rest }: PrismaNote): DomainNote {
        return DomainNote.create({
            authorId: new UniqueEntityId(authorId),
            createdAt: createdAt ?? null,
            ...rest
        }, new UniqueEntityId(id));
    }

    static toPrisma({ id, title, description, createdAt, updatedAt, authorId }: DomainNote): PrismaNote {
        return {
            id,
            title,
            description,
            createdAt,
            updatedAt,
            authorId
        }
    }
}