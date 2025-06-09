import { Tag } from "antd";
import { STATUS_COLORS, STATUS_LABELS } from "../../constants";
import type { ShipmentStatus } from "../../types/shipment";

const StatusBadge = (props: { status: ShipmentStatus }) => {
  const { status } = props;
  const statusColor = STATUS_COLORS[status];
  return <Tag color={statusColor}>{STATUS_LABELS[status]}</Tag>;
};

export default StatusBadge;