import { HttpStatus, INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "src/app.module";
import { PrismaService } from "src/modules/database/prisma/prisma.service";
import request from "supertest";
import { NoteFactory } from "test/factories/note.factory";
import { UserFactory } from "test/factories/user.factory";
import { resetDatabase } from "test/utils/prisma-reset";

describe("FetchUserNotesController (E2E) [GET /user/notes]", () => {
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

    it("should be able to fetch the user notes", async () => {
        const { id: authorId, name, email, password } = UserFactory.makeDomainUser();
        await prisma.client.user.create({
            data: {
                id: authorId,
                name,
                email,
                password
            }
        });

        const token = jwtService.sign({
            sub: authorId,
            email: email
        });

        const { title, description } = NoteFactory.makeDomainNote(authorId);

        await prisma.client.note.create({
            data: {
                title,
                description,
                authorId
            }
        });

        await prisma.client.note.create({
            data: {
                title,
                description,
                authorId
            }
        });

        const response = await request(app.getHttpServer())
            .get("/user/notes")
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(HttpStatus.OK);

        const notes = await prisma.client.note.findMany({
            where: {
                authorId: authorId
            }
        });

        expect(notes).toHaveLength(2);
    });

    it("should not be able to fetch the user notes without a token", async () => {
        const { id: authorId, name, email, password } = UserFactory.makeDomainUser();
        await prisma.client.user.create({
            data: {
                id: authorId,
                name,
                email,
                password
            }
        });

        const { title, description } = NoteFactory.makeDomainNote(authorId);

        await prisma.client.note.create({
            data: {
                title,
                description,
                authorId
            }
        });

        await prisma.client.note.create({
            data: {
                title,
                description,
                authorId
            }
        });

        const response = await request(app.getHttpServer())
            .get("/user/notes");

        expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
    });
});