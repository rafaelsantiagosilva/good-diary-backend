import { createParamDecorator, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { Payload } from "src/shared/auth/types/payload";

export const CurrentUser = createParamDecorator(
    (_: never, context: ExecutionContext) => {
        const request = context.switchToHttp().getRequest();

        if (!request.user)
            throw new UnauthorizedException();

        return request.user as Payload;
    }
);