import { Module } from "@nestjs/common";
import { Hasher } from "./hasher";
import { BcryptHasher } from "./bcrypt/bcrypt-hasher";
import { Crypter } from "./crypter";
import { NoteCrypter } from "./note/note-crypter";
import { EnvModule } from "../env/env.module";

@Module({
    imports: [EnvModule],
    providers: [
        {
            provide: Hasher,
            useClass: BcryptHasher
        },
        {
            provide: Crypter,
            useClass: NoteCrypter
        }
    ],
    exports: [
        Hasher,
        Crypter
    ]
})
export class CryptoModule { }