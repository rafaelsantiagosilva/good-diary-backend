import { Entity } from "src/shared/entities/entity"
import { UniqueEntityId } from "src/shared/entities/unique-entity-id"
import { Optional } from "src/shared/types/optional";

export type NoteProps = {
    title: string,
    description: string,
    authorId: UniqueEntityId,
    createdAt: Date,
    updatedAt: Date | null
}

export class Note extends Entity<NoteProps> {
    static create(props: Optional<NoteProps, "createdAt" >, id?: UniqueEntityId) {
        const note = new Note({ ...props, createdAt: props.createdAt ?? new Date() }, id ?? new UniqueEntityId());
        return note;
    }

    private touch() {
        this.props.updatedAt = new Date();
    }

    get authorId() {
        return this.props.authorId.toString();
    }

    get title() {
        return this.props.title;
    }

    set title(title: string) {
        this.props.title = title;
        this.touch();
    }

    get description() {
        return this.props.description;
    }

    set description(description: string) {
        this.props.description = description;
        this.touch();
    }
}