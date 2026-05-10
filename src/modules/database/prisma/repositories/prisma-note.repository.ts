import { Note } from "src/modules/notes/entities/notes.entitiy";
import { NoteRepository } from "src/modules/notes/repositories/note.repository";
import { User } from "src/modules/users/entities/user.entity";
import { PrismaNoteMapper } from "../mappers/prisma-note.mapper";
import { PrismaService } from "../prisma.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PrismaNoteRepository extends NoteRepository {
    constructor(private prisma: PrismaService) {
        super();
    }

    async getById(noteId: string): Promise<Note | null> {
        const prismaNote = await this.prisma.client.note.findUnique({
            where: {
                id: noteId
            }
        });

        if (!prismaNote)
            return null;

        return PrismaNoteMapper.toDomain(prismaNote);
    }

    async getAllUserNotes(user: User): Promise<Note[]> {
        const prismaNotes = await this.prisma.client.note.findMany({
            where: {
                authorId: user.id
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        return prismaNotes.map(note => PrismaNoteMapper.toDomain(note));
    }

    async addUserNote(note: Note): Promise<void> {
        await this.prisma.client.note.create({
            data: PrismaNoteMapper.toPrisma(note)
        });
    }

    async save(note: Note): Promise<void> {
        await this.prisma.client.note.update({
            data: PrismaNoteMapper.toPrisma(note),
            where: {
                id: note.id
            }
        });
    }

    async deleteNote(note: Note): Promise<void> {
        await this.prisma.client.note.delete({
            where: {
                id: note.id
            }
        });
    }

}