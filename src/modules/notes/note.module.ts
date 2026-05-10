import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database/database.module";
import { AddNoteUseCase } from "./usecases/add-note";
import { AddNoteController } from "./controllers/add-note.controller";

@Module({
    imports: [
        DatabaseModule
    ],
    controllers: [
        AddNoteController
    ],
    providers: [
        AddNoteUseCase
    ]
})
export class NoteModule { }