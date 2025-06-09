export interface Shipment {
  id: string;
  client_name: string;
  container_label: string;
  status: ShipmentStatus;
  arrival_date: string;
  delivery_by_date: string;
  eta: string;
  warehouse_id: string;
}

export type ShipmentStatus = 'OPEN' | 'IN_TRANSIT' | 'DELIVERED';

export interface ShipmentFilters {
  /**
   * input value for search
   */
  search: string;
  /**
   * selected statuses to filter by
   */
  status?: ShipmentStatus[];
  /**
   * page number for OPEN shipments pagination
   */
  open_page?: number;
  /**
   * page number for IN_TRANSIT shipments pagination
   */
  in_transit_page?: number;
  /**
   * page number for DELIVERED shipments pagination
   */
  delivered_page?: number;
}

export interface UpdateShipmentStatusPayload {
  id: string;
  status: ShipmentStatus;
}

export interface StatusShipmentData {
  shipments: Shipment[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  isLoading: boolean;
  error: Error | null;
}

export interface GroupedShipmentData {
  [key: string]: StatusShipmentData;
} 