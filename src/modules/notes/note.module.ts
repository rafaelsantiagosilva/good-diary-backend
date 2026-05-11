import { Module } from "@nestjs/common";
import { CryptoModule } from "../crypto/cypto.module";
import { DatabaseModule } from "../database/database.module";
import { AddNoteController } from "./controllers/add-note.controller";
import { DeleteNoteController } from "./controllers/delete-note.controller";
import { FetchUserNotesContoller } from "./controllers/fetch-user-notes.controller";
import { UpdateNoteController } from "./controllers/update-note.controller";
import { AddNoteUseCase } from "./usecases/add-note";
import { DeleteNoteUseCase } from "./usecases/delete-note";
import { FetchUserNotesUseCase } from "./usecases/fetch-user-notes";
import { UpdateNoteUseCase } from "./usecases/update-note";

@Module({
    imports: [
        DatabaseModule,
        CryptoModule
    ],
    controllers: [
        AddNoteController,
        FetchUserNotesContoller,
        UpdateNoteController,
        DeleteNoteController
    ],
    providers: [
        AddNoteUseCase,
        FetchUserNotesUseCase,
        UpdateNoteUseCase,
        DeleteNoteUseCase
    ]
})
export class NoteModule { }