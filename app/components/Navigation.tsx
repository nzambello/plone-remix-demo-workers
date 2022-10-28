import type { PloneContent } from 'types';
import { Link, useParams } from '@remix-run/react';
import { flattenToAppURL } from '~/utils/urls';

const Navigation = ({ items }: { items: PloneContent[] }) => {
  const route = useParams()?.['*'];

  return (
    <nav>
      <button className="mobile-menu-open">Menu</button>
      <ul id="navigation">
        <li>
          <a href="#main" className="mobile-menu-close" title="Close">
            &times;
          </a>
        </li>
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
