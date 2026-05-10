import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaPg } from "@prisma/adapter-pg";
import { EnvService } from "src/modules/env/env.service";
import { PrismaClient } from "./generated/client";

@Injectable()
export class PrismaService
    implements OnModuleInit, OnModuleDestroy {
    public readonly client: PrismaClient;

    constructor(env: EnvService) {
        this.client = new PrismaClient({
            adapter: new PrismaPg({
                connectionString: env.get("DATABASE_URL")
            }),
            log: ["error", "info", "query", "warn"]
        });
    }

    async onModuleInit() {
        await this.client.$connect();
    }

    async onModuleDestroy() {
        await this.client.$disconnect();
    }
}