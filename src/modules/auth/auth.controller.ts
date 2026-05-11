import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { ApiBadRequestResponse, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { createZodDto } from "nestjs-zod";
import { ZodValidationErrorResponseDto } from "src/shared/docs/zod-validation-error.dto";
import { z } from "zod";
import { AuthService } from "./auth.service";

class LoginRequestDto extends createZodDto(
    z.object({
        email: z.email().describe("E-mail do usuário."),
        password: z.string().describe("Senha do usuário.")
    })
) { }

class LoginResponseDto extends createZodDto(
    z.object({
        token: z.jwt().describe("O token de autenticação.")
    })
) { }

@Controller("/auth")
@ApiTags("Auth")
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: "Rota de login.",
        description: "Rota feita para retornar um token JWT. O login é feito a partir do e-mail e senha do usuário.",
    })
    @ApiOkResponse({
        description: "Token gerado com sucesso.",
        type: LoginResponseDto
    })
    @ApiBadRequestResponse({
        description: "Dados enviados são inválidos.",
        type: ZodValidationErrorResponseDto
    })
    async handle(@Body() { email, password }: LoginRequestDto) {
        const { token } = await this.authService.login(email, password);
        return { token };
    }
}
