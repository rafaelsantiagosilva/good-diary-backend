import { HttpStatus, INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "src/app.module";
import { Hasher } from "src/modules/crypto/hasher";
import { PrismaService } from "src/modules/database/prisma/prisma.service";
import request from "supertest";
import { UserFactory } from "test/factories/user.factory";
import { resetDatabase } from "test/utils/prisma-reset";

describe("CreateUserController (E2E) [POST /user]", () => {
    let app: INestApplication;
    let prisma: PrismaService;
    let hasher: Hasher;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule]
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();

        prisma = app.get<PrismaService>(PrismaService);
        hasher = app.get<Hasher>(Hasher);
    });

    beforeEach(async () => {
        await resetDatabase(prisma)
    });

    afterAll(async () => {
        await app.close();
    });

    it("should be able to create an user", async () => {
        const { name, email, password } = UserFactory.makeDomainUser();

        const response = await request(app.getHttpServer())
            .post("/user")
            .send({
                name,
                email,
                password
            });

        console.log(response);

        expect(response.status).toBe(HttpStatus.CREATED);

        const wasUserCreated = await prisma.client.user.findUnique({
            where: {
                email
            }
        });

        expect(wasUserCreated).not.toBeNull();
    });

    it("should not be able to create an user with invalid data", async () => {
        const { name, password } = UserFactory.makeDomainUser();

        const response = await request(app.getHttpServer())
            .post("/user")
            .send({
                name,
                email: "wrong email 123",
                password
            });

        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });

    it("should not be able to create a duplicated user", async () => {
        const { name, email, password } = UserFactory.makeDomainUser();

        await request(app.getHttpServer())
            .post("/user")
            .send({
                name,
                email,
                password
            });

        const response = await request(app.getHttpServer())
            .post("/user")
            .send({
                name: "Other Doe",
                email,
                password
            });

        expect(response.status).toBe(HttpStatus.CONFLICT);
    });
});