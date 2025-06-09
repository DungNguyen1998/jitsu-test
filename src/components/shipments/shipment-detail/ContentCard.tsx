import { UserOutlined } from "@ant-design/icons";

import { EnvironmentOutlined } from "@ant-design/icons";
import { CalendarOutlined } from "@ant-design/icons";
import { ClockCircleOutlined } from "@ant-design/icons";

import { Card, Descriptions, Typography } from "antd";
import StatusBadge from "../../base/StatusBadge";
import type { Shipment } from "../../../types/shipment";

const ShipmentDetailsHeader = ({ shipment }: { shipment: Shipment }) => {
  return (
    <div className="flex justify-between items-center mb-2">
      <Typography.Title level={2} style={{ margin: '0px' }}>{shipment.container_label}</Typography.Title>
      <StatusBadge status={shipment.status} />
    </div>
  );
};
  
const ShipmentDetailsContent = ({ shipment }: { shipment: Shipment }) => {
  return (
    <Descriptions column={1} bordered>
      <Descriptions.Item label={<><UserOutlined /> Client Name</>}>
        {shipment.client_name}
      </Descriptions.Item>
      <Descriptions.Item label={<><EnvironmentOutlined /> Warehouse ID</>}>
        {shipment.warehouse_id}
      </Descriptions.Item>
      <Descriptions.Item label={<><CalendarOutlined /> Arrival Date</>}>
        {new Date(shipment.arrival_date).toLocaleString()}
      </Descriptions.Item>
      <Descriptions.Item label={<><CalendarOutlined /> Delivery By Date</>}>
        {new Date(shipment.delivery_by_date).toLocaleString()}
      </Descriptions.Item>
      <Descriptions.Item label={<><ClockCircleOutlined /> ETA</>}>
        {new Date(shipment.eta).toLocaleString()}
      </Descriptions.Item>
    </Descriptions>
  );
};

const ContentCard = ({ shipment }: { shipment: Shipment }) => {
  return (
    <Card className="mb-6" size="small">
      <ShipmentDetailsHeader shipment={shipment} />
      <ShipmentDetailsContent shipment={shipment} />
    </Card>
  );
};

  export default ContentCard;