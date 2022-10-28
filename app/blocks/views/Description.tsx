import type { BlockData } from 'types/blocks';

/**
 * View description block component.
 * @class View
 * @extends Component
 */
const DescriptionBlockView = ({ properties, metadata }: BlockData) => {
  return (
    <p className="documentDescription">
      {(metadata || properties)['description'] || ''}
    </p>
  );
};

export default DescriptionBlockView;
