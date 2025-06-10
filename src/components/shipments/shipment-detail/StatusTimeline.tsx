import { Card, Steps } from 'antd';
import { TruckOutlined, CheckCircleOutlined, ShopOutlined } from '@ant-design/icons';
import type { Shipment, ShipmentStatus } from '../../../types/shipment';
import { STATUS_LABELS } from '../../../constants';

interface StatusTimelineCardProps {
  shipment: Shipment;
}

const StatusTimelineCard = ({ shipment }: StatusTimelineCardProps) => {
  // Define the status steps
  const statusSteps = [
    {
      title: STATUS_LABELS.OPEN,
      icon: <ShopOutlined />,
      status: 'OPEN' as ShipmentStatus,
    },
    {
      title: STATUS_LABELS.IN_TRANSIT,
      icon: <TruckOutlined />,
      status: 'IN_TRANSIT' as ShipmentStatus,
    },
    {
      title: STATUS_LABELS.DELIVERED,
      icon: <CheckCircleOutlined />,
      status: 'DELIVERED' as ShipmentStatus,
    },
  ];

  // Calculate current step based on shipment status
  const getCurrentStep = (currentStatus: ShipmentStatus) => {
    const stepIndex = statusSteps.findIndex(step => step.status === currentStatus);
    return stepIndex >= 0 ? stepIndex : 0;
  };

  const currentStep = getCurrentStep(shipment.status);

  // Convert steps to Ant Design Steps format
  const stepsItems = statusSteps.map((step, index) => ({
    title: step.title,
    icon: step.icon,
    status: (index < currentStep ? 'finish' : index === currentStep ? 'process' : 'wait') as 'finish' | 'process' | 'wait',
    direction: 'horizontal',
  }));

  return (
    <Card 
      className="mb-6" 
      size="small"
    >
      <div className="px-4 py-2">
        <Steps
          current={currentStep}
          direction="horizontal"
          size="default"
          items={stepsItems}
          className="status-timeline-steps"
        />
      </div>
    </Card>
  );
};

export default StatusTimelineCard; 