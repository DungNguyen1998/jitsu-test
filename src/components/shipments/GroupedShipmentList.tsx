import { useMemo } from 'react';
import ShipmentStatusListCard from './ShipmentStatusListCard';
import type { Shipment, ShipmentStatus, GroupedShipmentData } from '../../types/shipment';

interface GroupedShipmentListProps {
  groupedData: GroupedShipmentData;
  selectedShipment: Shipment | null;
  onShipmentSelect: (shipment: Shipment) => void;
  onPageChange: (status: ShipmentStatus, page: number) => void;
  filteringStatuses?: ShipmentStatus[];
}

const statusOrder: ShipmentStatus[] = ['OPEN', 'IN_TRANSIT', 'DELIVERED'];

const GroupedShipmentList = ({
  groupedData,
  selectedShipment,
  onShipmentSelect,
  onPageChange,
  filteringStatuses,
}: GroupedShipmentListProps) => {
  // Determine which statuses to show
  const statusesToShow = useMemo(() => {
    if (!filteringStatuses || filteringStatuses.length === 0) {
      return statusOrder; // Show all if no filter
    }
    return statusOrder.filter(status => filteringStatuses.includes(status));
  }, [filteringStatuses]);

  return (
    <div className="space-y-4 p-4">
      {statusesToShow.map(status => (
        <ShipmentStatusListCard
          key={status}
          status={status}
          statusData={groupedData[status]}
          selectedShipment={selectedShipment}
          onShipmentSelect={onShipmentSelect}
          onPageChange={onPageChange}
        />
      ))}
    </div>
  );
};

export default GroupedShipmentList; 