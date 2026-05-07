import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Payload } from "src/modules/auth/types/payload";

export const CurrentUser = createParamDecorator(
    (_: never, context: ExecutionContext) => {
        const request = context.switchToHttp().getRequest();
        return request.user as Payload;
    }
);