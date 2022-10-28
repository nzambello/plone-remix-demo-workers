import { RemixServer } from '@remix-run/react';
import type { EntryContext } from '@remix-run/cloudflare';
import { createInstance } from 'i18next';
import { renderToString } from 'react-dom/server';
import { I18nextProvider } from 'react-i18next';
import { i18n } from '~/utils/i18n.server';
import en from '~/locales/en';
import it from '~/locales/it';

export default async function handleRequest(
  request: Request,
  statusCode: number,
  headers: Headers,
  context: EntryContext
) {
  // First, we create a new instance of i18next so every request will have a
  // completely unique instance and not share any state
  let instance = createInstance();

  // Then we could detect locale from the request
  let lng = await i18n.getLocale(request);
  // And here we detect what namespaces the routes about to render want to use
  let ns = i18n.getRouteNamespaces(context);

  await instance.init({
    supportedLngs: ['it', 'en'],
    fallbackLng: 'en',
    react: { useSuspense: false },
    lng,
    ns,
    resources: { en: { translation: en }, it: { translation: it } }
  });

  // Then you can render your app wrapped in the I18nextProvider as in the
  // entry.client file
  let markup = renderToString(
    <I18nextProvider i18n={instance}>
      <RemixServer context={context} url={request.url} />
    </I18nextProvider>
  );

  headers.set('Content-Type', 'text/html');

  return new Response('<!DOCTYPE html>' + markup, {
    status: statusCode,
    headers: headers
  });
}
