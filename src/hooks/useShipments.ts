import { useState, useMemo, useCallback, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { shipmentService } from '../api/shipmentService';
import type { 
  Shipment, 
  ShipmentFilters, 
  UpdateShipmentStatusPayload, 
  ShipmentStatus,
  GroupedShipmentData
} from '../types/shipment';

const useUrlSearchParams = () => {
  const [searchParams, setSearchParams] = useState(() => new URLSearchParams(window.location.search));

  const updateSearchParams = useCallback((params: Record<string, string | string[] | undefined>) => {
    // Manually construct URL to avoid encoding commas
    const urlParts: string[] = [];
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '' && value !== null) {
        if (Array.isArray(value)) {
          if (value.length > 0) {
            urlParts.push(`${key}=${value.join(',')}`);
          }
        } else {
          urlParts.push(`${key}=${encodeURIComponent(value)}`);
        }
      }
    });
    
    const queryString = urlParts.join('&');
    const newUrl = `${window.location.pathname}${queryString ? `?${queryString}` : ''}`;
    window.history.replaceState({}, '', newUrl);
    setSearchParams(new URLSearchParams(queryString));
  }, []);

  // Listen for browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      setSearchParams(new URLSearchParams(window.location.search));
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return { searchParams, updateSearchParams };
};

const ITEMS_PER_PAGE = 5;

