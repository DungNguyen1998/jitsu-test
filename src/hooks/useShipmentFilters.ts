import { useMemo, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { ShipmentFilters, ShipmentStatus } from '../types/shipment';

// Constants
const VALID_STATUSES: ShipmentStatus[] = ['OPEN', 'IN_TRANSIT', 'DELIVERED'];
const DEFAULT_PAGE = 1;

// Pure utility functions for better testability

/**
 * Parse status parameter from URL string
 */
export const parseStatusFromUrl = (statusParam: string): ShipmentStatus[] => {
    if (!statusParam.trim()) return [];

    return statusParam
        .split(',')
        .filter((s: string) => VALID_STATUSES.includes(s as ShipmentStatus))
        .map(s => s as ShipmentStatus);
};

/**
 * Parse page number from URL parameter
 */
export const parsePageFromUrl = (pageParam: string | null): number => {
    if (!pageParam) return DEFAULT_PAGE;

    const page = parseInt(pageParam, 10);
    return isNaN(page) || page < 1 ? DEFAULT_PAGE : page;
};

/**
 * Get pagination key for a specific status
 */
export const getPageKey = (status: ShipmentStatus) => {
    return `${status.toLowerCase()}_page` as 'open_page' | 'in_transit_page' | 'delivered_page';
};

/**
 * Check if pagination needs to be reset
 */
export const shouldResetPagination = (filters: ShipmentFilters): boolean => {
    return (filters.open_page !== undefined && filters.open_page !== DEFAULT_PAGE) ||
        (filters.in_transit_page !== undefined && filters.in_transit_page !== DEFAULT_PAGE) ||
        (filters.delivered_page !== undefined && filters.delivered_page !== DEFAULT_PAGE);
};

/**
 * Parse all filters from URLSearchParams
 */
export const parseFiltersFromUrl = (searchParams: URLSearchParams): ShipmentFilters => {
    const search = searchParams.get('search') || '';
    const status = parseStatusFromUrl(searchParams.get('status') || '');

    const filters: ShipmentFilters = {
        search,
        status,
    };

    // Add pagination only for selected statuses
    if (!status.length || status.includes('OPEN')) {
        filters.open_page = parsePageFromUrl(searchParams.get('open_page'));
    }
    if (!status.length || status.includes('IN_TRANSIT')) {
        filters.in_transit_page = parsePageFromUrl(searchParams.get('in_transit_page'));
    }
    if (!status.length || status.includes('DELIVERED')) {
        filters.delivered_page = parsePageFromUrl(searchParams.get('delivered_page'));
    }

    return filters;
};

/**
 * Build URLSearchParams from filter object
 */
export const buildUrlParams = (filters: ShipmentFilters): URLSearchParams => {
    const params = new URLSearchParams();
    const { search, status, open_page, in_transit_page, delivered_page } = filters;

    // Add search parameter
    if (search?.trim()) {
        params.set('search', search);
    }
    if (status && status.length > 0) {
        params.set('status', status.join(','));
    }

    if (open_page && open_page !== DEFAULT_PAGE) {
        params.set('open_page', open_page.toString());
    }
    if (in_transit_page && in_transit_page !== DEFAULT_PAGE) {
        params.set('in_transit_page', in_transit_page.toString());
    }
    if (delivered_page && delivered_page !== DEFAULT_PAGE) {
        params.set('delivered_page', delivered_page.toString());
    }

    console.log('buildUrlParams', { filters, params });
    return params;
};

/**
 * Create filters with reset pagination
 */
export const createFiltersWithResetPagination = (filters: ShipmentFilters): ShipmentFilters => {
    const resetFilters: ShipmentFilters = {
        search: filters.search,
        status: filters.status,
    };

    // Add default pagination for selected statuses
    filters.status?.forEach(status => {
        const pageKey = getPageKey(status);
        resetFilters[pageKey] = DEFAULT_PAGE;
    });

    return resetFilters;
};

/**
 * Update pagination for a specific status in filters
 */
export const updateFilterPagination = (
    filters: ShipmentFilters,
    status: ShipmentStatus,
    page: number
): ShipmentFilters => {
    // Validate that status is selected
    if (filters.status && filters.status.length > 0 && !filters.status.includes(status)) {
        console.warn(`Attempted to update pagination for unselected status: ${status}`);
        return filters;
    }

    const pageKey = getPageKey(status);
    return {
        ...filters,
        [pageKey]: page,
    };
};

// Main hook
export const useShipmentFilters = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [lastSearch, setLastSearch] = useState<string>('');

    /**
     * Parse current filters from URL search parameters
     * Using useMemo ensures filters always reflect the current URL state
     */
    const filters = useMemo((): ShipmentFilters => {
        return parseFiltersFromUrl(searchParams);
    }, [searchParams]);

    /**
     * Reset pagination when search term changes
     */
    useEffect(() => {
        const currentSearch = filters.search;

        if (currentSearch !== lastSearch) {
            setLastSearch(currentSearch);

            // Only reset if we're not already on page 1 and this isn't the initial load
            if (shouldResetPagination(filters) && lastSearch !== '') {
                const resetFilters = createFiltersWithResetPagination(filters);
                const params = buildUrlParams(resetFilters);
                setSearchParams(params);
            }
        }
    }, [filters, lastSearch, setSearchParams]);

    /**
     * Update filters and synchronize with URL
     */
    const updateFilters = (newFilters: ShipmentFilters) => {
        const params = buildUrlParams(newFilters);
        setSearchParams(params);
    };

    return {
        filters,
        setFilters: updateFilters,
    };
}; 