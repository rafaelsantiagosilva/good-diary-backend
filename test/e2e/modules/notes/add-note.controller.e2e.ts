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

describe("AddNoteController (E2E) [POST /note]", () => {
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

    it("should be able to add a new note", async () => {
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

        const response = await request(app.getHttpServer())
            .post("/note")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title,
                description
            });

        expect(response.status).toBe(HttpStatus.CREATED);

        const wasNoteInDatabase = await prisma.client.note.findFirst({
            where: {
                authorId: authorId
            }
        });

        expect(wasNoteInDatabase).toBeTruthy();
        expect(noteCrypter.decrypt(wasNoteInDatabase!.title, authorId)).toBe((title));
    });

    it("should not be able to add a new note without a token", async () => {
        const { id: authorId, name, email, password } = UserFactory.makeDomainUser();
        await prisma.client.user.create({
            data: {
                name,
                email,
                password
            }
        });

        const { title, description } = NoteFactory.makeDomainNote(authorId);

        const response = await request(app.getHttpServer())
            .post("/note")
            .send({
                title,
                description
            });

        expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
    });

    it("should not be able to add a new note to a inexisting user", async () => {
        const { id: authorId, email } = UserFactory.makeDomainUser();

        const token = jwtService.sign({
            sub: authorId,
            email: email
        });

        const { title, description } = NoteFactory.makeDomainNote(authorId);

        const response = await request(app.getHttpServer())
            .post("/note")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title,
                description
            });

        expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
    });
});