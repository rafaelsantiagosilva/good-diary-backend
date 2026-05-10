import { Controller, Get } from "@nestjs/common";
import { CurrentUser } from "src/shared/auth/current-user.decorator";
import { RequireAuth } from "src/shared/auth/require-auth.decorator";
import { type Payload } from "src/shared/auth/types/payload";
import { FetchUserNotesUseCase } from "../usecases/fetch-user-notes";

@Controller("/user")
@RequireAuth()
export class FetchUserNotesContoller {
    constructor(private fetchUserNotes: FetchUserNotesUseCase) { }

    @Get("/notes")
    async handle(@CurrentUser() user: Payload) {
        const notes = await this.fetchUserNotes.execute({
            authorId: user.sub
        });

        return { notes };
    }
}