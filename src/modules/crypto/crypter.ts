export abstract class Crypter {
    abstract encrypt(text: string, key: string): string;
    abstract decrypt(encrypted: string, key: string): string;
}