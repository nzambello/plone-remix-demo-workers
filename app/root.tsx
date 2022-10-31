import type {
  LoaderArgs,
  MetaFunction,
  SerializeFrom
} from '@remix-run/cloudflare';
import type { ReactNode } from 'react';
import { json } from '@remix-run/cloudflare';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
  useLoaderData
} from '@remix-run/react';
import { useChangeLanguage } from 'remix-i18next';
import { useShouldHydrate } from 'remix-utils';
import { useDirection, useLocale } from '~/utils/use-i18n.hook';
import { i18n, localeCookie } from '~/utils/i18n.server';
import { removeTrailingSlash } from '~/utils/remove-trailing-slash';
import { useProgress } from '~/utils/use-progress.hook';

import config from './config';

export let meta: MetaFunction = ({ data }) => {
  let { locale } = (data as SerializeFrom<typeof loader>) ?? {};
  return {
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-transparent',
    'mobile-web-app-capable': 'yes',
    'og:locale': locale,
    'og:type': 'website',
    'twitter:card': 'summary_large_image',
    'X-UA-Compatible': 'IE=edge,chrome=1',
    HandheldFriendly: 'True',
    language: locale,
    MobileOptimized: '320',
    charset: 'utf-8',
    title: config.settings.siteTitle,
    description: config.settings.description,
    viewport: 'width=device-width,initial-scale=1,viewport-fit=cover'
  };
};

export let handle: PloneRemix.Handle = { i18n: 'translation' };

export async function loader({ request }: LoaderArgs) {
  removeTrailingSlash(new URL(request.url));

  let locale = await i18n.getLocale(request);

  return json(
    { locale },
    { headers: { 'Set-Cookie': await localeCookie.serialize(locale) } }
  );
}

export default function App() {
  let { locale } = useLoaderData();

  useChangeLanguage(locale);
  useProgress();

  return (
    <Document locale={locale}>
      <Outlet />
    </Document>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  if (process.env.NODE_ENV === 'development') console.error(error);
  return (
    <Document locale={useLocale()} title="Error!">
      Unexpected error
    </Document>
  );
}

export function CatchBoundary() {
  let caught = useCatch();
  return (
    <Document locale={useLocale()} title={caught.statusText}>
      {caught.statusText}
    </Document>
  );
}

function Document({
  children,
  title,
  locale
}: {
  children: ReactNode;
  title?: string;
  locale: string;
}) {
  let shouldHydrate = useShouldHydrate();
  let dir = useDirection();
  return (
    <html lang={locale} dir={dir} className="h-full">
      <head>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        {title ? <title>{title}</title> : null}
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
