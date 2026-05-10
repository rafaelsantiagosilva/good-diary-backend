import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { CryptoModule } from "../crypto/cypto.module";
import { DatabaseModule } from "../database/database.module";
import { EnvModule } from "../env/env.module";
import { EnvService } from "../env/env.service";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./jwt.strategy";

@Module({
    imports: [
        PassportModule,
        JwtModule.registerAsync({
            imports: [EnvModule],
            inject: [EnvService],
            global: true,
            useFactory(env: EnvService) {
                return {
                    secret: env.get("JWT_KEY"),
                    expiresIn: "1d"
                }
            }
        }),
        CryptoModule,
        EnvModule,
        DatabaseModule
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        JwtStrategy,
    ]
})
export class AuthModule { }