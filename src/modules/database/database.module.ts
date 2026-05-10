import { Module } from "@nestjs/common";
import { NoteRepository } from "../notes/repositories/note.repository";
import { UserRepository } from "../users/repositories/user.repository";
import { PrismaService } from "./prisma/prisma.service";
import { PrismaNoteRepository } from "./prisma/repositories/prisma-note.repository";
import { PrismaUserRepository } from "./prisma/repositories/prisma-user.repository";
import { EnvModule } from "../env/env.module";

@Module({
    imports: [EnvModule],
    providers: [
        PrismaService,
        {
            provide: UserRepository,
            useClass: PrismaUserRepository
        },
        {
            provide: NoteRepository,
            useClass: PrismaNoteRepository
        }
    ],
    exports: [
        PrismaService,
        UserRepository,
        NoteRepository
    ]
})
export class DatabaseModule { }