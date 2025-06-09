import { Button, Col, Input, Row, Select, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useState, useEffect, useCallback } from 'react';
import type { ShipmentFilters, ShipmentStatus } from '../../types/shipment';

const { Option } = Select;

interface SearchFilterProps {
  filters: ShipmentFilters;
  onFiltersChange: (filters: ShipmentFilters) => void;
  loading?: boolean;
}

const statusOptions: { label: string; value: ShipmentStatus }[] = [
  { label: 'Open', value: 'OPEN' },
  { label: 'In Transit', value: 'IN_TRANSIT' },
  { label: 'Delivered', value: 'DELIVERED' },
];

const SearchFilter = ({ filters, onFiltersChange, loading = false }: SearchFilterProps) => {
  const [searchValue, setSearchValue] = useState(filters.search);

  // Debounce search input
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchValue !== filters.search) {
        onFiltersChange({ ...filters, search: searchValue });
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchValue, filters, onFiltersChange]);

  // Update local search value when filters change (e.g., from URL)
  useEffect(() => {
    setSearchValue(filters.search);
  }, [filters.search]);

  const handleSearchChange = useCallback((value: string) => {
    setSearchValue(value);
  }, []);

  const handleStatusChange = useCallback((value: ShipmentStatus[] | undefined) => {
    onFiltersChange({ 
      ...filters, 
      status: value
    });
  }, [filters, onFiltersChange]);

  const handleClear = useCallback(() => {
    setSearchValue('');
    onFiltersChange({ search: '', status: undefined });
  }, [onFiltersChange]);

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
            mode='multiple'
          >
            {statusOptions.map(option => (
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