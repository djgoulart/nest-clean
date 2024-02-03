import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { PrismaService } from './prisma/prisma.service'
import { CreateAccountController } from './controllers/create-account.controller'
import { AuthenticateController } from './controllers/authenticate.controller'
import { CreateCustomerController } from './controllers/create-customer.controller'
import { envSchema } from './env'
import { AuthModule } from './auth/auth.module'
import { FetchUserCustomersController } from './controllers/fetch-user-customers.controller'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    AuthModule,
  ],
  controllers: [
    AuthenticateController,
    CreateAccountController,
    CreateCustomerController,
    FetchUserCustomersController,
  ],
  providers: [PrismaService],
})
export class AppModule {}
