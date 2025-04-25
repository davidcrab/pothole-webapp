import React, { useState } from 'react';
import { Pothole } from '../types';

interface PotholeDetailProps {
  pothole: Pothole;
  onUpdateSeverity: (id: number, severity: number) => void;
  onAddNote: (id: number, note: string) => void;
  onMarkRepaired: (id: number) => void;
  onImageClick: (imageUrl: string) => void;
}

const PotholeDetail: React.FC<PotholeDetailProps> = ({
  pothole,
  onUpdateSeverity,
  onAddNote,
  onMarkRepaired,
  onImageClick
}) => {
  const [newNote, setNewNote] = useState('');

  const severityColors = {
    1: '#4CAF50', // Green
    2: '#8BC34A', // Light Green
    3: '#FFC107', // Yellow
    4: '#FF9800', // Orange
    5: '#F44336'  // Red
  };

  const severityLabels = {
    1: 'Minor',
    2: 'Low',
    3: 'Moderate',
    4: 'High',
    5: 'Critical'
  };

  const handleAddNote = () => {
    if (newNote.trim()) {
      onAddNote(pothole.id, newNote);
      setNewNote('');
    }
  };

  return (
    <div style={{
      padding: '20px',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{ marginBottom: '20px' }}>
        <h3>Pothole #{pothole.id}</h3>
        <div style={{ 
          display: 'inline-block',
          padding: '4px 8px',
          borderRadius: '4px',
          backgroundColor: severityColors[pothole.severity as keyof typeof severityColors],
          color: 'white',
          marginBottom: '10px'
        }}>
          Severity: {severityLabels[pothole.severity as keyof typeof severityLabels]}
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h4>Image</h4>
        <img
          src={pothole.image}
          alt={`Pothole ${pothole.id}`}
          style={{
            width: '100%',
            height: 'auto',
            borderRadius: '8px',
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
          onClick={() => onImageClick(pothole.image)}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h4>Location</h4>
        <p>Latitude: {pothole.location.lat.toFixed(6)}</p>
        <p>Longitude: {pothole.location.lng.toFixed(6)}</p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h4>Update Severity</h4>
        <select
          value={pothole.severity}
          onChange={(e) => onUpdateSeverity(pothole.id, parseInt(e.target.value))}
          style={{
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #ddd',
            width: '100%'
          }}
        >
          {Object.entries(severityLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h4>Add Note</h4>
        <textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Add a note about this pothole..."
          style={{
            width: '100%',
            minHeight: '100px',
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #ddd',
            marginBottom: '10px'
          }}
        />
        <button
          onClick={handleAddNote}
          style={{
            padding: '8px 16px',
            backgroundColor: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Add Note
        </button>
      </div>

      <button
        onClick={() => onMarkRepaired(pothole.id)}
        style={{
          padding: '8px 16px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          width: '100%'
        }}
      >
        Mark as Repaired
      </button>
    </div>
  );
};

export default PotholeDetail; 