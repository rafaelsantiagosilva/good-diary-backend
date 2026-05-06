import { UniqueEntityId } from "./unique-entity-id";

export abstract class Entity<Props> {
    private _id: UniqueEntityId;
    protected props: Props;

    protected constructor(props: Props, id?: UniqueEntityId) {
        this.props = props;
        this._id = id ?? new UniqueEntityId();
    }

    get id() {
        return this._id.toString();
    }

    public equals(entity: Entity<any>) {
        if (entity === this)
            return true;

        return false;
    }
}