import { HttpStatus, INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "src/app.module";
import { Crypter } from "src/modules/crypto/crypter";
import { NoteCrypter } from "src/modules/crypto/note/note-crypter";
import { PrismaService } from "src/modules/database/prisma/prisma.service";
import request from "supertest";
import { NoteFactory } from "test/factories/note.factory";
import { UserFactory } from "test/factories/user.factory";
import { resetDatabase } from "test/utils/prisma-reset";

describe("FetchUserNotesController (E2E) [GET /user/notes]", () => {
    let app: INestApplication;
    let jwtService: JwtService;
    let noteCrypter: NoteCrypter;
    let prisma: PrismaService;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule]
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();

        jwtService = app.get<JwtService>(JwtService);
        noteCrypter = app.get<NoteCrypter>(Crypter);
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
                title: noteCrypter.encrypt(title, authorId),
                description: noteCrypter.encrypt(description, authorId),
                authorId
            }
        });

        await prisma.client.note.create({
            data: {
                title: noteCrypter.encrypt(title, authorId),
                description: noteCrypter.encrypt(description, authorId),
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
                title: noteCrypter.encrypt(title, authorId),
                description: noteCrypter.encrypt(description, authorId),
                authorId
            }
        });

        await prisma.client.note.create({
            data: {
                title: noteCrypter.encrypt(title, authorId),
                description: noteCrypter.encrypt(description, authorId),
                authorId
            }
        });

        const response = await request(app.getHttpServer())
            .get("/user/notes");

        expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
    });
});