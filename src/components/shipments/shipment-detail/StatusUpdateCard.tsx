import { Button, Card, Select, App } from "antd";
import StatusBadge from "../../base/StatusBadge";
import type { Shipment, ShipmentStatus } from "../../../types/shipment";
import { STATUS_OPTIONS } from "../../../constants";
import { useState, useEffect } from "react";
import { useShipmentMutation } from "../../../hooks/useShipmentMutation";

const StatusUpdateCard = ({ shipment }: { shipment: Shipment }) => {
    const { selectedStatus, setSelectedStatus, handleStatusUpdate, isUpdating } = useStatusUpdate(shipment);
    return (
        <Card title="Update Status" className="mb-6" size="small">
          <div className="flex gap-4 items-center">
              <Select
                placeholder="Choose a new status"
                value={selectedStatus}
                onChange={setSelectedStatus}
                className="w-full"
                disabled={isUpdating}
              >
                {STATUS_OPTIONS
                  .filter(option => option.value !== shipment.status)
                  .map(option => (
                    <Select.Option key={option.value} value={option.value} className="flex items-center gap-2">
                      <StatusBadge status={option.value} />
                    </Select.Option>
                  ))
                }
              </Select>
            
            <Button
              type="primary"
              onClick={handleStatusUpdate}
              disabled={!selectedStatus || selectedStatus === shipment.status}
              loading={isUpdating}
              className="w-full"
            >
              Update Status
            </Button>
          </div>
        </Card>
    );
  };
  
  const useStatusUpdate = (shipment: Shipment) => {
    const [selectedStatus, setSelectedStatus] = useState<ShipmentStatus | undefined>();
    const { message } = App.useApp();
    const { mutate: updateShipment, isPending: isUpdating, isSuccess, isError } = useShipmentMutation();
    
    const handleStatusUpdate = () => {
      if (!selectedStatus) {
        return;
      }
      updateShipment({ ...shipment, status: selectedStatus });
    }

    // Handle success and error messages
    useEffect(() => {
      if (isSuccess) {
        message.success('Status updated successfully');
        setSelectedStatus(undefined); // Reset selection on success
      }
      if (isError) {
        message.error('Failed to update status');
      }
    }, [isSuccess, isError]);

  
    return { selectedStatus, setSelectedStatus, handleStatusUpdate, isUpdating };
  }

  export default StatusUpdateCard