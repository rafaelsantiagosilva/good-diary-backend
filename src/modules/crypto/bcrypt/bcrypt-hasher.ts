import { Hasher } from "../hasher";
import bcrypt from "bcrypt";

export class BcryptHasher extends Hasher {
    private salts = 8;

    async compare(plain: string, hash: string): Promise<boolean> {
        return await bcrypt.compare(plain, hash);
    }

    async hash(plain: string): Promise<string> {
        return await bcrypt.hash(plain, this.salts);
    }

}