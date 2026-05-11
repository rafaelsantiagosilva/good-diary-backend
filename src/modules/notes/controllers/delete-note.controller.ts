import { Controller, Delete, HttpCode, HttpStatus, Param } from "@nestjs/common";
import { CurrentUser } from "src/shared/auth/current-user.decorator";
import { RequireAuth } from "src/shared/auth/require-auth.decorator";
import type { Payload } from "src/shared/auth/types/payload";
import { DeleteNoteUseCase } from "../usecases/delete-note";

@Controller()
@RequireAuth()
export class DeleteNoteController {
    constructor(private deleteNote: DeleteNoteUseCase) { }

    @Delete("/note/:id")
    @HttpCode(HttpStatus.NO_CONTENT)
    async handle(
        @Param("id") noteId: string,
        @CurrentUser() user: Payload
    ) {
        await this.deleteNote.execute({
            authorId: user.sub,
            noteId
        });
    }
}