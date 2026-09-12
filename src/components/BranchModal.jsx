import { useState, useMemo } from 'react';
import config from '../config/lahoriTikka.config';
import { Search, MapPin, Clock, CheckCircle, X, Navigation } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Fix default marker icon issue in Leaflet with React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function BranchModal({ isOpen, onClose, selectedBranch, onSelectBranch }) {
  const [searchQuery, setSearchQuery] = useState('');

  // Example coordinates for Islamabad branches (F-8 Markaz & Park View City)
  const branchCoords = {
    'F-8 Markaz': [33.7075, 73.0451],
    'Park View City': [33.6844, 73.1840]
  };

  const filteredBranches = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return config.branches;
    return config.branches.filter(b => 
      b.name.toLowerCase().includes(q) || 
      b.address.toLowerCase().includes(q) ||
      (b.deliveryZones && b.deliveryZones.some(zone => zone.toLowerCase().includes(q)))
    );
  }, [searchQuery]);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.6)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      padding: '16px'
    }}>
      <div style={{
        backgroundColor: 'var(--color-card-bg, #FFFFFF)',
        border: '1px solid var(--color-border)',
        borderRadius: '16px',
        maxWidth: '650px',
        width: '100%',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
      }}>
        {/* Modal Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--color-border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>
              Select Delivery Branch
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: '2px 0 0 0' }}>
              Choose your nearest hub for fast delivery across F, G & E sectors
            </p>
          </div>
          <button 
            onClick={onClose}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--color-text-muted)', padding: '4px',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Search Bar */}
        <div style={{ padding: '16px 24px 0 24px' }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text"
              placeholder="Search by area, sector (e.g. F-8, Park View), or branch..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px 10px 40px',
                borderRadius: '8px',
                border: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-bg, #F7F7F7)',
                color: 'var(--color-text)',
                fontSize: '0.9rem',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>
        </div>

        {/* Branch List */}
        <div style={{ padding: '16px 24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px', flex: 1 }}>
          {filteredBranches.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
              No matching branches found for "{searchQuery}".
            </div>
          ) : (
            filteredBranches.map((branch, idx) => {
              const isSelected = selectedBranch === branch.name;
              const coords = branchCoords[branch.name] || [33.7075, 73.0451];

              return (
                <div 
                  key={idx}
                  onClick={() => { onSelectBranch(branch.name); onClose(); }}
                  style={{
                    border: isSelected ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                    borderRadius: '12px',
                    padding: '16px',
                    backgroundColor: isSelected ? 'rgba(200, 16, 46, 0.03)' : 'var(--color-card-bg)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <div style={{
                        width: '40px', height: '40px', borderRadius: '8px',
                        backgroundColor: 'rgba(255, 215, 0, 0.15)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'var(--color-primary)', flexShrink: 0
                      }}>
                        <MapPin size={20} />
                      </div>
                      <div>
                        <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-text)', margin: '0 0 2px 0' }}>
                          {branch.name}
                        </h4>
                        <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', margin: 0 }}>
                          {branch.address}
                        </p>
                      </div>
                    </div>

                    {isSelected && (
                      <span style={{
                        display: 'flex', alignItems: 'center', gap: '4px',
                        backgroundColor: 'var(--color-primary)', color: '#fff',
                        padding: '4px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 600
                      }}>
                        <CheckCircle size={12} /> Selected
                      </span>
                    )}
                  </div>

                  {/* Hours & Zones */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: 'var(--color-text-muted)', borderTop: '1px solid var(--color-border)', paddingTop: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Clock size={14} />
                      <span>{branch.hours || '12:00 PM - 2:00 AM'}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Navigation size={14} color="var(--color-primary)" />
                      <span>Delivers to: {branch.deliveryZones ? branch.deliveryZones.join(', ') : 'F, G & E Sectors'}</span>
                    </div>
                  </div>

                  {/* Leaflet Map Preview */}
                  <div style={{ height: '120px', width: '100%', borderRadius: '8px', overflow: 'hidden', zIndex: 1 }}>
                    <MapContainer 
                      center={coords} 
                      zoom={13} 
                      zoomControl={false}
                      dragging={false}
                      scrollWheelZoom={false}
                      style={{ height: '100%', width: '100%' }}
                    >
                      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                      <Marker position={coords}>
                        <Popup>{branch.name}</Popup>
                      </Marker>
                    </MapContainer>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}