import '@remix-run/server-runtime';
import type { SlateElement } from './blocks';
import type {
  DynamicLinksFunction,
  ExternalScriptsFunction,
  StructuredDataFunction
} from 'remix-utils';
import type { Env } from '~/env';

interface HydrateFunction<LoaderData> {
  (data: LoaderData): boolean;
}

declare global {
  namespace PloneRemix {
    export type Handle<LoaderData = unknown> = {
      i18n?: string | string[];
      hydrate?: boolean | HydrateFunction<LoaderData>;
      scripts?: ExternalScriptsFunction;
      dynamicLinks?: DynamicLinksFunction<LoaderData>;
      structuredData?: StructuredDataFunction<LoaderData>;
    };
  }
}

declare module '@remix-run/server-runtime' {
  export interface AppLoadContext {
    env: Env;
  }
}

export * from './blocks';

export declare type PloneResponse = {
  /**
   * @property {number} - The HTTP status code of the response.
   */
  status: number;
  /**
   * @property {string} type - Error type
   */
  type?: 'NotFound' | 'Unauthorized';
  /**
   * @property {string} message - Error message
   */
  message?: string;
};

export type PloneContent = {
  '@id': string;
  '@type': string;
  '@components': {
    actions: {
      '@id': string;
      [key: string]: any;
    };
    breadcrumbs: {
      '@id': string;
      [key: string]: any;
    };
    contextnavigation: {
      '@id': string;
      [key: string]: any;
    };
    navigation: {
      '@id': string;
      items?: {
        '@id': string;
        language: string;
      }[];
      [key: string]: any;
    };
    types: {
      '@id': string;
      [key: string]: any;
    };
    workflow: {
      '@id': string;
      [key: string]: any;
    };
    translations: {
      '@id': string;
      items?: {
        '@id': string;
        language: string;
      }[];
      [key: string]: any;
    };
    [key: string]: {
      '@id': string;
      [key: string]: any;
    };
  };
  id: string;
  title: string;
  description?: string;
  allow_discussion?: boolean | null;
  blocks?: {
    [id: string]: any;
  };
  blocks_layout?: {
    items: string[];
  };
  contributors?: string[];
  creators?: string[];
  effective?: string | null;
  exclude_from_nav?: boolean | null;
  expires?: string | null;
  is_folderish?: boolean | null;
  items?: PloneContent[];
  items_total?: number | null;
  language?: {
    title: string;
    token: string;
  };
  lock?: {
    locked: boolean;
    stealable: boolean;
  };
  parent?: PloneContent;
  relatedItems?: PloneContent[];
  rights?: string;
  subjects?: string[];
  table_of_contents?: boolean | null;
};

export type Settings = {
  siteTitle: string;
  description?: string;
  isMultilingual: boolean;
  supportedLanguages: string[];
  defaultLanguage: string;
  internalApiPath: string;
  apiPath: string;
  publicURL: string;
  legacyTraverse: boolean;
  slate: {
    elements: SlateElement;
    topLevelTargetElements: string[];
    [key: string]: any;
  };
  nonContentRoutes: (string | RegExp)[];
  [key: string]: any;
};
