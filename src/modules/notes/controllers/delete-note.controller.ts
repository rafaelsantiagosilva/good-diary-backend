import { Controller, Delete, HttpCode, HttpStatus, Param } from "@nestjs/common";
import { ApiBadRequestResponse, ApiNoContentResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { CurrentUser } from "src/shared/auth/current-user.decorator";
import { RequireAuth } from "src/shared/auth/require-auth.decorator";
import type { Payload } from "src/shared/auth/types/payload";
import { InexistingNoteResponseDto } from "src/shared/docs/inexisting-note-error.dto";
import { UnauthorizedErrorResponseDto } from "src/shared/docs/unauthorized-error.dto";
import { DeleteNoteUseCase } from "../usecases/delete-note";

@Controller()
@RequireAuth()
@ApiTags("Note")
export class DeleteNoteController {
    constructor(private deleteNote: DeleteNoteUseCase) { }

    @Delete("/note/:id")
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({
        summary: "Rota para deletar uma nota.",
        description: "Rota com a funcionalidade de deletar uma nota, com base em seu ID, de um usuário autenticado."
    })
    @ApiNoContentResponse({ description: "Nota deletada com sucesso." })
    @ApiBadRequestResponse({
        description: "Tentou deletar uma nota inexsitente.",
        type: InexistingNoteResponseDto
    })
    @ApiUnauthorizedResponse({
        description: "Falta de autenticação e/ou autenticação incorreta.",
        type: UnauthorizedErrorResponseDto
    })
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