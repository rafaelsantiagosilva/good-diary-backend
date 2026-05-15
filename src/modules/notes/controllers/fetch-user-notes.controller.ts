import { Controller, Get } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { createZodDto } from "nestjs-zod";
import { CurrentUser } from "src/shared/auth/current-user.decorator";
import { RequireAuth } from "src/shared/auth/require-auth.decorator";
import { type Payload } from "src/shared/auth/types/payload";
import { z } from "zod";
import { NoteHttpPresenter } from "../presenters/note-http.presenter";
import { FetchUserNotesUseCase } from "../usecases/fetch-user-notes";
import { UnauthorizedErrorResponseDto } from "src/shared/docs/unauthorized-error.dto";

class FetchUserNotesResponseDto extends createZodDto(
    z.object({
        notes: z.array(z.object({
            id: z.uuid().describe("ID da nota."),
            title: z.string().describe("Título da nota"),
            description: z.string().describe("Descrição/corpo da nota."),
            createdAt: z.iso.datetime().describe("Quando a nota foi criada."),
            updatedAt: z.iso.datetime().optional().describe("Última vez que a nota foi editada.")
        }))
    })
) { }

@Controller("/user")
@RequireAuth()
@ApiTags("Note")
export class FetchUserNotesContoller {
    constructor(private fetchUserNotes: FetchUserNotesUseCase) { }

    @Get("/notes")
    @ApiOperation({
        summary: "Rota para pegar todas as notas de um usuário.",
        description: "Rota com funcionalidade de buscar todas as notas de um usuário autenticado, ordenadas em data de criação (`desc`)"
    })
    @ApiOkResponse({
        description: "Notas retornadas com sucesso.",
        type: FetchUserNotesResponseDto
    })
    @ApiUnauthorizedResponse({
        description: "Falta de autenticação e/ou autenticação incorreta.",
        type: UnauthorizedErrorResponseDto
    })
    async handle(@CurrentUser() user: Payload) {
        const notes = await this.fetchUserNotes.execute({
            authorId: user.sub
        });

        return { notes: notes.map(note => NoteHttpPresenter.toHttp(note)) };
    }
}