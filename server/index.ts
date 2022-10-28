import type { AppLoadContext } from '@remix-run/cloudflare';

import {
  combineGetLoadContexts,
  createMetronomeGetLoadContext,
  registerMetronome
} from '@metronome-sh/cloudflare-pages';
import {
  createPagesFunctionHandler,
  GetLoadContextFunction
} from '@remix-run/cloudflare-pages';
import * as build from '@remix-run/dev/server-build';

import type { Env } from '~/env';
import { envSchema } from '~/env';

const buildWithMetronome = registerMetronome(build);

const metronomeGetLoadContext = createMetronomeGetLoadContext(
  buildWithMetronome,
  { config: require('../metronome.config.js') }
);

const handleRequest = createPagesFunctionHandler({
  build: buildWithMetronome,
  mode: process.env.NODE_ENV,
  getLoadContext: combineGetLoadContexts((context): AppLoadContext => {
    // Environment variables
    let env: AppLoadContext['env'] = envSchema.parse(context.env);

    return { env };
  }, metronomeGetLoadContext) as GetLoadContextFunction<AppLoadContext>
});

export function onRequest(context: EventContext<any, any, any>) {
  return handleRequest(context);
}
