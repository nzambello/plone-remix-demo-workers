/// <reference types="@remix-run/dev" />
/// <reference types="@remix-run/cloudflare" />
/// <reference types="@cloudflare/workers-types" />

declare var process: {
  env: { NODE_ENV: 'development' | 'production' };
};

declare var PUBLIC_URL: string;
declare var PLONE_RESTAPI_URL: string;
