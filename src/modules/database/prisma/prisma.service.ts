import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaPg } from "@prisma/adapter-pg";
import { EnvService } from "src/modules/env/env.service";
import { PrismaClient } from "./generated/client";

@Injectable()
export class PrismaService
    extends PrismaClient
    implements OnModuleInit, OnModuleDestroy {
    constructor(env: EnvService) {
        super({
            adapter: new PrismaPg({
                connectionString: env.get("DATABASE_URL")
            }),
            log: ["error", "info", "query", "warn"]
        });
    }

    onModuleInit() {
        this.$connect();
    }

    onModuleDestroy() {
        this.$disconnect();
    }
}