import { Hasher } from "../hasher";

export class StubHasher extends Hasher {
    async compare(plain: string, hash: string): Promise<boolean> {
        if (await this.hash(plain) === hash)
            return true;
    
        return false;
    }

    async hash(plain: string): Promise<string> {
        return plain.concat("-hashed");
    }
}