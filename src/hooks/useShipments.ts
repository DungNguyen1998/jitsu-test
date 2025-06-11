import { useShipmentFilters } from './useShipmentFilters';
import { useShipmentQueries } from './useShipmentQueries';
import { useState } from 'react';

/**
 * Main hook for managing shipment data, filters, and selection
 * 
 * @description This is the primary hook for shipment management that combines filtering,
 * data fetching, and selection state management. It provides a complete interface for
 * shipment list functionality including search, status filtering, pagination, and selection.
 * 
 */
export const useShipments = () => {

  // Manage filter state and URL synchronization
  const { filters, setFilters } = useShipmentFilters();

  // Fetch shipment data based on current filters
  const { groupedData, isLoading, error } = useShipmentQueries(filters);

  const [selectedShipmentId, setSelectedShipmentId] = useState<string>('');

  return {
    // Data
    groupedData,
    isLoading,
    error,

    // Selection state
    selectedShipmentId,
    setSelectedShipmentId,

    // Filter state
    filters, // filters state includes search input, status filter, and pagination
    setFilters, // update filters state and sync with URL
  };
}; 