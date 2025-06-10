import { useMemo } from 'react';
import ShipmentStatusListCard from './ShipmentListByStatus';
import type { ShipmentStatus, GroupedShipmentData } from '../../../types/shipment';

interface ShipmentListProps {
  groupedData: GroupedShipmentData;
  selectedShipmentId: string;
  onShipmentSelect: (shipmentId: string) => void;
  onPageChange: (status: ShipmentStatus, page: number) => void;
  filteringStatuses?: ShipmentStatus[];
}

const statusOrder: ShipmentStatus[] = ['OPEN', 'IN_TRANSIT', 'DELIVERED'];

const ShipmentList = ({
  groupedData,
  selectedShipmentId,
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
            {statusesToShow.map(status => {
              const statusData = groupedData[status];
              
              return (
                <ShipmentStatusListCard
                  key={status}
                  status={status}
                  dataSource={statusData.shipments}
                  pagination={statusData.pagination}
                  loading={statusData.isLoading}
                  selectedId={selectedShipmentId}
                  onItemSelect={onShipmentSelect}
                  onPageChange={(page) => onPageChange(status, page)}
                />
              );
            })}
        </div>
    </div>
  );
};

export default ShipmentList; 