import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { MapPin, Star, Award, Calendar } from 'lucide-react';
import { toast } from 'sonner';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function PaseadorPerfil() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [walker, setWalker] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWalker();
  }, [id]);

  const loadWalker = async () => {
    try {
      const response = await axios.get(`${API}/walkers/${id}`);
      setWalker(response.data);
    } catch (err) {
      toast.error('Error al cargar el perfil');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={styles.loading}>Cargando perfil...</div>;
  }

  if (!walker) {
    return <div style={styles.loading}>Paseador no encontrado</div>;
  }

  return (
    <div style={styles.page}>
      <div className="container">
        <div style={styles.grid} className="perfil-grid">
          {/* Left Column */}
          <div style={styles.leftColumn} className="perfil-left">
            <div style={styles.profileCard}>
              <div style={styles.avatarContainer}>
                <img
                  src={walker.profile_image || walker.user_picture || 'https://i.pravatar.cc/300?img=1'}
                  alt={walker.user_name}
                  style={styles.avatar}
                />
                {walker.is_verified && (
                  <div style={styles.verifiedBadge}>
                    <Award size={24} color="white" />
                    <span>Verificado</span>
                  </div>
                )}
              </div>

              <h1 style={styles.name} data-testid="walker-profile-name">{walker.user_name}</h1>

              <div style={styles.rating}>
                <Star size={20} fill="#FFB800" color="#FFB800" />
                <span style={styles.ratingText}>
                  {walker.rating} ({walker.reviews_count} reseñas)
                </span>
              </div>

              <div style={styles.location}>
                <MapPin size={18} color="#666" />
                <span>{walker.location}</span>
              </div>

              <div style={styles.experience}>
                <Calendar size={18} color="#666" />
                <span>{walker.experience_years} años de experiencia</span>
              </div>

              <div style={styles.availability} data-testid="availability">
                {walker.availability}
              </div>

              <div style={styles.priceSection}>
                <span style={styles.priceLabel}>Desde</span>
                <span style={styles.price}>{walker.price_from}€</span>
              </div>

              <Button
                onClick={() => navigate(`/reservar/${walker.id}`)}
                style={styles.reserveBtn}
                className="w-full"
                data-testid="reservar-profile-btn"
              >
                Reservar paseo
              </Button>
            </div>
          </div>

          {/* Right Column */}
          <div style={styles.rightColumn}>
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>Sobre mí</h2>
              <p style={styles.bio}>{walker.bio}</p>
            </div>

            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>Especialidades</h2>
              <div style={styles.specialtyGrid} className="perfil-specialty-grid">
                {walker.specialties.map((specialty, idx) => (
                  <div key={idx} style={styles.specialtyCard}>
                    {specialty}
                  </div>
                ))}
              </div>
            </div>

            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>Servicios disponibles</h2>
              <div style={styles.servicesGrid} className="perfil-services-grid">
                <div style={styles.serviceCard}>
                  <h4 style={styles.serviceTitle}>Paseo Básico</h4>
                  <p style={styles.servicePrice}>6€</p>
                  <p style={styles.serviceDuration}>30 minutos</p>
                  <ul style={styles.serviceFeatures}>
                    <li>Paseo por el barrio</li>
                    <li>Reporte con fotos</li>
                    <li>Agua fresca</li>
                  </ul>
                </div>

                <div style={{...styles.serviceCard, ...styles.popularService}}>
                  <div style={styles.popularBadge}>Más popular</div>
                  <h4 style={styles.serviceTitle}>Paseo Estándar</h4>
                  <p style={styles.servicePrice}>8€</p>
                  <p style={styles.serviceDuration}>45 minutos</p>
                  <ul style={styles.serviceFeatures}>
                    <li>Parque o zona verde</li>
                    <li>Socialización</li>
                    <li>Ejercicio moderado</li>
                  </ul>
                </div>

                <div style={styles.serviceCard}>
                  <h4 style={styles.serviceTitle}>Paseo Premium</h4>
                  <p style={styles.servicePrice}>10€</p>
                  <p style={styles.serviceDuration}>60 minutos</p>
                  <ul style={styles.serviceFeatures}>
                    <li>Actividades de juego</li>
                    <li>Múltiples ubicaciones</li>
                    <li>Entrenamiento básico</li>
                  </ul>
                </div>
              </div>
            </div>
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
  grid: {
    display: 'grid',
    gridTemplateColumns: '350px 1fr',
    gap: '2.5rem',
  },
  leftColumn: {
    position: 'sticky',
    top: '6rem',
    alignSelf: 'start',
  },
  profileCard: {
    background: 'white',
    borderRadius: '20px',
    padding: '2rem',
    boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
    textAlign: 'center',
  },
  avatarContainer: {
    position: 'relative',
    display: 'inline-block',
    marginBottom: '1.5rem',
  },
  avatar: {
    width: '160px',
    height: '160px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '4px solid #FFE8D6',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    background: '#10B981',
    color: 'white',
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '0.375rem',
    fontSize: '0.875rem',
    fontWeight: 600,
  },
  name: {
    fontSize: '1.75rem',
    fontWeight: 700,
    marginBottom: '1rem',
    color: '#1a1a1a',
  },
  rating: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    marginBottom: '1rem',
  },
  ratingText: {
    fontSize: '1rem',
    fontWeight: 600,
    color: '#1a1a1a',
  },
  location: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    color: '#666',
    marginBottom: '0.75rem',
  },
  experience: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    color: '#666',
    marginBottom: '1.5rem',
  },
  availability: {
    background: '#FFE8D6',
    color: '#FF6B00',
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    fontSize: '0.9375rem',
    fontWeight: 600,
    marginBottom: '1.5rem',
  },
  priceSection: {
    marginBottom: '1.5rem',
  },
  priceLabel: {
    fontSize: '0.875rem',
    color: '#666',
    display: 'block',
    marginBottom: '0.25rem',
  },
  price: {
    fontSize: '2rem',
    fontWeight: 700,
    color: '#FF6B00',
  },
  reserveBtn: {
    background: '#FF6B00',
    color: 'white',
    width: '100%',
    padding: '1rem',
    fontSize: '1.0625rem',
    fontWeight: 600,
  },
  rightColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
  },
  section: {
    background: 'white',
    borderRadius: '16px',
    padding: '2rem',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
  },
  sectionTitle: {
    fontSize: '1.5rem',
    fontWeight: 700,
    marginBottom: '1.25rem',
    color: '#1a1a1a',
  },
  bio: {
    fontSize: '1rem',
    lineHeight: 1.7,
    color: '#666',
  },
  specialtyGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
    gap: '1rem',
  },
  specialtyCard: {
    background: '#F3F4F6',
    padding: '1rem',
    borderRadius: '12px',
    textAlign: 'center',
    fontSize: '0.9375rem',
    fontWeight: 500,
  },
  servicesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '1.5rem',
  },
  serviceCard: {
    background: '#FAFAFA',
    padding: '1.5rem',
    borderRadius: '12px',
    position: 'relative',
  },
  popularService: {
    background: '#FFF5EF',
    border: '2px solid #FF6B00',
  },
  popularBadge: {
    position: 'absolute',
    top: '-0.75rem',
    left: '50%',
    transform: 'translateX(-50%)',
    background: '#FF6B00',
    color: 'white',
    padding: '0.25rem 0.875rem',
    borderRadius: '12px',
    fontSize: '0.8125rem',
    fontWeight: 600,
  },
  serviceTitle: {
    fontSize: '1.125rem',
    fontWeight: 600,
    marginBottom: '0.75rem',
    color: '#1a1a1a',
  },
  servicePrice: {
    fontSize: '1.75rem',
    fontWeight: 700,
    color: '#FF6B00',
    marginBottom: '0.25rem',
  },
  serviceDuration: {
    fontSize: '0.875rem',
    color: '#666',
    marginBottom: '1rem',
  },
  serviceFeatures: {
    listStyle: 'none',
    padding: 0,
    fontSize: '0.875rem',
    color: '#666',
  },
};
