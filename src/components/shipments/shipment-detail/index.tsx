import { Empty, Spin, Alert, Col, Row } from 'antd';
import Information from './Information';
import StatusTimeline from './StatusTimeline';
import { useShipmentDetails } from '../../../hooks/useShipmentDetails';
import SimpleStatusChanger from './StatusChanger';

interface ShipmentDetailsProps {
  shipmentId: string;
}

const ShipmentDetails = ({ shipmentId }: ShipmentDetailsProps) => {
  const { 
    shipment, 
    error,
    isFetching,
  } = useShipmentDetails(shipmentId);

  if (!shipmentId) {
    return (
      <div className="flex items-center justify-center py-20">
        <Empty description="Select a shipment to view details" />
      </div>
    );
  }

  if (error && !shipment?.id) {
    return (
      <div className="p-4">
        <Alert
          message="Error loading shipment details"
          description={error instanceof Error ? error.message : 'An unknown error occurred'}
          type="error"
          showIcon
        />
      </div>
    );
  }

  return (
    <Spin spinning={isFetching} size="small">
      <div className={`overflow-y-auto p-4 max-h-[600px]`}>
        {/* Status Timeline - Full Width */}
        <StatusTimeline shipment={shipment} />
        
        {/* Information and Status Changer */}
        <Row gutter={16}>
          <Col span={14}>
            <Information shipment={shipment} />
          </Col>
          <Col span={10}>
            <SimpleStatusChanger shipment={shipment} />
          </Col>
        </Row>
     </div>
    </Spin>
  );
};



export default ShipmentDetails; 