import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from "@nestjs/config";
import { envSchema } from './modules/env/env';
import { EnvService } from './modules/env/env.service';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validate: env => envSchema.parse(env)
    })
  ],
  providers: [EnvService]
})
export class AppModule { }
