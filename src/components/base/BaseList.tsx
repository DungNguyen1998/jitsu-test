import { Card, List, Typography } from 'antd';
import BaseListItem from './BaseListItem';
import type { ReactNode } from 'react';
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
   * Currently selected item, if any
   */
  selectedItem: TItem | null;
  /**
   * Callback when an item is selected
   */
  onItemSelect: (item: TItem) => void;
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
 */
const BaseList = <TItem extends { id: string }>({
  title,
  itemName,
  dataSource,
  pagination,
  loading,
  selectedItem,
  onItemSelect,
  onPageChange,
  renderItemContent,
}: BaseListProps<TItem>) => {

  return (
    <Card
      className="border shadow-sm"
      size="small"
      title={
        <div className="flex items-center justify-between">
            <Typography.Text strong>{title}</Typography.Text>
        </div>
      }
      extra={
        <Typography.Text>
          {pagination?.total} {itemName}{pagination?.total !== 1 ? 's' : ''}
        </Typography.Text>
      }
    >
        <List
          loading={loading}
          dataSource={dataSource}
          split={false}
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
          }}
          renderItem={(item) => (
            <List.Item style={{ padding: 0 }}>             
                <BaseListItem
                  key={item.id}
                  isSelected={selectedItem?.id === item.id}
                  onClick={() => onItemSelect(item)}
                  renderContent={() => renderItemContent(item, selectedItem?.id === item.id)}
                />
            </List.Item>
          )}
        />
    </Card> 
  );
};

export default BaseList; 