import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "src/shared/auth/current-user.decorator";
import { RequireAuth } from "src/shared/auth/require-auth.decorator";
import { type Payload } from "src/shared/auth/types/payload";
import { NoteHttpPresenter } from "../presenters/note-http.presenter";
import { FetchUserNotesUseCase } from "../usecases/fetch-user-notes";

@Controller("/user")
@RequireAuth()
@ApiTags("Note")
export class FetchUserNotesContoller {
    constructor(private fetchUserNotes: FetchUserNotesUseCase) { }

    @Get("/notes")
    async handle(@CurrentUser() user: Payload) {
        const notes = await this.fetchUserNotes.execute({
            authorId: user.sub
        });

        return { notes: notes.map(note => NoteHttpPresenter.toHttp(note)) };
    }
}