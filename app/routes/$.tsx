import type {
  MetaFunction,
  LinksFunction,
  LoaderArgs
} from '@remix-run/cloudflare';
import { json, redirect } from '@remix-run/cloudflare';
import type { PloneContent, PloneResponse } from 'types';
import { Link, useLoaderData } from '@remix-run/react';
import invariant from 'tiny-invariant';
import LanguageSelector from '~/components/LanguageSelector';
import Navigation from '~/components/Navigation';
import { flattenToAppURL } from '~/utils/urls';
import config from '~/config';
import View from '~/views/View';
import criticalCss from '../styles/critical.css';
import themeCss from '../styles/theme.css';
import Breadcrumb from '~/components/Breadcrumb';
import Footer from '~/components/Footer';

invariant(
  config.settings.defaultLanguage,
  'Missing defaultLanguage in config.settings'
);

export const meta: MetaFunction = ({ data }) => ({
  charset: 'utf-8',
  title: `${data?.content?.title}${data?.content?.title ? ' | ' : ''}${
    config.settings.siteTitle
  }`,
  viewport: 'width=device-width,initial-scale=1'
});

export const links: LinksFunction = () => [
  { rel: 'preload', href: criticalCss, as: 'style' },
  { rel: 'stylesheet', href: criticalCss },
  { rel: 'preload', href: themeCss, as: 'style' },
  { rel: 'stylesheet', href: themeCss }
];

type LoaderData = {
  lang?: string;
  content?: PloneContent;
  navigation?: PloneContent[];
};

export const loader = async ({ params, request, context }: LoaderArgs) => {
  const lang = config.settings.isMultilingual
    ? flattenToAppURL(request.url).split('/')?.[1] ??
      config.settings.defaultLanguage
    : config.settings.defaultLanguage;

  const navReq = await fetch(
    `${PLONE_RESTAPI_URL}/${
      config.settings.isMultilingual ? `${lang}/` : ''
    }@navigation?expand.navigation.depth=2`,
    {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    }
  );
  const navigation = await navReq.json();

  const contentReq = await fetch(
    `${PLONE_RESTAPI_URL}/${params['*']}?expand=translations&expand=breadcrumbs`,
    {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    }
  );
  const content = (await contentReq.json()) as PloneContent & PloneResponse;

  if (!content || !!content.message)
    throw new Response('Not Found', { status: 404 });

  if (content['@type'] === 'PloneSite' && config.settings.isMultilingual) {
    const DEFAULT_LANG = config.settings.defaultLanguage;
    return redirect(`/${DEFAULT_LANG}`);
  }

  return json<LoaderData>({
    lang,
    content: {
      ...content,
      '@id': flattenToAppURL(content['@id']),
      '@components': {
        ...(content['@components'] || {}),
        translations: {
          ...(content['@components']?.['translations'] || {}),
          items: [
            // @ts-ignore
            ...(content['@components']?.['translations']?.items?.map((i) => ({
              ...i,
              '@id': flattenToAppURL(i['@id'])
            })) || [])
          ]
        },
        breadcrumbs: {
          ...(content['@components']?.['breadcrumbs'] || {}),
          items: [
            // @ts-ignore
            ...(content['@components']?.['breadcrumbs']?.items?.map((i) => ({
              ...i,
              '@id': flattenToAppURL(i['@id'])
            })) || [])
          ]
        }
      }
    },
    navigation:
      // @ts-ignore
      navigation?.items?.map((i: PloneContent) => ({
        ...i,
        '@id': flattenToAppURL(i['@id'])
      })) ?? []
  });
};

export function Content({
  navigation,
  lang,
  content,
  children
}: LoaderData & { children?: React.ReactNode }) {
  return (
    <>
      <nav className="skip-links">
        <a href="#content">Skip to content</a>
        <a href="#navigation">Skip to navigation</a>
      </nav>
      <header className="container">
        <Link
          to={
            config.settings.isMultilingual
              ? `/${lang || config.settings.defaultLanguage}`
              : ''
          }
        >
          <img
            alt="logo"
            src="https://6.demo.plone.org/static/media/Logo.16e25cdf.svg"
          />
        </Link>
        <Navigation items={navigation ?? []} />
        {content && (
          <LanguageSelector
            currentLang={lang}
            translations={content?.['@components'].translations?.items}
          />
        )}
      </header>
      {content && (
        <Breadcrumb items={content?.['@components'].breadcrumbs?.items} />
      )}
      <main className="container" id="content">
        {children}
      </main>
      <Footer />
    </>
  );
}

export function CatchBoundary() {
  return (
    <Content>
      <h2>We couldn't find that page!</h2>
    </Content>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  if (process.env.NODE_ENV === 'development') console.error(error);
  return (
    <Content>
      <p>Unexpected error</p>
    </Content>
  );
}

export default function ContentPage() {
  const { navigation, lang, content } = useLoaderData() as LoaderData;

  return (
    <Content navigation={navigation} lang={lang} content={content}>
      {/* @ts-ignore */}
      <View content={content} />
    </Content>
  );
}
