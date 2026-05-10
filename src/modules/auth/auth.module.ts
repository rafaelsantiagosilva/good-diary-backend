import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { JwtStrategy } from "./jwt.strategy";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { CryptoModule } from "../crypto/cypto.module";

@Module({
    imports: [
        PassportModule,
        JwtModule.register({
            secret: process.env.JWT_KEY ?? "",
            signOptions: {
                expiresIn: "1d"
            }
        }),
        CryptoModule
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy, ]
})
export class AuthModule {}