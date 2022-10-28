import { createCookie } from '@remix-run/cloudflare';
import { RemixI18Next } from 'remix-i18next';

import en from '~/locales/en';
import it from '~/locales/it';

export let localeCookie = createCookie('locale', {
  path: '/',
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production'
});

export let i18n = new RemixI18Next({
  detection: {
    fallbackLanguage: 'en',
    supportedLanguages: ['cimode', 'it', 'en'],
    cookie: localeCookie
  },
  i18next: {
    supportedLngs: ['it', 'en'],
    resources: { en: { translation: en }, it: { translation: it } }
  }
});
