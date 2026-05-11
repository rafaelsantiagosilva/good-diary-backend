import { Crypter } from "../crypter";

export class StubCrypter extends Crypter {
    encrypt(text: string, key: string): string {
        return text.concat(key);
    }

    decrypt(encrypted: string, key: string): string {
        return encrypted.replace(key, "");
    }
}