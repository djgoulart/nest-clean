import {
  Body,
  Controller,
  HttpCode,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common'
import { z } from 'zod'

import { PrismaService } from '@/prisma/prisma.service'
import { ZodValidationPipe } from '@/pipes/zod-validation-pipes'
import { JwtAuthGuard } from '@/auth/jwt-auth.guard'
import { CurrentUser } from '@/auth/current-user.decorator'
import { UserPayload } from '@/auth/jwt.strategy'

const createCustomerBodySchema = z.object({
  name: z.string(),
  contact: z.string(),
  phone: z.string(),
})

type CreateCustomerBodySchema = z.infer<typeof createCustomerBodySchema>

@Controller('/customers')
@UseGuards(JwtAuthGuard)
export class CreateCustomerController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createCustomerBodySchema))
  async handle(
    @Body() body: CreateCustomerBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { name, contact, phone } = body
    const userId = user.sub

    await this.prisma.customer.create({
      data: {
        name,
        contact,
        phone,
        userId,
      },
    })
  }
}
