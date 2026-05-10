import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { z } from "zod";
import { EnvService } from "../env/env.service";
import { Payload } from "./types/payload";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(env: EnvService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: env.get("JWT_KEY") ?? ""
        });
    }

    validate(payload: Payload) {
        const payloadSchema = z.object({
            sub: z.uuid(),
            email: z.email()
        });

        const { success, data } = payloadSchema.safeParse(payload);

        if (!success)
            throw new UnauthorizedException();

        return data;
    }
}