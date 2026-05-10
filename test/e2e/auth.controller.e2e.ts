import { HttpStatus, INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "src/app.module";
import { Hasher } from "src/modules/crypto/hasher";
import { PrismaService } from "src/modules/database/prisma/prisma.service";
import request from "supertest";
import { UserFactory } from "test/factories/user.factory";
import { resetDatabase } from "test/utils/prisma-reset";

describe("AuthController (E2E) [POST /auth]", () => {
    let app: INestApplication;
    let prisma: PrismaService;
    let jwtService: JwtService;
    let hasher: Hasher;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule]
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();

        prisma = app.get<PrismaService>(PrismaService);
        hasher = app.get<Hasher>(Hasher);
        jwtService = app.get<JwtService>(JwtService);
    });

    beforeEach(async () => {
        await resetDatabase(prisma)
    });

    afterAll(async () => {
        await app.close();
    });

    it("should be able to login", async () => {
        const { id, name, password, email } = UserFactory.makeDomainUser();

        await prisma.client.user.create({
            data: {
                name,
                email,
                password: await hasher.hash(password),
                id
            }
        });

        const response = await request(app.getHttpServer())
            .post("/auth")
            .send({
                email,
                password
            });

        const token = jwtService.sign({
            sub: id,
            email: email
        });

        expect(response.status).toBe(HttpStatus.OK);
    });

    it("should not be able to login with a inexisting user", async () => {
        const { password, email } = UserFactory.makeDomainUser();

        const response = await request(app.getHttpServer())
            .post("/auth")
            .send({
                email,
                password
            });

        expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
    });

    it("should not be able to login with wrong credentials", async () => {
        const { id, name, password, email } = UserFactory.makeDomainUser();

        await prisma.client.user.create({
            data: {
                name,
                email,
                password: await hasher.hash(password),
                id
            }
        });

        const response = await request(app.getHttpServer())
            .post("/auth")
            .send({
                email,
                password: "wrong-pass"
            });

        const token = jwtService.sign({
            sub: id,
            email: email
        });

        expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
    });
});