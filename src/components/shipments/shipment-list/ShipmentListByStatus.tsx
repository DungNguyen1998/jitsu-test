import BaseList, { type BaseListProps } from '../../base/BaseList';
import { Typography } from 'antd';
import type { Shipment, ShipmentStatus } from '../../../types/shipment';
import { PRIMARY_COLOR, STATUS_LABELS } from '../../../constants';
import StatusBadge from '../../base/StatusBadge';

const { Text } = Typography;

interface ShipmentStatusListProps extends Omit<BaseListProps<Shipment>, 'title' | 'itemName' | 'renderItemContent'> {
  status: ShipmentStatus;
}

const renderItemContent = (shipment: Shipment, isSelected: boolean) => {
  const textColor = isSelected ? PRIMARY_COLOR : undefined;
  
  return (
    <div className="flex flex-col gap-1 transition-all duration-200">
      {/* First line: client_name + status badge */}
      <div className="flex justify-between items-center">
        <Text strong style={{ color: textColor}}>
          {shipment.client_name}
        </Text>
        <StatusBadge status={shipment.status} />
      </div>
      
      {/* Second line: container_label + arrival_date */}
      <div className="flex justify-between items-center">
        <Text style={{ color: textColor, fontSize: '12px'}} type='secondary'>
          {shipment.container_label}
        </Text>
        <Text style={{ color: textColor, fontSize: '11px'}} type='secondary'>
          {new Date(shipment.arrival_date).toLocaleString()}
        </Text>
      </div>
    </div>
  );
};

const ShipmentListByStatus = (props: ShipmentStatusListProps) => {
  const {status, ...rest} = props;
  return (
    <BaseList
      title={STATUS_LABELS[status]}
      itemName="shipment"
      renderItemContent={renderItemContent}
      {...rest}
    />
  );
};

export default ShipmentListByStatus; 