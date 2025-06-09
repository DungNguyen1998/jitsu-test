import { Button, Card, message, Select } from "antd";
import StatusBadge from "../../base/StatusBadge";
import type { Shipment, ShipmentStatus } from "../../../types/shipment";
import { STATUS_OPTIONS } from "../../../constants";
import { useState } from "react";

const StatusUpdateCard = ({ shipment, onStatusUpdate, isUpdating }: { shipment: Shipment, onStatusUpdate: (payload: { id: string; status: ShipmentStatus }) => void, isUpdating: boolean }) => {
    const { selectedStatus, setSelectedStatus, handleStatusUpdate } = useStatusUpdate(shipment, onStatusUpdate);
    return (
        <Card title="Update Status" className="mb-6" size="small">
          <div className="space-y-4">
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
  
  const useStatusUpdate = (shipment: Shipment, onStatusUpdate: (payload: { id: string; status: ShipmentStatus }) => void) => {
    const [selectedStatus, setSelectedStatus] = useState<ShipmentStatus | undefined>();
    const handleStatusUpdate = () => {
      if (!selectedStatus || selectedStatus === shipment.status) {
        message.warning('Please select a different status');
        return;
      }
  
      onStatusUpdate({ id: shipment.id, status: selectedStatus });
      setSelectedStatus(undefined);
      message.success('Status update initiated');
    }
  
    return { selectedStatus, setSelectedStatus, handleStatusUpdate };
  }

  export default StatusUpdateCard