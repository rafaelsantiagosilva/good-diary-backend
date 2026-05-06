import { User } from "src/modules/users/entities/user.entity";
import { Note } from "../entities/notes.entitiy";
import { NoteRepository } from "./note.repository";

export class InMemoryNoteRepository implements NoteRepository {
    data: Note[] = [];
    
    async getAllUserNotes(user: User): Promise<Note[]> {
        return this.data.filter(note => note.authorId === user.id.toString());
    }

    async addUserNote(note: Note): Promise<void> {
        this.data.push(note);
    }
    
    async save(note: Note): Promise<void> {
        const index = this.data.findIndex(noteSearched => noteSearched.id === note.id);
        this.data[index] = note;
    }

    async deleteNote(note: Note): Promise<void> {
        this.data = this.data.filter(oldNote => oldNote.id !== note.id);
    }
    
}