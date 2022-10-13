import type { MetaFunction, LoaderArgs, LinksFunction } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import type { PloneContent } from 'plone-restapi-client/dist/content';
import { Link, useLoaderData } from '@remix-run/react';
import invariant from 'tiny-invariant';
import LanguageSelector from '~/components/LanguageSelector';
import Navigation from '~/components/Navigation';
import { flattenToAppURL } from '~/utils/urls';
import { PLONE_RESTAPI_URL } from '~/utils/variables.server';
import config from '~/config';
import * as plone from 'plone-restapi-client';
import View from '~/views/View';
import criticalCss from '../styles/critical.css';
import themeCss from '../styles/theme.css';
import reachSkipNavCss from '@reach/skip-nav/styles.css';
import { SkipNavLink, SkipNavContent } from '@reach/skip-nav';
import Breadcrumb from '~/components/Breadcrumb';
import Footer from '~/components/Footer';

plone.client.init(PLONE_RESTAPI_URL);

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
  { rel: 'stylesheet', href: themeCss },
  { rel: 'stylesheet', href: reachSkipNavCss }
];

type LoaderData = {
  lang?: string;
  content: PloneContent;
  navigation: PloneContent[]; // PloneContent['@components']['navigation']['items'][]
};

export const loader = async ({ params, request }: LoaderArgs) => {
  if (config.settings.isMultilingual) {
    const DEFAULT_LANG = config.settings.defaultLanguage;
    return redirect(`/${DEFAULT_LANG}`);
  }

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

  const content = await plone.content.get(
    `/?expand=translations&expand=breadcrumbs`
  );

  if (!content || !!content.message)
    throw new Response('Not Found', { status: 404 });

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
      navigation?.items?.map((i: PloneContent) => ({
        ...i,
        '@id': flattenToAppURL(i['@id'])
      })) ?? []
  });
};

export default function RootContentPage() {
  const { navigation, lang, content } = useLoaderData() as LoaderData;

  return (
    <>
      <SkipNavLink href="#content" />
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
        <Navigation items={navigation} />
        <LanguageSelector
          currentLang={lang}
          translations={content['@components'].translations?.items}
        />
      </header>
      <Breadcrumb items={content['@components'].breadcrumbs?.items} />
      <main className="container">
        <SkipNavContent id="content" />
        <View content={content} />
      </main>
      <Footer />
    </>
  );
}
