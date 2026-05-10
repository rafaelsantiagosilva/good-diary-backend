import { Body, Controller, Post } from "@nestjs/common";
import { CurrentUser } from "src/shared/auth/current-user.decorator";
import { RequireAuth } from "src/shared/auth/require-auth.decorator";
import { type Payload } from "src/shared/auth/types/payload";
import { AddNoteUseCase } from "../usecases/add-note";
import { z } from "zod";
import { createZodDto } from "nestjs-zod";

const AddNoteSchema = z.object({
    title: z.string().nonempty({
        error: "Uma nota deve conter título"
    }),
    description: z.string()
});

class AddNoteDto extends createZodDto(AddNoteSchema) { }

@Controller()
@RequireAuth()
export class AddNoteController {
    constructor(private addNote: AddNoteUseCase) { }

    @Post("/note")
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