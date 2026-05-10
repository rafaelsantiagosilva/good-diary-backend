import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
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

    // TODO: implement the validation
    validate({ sub, email }: Payload) {
        return {
            userId: sub,
            email
        }
    }
}