import { HttpStatus, INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "src/app.module";
import { PrismaService } from "src/modules/database/prisma/prisma.service";
import request from "supertest";
import { NoteFactory } from "test/factories/note.factory";
import { UserFactory } from "test/factories/user.factory";
import { resetDatabase } from "test/utils/prisma-reset";

describe("DeleteNoteController (E2E) [DELETE /note/:id]", () => {
    let app: INestApplication;
    let jwtService: JwtService;
    let prisma: PrismaService;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule]
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();

        jwtService = app.get<JwtService>(JwtService);
        prisma = app.get<PrismaService>(PrismaService);
    });

    beforeEach(async () => {
        await resetDatabase(prisma)
    });

    afterAll(async () => {
        await app.close();
    });

    it("should be able to delete a note", async () => {
        const { id: userId, name, email, password } = UserFactory.makeDomainUser();
        await prisma.client.user.create({
            data: {
                id: userId,
                name,
                email,
                password
            }
        });

        const token = jwtService.sign({
            sub: userId,
            email: email
        });

        const { id, title, description, authorId, updatedAt } = NoteFactory.makeDomainNote(userId);
        await prisma.client.note.create({
            data: {
                id,
                title,
                description,
                authorId,
                updatedAt
            }
        });

        const response = await request(app.getHttpServer())
            .delete(`/note/${id}`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(HttpStatus.NO_CONTENT);

        const wasNoteInDatabase = await prisma.client.note.findFirst({
            where: {
                authorId: authorId
            }
        });

        expect(wasNoteInDatabase).toBeFalsy();
    });

    it("should not be able to delete a note without a token", async () => {
        const { id: userId, name, email, password } = UserFactory.makeDomainUser();
        await prisma.client.user.create({
            data: {
                id: userId,
                name,
                email,
                password
            }
        });

        const { id, title, description, authorId, updatedAt } = NoteFactory.makeDomainNote(userId);
        await prisma.client.note.create({
            data: {
                id,
                title,
                description,
                authorId,
                updatedAt
            }
        });

        const response = await request(app.getHttpServer())
            .delete(`/note/${id}`);

        expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
    });

    it("should not be able to delete a another user note", async () => {
        const { id: userId, name, email, password } = UserFactory.makeDomainUser();

        await prisma.client.user.create({
            data: {
                id: userId,
                name,
                email,
                password
            }
        });

        const otherUser = UserFactory.makeDomainUser({
            email: "other@email.com",
            name: "Other User",
            password: "otherpass"
        });

        await prisma.client.user.create({
            data: {
                id: otherUser.id,
                name: otherUser.name,
                email: otherUser.email,
                password: otherUser.password
            }
        });

        const otherUserToken = jwtService.sign({
            sub: otherUser.id,
            email: otherUser.email
        });

        const { id, title, description, authorId, updatedAt } = NoteFactory.makeDomainNote(userId);
        await prisma.client.note.create({
            data: {
                id,
                title,
                description,
                authorId,
                updatedAt
            }
        });

        const response = await request(app.getHttpServer())
            .delete(`/note/${id}`)
            .set("Authorization", `Bearer ${otherUserToken}`);

        expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
    });
});