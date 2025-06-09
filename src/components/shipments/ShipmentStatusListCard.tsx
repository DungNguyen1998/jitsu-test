import BaseList from '../base/BaseList';
import { UserOutlined } from '@ant-design/icons';
import { Typography, Tag } from 'antd';
import type { Shipment, ShipmentStatus, StatusShipmentData } from '../../types/shipment';

const { Text } = Typography;

interface ShipmentStatusListCardProps {
  status: ShipmentStatus;
  statusData: StatusShipmentData;
  selectedShipment: Shipment | null;
  onShipmentSelect: (shipment: Shipment) => void;
  onPageChange: (status: ShipmentStatus, page: number) => void;
}

const statusLabels: Record<ShipmentStatus, string> = {
  OPEN: 'Open',
  IN_TRANSIT: 'In Transit',
  DELIVERED: 'Delivered',
};

const statusColors: Record<ShipmentStatus, string> = {
  OPEN: 'orange',
  IN_TRANSIT: 'processing',
  DELIVERED: 'success',
};

const ShipmentStatusListCard = ({
  status,
  statusData,
  selectedShipment,
  onShipmentSelect,
  onPageChange,
}: ShipmentStatusListCardProps) => {
  // Transform StatusShipmentData to BaseStatusData format
  const transformedStatusData = {
    items: statusData.shipments,
    pagination: statusData.pagination,
    isLoading: statusData.isLoading,
    error: statusData.error,
  };

  // Configure how to extract fields from Shipment objects
  const itemConfig = {
    title: (shipment: Shipment) => shipment.container_label,
    subtitle: (shipment: Shipment) => shipment.client_name,
    status: (shipment: Shipment) => shipment.status,
    icon: UserOutlined,
  };

  
  const renderItemContent = (shipment: Shipment, isSelected: boolean) => {
    const textColor = isSelected ? '#1890ff' : '#262626';
    const subtextColor = isSelected ? '#1890ff' : '#8c8c8c';
    
    return (
      <div>
        {/* First line: client_name + status badge */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '4px' 
        }}>
          <Text style={{ 
            color: textColor, 
            fontWeight: isSelected ? '600' : '500',
            fontSize: '14px',
            transition: 'all 0.2s ease-in-out'
          }}>
            {shipment.client_name}
          </Text>
          <Tag 
            color={statusColors[shipment.status]}
            style={{ 
              fontSize: '11px',
              fontWeight: '500',
            }}
          >
            {statusLabels[shipment.status]}
          </Tag>
        </div>
        
        {/* Second line: container_label + arrival_date */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center' 
        }}>
          <Text style={{ 
            color: subtextColor, 
            fontSize: '12px',
            transition: 'all 0.2s ease-in-out'
          }}>
            {shipment.container_label}
          </Text>
          <Text style={{ 
            color: subtextColor, 
            fontSize: '11px',
            transition: 'all 0.2s ease-in-out'
          }}>
            {new Date(shipment.arrival_date).toLocaleString()}
          </Text>
        </div>
      </div>
    );
  };
  
  return (
    <BaseList
      status={status}
      statusData={transformedStatusData}
      selectedItem={selectedShipment}
      onItemSelect={onShipmentSelect}
      onPageChange={onPageChange}
      statusConfig={{
        labels: statusLabels,
        colors: statusColors,
      }}
      itemName="shipment"
      itemConfig={itemConfig}
      renderItemContent={renderItemContent}
    />
  );
};

export default ShipmentStatusListCard; 