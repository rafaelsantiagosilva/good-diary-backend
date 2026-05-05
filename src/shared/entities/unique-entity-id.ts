export class UniqueEntityId {
    private value: string;

    constructor(value?: string) {
        this.value = value ?? crypto.randomUUID();
    }

    equals(id: UniqueEntityId) {
        return id.toString() === this.value;
    }   

    toString() {
        return this.value;
    }
}