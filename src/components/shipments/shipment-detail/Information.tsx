import { CheckCircleOutlined, ContainerOutlined, UserOutlined } from "@ant-design/icons";

import { EnvironmentOutlined } from "@ant-design/icons";
import { CalendarOutlined } from "@ant-design/icons";
import { ClockCircleOutlined } from "@ant-design/icons";

import { Card, Descriptions, Typography } from "antd";
import type { Shipment } from "../../../types/shipment";
import { formatDate } from "../../../utils/format-date";
const {Item} = Descriptions;

const ShipmentDetailsContent = ({ shipment }: { shipment: Shipment }) => {
  return (
    <Descriptions column={1} bordered>
      <Item label={<><UserOutlined /> Client Name</>}>
        {shipment.client_name}
      </Item>
      <Item label={<><ContainerOutlined /> Container Label</>}>
        {shipment.container_label}
      </Item>
      <Item label={<><EnvironmentOutlined /> Warehouse ID</>}>
        {shipment.warehouse_id}
      </Item>
      <Item label={<><CalendarOutlined /> Arrival Date</>}>
        {formatDate(shipment.arrival_date)}
      </Item>
      <Item label={<><CalendarOutlined /> Delivery By Date</>}>
        {formatDate(shipment.delivery_by_date)}
      </Item>
      <Item label={<><ClockCircleOutlined /> ETA</>}>
        {formatDate(shipment.eta)}
      </Item>
      {shipment.delivered_date && (
        <Item label={<><CheckCircleOutlined /> Delivered Date</>}>
          {formatDate(shipment.delivered_date)}
        </Item>
      )}
    </Descriptions>
  );
};

const Information = ({ shipment }: { shipment: Shipment }) => {
  return (
      <Card className="mb-6" size="small">
        <Typography.Title level={3} style={{marginTop: '0px'}}>Information</Typography.Title>
        <ShipmentDetailsContent shipment={shipment} />
      </Card>
  );
};

  export default Information;