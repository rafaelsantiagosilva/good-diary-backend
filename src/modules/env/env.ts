import "dotenv/config";
import { z } from "zod";

export const envSchema = z.object({
    PORT: z.coerce.number().default(3000),
    JWT_KEY: z.string(),
    DB_PASS: z.string(),
    DB_USER: z.string(),
    DB_NAME: z.string(),
    ENCRYPTION_KEY: z.string(),
    DATABASE_URL: z.url()
});

export type Env = z.infer<typeof envSchema>;