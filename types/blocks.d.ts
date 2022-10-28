import type { PloneContent } from 'types';
export interface BlockData<T = any> {
  id: string;
  data?: T;
  content?: T;
  styling?: { [key: string]: any };
  properties: { [key: string]: any };
  metadata?: { [key: string]: any };
  detached?: boolean;
  [key: string]: any;
}

export type BlockConfig = {
  id: string;
  title: string;
  view: React.ReactNode | JSX.Element | React.FC<BlockData>;
  variations?: BlockConfig[];
  getAsyncData?: () => {};
};

export type SlateElement = {
  [element: string]: ({
    attributes,
    data,
    children
  }: {
    attributes?: { [key: string]: any };
    data?: SlateElementData;
    children: JSX.Element[];
  }) => JSX.Element;
};

export type SlateElementData = {
  title: string;
  url?: string;
  link: {
    external?: {
      external_link: string;
      target?: string;
    };
    internal?: {
      internal_link: PloneContent[];
      target?: string;
    };
    email?: {
      email_address: string;
      email_subject?: string;
    };
  };
};
