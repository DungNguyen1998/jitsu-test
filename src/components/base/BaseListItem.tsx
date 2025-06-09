import { Card } from 'antd';
import type { ReactNode } from 'react';
import { PRIMARY_COLOR } from '../../constants';

const SELECTED_CARD_STYLE: React.CSSProperties = {
    borderColor: PRIMARY_COLOR,
    backgroundColor: '#f0f8ff',
    boxShadow: '0 4px 12px rgba(24, 144, 255, 0.15)',
};
interface BaseListItemProps {
  /**
   * Whether the item is currently selected
   */
  isSelected: boolean;
  /**
   * Click handler for the item
   */
  onClick: () => void;
  /**
   * Function to render the content inside the item
   */
  renderContent: () => ReactNode;
}

/**
 * Renders a selectable card item that can be used in lists (e.g., BaseList)
 */
const BaseListItem = (props: BaseListItemProps) => {
  const {isSelected, onClick, renderContent} = props;

  return (
    <Card
      hoverable
      className='w-full mb-2'
      style={isSelected ? {...SELECTED_CARD_STYLE} : {}}
      onClick={onClick}
      size="small"
    >
      {renderContent()}
    </Card>
  );
};

export default BaseListItem;