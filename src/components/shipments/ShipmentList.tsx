import GroupedShipmentList from './GroupedShipmentList';
import type { Shipment, ShipmentStatus, GroupedShipmentData } from '../../types/shipment';

interface ShipmentListProps {
  groupedData: GroupedShipmentData;
  selectedShipment: Shipment | null;
  onShipmentSelect: (shipment: Shipment) => void;
  onPageChange: (status: ShipmentStatus, page: number) => void;
  filteringStatuses?: ShipmentStatus[];
}

const ShipmentList = ({
  groupedData,
  selectedShipment,
  onShipmentSelect,
  onPageChange,
  filteringStatuses,
}: ShipmentListProps) => {
  return (
    <div className="flex flex-col h-full">
      <GroupedShipmentList
        groupedData={groupedData}
        selectedShipment={selectedShipment}
        onShipmentSelect={onShipmentSelect}
        onPageChange={onPageChange}
        filteringStatuses={filteringStatuses}
      />
    </div>
  );
};

export default ShipmentList; 