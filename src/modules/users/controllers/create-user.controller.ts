import { Body, Controller, Post } from "@nestjs/common";
import { createZodDto } from "nestjs-zod";
import { z } from "zod";
import { CreateUserUseCase } from "../usecases/create-user";
import { ApiBadRequestResponse, ApiCreatedResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { ZodValidationErrorResponseDto } from "src/shared/docs/zod-validation-error.dto";

class CreateUserRequestDto extends createZodDto(
    z.object({
        name: z.string().nonempty().describe("Nome do usuário."),
        email: z.email({
            error: "E-mail inválido"
        }).describe("E-mail do usuário"),
        password: z.string().min(6, {
            error: "A senha deve ter, no mínimo, 6 caracteres"
        }).describe("Senha do usuário.")
    })
) { }

@Controller("/user")
@ApiTags("User")
export class CreateUserController {
    constructor(private createUser: CreateUserUseCase) { }

    @Post()
    @ApiOperation({
        summary: "Rota de criação de usuário.",
        description: "Rota feita para criar um usuário com base em seu nome, e-mail e senha."
    })
    @ApiCreatedResponse({ description: "Usuário criado com sucesso." })
    @ApiBadRequestResponse({
        description: "Dados enviados são inválidos.",
        type: ZodValidationErrorResponseDto
    })
    async handle(@Body() { name, email, password }: CreateUserRequestDto) {
        await this.createUser.execute({
            name,
            email,
            password
        });
    }
}