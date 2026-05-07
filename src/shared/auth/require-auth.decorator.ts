import { applyDecorators, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth } from "@nestjs/swagger";

export function RequireAuth() {
    return applyDecorators(
        ApiBearerAuth(),
        UseGuards(AuthGuard("jwt")),
    )
}