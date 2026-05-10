import { PrismaService } from "src/modules/database/prisma/prisma.service";

export async function resetDatabase(prisma: PrismaService) {
    const tableNames = await prisma.client.$queryRaw<
        Array<{ tablename: string }>
    >`SELECT tablename FROM pg_tables WHERE schemaname='public'`;

    const tables = tableNames
        .map(({ tablename }) => tablename)
        .filter((name) => name !== "_prisma_migrations")
        .map((name) => `"public"."${name}"`)
        .join(", ");

    try {
        await prisma.client.$executeRawUnsafe(`TRUNCATE TABLE ${tables} CASCADE;`);
    } catch (error) {
        console.error("Error when cleaning the test database!", error);
    }
}