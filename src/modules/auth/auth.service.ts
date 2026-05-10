import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Hasher } from "../crypto/hasher";
import { UserRepository } from "../users/repositories/user.repository";
import { Payload } from "../../shared/auth/types/payload";

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private hasher: Hasher,
        private userRepository: UserRepository
    ) { }

    async login(email: string, password: string) {
        const user = await this.userRepository.getByEmail(email);

        if (!user)
            throw new UnauthorizedException();

        const isPasswordValid = await this.hasher.compare(password, user?.password);

        if (!isPasswordValid)
            throw new UnauthorizedException();

        const payload: Payload = {
            sub: user.id,
            email: user.email
        }

        return {
            token: this.jwtService.sign(payload)
        }
    }
}