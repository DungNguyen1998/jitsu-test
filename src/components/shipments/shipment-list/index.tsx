import { useMemo } from 'react';
import ShipmentStatusListCard from './ShipmentListByStatus';
import type { ShipmentStatus, GroupedShipmentData, ShipmentFilters } from '../../../types/shipment';
import { updateFilterPagination } from '../../../hooks/useShipmentFilters';

interface ShipmentListProps {
  groupedData: GroupedShipmentData;
  selectedShipmentId: string;
  onShipmentSelect: (shipmentId: string) => void;
  filters: ShipmentFilters;
  onFiltersChange: (filters: ShipmentFilters) => void;
}

const statusOrder: ShipmentStatus[] = ['OPEN', 'IN_TRANSIT', 'DELIVERED'];

const ShipmentList = ({
  groupedData,
  selectedShipmentId,
  onShipmentSelect,
  filters,
  onFiltersChange,
}: ShipmentListProps) => {
  
  // Determine which statuses to show
  const statusesToShow = useMemo(() => {
    if (!filters.status || filters.status.length === 0) {
      return statusOrder; // Show all if no filter
    }
    return statusOrder.filter(status => filters?.status?.includes(status));
  }, [filters.status]);

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
                  onPageChange={(page) => {
                    const newFilters = updateFilterPagination(filters, status, page);
                    onFiltersChange(newFilters);
                  }}
                />
              );
            })}
        </div>
    </div>
  );
};

export default ShipmentList; 