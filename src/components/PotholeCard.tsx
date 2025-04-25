import React from 'react';
import { Pothole } from '../types';

interface PotholeCardProps {
  pothole: Pothole;
  onClick: (pothole: Pothole) => void;
  isSelected: boolean;
}

const PotholeCard: React.FC<PotholeCardProps> = ({ pothole, onClick, isSelected }) => {
  const severityColors = ['#4CAF50', '#8BC34A', '#FFC107', '#FF9800', '#F44336'];
  
  return (
    <div 
      className="pothole-card" 
      onClick={() => onClick(pothole)}
      style={{
        border: `2px solid ${severityColors[pothole.severity - 1]}`,
        padding: '10px',
        margin: '10px',
        borderRadius: '8px',
        cursor: 'pointer',
        backgroundColor: isSelected ? 'rgba(0, 0, 0, 0.05)' : 'white',
        boxShadow: isSelected ? '0 4px 8px rgba(0,0,0,0.2)' : '0 2px 4px rgba(0,0,0,0.1)',
        transform: isSelected ? 'scale(1.02)' : 'scale(1)',
        transition: 'all 0.2s ease-in-out',
        position: 'relative',
      }}
    >
      {isSelected && (
        <div style={{
          position: 'absolute',
          top: '5px',
          right: '5px',
          backgroundColor: '#2196F3',
          color: 'white',
          padding: '2px 8px',
          borderRadius: '12px',
          fontSize: '0.8rem',
        }}>
          Selected
        </div>
      )}
      <h3>Pothole #{pothole.id}</h3>
      <p>Severity: {pothole.severity}</p>
      <p>Location: {pothole.location.lat.toFixed(6)}, {pothole.location.lng.toFixed(6)}</p>
      <p>Route: {pothole.route_id}</p>
      <p>Segment: {pothole.segment_id}</p>
    </div>
  );
};

export default PotholeCard; 