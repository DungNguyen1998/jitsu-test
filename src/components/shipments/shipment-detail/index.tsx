import { Empty, Spin, Alert } from 'antd';
import ContentCard from './ContentCard';
import StatusUpdateCard from './StatusUpdateCard';
import { useShipmentDetails } from '../../../hooks/useShipmentDetails';

interface ShipmentDetailsProps {
  shipmentId: string;
}

const ShipmentDetails = ({ shipmentId }: ShipmentDetailsProps) => {
  const { 
    shipment, 
    error,
    isFetching,
  } = useShipmentDetails(shipmentId);

  if (!shipmentId) {
    return (
      <div className="flex items-center justify-center py-20">
        <Empty description="Select a shipment to view details" />
      </div>
    );
  }

  if (error && !shipment?.id) {
    return (
      <div className="p-4">
        <Alert
          message="Error loading shipment details"
          description={error instanceof Error ? error.message : 'An unknown error occurred'}
          type="error"
          showIcon
        />
      </div>
    );
  }

  return (
    <Spin spinning={isFetching} size="small">
    <div className={`overflow-y-auto p-4 max-h-[600px]`}>
      <ContentCard shipment={shipment} />
      <StatusUpdateCard 
        shipment={shipment} 
      />
    </div>
    </Spin>
  );
};



export default ShipmentDetails; 