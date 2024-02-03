import {
  Controller,
  Get,
  HttpCode,
  Query,
  UseGuards,
  UsePipes,
} from '@nestjs/common'

import { PrismaService } from '@/prisma/prisma.service'
import { JwtAuthGuard } from '@/auth/jwt-auth.guard'
import { CurrentUser } from '@/auth/current-user.decorator'
import { UserPayload } from '@/auth/jwt.strategy'
import { z } from 'zod'
import { ZodValidationPipe } from '@/pipes/zod-validation-pipes'

const queryParamsSchema = z.object({
  page: z
    .string()
    .optional()
    .default('1')
    .transform(Number)
    .pipe(z.number().min(1)),
})

type QueryParamsSchema = z.infer<typeof queryParamsSchema>

@Controller('/customers')
@UseGuards(JwtAuthGuard)
export class FetchUserCustomersController {
  constructor(private prisma: PrismaService) {}

  @Get()
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(queryParamsSchema))
  async handle(
    @Query() query: QueryParamsSchema,
    @CurrentUser() user: UserPayload,
  ) {
    const userId = user.sub

    const { page } = query
    const perPage = 20

    const customers = await this.prisma.customer.findMany({
      take: perPage,
      skip: (page - 1) * perPage,
      where: {
        userId,
      },
      orderBy: {
        name: 'asc',
      },
    })

    return { customers }
  }
}