export const useShipments = () => {
  const queryClient = useQueryClient();
  const { searchParams, updateSearchParams } = useUrlSearchParams();
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [lastSearch, setLastSearch] = useState<string>('');

  // Parse filters from URL search params
  const filters = useMemo((): ShipmentFilters => {
    const search = searchParams.get('search') || '';
    const statusParam = searchParams.get('status');
    const status: ShipmentStatus[] | undefined = statusParam 
      ? statusParam.split(',').filter(s => ['OPEN', 'IN_TRANSIT', 'DELIVERED'].includes(s)) as ShipmentStatus[]
      : undefined;

    return { 
      search, 
      status,
      open_page: parseInt(searchParams.get('open_page') || '1', 10),
      in_transit_page: parseInt(searchParams.get('in_transit_page') || '1', 10),
      delivered_page: parseInt(searchParams.get('delivered_page') || '1', 10),
    };
  }, [searchParams]);

  // Reset pages to 1 when search changes
  useEffect(() => {
    if (filters.search !== lastSearch) {
      setLastSearch(filters.search);
      
      // Only reset pages if search actually changed and we're not on page 1
      if (lastSearch !== '' || (filters.open_page !== 1 || filters.in_transit_page !== 1 || filters.delivered_page !== 1)) {
        const resetFilters = {
          ...filters,
          open_page: 1,
          in_transit_page: 1,
          delivered_page: 1,
        };
        
        // Update URL without page params when resetting
        const params: Record<string, string | string[] | undefined> = {};
        if (resetFilters.search) params.search = resetFilters.search;
        if (resetFilters.status && resetFilters.status.length > 0) params.status = resetFilters.status;
        
        updateSearchParams(params);
      }
    }
  }, [filters.search, lastSearch, filters.open_page, filters.in_transit_page, filters.delivered_page, updateSearchParams]);

  // Update filters function
  const setFilters = useCallback((newFilters: ShipmentFilters) => {
    const params: Record<string, string | string[] | undefined> = {};
    
    if (newFilters.search) {
      params.search = newFilters.search;
    }
    
    if (newFilters.status && newFilters.status.length > 0) {
      params.status = newFilters.status;
    }

    // Add pagination params
    if (newFilters.open_page && newFilters.open_page !== 1) {
      params.open_page = newFilters.open_page.toString();
    }
    if (newFilters.in_transit_page && newFilters.in_transit_page !== 1) {
      params.in_transit_page = newFilters.in_transit_page.toString();
    }
    if (newFilters.delivered_page && newFilters.delivered_page !== 1) {
      params.delivered_page = newFilters.delivered_page.toString();
    }
    
    updateSearchParams(params);
  }, [updateSearchParams]);

  // Update page for specific status
  const updateStatusPage = useCallback((status: ShipmentStatus, page: number) => {
    const pageKey = `${status.toLowerCase()}_page` as keyof ShipmentFilters;
    setFilters({
      ...filters,
      [pageKey]: page,
    });
  }, [filters, setFilters]);

  // Determine which statuses to fetch
  const statusesToFetch = useMemo(() => {
    if (!filters.status || filters.status.length === 0) {
      return ['OPEN', 'IN_TRANSIT', 'DELIVERED'] as ShipmentStatus[];
    }
    return filters.status;
  }, [filters.status]);

  // Get shipments for OPEN status
  const openQuery = useQuery({
    queryKey: ['shipments', 'OPEN', filters.search, filters.open_page],
    queryFn: () => shipmentService.getShipments({
      status: 'OPEN',
      search: filters.search || undefined,
      page: filters.open_page,
      limit: ITEMS_PER_PAGE,
    }),
    enabled: statusesToFetch.includes('OPEN'),
  });

  // Get shipments for IN_TRANSIT status
  const inTransitQuery = useQuery({
    queryKey: ['shipments', 'IN_TRANSIT', filters.search, filters.in_transit_page],
    queryFn: () => shipmentService.getShipments({
      status: 'IN_TRANSIT',
      search: filters.search || undefined,
      page: filters.in_transit_page,
      limit: ITEMS_PER_PAGE,
    }),
    enabled: statusesToFetch.includes('IN_TRANSIT'),
  });

  // Get shipments for DELIVERED status
  const deliveredQuery = useQuery({
    queryKey: ['shipments', 'DELIVERED', filters.search, filters.delivered_page],
    queryFn: () => shipmentService.getShipments({
      status: 'DELIVERED',
      search: filters.search || undefined,
      page: filters.delivered_page,
      limit: ITEMS_PER_PAGE,
    }),
    enabled: statusesToFetch.includes('DELIVERED'),
  });

  // Combine data from all queries
  const groupedData = useMemo((): GroupedShipmentData => {
    return {
      OPEN: {
        shipments: openQuery.data?.data || [],
        pagination: openQuery.data?.pagination || { page: 1, limit: ITEMS_PER_PAGE, total: 0, totalPages: 0 },
        isLoading: openQuery.isLoading,
        error: openQuery.error,
      },
      IN_TRANSIT: {
        shipments: inTransitQuery.data?.data || [],
        pagination: inTransitQuery.data?.pagination || { page: 1, limit: ITEMS_PER_PAGE, total: 0, totalPages: 0 },
        isLoading: inTransitQuery.isLoading,
        error: inTransitQuery.error,
      },
      DELIVERED: {
        shipments: deliveredQuery.data?.data || [],
        pagination: deliveredQuery.data?.pagination || { page: 1, limit: ITEMS_PER_PAGE, total: 0, totalPages: 0 },
        isLoading: deliveredQuery.isLoading,
        error: deliveredQuery.error,
      },
    };
  }, [openQuery, inTransitQuery, deliveredQuery]);

  // Get all shipments for backwards compatibility
  const allShipments = useMemo(() => {
    return [
      ...groupedData.OPEN.shipments,
      ...groupedData.IN_TRANSIT.shipments,
      ...groupedData.DELIVERED.shipments,
    ];
  }, [groupedData]);

  // Update shipment status mutation
  const updateStatusMutation = useMutation({
    mutationFn: (payload: UpdateShipmentStatusPayload) => 
      shipmentService.updateShipmentStatus(payload),
    onSuccess: (updatedShipment) => {
      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries({ queryKey: ['shipments'] });
      
      // Update selected shipment if it's the one that was updated
      if (selectedShipment?.id === updatedShipment.id) {
        setSelectedShipment(updatedShipment);
      }
    },
  });

  const isLoading = openQuery.isLoading || inTransitQuery.isLoading || deliveredQuery.isLoading;
  const error = openQuery.error || inTransitQuery.error || deliveredQuery.error;

  return {
    shipments: allShipments,
    groupedData,
    isLoading,
    error,
    selectedShipment,
    setSelectedShipment,
    filters,
    setFilters,
    updateStatusPage,
    updateShipmentStatus: updateStatusMutation.mutate,
    isUpdatingStatus: updateStatusMutation.isPending,
    updateStatusError: updateStatusMutation.error,
  };
}; 