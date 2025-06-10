import type { ShipmentStatus } from "../types/shipment";

export const STATUS_LABELS: Record<ShipmentStatus, string> = {
    OPEN: 'Open',
    IN_TRANSIT: 'In Transit',
    DELIVERED: 'Delivered',
};
  
export const STATUS_COLORS: Record<ShipmentStatus, string> = {
    OPEN: 'processing',
    IN_TRANSIT: 'orange',
    DELIVERED: 'success',
};

export const PRIMARY_COLOR = '#1890ff';

export const STATUS_OPTIONS = [
  { label: STATUS_LABELS.OPEN, value: 'OPEN' as const },
  { label: STATUS_LABELS.IN_TRANSIT, value: 'IN_TRANSIT' as const },
  { label: STATUS_LABELS.DELIVERED, value: 'DELIVERED' as const },
] as const;