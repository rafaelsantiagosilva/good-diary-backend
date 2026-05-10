import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database/database.module";
import { CryptoModule } from "../crypto/cypto.module";
import { CreateUserUseCase } from "./usecases/create-user";
import { CreateUserController } from "./controllers/create-user.controller";

@Module({
    imports: [
        DatabaseModule,
        CryptoModule
    ],
    controllers: [
        CreateUserController
    ],
    providers: [
        CreateUserUseCase
    ]
})
export class UserModule { }