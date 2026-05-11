import { Body, Controller, Post } from "@nestjs/common";
import { createZodDto } from "nestjs-zod";
import { z } from "zod";
import { CreateUserUseCase } from "../usecases/create-user";
import { ApiTags } from "@nestjs/swagger";

const CreateUserSchema = z.object({
    name: z.string().nonempty(),
    email: z.email({
        error: "E-mail inválido"
    }),
    password: z.string().min(6, {
        error: "A senha deve ter, no mínimo, 6 caracteres"
    })
});

class CreateUserDto extends createZodDto(CreateUserSchema) { }

@Controller("/user")
@ApiTags("User")
export class CreateUserController {
    constructor(private createUser: CreateUserUseCase) { }

    @Post()
    async handle(@Body() { name, email, password }: CreateUserDto) {
        await this.createUser.execute({
            name,
            email,
            password
        });
    }
}