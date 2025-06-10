import { useQuery } from '@tanstack/react-query';
import { shipmentService } from '../api/shipmentService';
import type { Shipment } from '../types/shipment';

export const defaultShipment: Shipment = {
    id: '',
    client_name: '',
    container_label: '',
    status: 'OPEN',
    arrival_date: '',
    delivery_by_date: '',
    eta: '',
    warehouse_id: '',
};

/**
 * Hook to fetch and manage shipment details
 * @param shipmentId - The ID of the shipment to fetch
 * @returns {Object} An object containing:
 * - shipment: The fetched shipment data or initial empty shipment if not loaded
 * - isLoading: Boolean indicating if the query is in progress
 * - error: Any error that occurred during the fetch
 * - refetch: Function to manually trigger a refetch of the data
 */
export const useShipmentDetails = (shipmentId: string) => {
  const {
    data: shipment,
    isLoading,
    error,
    refetch,
    isFetching
  } = useQuery({
    queryKey: ['shipment', shipmentId],
    queryFn: () => shipmentService.getShipmentById(shipmentId!),
    enabled: !!shipmentId,
    placeholderData: (previousData, previousQuery) => {
      // Keep previous data when switching between different shipments
      if (previousQuery && previousData && previousData.id !== defaultShipment.id) {
        return previousData;
      }
      return defaultShipment;
    },
  });

  return {
    shipment: shipment ?? defaultShipment,
    isLoading,
    isFetching, // This shows true when fetching new data but still has cached data
    error,
    refetch,
  };
}; 