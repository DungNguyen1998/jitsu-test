import { Button, Col, Input, Row, Select } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import type { ShipmentFilters } from '../../types/shipment';
import { STATUS_OPTIONS } from '../../constants';
import { useSearchFilter } from '../../hooks/useSearchFilter';

const { Option } = Select;

interface SearchFilterProps {
  filters: ShipmentFilters;
  onFiltersChange: (filters: ShipmentFilters) => void;
  loading?: boolean;
}

const SearchFilter = ({ filters, onFiltersChange, loading = false }: SearchFilterProps) => {
  const { searchValue, handleSearchChange, handleStatusChange, handleClear } = useSearchFilter({
    filters,
    onFiltersChange,
  });

  return (
    <div className="p-4 bg-white border-b">
      <Row gutter={16} justify="center">
        <Col span={12}>
          <Input
            placeholder="Search by container label or client name..."
            prefix={<SearchOutlined />}
            value={searchValue}
            onChange={(e) => handleSearchChange(e.target.value)}
            disabled={loading}
            allowClear
          />
        </Col>
        <Col span={10}>
          <Select
            placeholder="Filter by status"
            value={filters.status || []}
            onChange={handleStatusChange}
            disabled={loading}
            allowClear
            className="w-full"
            mode="multiple"
          >
            {STATUS_OPTIONS.map(option => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Col>
        <Col span={2}>
          <Button type="primary" onClick={handleClear}>
            Clear
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default SearchFilter; 