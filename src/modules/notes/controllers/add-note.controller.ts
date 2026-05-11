import { Body, Controller, Post } from "@nestjs/common";
import { ApiBadRequestResponse, ApiCreatedResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { createZodDto } from "nestjs-zod";
import { CurrentUser } from "src/shared/auth/current-user.decorator";
import { RequireAuth } from "src/shared/auth/require-auth.decorator";
import { type Payload } from "src/shared/auth/types/payload";
import { UnauthorizedErrorResponseDto } from "src/shared/docs/unauthorized-error.dto";
import { ZodValidationErrorResponseDto } from "src/shared/docs/zod-validation-error.dto";
import { z } from "zod";
import { AddNoteUseCase } from "../usecases/add-note";

class AddNoteRequestDto extends createZodDto(
    z.object({
        title: z.string().nonempty({
            error: "Uma nota deve conter título"
        }).describe("Título da nota."),
        description: z.string().describe("Descrição/corpo da nota.")
    })
) { }

@Controller()
@RequireAuth()
@ApiTags("Note")
export class AddNoteController {
    constructor(private addNote: AddNoteUseCase) { }

    @Post("/note")
    @ApiOperation({
        summary: "Rota de criação de nota.",
        description: "Rota feita para criar uma nota, com título e descrição (esta pode estar vazia) para um usuário autenticado.",
    })
    @ApiCreatedResponse({ description: "Nota criada com sucesso." })
    @ApiBadRequestResponse({
        description: "Dados inválidos.",
        type: ZodValidationErrorResponseDto
    })
    @ApiUnauthorizedResponse({
        description: "Falta de autenticação e/ou autenticação incorreta.",
        type: UnauthorizedErrorResponseDto
    })
    async handle(
        @Body() { title, description }: AddNoteRequestDto,
        @CurrentUser() user: Payload
    ) {
        const { sub: authorId } = user;
        await this.addNote.execute({
            title,
            description,
            authorId
        });
    }
}