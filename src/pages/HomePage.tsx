import { Typography, Row, Col } from 'antd';
import ShipmentDetails from '../components/shipments/shipment-detail';
import SearchFilter from '../components/shipments/SearchFilter';
import { useShipments } from '../hooks/useShipments';
import type { ShipmentStatus } from '../types/shipment';
import ShipmentList from '../components/shipments/shipment-list';

const { Title } = Typography;

const HomePage = () => {
  const {
    // shipments,
    groupedData,
    isLoading,
    selectedShipmentId,
    setSelectedShipmentId,
    filters,
    setFilters,
    updateStatusPage,
  } = useShipments();

  // Determine which status groups to show based on filters
  const filteringStatuses: ShipmentStatus[] | undefined = 
    filters.status && filters.status.length > 0 ? filters.status : undefined;

  return (
    <div className="max-w-full mx-auto">
      <div className="mb-6">
        <Title level={1} className="text-center mt-0">
          Shipment Management System
        </Title>
      </div>

      {/* Search Filter - Full Width */}
      <div className="mb-6 bg-white rounded-lg shadow-sm border">
        <SearchFilter 
          filters={filters} 
          onFiltersChange={setFilters} 
          loading={isLoading}
        />
      </div>
      
      <Row gutter={24}>
        {/* Left Panel - Scrollable Shipment Lists */}
        <Col xs={24} lg={12}>
          <div 
            className="bg-white rounded-lg shadow-sm border"
            style={{ 
              height: '80vh',
              overflow: 'auto'
            }}
          >
            <ShipmentList
              groupedData={groupedData}
              selectedShipmentId={selectedShipmentId}
              onShipmentSelect={setSelectedShipmentId}
              onPageChange={updateStatusPage}
              filteringStatuses={filteringStatuses}
            />
          </div>
        </Col>

        {/* Right Panel - Sticky Shipment Details */}
        <Col xs={24} lg={12}>
          <div 
            className="bg-white rounded-lg shadow-sm border"
            style={{ 
              height: '80vh',
              position: 'sticky',
              top: '20px',
              overflow: 'auto'
            }}
          >
            <ShipmentDetails
              shipmentId={selectedShipmentId || ''}
            />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default HomePage; 