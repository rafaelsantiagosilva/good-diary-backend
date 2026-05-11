import { Body, Controller, HttpCode, HttpStatus, Param, Put } from "@nestjs/common";
import { createZodDto } from "nestjs-zod";
import { CurrentUser } from "src/shared/auth/current-user.decorator";
import { RequireAuth } from "src/shared/auth/require-auth.decorator";
import type { Payload } from "src/shared/auth/types/payload";
import { z } from "zod";
import { UpdateNoteUseCase } from "../usecases/update-note";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

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