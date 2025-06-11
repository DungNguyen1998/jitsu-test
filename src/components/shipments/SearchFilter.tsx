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
  const { filters: handledFilters, handleSearchChange, handleStatusChange, handleClear } = useSearchFilter({
    filters,
    onFiltersChange,
  });

  return (
    <div className="p-4 mb-2">
      <Row gutter={4} align="bottom" wrap={false}>
        <Col flex={1}>
        <div className='flex flex-col gap-2'>
          <Input
            placeholder="Search by container label or client name..."
            prefix={<SearchOutlined />}
            value={handledFilters.search}
            onChange={(e) => handleSearchChange(e.target.value)}
            disabled={loading}
            allowClear
          />
          <Select
            placeholder="Filter by status"
            value={handledFilters.status || []}
            onChange={handleStatusChange}
            disabled={loading}
            allowClear
            className="w-full"
            mode="multiple"
          >
            {STATUS_OPTIONS.map((option: { label: string; value: string }) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </div>
          
        </Col>
        <Col>
          <Button type="primary" onClick={handleClear}>
            Clear
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default SearchFilter; 