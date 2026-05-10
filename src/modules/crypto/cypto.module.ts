import { Module } from "@nestjs/common";
import { Hasher } from "./hasher";
import { BcryptHasher } from "./bcrypt/bcrypt-hasher";

@Module({
    providers: [
        {
            provide: Hasher,
            useClass: BcryptHasher 
        }
    ],
    exports: [
        Hasher
    ]
})
export class CryptoModule { }