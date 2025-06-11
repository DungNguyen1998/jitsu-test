import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { shipmentService } from '../api/shipmentService';
import type { ShipmentFilters, ShipmentStatus, GroupedShipmentData } from '../types/shipment';

                                                                      
const ITEMS_PER_PAGE = 5;
const DEFAULT_PAGINATION = {
    page: 1, 
    limit: ITEMS_PER_PAGE, 
    total: 0, 
    totalPages: 0 
};

/**
 * Custom hook for fetching shipment data across multiple statuses
 * 
 * @description This hook manages data fetching for shipments grouped by status.
 * It creates separate queries for each status (OPEN, IN_TRANSIT, DELIVERED) and
 * combines the results into a structured format. Queries are only enabled for
 * statuses that are being filtered for, optimizing performance.
 */
export const useShipmentQueries = (
  filters: ShipmentFilters
) => {

  const statusesToFetch = filters?.status?.length ? filters.status : ['OPEN', 'IN_TRANSIT', 'DELIVERED'] as ShipmentStatus[];
  const enabledFetchOpen =  statusesToFetch.includes('OPEN');
  const enabledFetchInTransit =  statusesToFetch.includes('IN_TRANSIT');
  const enabledFetchDelivered =  statusesToFetch.includes('DELIVERED');

  /**
   * Query for OPEN status shipments
   */
  const openQuery = useQuery({
    queryKey: ['shipments', 'OPEN', filters.search, filters.open_page],
    queryFn: () => shipmentService.getShipments({
      status: 'OPEN',
      search: filters.search || undefined,
      page: filters.open_page || 1,
      limit: ITEMS_PER_PAGE,
    }),
    enabled: enabledFetchOpen,
    staleTime: 30 * 1000, // Consider data fresh for 30 seconds
    placeholderData: (previousData) => previousData, // Keep previous data while loading
  });

  /**
   * Query for IN_TRANSIT status shipments
   */
  const inTransitQuery = useQuery({
    queryKey: ['shipments', 'IN_TRANSIT', filters.search, filters.in_transit_page],
    queryFn: () => shipmentService.getShipments({
      status: 'IN_TRANSIT',
      search: filters.search || undefined,
      page: filters.in_transit_page || 1,
      limit: ITEMS_PER_PAGE,
    }),
    enabled: enabledFetchInTransit,
    staleTime: 30 * 1000,
    placeholderData: (previousData) => previousData, // Keep previous data while loading
  });

  /**
   * Query for DELIVERED status shipments
   */
  const deliveredQuery = useQuery({
    queryKey: ['shipments', 'DELIVERED', filters.search, filters.delivered_page],
    queryFn: () => shipmentService.getShipments({
      status: 'DELIVERED',
      search: filters.search || undefined,
      page: filters.delivered_page || 1,
      limit: ITEMS_PER_PAGE,
    }),
    enabled: enabledFetchDelivered,
    staleTime: 30 * 1000,
    placeholderData: (previousData) => previousData, // Keep previous data while loading
  });

  /**
   * Combine data from all queries into grouped structure
   */
    const groupedData = useMemo((): GroupedShipmentData => {
        const result: GroupedShipmentData = {};
        if (enabledFetchOpen) {
            result.OPEN = {
                shipments: openQuery.data?.data || [],
                pagination: openQuery.data?.pagination || DEFAULT_PAGINATION,
                isLoading: openQuery.isLoading,
                error: openQuery.error,
            };
        }
        if (enabledFetchInTransit) {
            result.IN_TRANSIT = {
                shipments: inTransitQuery.data?.data || [],
                pagination: inTransitQuery.data?.pagination || DEFAULT_PAGINATION,
                isLoading: inTransitQuery.isLoading,
                error: inTransitQuery.error,
            };
        }
        if (enabledFetchDelivered) { 
            result.DELIVERED = {
                shipments: deliveredQuery.data?.data || [],
                pagination: deliveredQuery.data?.pagination || DEFAULT_PAGINATION,
                isLoading: deliveredQuery.isLoading,
                error: deliveredQuery.error,
            };
        }
      return result;
    }, [openQuery, inTransitQuery, deliveredQuery, enabledFetchOpen, enabledFetchInTransit, enabledFetchDelivered]);


  const isLoading = openQuery.isLoading || inTransitQuery.isLoading || deliveredQuery.isLoading;
  const error = openQuery.error || inTransitQuery.error || deliveredQuery.error;

  return {
    groupedData,
    isLoading,
    error,
  };
}; 