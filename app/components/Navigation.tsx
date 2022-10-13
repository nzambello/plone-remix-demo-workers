import type { PloneContent } from 'plone-restapi-client/dist/content';
import { Link, useParams } from '@remix-run/react';
import { flattenToAppURL } from '~/utils/urls';

const Navigation = ({ items }: { items: PloneContent[] }) => {
  const route = useParams()?.['*'];

  return (
    <nav>
      <ul>
        {items.map((item) => (
          <li
            key={item['@id']}
            className={
              (!route && item['@id'] === '') ||
              (route && item['@id'].includes(route))
                ? 'active'
                : ''
            }
          >
            <Link to={flattenToAppURL(item['@id'])}>{item.title}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navigation;
