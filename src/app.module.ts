import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from "@nestjs/config";
import { envSchema } from './modules/env/env';
import { EnvService } from './modules/env/env.service';
import { CryptoModule } from './modules/crypto/cypto.module';
import { UserModule } from './modules/users/user.module';
import { NoteModule } from './modules/notes/note.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: env => envSchema.parse(env)
    }),

    CryptoModule,
    AuthModule,
    UserModule,
    NoteModule,
  ],
  providers: [EnvService]
})
export class AppModule { }
