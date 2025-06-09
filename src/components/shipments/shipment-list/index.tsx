import { useMemo } from 'react';
import ShipmentStatusListCard from './ShipmentListByStatus';
import type { Shipment, ShipmentStatus, GroupedShipmentData } from '../../../types/shipment';

interface ShipmentListProps {
  groupedData: GroupedShipmentData;
  selectedShipment: Shipment | null;
  onShipmentSelect: (shipment: Shipment) => void;
  onPageChange: (status: ShipmentStatus, page: number) => void;
  filteringStatuses?: ShipmentStatus[];
}

const statusOrder: ShipmentStatus[] = ['OPEN', 'IN_TRANSIT', 'DELIVERED'];

const ShipmentList = ({
  groupedData,
  selectedShipment,
  onShipmentSelect,
  onPageChange,
  filteringStatuses,
}: ShipmentListProps) => {
  // Determine which statuses to show
  const statusesToShow = useMemo(() => {
    if (!filteringStatuses || filteringStatuses.length === 0) {
      return statusOrder; // Show all if no filter
    }
    return statusOrder.filter(status => filteringStatuses.includes(status));
  }, [filteringStatuses]);

  return (
    <div className="flex flex-col h-full">
        <div className="space-y-4 p-4">
            {statusesToShow.map(status => (
            <ShipmentStatusListCard
                key={status}
                status={status}
                dataSource={groupedData[status].shipments}
                pagination={groupedData[status].pagination}
                loading={groupedData[status].isLoading}
                selectedItem={selectedShipment}
                onItemSelect={onShipmentSelect}
                onPageChange={(page) => onPageChange(status, page)}
            />
            ))}
        </div>
    </div>
  );
};

export default ShipmentList; 