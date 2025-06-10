import BaseList, { type BaseListProps } from '../../base/BaseList';
import { Typography } from 'antd';
import type { Shipment, ShipmentStatus } from '../../../types/shipment';
import { PRIMARY_COLOR, STATUS_LABELS } from '../../../constants';
import StatusBadge from '../../base/StatusBadge';
import React, { useCallback } from 'react';

const { Text } = Typography;

interface ShipmentStatusListProps extends Omit<BaseListProps<Shipment>, 'title' | 'itemName' | 'renderItemContent'> {
  status: ShipmentStatus;
}

/**
 * Optimized ShipmentListByStatus component that only re-renders when its specific status data changes
 */
const ShipmentListByStatus = React.memo<ShipmentStatusListProps>((props) => {
  const {status, ...rest} = props;

  // Memoize the render function to prevent recreation on every render
  const renderItemContent = useCallback((shipment: Shipment, isSelected: boolean) => {
    const textColor = isSelected ? PRIMARY_COLOR : undefined;
    
    return (
      <div className="flex flex-col gap-1 transition-all duration-200">
        {/* First line: client_name + status badge */}
        <div className="flex justify-between items-center">
          <Text strong style={{ color: textColor}}>
            {shipment.client_name}
          </Text>
          <StatusBadge status={shipment.status} />
        </div>
        
        {/* Second line: container_label + arrival_date */}
        <div className="flex justify-between items-center">
          <Text style={{ color: textColor, fontSize: '12px'}} type='secondary'>
            {shipment.container_label}
          </Text>
          <Text style={{ color: textColor, fontSize: '11px'}} type='secondary'>
            {new Date(shipment.arrival_date).toLocaleString()}
          </Text>
        </div>
      </div>
    );
  }, []); // Empty dependency array since the function doesn't depend on any props

  return (
    <BaseList
      title={STATUS_LABELS[status]}
      itemName="shipment"
      renderItemContent={renderItemContent}
      {...rest}
    />
  );
}, (prevProps, nextProps) => {
  // Custom comparison function for React.memo
  // Only re-render if the props that matter to this specific status have changed
  
  // Check if basic props changed
  if (
    prevProps.status !== nextProps.status ||
    prevProps.loading !== nextProps.loading ||
    prevProps.selectedId !== nextProps.selectedId
  ) {
    return false; // Props changed, re-render
  }

  // Check if pagination changed
  if (
    prevProps.pagination.page !== nextProps.pagination.page ||
    prevProps.pagination.total !== nextProps.pagination.total ||
    prevProps.pagination.totalPages !== nextProps.pagination.totalPages ||
    prevProps.pagination.limit !== nextProps.pagination.limit
  ) {
    return false; // Pagination changed, re-render
  }

  // Check if data array changed (shallow comparison for performance)
  if (
    prevProps.dataSource.length !== nextProps.dataSource.length ||
    prevProps.dataSource !== nextProps.dataSource
  ) {
    return false; // Data changed, re-render
  }

  // No relevant changes detected, skip re-render
  return true;
});

ShipmentListByStatus.displayName = 'ShipmentListByStatus';

export default ShipmentListByStatus; 