import React, { useMemo, useCallback } from 'react';
import { Card, List } from 'antd';
import type { ReactNode } from 'react';
import { PRIMARY_COLOR } from '../../constants';

const SELECTED_CARD_STYLE: React.CSSProperties = {
    borderColor: PRIMARY_COLOR,
    backgroundColor: '#f0f8ff',
    boxShadow: '0 4px 12px rgba(24, 144, 255, 0.15)',
};

interface BaseListItemProps<TItem = any> {
  /**
   * The item data to display
   */
  item: TItem & { id: string };
  /**
   * Whether the item is currently selected
   */
  isSelected: boolean;
  /**
   * Callback when an item is selected
   */
  onItemSelect: (itemId: string) => void;
  /**
   * Function to render the content of each item
   */
  renderItemContent: (item: TItem, isSelected: boolean) => ReactNode;
}

/**
 * Optimized selectable list item component with memoization
 * Handles both the List.Item wrapper and Card rendering with stable callbacks
 */
const BaseListItem = React.memo<BaseListItemProps>((props) => {
  const { item, isSelected, onItemSelect, renderItemContent } = props;

  // Create stable callbacks for this specific item
  const handleClick = useCallback(() => {
    onItemSelect(item.id);
  }, [onItemSelect, item.id]);

  // Memoize the card style to prevent object recreation on every render
  const cardStyle = useMemo(() => {
    return isSelected ? { ...SELECTED_CARD_STYLE } : undefined;
  }, [isSelected]);

  // Memoize the rendered content to avoid re-rendering if renderItemContent function is stable
  const content = useMemo(() => {
    return renderItemContent(item, isSelected);
  }, [renderItemContent, item, isSelected]);

  return (
    <List.Item style={{ padding: 0 }}>
      <Card
        hoverable
        className='w-full mb-2'
        style={cardStyle}
        onClick={handleClick}
        size="small"
      >
        {content}
      </Card>
    </List.Item>
  );
});

export default BaseListItem;