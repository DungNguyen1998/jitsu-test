import { Card, Tag, Typography } from 'antd';
import { UserOutlined, EnvironmentOutlined } from '@ant-design/icons';
import type { Shipment, ShipmentStatus } from '../../types/shipment';

const { Text, Title } = Typography;

interface ShipmentListItemProps {
  shipment: Shipment;
  isSelected: boolean;
  onClick: (shipment: Shipment) => void;
}

const statusColors: Record<ShipmentStatus, string> = {
  OPEN: 'orange',
  IN_TRANSIT: 'blue',
  DELIVERED: 'green',
};

const ShipmentListItem = ({ shipment, isSelected, onClick }: ShipmentListItemProps) => {
  return (
    <Card
      hoverable
      className={`mb-2 cursor-pointer transition-all ${
        isSelected ? 'border-blue-500 shadow-md' : 'border-gray-200'
      }`}
      onClick={() => onClick(shipment)}
      size="small"
    >
      <div className="space-y-2">
        <div className="flex justify-between items-start">
          <Title level={5} className="mb-1">
            {shipment.container_label}
          </Title>
          <Tag color={statusColors[shipment.status]}>
            {shipment.status.replace('_', ' ')}
          </Tag>
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center text-gray-600">
            <UserOutlined className="mr-2" />
            <Text type="secondary">{shipment.client_name}</Text>
          </div>
          
          <div className="flex items-center text-gray-600">
            <EnvironmentOutlined className="mr-2" />
            <Text type="secondary">Warehouse: {shipment.warehouse_id}</Text>
          </div>
        </div>
        
        <div className="text-xs text-gray-500">
          ETA: {new Date(shipment.eta).toLocaleDateString()}
          <br />
          Delivery by: {new Date(shipment.delivery_by_date).toLocaleDateString()}
        </div>
      </div>
    </Card>
  );
};

export default ShipmentListItem; 