import apiClient from './client';
import type { Shipment, ShipmentStatus, UpdateShipmentStatusPayload } from '../types/shipment';

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface GetShipmentsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: ShipmentStatus;
}

export const shipmentService = {
  // Get paginated shipments with filters
  async getShipments(params: GetShipmentsParams = {}): Promise<PaginatedResponse<Shipment>> {
    const searchParams = new URLSearchParams();
    
    if (params.page) searchParams.set('_page', params.page.toString());
    if (params.limit) searchParams.set('_limit', params.limit.toString());
    if (params.search) {
      // For json-server, we need to use full-text search with 'q' parameter
      searchParams.set('q', params.search);
    }
    if (params.status) searchParams.set('status', params.status);
    
    const queryString = searchParams.toString();
    const endpoint = `/shipments${queryString ? `?${queryString}` : ''}`;
    
    const response = await apiClient.get<Shipment[]>(endpoint);
    
    // Extract total count from X-Total-Count header
    const totalHeader = response.headers.get('X-Total-Count') || '0';
    const total = parseInt(totalHeader, 10);
    
    const page = params.page || 1;
    const limit = params.limit || 20;
    const totalPages = Math.ceil(total / limit);
    
    return {
      data: response.data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  },

  // Get all shipments (for backwards compatibility)
  async getAllShipments(): Promise<Shipment[]> {
    const response = await apiClient.get<Shipment[]>('/shipments');
    return response.data;
  },

  // Get a specific shipment by ID
  async getShipmentById(id: string): Promise<Shipment> {
    const response = await apiClient.get<Shipment>(`/shipments/${id}`);
    return response.data;
  },

  // Update shipment status
  async updateShipmentStatus(payload: UpdateShipmentStatusPayload): Promise<Shipment> {
    const response = await apiClient.patch<Shipment>(`/shipments/${payload.id}`, {
      status: payload.status
    });
    return response.data;
  },
  // Update shipment by id
  async updateShipmentById(payload: Shipment): Promise<Shipment> {
    const response = await apiClient.patch<Shipment>(`/shipments/${payload.id}`, payload);
    return response.data;
  },

  // Search shipments by label or client name (deprecated - use getShipments with search param)
  async searchShipments(query: string): Promise<Shipment[]> {
    const response = await apiClient.get<Shipment[]>(`/shipments/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },

  // Filter shipments by status (deprecated - use getShipments with status param)
  async getShipmentsByStatus(status: ShipmentStatus): Promise<Shipment[]> {
    const response = await apiClient.get<Shipment[]>(`/shipments?status=${status}`);
    return response.data;
  },
}; 