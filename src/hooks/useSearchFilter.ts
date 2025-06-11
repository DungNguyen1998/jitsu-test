import { useState, useCallback, useEffect } from 'react';
import { useDebounce } from 'use-debounce';
import type { ShipmentFilters, ShipmentStatus } from '../types/shipment';

interface UseSearchFilterProps {
  filters: ShipmentFilters;
  onFiltersChange: (filters: ShipmentFilters) => void;
}

interface UseSearchFilterReturn {
  filters: ShipmentFilters;
  handleSearchChange: (value: string) => void;
  handleStatusChange: (status: ShipmentStatus[] | undefined) => void;
  handleClear: () => void;
}

/**
 * Custom hook for managing search and filter values for UI components with debounced search input
 * 
 * @param filters - Current filter state
 * @param onFiltersChange - Callback to update filters
 * @returns Object containing search value and handler functions
 */
export const useSearchFilter = (props: UseSearchFilterProps): UseSearchFilterReturn => {
  const { filters, onFiltersChange } = props;
  const [searchValue, setSearchValue] = useState(filters.search);
  
  // Debounced search value using use-debounce library
  const [debouncedSearch] = useDebounce(searchValue, 300);

  // Apply debounced search to filters when it changes
  useEffect(() => {
    if (debouncedSearch !== filters.search) {
      onFiltersChange({ 
        ...filters, 
        search: debouncedSearch 
      });
    }
  }, [debouncedSearch]);


  /**
   * Handle search input changes (immediate local state update)
   */
  const handleSearchChange = useCallback((value: string) => {
    setSearchValue(value);
  }, []);

  /**
   * Handle status filter changes (immediate external state update)
   */
  const handleStatusChange = useCallback((status: ShipmentStatus[] | undefined) => {
    onFiltersChange({ 
      ...filters, 
      status 
    });
  }, [filters, onFiltersChange]);

  /**
   * Clear all filters and reset search
   */
  const handleClear = useCallback(() => {
    setSearchValue('');
    onFiltersChange({ 
      search: '', 
      status: [] 
    });
  }, [onFiltersChange]);

  return {
    filters: {...filters, search: searchValue},
    handleSearchChange,
    handleStatusChange,
    handleClear,
  };
}; 