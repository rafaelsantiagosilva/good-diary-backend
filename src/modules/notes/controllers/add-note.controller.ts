import { Body, Controller, Post } from "@nestjs/common";
import { ApiBadRequestResponse, ApiCreatedResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { createZodDto } from "nestjs-zod";
import { CurrentUser } from "src/shared/auth/current-user.decorator";
import { RequireAuth } from "src/shared/auth/require-auth.decorator";
import { type Payload } from "src/shared/auth/types/payload";
import { z } from "zod";
import { AddNoteUseCase } from "../usecases/add-note";

const AddNoteSchema = z.object({
    title: z.string().nonempty({
        error: "Uma nota deve conter título"
    }),
    description: z.string()
});

class AddNoteDto extends createZodDto(AddNoteSchema) { }

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
    @ApiBadRequestResponse({ description: "Dados inválidos." })
    @ApiUnauthorizedResponse({ description: "Falta de autenticação e/ou autenticação incorreta." })
    async handle(
        @Body() { title, description }: AddNoteDto,
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