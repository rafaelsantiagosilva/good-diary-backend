import { Body, Controller, HttpCode, HttpStatus, Param, Put } from "@nestjs/common";
import { ApiBadRequestResponse, ApiNoContentResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse, getSchemaPath } from "@nestjs/swagger";
import { createZodDto } from "nestjs-zod";
import { CurrentUser } from "src/shared/auth/current-user.decorator";
import { RequireAuth } from "src/shared/auth/require-auth.decorator";
import type { Payload } from "src/shared/auth/types/payload";
import { InexistingNoteResponseDto } from "src/shared/docs/inexisting-note-error.dto";
import { UnauthorizedErrorResponseDto } from "src/shared/docs/unauthorized-error.dto";
import { ZodValidationErrorResponseDto } from "src/shared/docs/zod-validation-error.dto";
import { z } from "zod";
import { UpdateNoteUseCase } from "../usecases/update-note";

const UpdateNoteSchema = z.object({
    title: z.string().nonempty({
        error: "O título de uma nota é obrigatório!"
    }),
    description: z.string()
});

class UpdateNoteDto extends createZodDto(UpdateNoteSchema) { }

@Controller()
@RequireAuth()
@ApiTags("Note")
export class UpdateNoteController {
    constructor(private updateNote: UpdateNoteUseCase) { }

    @Put("/note/:id")
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({
        summary: "Rota para edição de uma nota.",
        description: "Rota com funcionalidade de editar uma nota de um usuário autenticado, com base no ID da nota."
    })
    @ApiNoContentResponse({ description: "Nota editada com sucesso." })
    @ApiBadRequestResponse({
        description: "Pode retornar erro de nota inexistente ou erro de validação de dados.",
        schema: {
            oneOf: [
                { $ref: getSchemaPath(InexistingNoteResponseDto) },
                { $ref: getSchemaPath(ZodValidationErrorResponseDto) },
            ],
        },
    })
    @ApiUnauthorizedResponse({
        description: "Falta de autenticação e/ou autenticação incorreta.",
        type: UnauthorizedErrorResponseDto
    })
    async handle(
        @Param("id") noteId: string,
        @Body() { title, description }: UpdateNoteDto,
        @CurrentUser() user: Payload
    ) {
        await this.updateNote.execute({
            authorId: user.sub,
            note: {
                id: noteId,
                title,
                description,
            }
        });
    }
}