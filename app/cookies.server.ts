import { createCookie } from '@remix-run/cloudflare';

export const i18nCookie = createCookie('i18n', {
  sameSite: 'lax',
  path: '/'
});
