import { Injectable } from "@nestjs/common";
import crypto from "node:crypto";
import { EnvService } from "src/modules/env/env.service";
import { Crypter } from "../crypter";

@Injectable()
export class NoteCrypter extends Crypter {
    private readonly algorithm: crypto.CipherGCMTypes = "aes-256-gcm";

    constructor(private env: EnvService) {
        super();
    }

    encrypt(text: string, userId: string): string {
        const key = this.generateUserKey(userId);
        const iv = crypto.randomBytes(12);
        const cipher = crypto.createCipheriv(this.algorithm, key, iv);

        const encrypted = Buffer.concat([
            cipher.update(text, "utf8"),
            cipher.final()
        ]);

        const tag = cipher.getAuthTag();
        return Buffer.concat([iv, tag, encrypted]).toString("base64");
    }

    decrypt(encrypted: string, userId: string): string {
        const key = this.generateUserKey(userId);
        const buffer = Buffer.from(encrypted, "base64");

        const iv = buffer.subarray(0, 12);
        const tag = buffer.subarray(12, 28);
        const text = buffer.subarray(28);

        const decipher = crypto.createDecipheriv(this.algorithm, key, iv);
        decipher.setAuthTag(tag);

        const decrypted = Buffer.concat([
            decipher.update(text),
            decipher.final()
        ]);

        return decrypted.toString("utf8");
    }

    private generateUserKey(userId: string): Buffer {
        const masterKey = this.env.get("ENCRYPTION_KEY")!;
        return crypto.createHmac("sha256", masterKey)
            .update(userId)
            .digest();
    }
}
