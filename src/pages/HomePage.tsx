import { Typography, Row, Col } from 'antd';
import ShipmentDetails from '../components/shipments/shipment-detail';
import SearchFilter from '../components/shipments/SearchFilter';
import { useShipments } from '../hooks/useShipments';
import ShipmentList from '../components/shipments/shipment-list';

const { Title } = Typography;

const HomePage = () => {
  const {
    groupedData,
    isLoading,
    selectedShipmentId,
    setSelectedShipmentId,
    filters,
    setFilters,
    updateStatusPage,
  } = useShipments();

  return (
    <div className="max-w-full mx-auto">
      <div className="mb-6">
        <Title level={2} className="text-center mt-0">
          Shipment Management System
        </Title>
      </div>

      <Row gutter={24}>
        {/* Left Panel - Scrollable Shipment Lists */}
        <Col xs={24} lg={10}>

          {/* Search Filter */}
          <div className="h-fit sticky top-0 bg-white rounded-lg shadow-sm border" style={{zIndex: 1000}}>
            <SearchFilter
              filters={filters}
              onFiltersChange={setFilters}
              loading={isLoading}
            />
          </div>

          {/* Shipment List */}
          <div className="bg-white rounded-lg shadow-sm border">
            <ShipmentList
              groupedData={groupedData}
              selectedShipmentId={selectedShipmentId}
              onShipmentSelect={setSelectedShipmentId}
              onPageChange={updateStatusPage}
              filteringStatuses={filters.status || []}
            />
          </div>
        </Col>

        {/* Right Panel - Sticky Shipment Details */}
        <Col xs={24} lg={14}>
          <div className="sticky top-0 overflow-auto h-fit bg-white rounded-lg shadow-sm border relative">
            <ShipmentDetails shipmentId={selectedShipmentId || ''} />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default HomePage; 