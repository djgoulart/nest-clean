import { z } from 'zod'

export const envSchema = z.object({
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
  DB_NAME: z.string(),
  DATABASE_URL: z.string().url(),
  PORT: z.coerce.number().optional().default(3000),
})

export type EnvSchema = z.infer<typeof envSchema>
