import { User } from "src/modules/users/entities/user.entity";
import { Note } from "../entities/notes.entitiy";

export interface NoteRepository {
    getAllUserNotes(user: User): Promise<Note[]>;
    addUserNote(note: Note): Promise<void>;
    save(note: Note): Promise<void>;
    deleteNote(note: Note): Promise<void>;
}