import {
  Body,
  Controller,
  HttpCode,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common'
import { z } from 'zod'

import { PrismaService } from 'src/prisma/prisma.service'
import { ZodValidationPipe } from 'src/pipes/zod-validation-pipes'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'

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
  async handle(@Body() body: CreateCustomerBodySchema) {
    const { name, contact, phone } = body

    await this.prisma.customer.create({
      data: {
        name,
        contact,
        phone,
      },
    })
  }
}
