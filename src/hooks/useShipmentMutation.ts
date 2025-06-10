import { useMutation, useQueryClient } from "@tanstack/react-query";
import { shipmentService } from "../api/shipmentService";
import type { Shipment } from "../types/shipment";

/**
 * Hook to update shipment by id
 */
export const useShipmentMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (payload: Shipment) => 
      shipmentService.updateShipmentById(payload),
    onMutate: async (variables) => {
      // Cancel any outgoing refetches for this specific shipment
      await queryClient.cancelQueries({ queryKey: ['shipment', variables.id] });
    },
    onSuccess: (updatedShipment) => {
      // Update the cache with the actual response
      queryClient.setQueryData(['shipment', updatedShipment.id], updatedShipment);
      
      // Invalidate shipments list to refresh the lists
      queryClient.invalidateQueries({ queryKey: ['shipments'] });
    },
  });
};