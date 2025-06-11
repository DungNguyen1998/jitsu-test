import { Button, Space, App, Card, Typography, Divider } from 'antd';
import { TruckOutlined, CheckCircleOutlined, ShopOutlined } from '@ant-design/icons';
import StatusBadge from '../../base/StatusBadge';
import type { Shipment, ShipmentStatus } from '../../../types/shipment';
import { useShipmentMutation } from '../../../hooks/useShipmentMutation';
import { useEffect } from 'react';

const { Text } = Typography;

interface SimpleStatusChangerProps {
  shipment: Shipment;
}

const SimpleStatusChanger = ({ shipment }: SimpleStatusChangerProps) => {
  const { handleStatusUpdate, isUpdating } = useStatusUpdate();

  // Define the available actions based on current status lifecycle
  const getAvailableActions = (currentStatus: ShipmentStatus) => {
    switch (currentStatus) {
      case 'OPEN':
        // OPEN can only change to IN_TRANSIT
        return [
          { 
            status: 'IN_TRANSIT' as ShipmentStatus, 
            label: 'Start Transit', 
            icon: <TruckOutlined />, 
            type: 'primary' as const,
          }
        ];
      case 'IN_TRANSIT':
        // IN_TRANSIT can go back to OPEN or forward to DELIVERED
        return [
            { 
              status: 'OPEN' as ShipmentStatus, 
              label: 'Return to Open', 
              icon: <ShopOutlined />, 
              type: 'default' as const,
            },
            { 
              status: 'DELIVERED' as ShipmentStatus, 
              label: 'Mark as Delivered', 
              icon: <CheckCircleOutlined />, 
              type: 'primary' as const,
            }
            
        ];
      case 'DELIVERED':
        // DELIVERED cannot change to any status (final state)
        return [];
      default:
        return [];
    }
  };

  const availableActions = getAvailableActions(shipment.status);

  const handleActionClick = (newStatus: ShipmentStatus) => {
    let updatedShipment = { ...shipment, status: newStatus };
    
    // Update fields based on status transition
    if (newStatus === 'DELIVERED') {
      // Set delivered date when marking as delivered
      updatedShipment.delivered_date = new Date().toISOString();
    }
    
    handleStatusUpdate(updatedShipment);
  };

  const icons = {
    'OPEN': <ShopOutlined />,
    'IN_TRANSIT': <TruckOutlined />,
    'DELIVERED': <CheckCircleOutlined />,
  }


  return (
    <Card size="small">
      <Typography.Title level={3} style={{marginTop: '0px'}}>Current Status</Typography.Title>
        <div className="flex items-center gap-3 mb-2">
            {icons[shipment.status]}
            <StatusBadge status={shipment.status} />
        </div>
        <Divider className="my-4" />
      <div className="space-y-4">
          <div className="space-y-2">

            <Text>Available Actions</Text>

            {/* Action Buttons */}
            {availableActions.length ? (
                <Space direction="vertical" className="w-full">
                {availableActions.map(action => (
                    <Button
                    key={action.status}
                    type={action.type}
                    icon={action.icon}
                    size="large"
                    className="w-full text-center"
                    onClick={() => handleActionClick(action.status)}
                    loading={isUpdating}
                    >
                    {action.label}
                    </Button>
                ))}
                </Space>
             ) : (
                <div className="flex flex-col items-center justify-center py-4 text-gray-500">
                    <CheckCircleOutlined style={{ fontSize: '48px', color: '#52c41a', marginBottom: '10px' }} />
                    <Text>
                        Shipment is completed
                    </Text>
                    <Text type="secondary" style={{ fontSize: '11px' }}>
                    No further actions available
                    </Text>
          </div>
             )}


          </div>
       
      </div>
    </Card>
  );
};

const useStatusUpdate = () => {
  const { message } = App.useApp();
  const { mutate: updateShipment, isPending: isUpdating, isSuccess, isError, error } = useShipmentMutation();

  const handleStatusUpdate = (updatedShipment: Shipment) => {
    updateShipment(updatedShipment);
  };

  useEffect(() => {
    if (isSuccess) {
      message.success('Status updated successfully');
    }
    if (isError) {
      message.error(`Failed to update status: ${error?.message || 'Unknown error'}`);
    }
  }, [isSuccess, isError, error, message]);

  return { handleStatusUpdate, isUpdating };
};

export default SimpleStatusChanger; 