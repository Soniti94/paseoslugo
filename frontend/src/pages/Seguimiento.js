import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';
import { GoogleMap, Marker, Polyline, useJsApiLoader } from '@react-google-maps/api';
import { Card } from '@/components/ui/card';
import { MapPin, Clock, Camera } from 'lucide-react';
import { toast } from 'sonner';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function Seguimiento() {
  const { bookingId } = useParams();
  const { token } = useAuth();
  const [booking, setBooking] = useState(null);
  const [walk, setWalk] = useState(null);
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: config?.google_maps_api_key || 'AIzaSyCMXzgUZP8pFPQ8QDoEm6so2nbbcw83emY',
  });

  useEffect(() => {
    loadConfig();
    loadData();
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, []);

  const loadConfig = async () => {
    try {
      const response = await axios.get(`${API}/config`);
      setConfig(response.data);
    } catch (err) {
      console.error('Error loading config');
    }
  };

  const loadData = async () => {
    try {
      const [bookingRes, walkRes] = await Promise.all([
        axios.get(`${API}/bookings/${bookingId}`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API}/walks/${bookingId}`),
      ]);
      setBooking(bookingRes.data);
      setWalk(walkRes.data);
    } catch (err) {
      toast.error('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  if (loading || !isLoaded) {
    return <div style={styles.loading}>Cargando seguimiento...</div>;
  }

  if (!booking || !walk) {
    return <div style={styles.loading}>No se encontró el paseo</div>;
  }

  const center = walk.route_data.length > 0
    ? { lat: walk.route_data[walk.route_data.length - 1].lat, lng: walk.route_data[walk.route_data.length - 1].lng }
    : { lat: 43.0097, lng: -7.5567 };

  const path = walk.route_data.map(point => ({ lat: point.lat, lng: point.lng }));

  return (
    <div style={styles.page}>
      <div className="container">
        <h1 style={styles.title} data-testid="seguimiento-title">Seguimiento del Paseo</h1>

        <div style={styles.grid} className="seguimiento-grid">
          {/* Left: Map */}
          <div style={styles.mapSection}>
            <GoogleMap
              mapContainerStyle={styles.map}
              mapContainerClassName="seguimiento-map"
              center={center}
              zoom={15}
              options={{
                disableDefaultUI: false,
                zoomControl: true,
              }}
            >
              {walk.route_data.length > 0 && (
                <>
                  <Marker position={path[0]} label="Inicio" />
                  <Marker position={path[path.length - 1]} label="Actual" />
                  <Polyline
                    path={path}
                    options={{
                      strokeColor: '#FF6B00',
                      strokeOpacity: 0.8,
                      strokeWeight: 4,
                    }}
                  />
                </>
              )}
            </GoogleMap>
          </div>

          {/* Right: Info */}
          <div style={styles.infoSection}>
            <Card style={styles.infoCard}>
              <h3 style={styles.infoTitle}>Información del paseo</h3>

              <div style={styles.infoItem}>
                <MapPin size={20} color="#666" />
                <div>
                  <div style={styles.infoLabel}>Estado</div>
                  <div style={styles.infoValue}>{walk.status === 'in_progress' ? 'En progreso' : walk.status === 'completed' ? 'Completado' : 'Pendiente'}</div>
                </div>
              </div>

              {walk.start_time && (
                <div style={styles.infoItem}>
                  <Clock size={20} color="#666" />
                  <div>
                    <div style={styles.infoLabel}>Hora de inicio</div>
                    <div style={styles.infoValue}>{new Date(walk.start_time).toLocaleTimeString('es-ES')}</div>
                  </div>
                </div>
              )}

              {walk.end_time && (
                <div style={styles.infoItem}>
                  <Clock size={20} color="#666" />
                  <div>
                    <div style={styles.infoLabel}>Hora de finalización</div>
                    <div style={styles.infoValue}>{new Date(walk.end_time).toLocaleTimeString('es-ES')}</div>
                  </div>
                </div>
              )}

              {walk.route_data.length > 0 && (
                <div style={styles.infoItem}>
                  <MapPin size={20} color="#666" />
                  <div>
                    <div style={styles.infoLabel}>Distancia recorrida</div>
                    <div style={styles.infoValue}>{walk.route_data.length} puntos registrados</div>
                  </div>
                </div>
              )}
            </Card>

            {walk.report_text && (
              <Card style={styles.reportCard}>
                <h3 style={styles.reportTitle}>Reporte del paseador</h3>
                <p style={styles.reportText}>{walk.report_text}</p>
              </Card>
            )}

            {walk.photos && walk.photos.length > 0 && (
              <Card style={styles.photosCard}>
                <h3 style={styles.photosTitle}>
                  <Camera size={20} /> Fotos del paseo
                </h3>
                <div style={styles.photosGrid} className="seguimiento-photos-grid">
                  {walk.photos.map((photo, idx) => (
                    <img
                      key={idx}
                      src={photo}
                      alt={`Foto ${idx + 1}`}
                      style={styles.photo}
                      data-testid={`walk-photo-${idx}`}
                    />
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#FAFAFA',
    padding: '3rem 0 5rem',
  },
  loading: {
    textAlign: 'center',
    padding: '5rem',
    fontSize: '1.125rem',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: 700,
    marginBottom: '2.5rem',
    color: '#1a1a1a',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 400px',
    gap: '2rem',
  },
  mapSection: {
    background: 'white',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
  },
  map: {
    width: '100%',
    height: '600px',
  },
  infoSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  infoCard: {
    padding: '1.5rem',
  },
  infoTitle: {
    fontSize: '1.25rem',
    fontWeight: 700,
    marginBottom: '1.5rem',
    color: '#1a1a1a',
  },
  infoItem: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '1.25rem',
  },
  infoLabel: {
    fontSize: '0.875rem',
    color: '#666',
    marginBottom: '0.25rem',
  },
  infoValue: {
    fontSize: '1rem',
    fontWeight: 600,
    color: '#1a1a1a',
  },
  reportCard: {
    padding: '1.5rem',
  },
  reportTitle: {
    fontSize: '1.125rem',
    fontWeight: 700,
    marginBottom: '1rem',
    color: '#1a1a1a',
  },
  reportText: {
    fontSize: '0.9375rem',
    lineHeight: 1.7,
    color: '#666',
  },
  photosCard: {
    padding: '1.5rem',
  },
  photosTitle: {
    fontSize: '1.125rem',
    fontWeight: 700,
    marginBottom: '1rem',
    color: '#1a1a1a',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  photosGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '1rem',
  },
  photo: {
    width: '100%',
    height: '150px',
    objectFit: 'cover',
    borderRadius: '8px',
  },
};