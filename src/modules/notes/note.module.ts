import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database/database.module";
import { AddNoteController } from "./controllers/add-note.controller";
import { AddNoteUseCase } from "./usecases/add-note";
import { FetchUserNotesUseCase } from "./usecases/fetch-user-notes";
import { FetchUserNotesContoller } from "./controllers/fetch-user-notes.controller";

@Module({
    imports: [
        DatabaseModule
    ],
    controllers: [
        AddNoteController,
        FetchUserNotesContoller
    ],
    providers: [
        AddNoteUseCase,
        FetchUserNotesUseCase
    ]
})
export class NoteModule { }