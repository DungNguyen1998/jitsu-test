import { Card, Descriptions, Tag, Select, Button, message, Empty } from 'antd';
import { UserOutlined, EnvironmentOutlined, CalendarOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useState } from 'react';
import type { Shipment, ShipmentStatus } from '../../types/shipment';

const { Option } = Select;

interface ShipmentDetailsProps {
  shipment: Shipment | null;
  onStatusUpdate: (payload: { id: string; status: ShipmentStatus }) => void;
  isUpdating: boolean;
}

const statusOptions: { label: string; value: ShipmentStatus; color: string }[] = [
  { label: 'Open', value: 'OPEN', color: 'orange' },
  { label: 'In Transit', value: 'IN_TRANSIT', color: 'blue' },
  { label: 'Delivered', value: 'DELIVERED', color: 'green' },
];

const ShipmentDetails = ({ shipment, onStatusUpdate, isUpdating }: ShipmentDetailsProps) => {
  const [selectedStatus, setSelectedStatus] = useState<ShipmentStatus | undefined>();

  if (!shipment) {
    return (
      <div className="flex items-center justify-center py-20">
        <Empty description="Select a shipment to view details" />
      </div>
    );
  }

  const handleStatusUpdate = () => {
    if (!selectedStatus || selectedStatus === shipment.status) {
      message.warning('Please select a different status');
      return;
    }

    onStatusUpdate({ id: shipment.id, status: selectedStatus });
    setSelectedStatus(undefined);
    message.success('Status update initiated');
  };

  const currentStatusOption = statusOptions.find(option => option.value === shipment.status);

  return (
    <div className="overflow-y-auto p-4 max-h-[600px]">
      <Card className="mb-6" size="small">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold">{shipment.container_label}</h2>
          <Tag color={currentStatusOption?.color} className="text-sm">
            {shipment.status.replace('_', ' ')}
          </Tag>
        </div>

        <Descriptions column={1} bordered>
          <Descriptions.Item label={<><UserOutlined /> Client Name</>}>
            {shipment.client_name}
          </Descriptions.Item>
          <Descriptions.Item label={<><EnvironmentOutlined /> Warehouse ID</>}>
            {shipment.warehouse_id}
          </Descriptions.Item>
          <Descriptions.Item label={<><CalendarOutlined /> Arrival Date</>}>
            {new Date(shipment.arrival_date).toLocaleString()}
          </Descriptions.Item>
          <Descriptions.Item label={<><CalendarOutlined /> Delivery By Date</>}>
            {new Date(shipment.delivery_by_date).toLocaleString()}
          </Descriptions.Item>
          <Descriptions.Item label={<><ClockCircleOutlined /> ETA</>}>
            {new Date(shipment.eta).toLocaleString()}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="Update Status" className="mb-6" size="small">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Select New Status:</label>
            <Select
              placeholder="Choose a new status"
              value={selectedStatus}
              onChange={setSelectedStatus}
              className="w-full"
              disabled={isUpdating}
            >
              {statusOptions
                .filter(option => option.value !== shipment.status)
                .map(option => (
                  <Option key={option.value} value={option.value}>
                    <Tag color={option.color} className="mr-2">
                      {option.label}
                    </Tag>
                  </Option>
                ))
              }
            </Select>
          </div>
          
          <Button
            type="primary"
            onClick={handleStatusUpdate}
            disabled={!selectedStatus || selectedStatus === shipment.status}
            loading={isUpdating}
            className="w-full"
          >
            Update Status
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ShipmentDetails; 