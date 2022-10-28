import { z } from 'zod';

export let envSchema = z.object({
  PUBLIC_URL: z.string().min(1).url(),
  PLONE_RESTAPI_URL: z.string().min(1).url(),
  NODE_ENV: z
    .union([
      z.literal('test'),
      z.literal('development'),
      z.literal('production')
    ])
    .default('development')
});

export type Env = z.infer<typeof envSchema>;
