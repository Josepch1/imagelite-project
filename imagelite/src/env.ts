import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url().nullish().default('http://localhost:8080'),
})

const env = envSchema.parse(process.env);

export default env;