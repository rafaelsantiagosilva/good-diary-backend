import { Note } from "../entities/notes.entitiy";

export class NoteHttpPresenter {
    static toHttp(note: Note) {
        return {
            id: note.id,
            title: note.title,
            description: note.description,
            createdAt: note.createdAt,
            updatedAt: note.updatedAt
        }
    }
}
