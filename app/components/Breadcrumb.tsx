import type { PloneContent } from 'plone-restapi-client/dist/content';
import { Link } from '@remix-run/react';
import { flattenToAppURL } from '~/utils/urls';

const Breadcrumb = ({ items }: { items: PloneContent[] }) => {
  return (
    <nav aria-label="Breadcrumb" className="breadcrumb">
      <ol className="container">
        <li key="root">
          <Link to="/">Home</Link>
        </li>
        {items.map((item) => (
          <li key={item['@id']}>
            <Link to={flattenToAppURL(item['@id'])}>{item.title}</Link>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
