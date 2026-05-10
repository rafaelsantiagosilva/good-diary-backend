import { User } from "src/modules/users/entities/user.entity";
import { Note } from "../entities/notes.entitiy";

export abstract class NoteRepository {
    abstract getById(noteId: string): Promise<Note | null>;
    abstract getAllUserNotes(user: User): Promise<Note[]>;
    abstract addUserNote(note: Note): Promise<void>;
    abstract save(note: Note): Promise<void>;
    abstract deleteNote(note: Note): Promise<void>;
}