import { Card } from 'antd';
import type { ReactNode } from 'react';

interface BaseListItemProps {
  isSelected: boolean;
  onClick: () => void;
  renderContent: () => ReactNode;
}

const BaseListItem = ({
  isSelected,
  onClick,
  renderContent,
}: BaseListItemProps) => {
  // Enhanced dynamic styles based on selection state
  const cardStyle: React.CSSProperties = isSelected ? {
    borderColor: '#1890ff',
    backgroundColor: '#f0f8ff',
    boxShadow: '0 4px 12px rgba(24, 144, 255, 0.15)',
    transition: 'all 0.2s ease-in-out',
    color: '#1890ff',
  } : {
    borderColor: '#d9d9d9',
    backgroundColor: '#ffffff',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
    transition: 'all 0.2s ease-in-out',
  };

  return (
    <Card
      hoverable
      style={{ 
        ...cardStyle, 
        width: '100%', 
        marginBottom: '8px',
        cursor: 'pointer',
      }}
      styles={{
        body: {
          transition: 'all 0.2s ease-in-out',
        },
      }}
      onMouseEnter={(e) => {
        const card = e.currentTarget;
        if (isSelected) {
          card.style.boxShadow = '0 6px 16px rgba(24, 144, 255, 0.25)';
          card.style.transform = 'translateY(-2px)';
        } else {
          card.style.borderColor = '#40a9ff';
          card.style.boxShadow = '0 4px 8px rgba(64, 169, 255, 0.12)';
          card.style.backgroundColor = '#fafafa';
          card.style.transform = 'translateY(-1px)';
        }
      }}
      onMouseLeave={(e) => {
        const card = e.currentTarget;
        if (isSelected) {
          card.style.boxShadow = '0 4px 12px rgba(24, 144, 255, 0.15)';
          card.style.transform = 'translateY(-1px)';
        } else {
          card.style.borderColor = '#d9d9d9';
          card.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.05)';
          card.style.backgroundColor = '#ffffff';
          card.style.transform = 'translateY(0px)';
        }
      }}
      onClick={onClick}
      size="small"
    >
      {renderContent()}
    </Card>
  );
};

export default BaseListItem; 