import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { createZodDto } from "nestjs-zod";
import { z } from "zod";
import { AuthService } from "./auth.service";
import { ApiTags } from "@nestjs/swagger";

const LoginSchema = z.object({
    email: z.email(),
    password: z.string()
});

class LoginDto extends createZodDto(LoginSchema) { }

@Controller("/auth")
@ApiTags("Auth")
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post()
    @HttpCode(HttpStatus.OK)
    async handle(@Body() { email, password }: LoginDto) {
        const { token } = await this.authService.login(email, password);
        return { token };
    }
}
