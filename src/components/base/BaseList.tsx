import { Card, Badge, Empty, Spin, Alert, List, Typography } from 'antd';
import BaseListItem from './BaseListItem';
import type { ReactNode } from 'react';


interface BaseStatusData<TItem> {
  items: TItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  isLoading: boolean;
  error: Error | null;
}

interface ItemFieldConfig<TItem, TStatus extends string> {
  title: (item: TItem) => string;
  subtitle?: (item: TItem) => string;
  status: (item: TItem) => TStatus;
  icon?: React.ComponentType<any>;
}

interface BaseListProps<TItem, TStatus extends string> {
  status: TStatus;
  statusData: BaseStatusData<TItem>;
  selectedItem: TItem | null;
  onItemSelect: (item: TItem) => void;
  onPageChange: (status: TStatus, page: number) => void;
  statusConfig: {
    labels: Record<TStatus, string>;
    colors: Record<TStatus, string>;
  };
  itemName: string; // e.g., "shipment", "order", "task"
  itemConfig: ItemFieldConfig<TItem, TStatus>;
  renderItemContent: (item: TItem, isSelected: boolean) => ReactNode;
}

const BaseList = <TItem extends { id: string }, TStatus extends string>({
  status,
  statusData,
  selectedItem,
  onItemSelect,
  onPageChange,
  statusConfig,
  itemName,
  renderItemContent,
}: BaseListProps<TItem, TStatus>) => {
  const { items, pagination, isLoading, error } = statusData;
  const { labels, colors } = statusConfig;


  if (error) {
    return (
      <Card
        title={
          <div className="flex items-center justify-between">
            <Badge 
              status={colors[status] as any} 
              text={labels[status]} 
              className="text-lg font-medium"
            />
            <span className="text-sm text-red-500">Error</span>
          </div>
        }
        className="border shadow-sm"
      >
        <Alert 
          message={`Error loading ${labels[status].toLowerCase()} ${itemName}s`} 
          description={error.message}
          type="error" 
        />
      </Card>
    );
  }

  return (
    <Card
      title={
        <div className="flex items-center justify-between">
          <Badge 
            status={colors[status] as any} 
            text={labels[status]} 
            className="text-lg font-medium"
          />
          <span className="text-sm text-gray-500">
            {pagination.total} {itemName}{pagination.total !== 1 ? 's' : ''}
          </span>
        </div>
      }
      className="border shadow-sm"
      size="small"
    >
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Spin size="large" />
        </div>
      ) : pagination.total === 0 ? (
        <Empty 
          description={`No ${labels[status].toLowerCase()} ${itemName}s`}
          className="py-8"
        />
      ) : (
        <List
          dataSource={items}
          split={false}
          pagination={{
            size: 'small',
            current: pagination.page,
            total: pagination.total,
            pageSize: pagination.limit,
            showSizeChanger: false,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} of ${total} ${itemName}s`,
            onChange: (page) => onPageChange(status, page),
            position: 'bottom',
            align: 'center',
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
      )}
    </Card> 
  );
};

export default BaseList; 