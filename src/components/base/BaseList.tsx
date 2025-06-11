import { Card, List, Spin, Typography } from 'antd';
import BaseListItem from './BaseListItem';
import type { ReactNode } from 'react';
import { useCallback } from 'react';

export interface BaseListProps<TItem> {
  /**
   * The title displayed at the top of the list
   */
  title: string;
  /**
   * The name of a single item (e.g., "shipment", "order", "task")
   */
  itemName: string;
  /**
   * Array of items to display in the list
   */
  dataSource: TItem[];
  /**
   * Pagination configuration
   */
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  /**
   * Whether the list is in a loading state
   */
  loading: boolean;
  /**
   * Currently selected item id, if any
   */
  selectedId: string;
  /**
   * Callback when an item is selected
   */
  onItemSelect: (itemId: string) => void;
  /**
   * Callback when user changes the page on pagination
   */
  onPageChange: (page: number) => void;
  /**
   * Function to render the content of each item
   */
  renderItemContent: (item: TItem, isSelected: boolean) => ReactNode;
}

/**
 * A generic list component that handles selection, pagination, and custom item content rendering.
 * Optimized for performance with memoized callbacks and stable props.
 */
const BaseList = <TItem extends { id: string }>({
  title,
  itemName,
  dataSource,
  pagination,
  loading,
  selectedId,
  onItemSelect,
  onPageChange,
  renderItemContent,
}: BaseListProps<TItem>) => {
  // Create a memoized render function for the list
  const renderListItem = useCallback((item: TItem) => {
    const isSelected = selectedId === item.id;

    return (
      <BaseListItem
        key={item.id}
        item={item}
        isSelected={isSelected}
        onItemSelect={onItemSelect}
        renderItemContent={renderItemContent}
      />
    );
  }, [selectedId, onItemSelect, renderItemContent]);

  return (
    <Card
      className={`border shadow-sm`}
      size="small"
      title={
        <div className="flex items-center gap-2">
            <Typography.Text strong>{title}</Typography.Text>
            <Spin spinning={loading} size="small" />
        </div>
      }
      extra={
        <Typography.Text>
          {pagination?.total} {itemName}{pagination?.total !== 1 ? 's' : ''}
        </Typography.Text>
      }
    >
        <List
          dataSource={dataSource}
          split={false}
          loading={false} // Disable built-in loading to prevent layout shift
          pagination={{
            size: 'small',
            position: 'bottom',
            align: 'center',
            showSizeChanger: false,
            current: pagination?.page,
            total: pagination?.total,
            pageSize: pagination?.limit,
            showTotal: (total, range) => 
              `${range?.[0]}-${range?.[1]} of ${total} ${itemName}s`,
            onChange: onPageChange,
            disabled: loading, // Disable pagination during loading
          }}
          renderItem={renderListItem}
        />
    </Card> 
  );
};

export default BaseList; 