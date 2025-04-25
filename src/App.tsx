import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import PotholeCard from './components/PotholeCard';
import PotholeDetail from './components/PotholeDetail';
import { Pothole } from './types';
import potholeData from './pothole_data.json';

// Severity colors for markers
const severityColors = {
  1: '#4CAF50', // Green
  2: '#8BC34A', // Light Green
  3: '#FFC107', // Yellow
  4: '#FF9800', // Orange
  5: '#F44336'  // Red
};

// Create custom icons for each severity level
const createIcon = (severity: number, isSelected: boolean = false) => {
  const size = isSelected ? 35 : 25;
  return L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="
      background-color: ${severityColors[severity as keyof typeof severityColors]};
      width: ${size}px;
      height: ${size}px;
      display: block;
      position: relative;
      border-radius: ${size}px;
      border: 2px solid white;
      box-shadow: 0 0 4px rgba(0,0,0,0.5);
    "></div>`,
    iconSize: [size, size],
    iconAnchor: [size/2, size/2]
  });
};

const App: React.FC = () => {
  const [potholes, setPotholes] = useState<Pothole[]>([]);
  const [selectedPothole, setSelectedPothole] = useState<Pothole | null>(null);
  const [map, setMap] = useState<L.Map | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isSatellite, setIsSatellite] = useState(false);
  const selectedCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Update image paths to point to the public directory
    const updatedPotholes = potholeData.map(pothole => ({
      ...pothole,
      image: `/images/${pothole.image.split('/').pop()}`
    }));
    setPotholes(updatedPotholes);
  }, []);

  const handlePotholeClick = (pothole: Pothole) => {
    setSelectedPothole(pothole);
    if (map) {
      map.setView([pothole.location.lat, pothole.location.lng], 18);
    }
    // Scroll to the selected card after a short delay to ensure it's rendered
    setTimeout(() => {
      if (selectedCardRef.current) {
        selectedCardRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
    }, 100);
  };

  const handleCloseDetail = () => {
    setSelectedPothole(null);
    if (map) {
      map.setZoom(13);
    }
  };

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const handleCloseImage = () => {
    setSelectedImage(null);
  };

  const handleUpdateSeverity = (id: number, severity: number) => {
    setPotholes(prevPotholes =>
      prevPotholes.map(pothole =>
        pothole.id === id ? { ...pothole, severity } : pothole
      )
    );
  };

  const handleAddNote = (id: number, note: string) => {
    // TODO: Implement note storage
    console.log(`Adding note to pothole ${id}: ${note}`);
  };

  const handleMarkRepaired = (id: number) => {
    // TODO: Implement repair status
    console.log(`Marking pothole ${id} as repaired`);
  };

  const isPotholeSelected = (pothole: Pothole): boolean => {
    return selectedPothole !== null && selectedPothole.id === pothole.id;
  };

  return (
    <div style={{ position: 'relative', height: '100vh', width: '100%' }}>
      <MapContainer
        center={[37.71677601, -122.47224851]}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        ref={setMap}
      >
        {isSatellite ? (
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
          />
        ) : (
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
        )}
        {potholes.map((pothole) => (
          <Marker
            key={pothole.id}
            position={[pothole.location.lat, pothole.location.lng]}
            icon={createIcon(pothole.severity, isPotholeSelected(pothole))}
            eventHandlers={{
              click: () => handlePotholeClick(pothole),
            }}
          >
            {isPotholeSelected(pothole) && (
              <Popup>
                <div>
                  <h3>Pothole #{pothole.id}</h3>
                  <p>Severity: {pothole.severity}</p>
                </div>
              </Popup>
            )}
          </Marker>
        ))}
      </MapContainer>
      
      {/* Map Toggle Button */}
      <button
        onClick={() => setIsSatellite(!isSatellite)}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          padding: '8px 16px',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          color: '#333',
          border: '1px solid #ddd',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '14px',
          zIndex: 1000,
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        <span style={{ fontSize: '20px' }}>🌍</span>
        {isSatellite ? 'Switch to Street Map' : 'Switch to Satellite'}
      </button>

      {/* Left Panel - Always visible */}
      <div style={{
        position: 'absolute',
        left: '20px',
        top: '20px',
        width: '350px',
        maxHeight: 'calc(100vh - 40px)',
        overflowY: 'auto',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        zIndex: 1000
      }}>
        <h2 style={{ 
          textAlign: 'center', 
          marginBottom: '20px',
          color: '#333',
          fontSize: '1.5rem',
          padding: '20px 20px 0'
        }}>Potholes</h2>
        <div style={{ padding: '0 10px' }}>
          {potholes.map((pothole) => (
            <div
              key={pothole.id}
              ref={selectedPothole?.id === pothole.id ? selectedCardRef : null}
            >
              <PotholeCard
                pothole={pothole}
                onClick={handlePotholeClick}
                isSelected={isPotholeSelected(pothole)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel - Detail View */}
      {selectedPothole && (
        <div style={{
          position: 'absolute',
          right: '20px',
          top: '20px',
          width: '500px',
          maxHeight: 'calc(100vh - 40px)',
          overflowY: 'auto',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <h2 style={{ margin: 0 }}>Pothole Details</h2>
            <button
              onClick={handleCloseDetail}
              style={{
                width: '40px',
                height: '40px',
                backgroundColor: 'transparent',
                color: '#999',
                border: 'none',
                cursor: 'pointer',
                fontSize: '24px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: '50%',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.color = '#333';
                e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.color = '#999';
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              ×
            </button>
          </div>
          <PotholeDetail
            pothole={selectedPothole}
            onUpdateSeverity={handleUpdateSeverity}
            onAddNote={handleAddNote}
            onMarkRepaired={handleMarkRepaired}
            onImageClick={handleImageClick}
          />
        </div>
      )}

      {/* Image Modal */}
      {selectedImage && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 2000
          }}
          onClick={handleCloseImage}
        >
          <div 
            style={{
              width: '95vw',
              height: '95vh',
              position: 'relative',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={selectedImage} 
              alt="Pothole" 
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
                transform: 'scale(1.2)'
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
