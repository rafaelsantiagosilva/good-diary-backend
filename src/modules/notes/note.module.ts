import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database/database.module";
import { AddNoteController } from "./controllers/add-note.controller";
import { AddNoteUseCase } from "./usecases/add-note";
import { FetchUserNotesUseCase } from "./usecases/fetch-user-notes";
import { FetchUserNotesContoller } from "./controllers/fetch-user-notes.controller";
import { UpdateNoteUseCase } from "./usecases/update-note";
import { UpdateNoteController } from "./controllers/update-note.controller";

@Module({
    imports: [
        DatabaseModule
    ],
    controllers: [
        AddNoteController,
        FetchUserNotesContoller,
        UpdateNoteController
    ],
    providers: [
        AddNoteUseCase,
        FetchUserNotesUseCase,
        UpdateNoteUseCase
    ]
})
export class NoteModule { }