import type { BlockData } from 'types/blocks';

/**
 * View html block class.
 * @class View
 * @extends Component
 */
const HTMLBlockView = ({ content }: BlockData) => (
  <div
    className="block html"
    dangerouslySetInnerHTML={{ __html: content.html }}
  />
);

export default HTMLBlockView;
