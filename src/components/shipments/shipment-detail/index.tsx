import { Empty } from 'antd';
import type { Shipment, ShipmentStatus } from '../../../types/shipment';
import ContentCard from './ContentCard';
import StatusUpdateCard from './StatusUpdateCard';


interface ShipmentDetailsProps {
  shipment: Shipment | null;
  onStatusUpdate: (payload: { id: string; status: ShipmentStatus }) => void;
  isUpdating: boolean;
}

const ShipmentDetails = ({ shipment, onStatusUpdate, isUpdating }: ShipmentDetailsProps) => {

  if (!shipment) {
    return (
      <div className="flex items-center justify-center py-20">
        <Empty description="Select a shipment to view details" />
      </div>
    );
  }

  return (
    <div className="overflow-y-auto p-4 max-h-[600px]">
      <ContentCard shipment={shipment} />

      <StatusUpdateCard shipment={shipment} onStatusUpdate={onStatusUpdate} isUpdating={isUpdating} />
    </div>
  );
};



export default ShipmentDetails; 