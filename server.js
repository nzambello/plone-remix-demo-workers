import {
  createMetronomeGetLoadContext,
  registerMetronome
} from '@metronome-sh/cloudflare-workers';
import { createEventHandler } from '@remix-run/cloudflare-workers';
import * as build from '@remix-run/dev/server-build';

const buildWithMetronome = registerMetronome(build);

const metronomeGetLoadContext = createMetronomeGetLoadContext(
  buildWithMetronome,
  { config: require('./metronome.config.js') }
);

addEventListener(
  'fetch',
  createEventHandler({
    build: buildWithMetronome,
    mode: process.env.NODE_ENV,
    getLoadContext: metronomeGetLoadContext
  })
);
