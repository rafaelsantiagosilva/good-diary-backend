import { PrismaService } from "src/modules/database/prisma/prisma.service";

export async function resetDatabase(prisma: PrismaService) {
    try {
        await prisma.client.note.deleteMany();
        await prisma.client.user.deleteMany();
    } catch (error) {
        console.error("Error when cleaning the test database!", error);
    }
}