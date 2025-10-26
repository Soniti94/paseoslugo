import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Star, Award } from 'lucide-react';
import { toast } from 'sonner';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function Paseadores() {
  const navigate = useNavigate();
  const [walkers, setWalkers] = useState([]);
  const [filteredWalkers, setFilteredWalkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');

  useEffect(() => {
    loadWalkers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, locationFilter, walkers]);

  const loadWalkers = async () => {
    try {
      const response = await axios.get(`${API}/walkers`);
      setWalkers(response.data);
      setFilteredWalkers(response.data);
    } catch (err) {
      toast.error('Error al cargar paseadores');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...walkers];

    if (searchTerm) {
      filtered = filtered.filter(w =>
        w.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        w.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (locationFilter !== 'all') {
      filtered = filtered.filter(w => w.location === locationFilter);
    }

    setFilteredWalkers(filtered);
  };

  if (loading) {
    return <div style={styles.loading}>Cargando paseadores...</div>;
  }

  return (
    <div style={styles.page}>
      <div className="container">
        <div style={styles.header}>
          <h1 style={styles.title} data-testid="paseadores-title">Nuestros paseadores en Lugo</h1>
          <p style={styles.subtitle}>
            Todos nuestros paseadores están verificados, asegurados y tienen experiencia
            demostrable en el cuidado de mascotas. Encuentra el perfecto para tu perro.
          </p>
        </div>

        <div style={styles.filters}>
          <Input
            placeholder="Buscar por nombre o especialidad..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
            data-testid="search-input"
          />
          <Select value={locationFilter} onValueChange={setLocationFilter}>
            <SelectTrigger style={styles.select} data-testid="location-filter">
              <SelectValue placeholder="Ubicación" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las ubicaciones</SelectItem>
              <SelectItem value="Centro de Lugo">Centro de Lugo</SelectItem>
              <SelectItem value="Ensanche">Ensanche</SelectItem>
              <SelectItem value="A Milagrosa">A Milagrosa</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div style={styles.walkersGrid}>
          {filteredWalkers.map((walker) => (
            <div key={walker.id} style={styles.walkerCard} data-testid={`walker-card-${walker.id}`}>
              <div style={styles.cardHeader}>
                <img
                  src={walker.profile_image || walker.user_picture || 'https://i.pravatar.cc/150?img=1'}
                  alt={walker.user_name}
                  style={styles.avatar}
                />
                {walker.is_verified && (
                  <div style={styles.verifiedBadge}>
                    <Award size={14} color="white" />
                  </div>
                )}
              </div>

              <div style={styles.cardContent}>
                <div style={styles.cardTop}>
                  <h3 style={styles.walkerName} data-testid="walker-name">{walker.user_name}</h3>
                  {walker.availability && (
                    <span style={styles.availabilityBadge} data-testid="availability-badge">{walker.availability}</span>
                  )}
                </div>

                <div style={styles.rating}>
                  <Star size={16} fill="#FFB800" color="#FFB800" />
                  <span style={styles.ratingText}>
                    {walker.rating} ({walker.reviews_count})
                  </span>
                </div>

                <div style={styles.location}>
                  <MapPin size={16} color="#666" />
                  <span>{walker.location}</span>
                  <span style={styles.experience}>{walker.experience_years} años</span>
                </div>

                <p style={styles.bio}>{walker.bio}</p>

                <div style={styles.specialties}>
                  <strong>Especialidades:</strong>
                  <div style={styles.specialtyTags}>
                    {walker.specialties.slice(0, 3).map((specialty, idx) => (
                      <span key={idx} style={styles.specialtyTag}>{specialty}</span>
                    ))}
                  </div>
                </div>

                <div style={styles.cardFooter}>
                  <div style={styles.price}>
                    <span style={styles.priceLabel}>Precio</span>
                    <span style={styles.priceAmount}>Desde {walker.price_from}€</span>
                  </div>
                  <div style={styles.cardActions}>
                    <Button
                      variant="outline"
                      onClick={() => navigate(`/paseador/${walker.id}`)}
                      data-testid="ver-perfil-btn"
                    >
                      Ver perfil
                    </Button>
                    <Button
                      onClick={() => navigate(`/reservar/${walker.id}`)}
                      style={styles.reserveBtn}
                      data-testid="reservar-btn"
                    >
                      Reservar
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredWalkers.length === 0 && (
          <div style={styles.noResults} data-testid="no-results">
            <p>No se encontraron paseadores con los filtros seleccionados.</p>
          </div>
        )}
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
  header: {
    textAlign: 'center',
    marginBottom: '3rem',
  },
  title: {
    fontSize: '2.75rem',
    fontWeight: 700,
    marginBottom: '1rem',
    color: '#1a1a1a',
  },
  subtitle: {
    fontSize: '1.125rem',
    color: '#666',
    maxWidth: '700px',
    margin: '0 auto',
  },
  filters: {
    display: 'grid',
    gridTemplateColumns: '1fr auto',
    gap: '1rem',
    marginBottom: '3rem',
  },
  searchInput: {
    maxWidth: '500px',
  },
  select: {
    minWidth: '200px',
  },
  walkersGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '2rem',
  },
  walkerCard: {
    background: 'white',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
    transition: 'all 0.2s',
    cursor: 'pointer',
  },
  cardHeader: {
    position: 'relative',
    height: '200px',
    background: 'linear-gradient(135deg, #FFE8D6 0%, #FFF5EF 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '4px solid white',
  },
  verifiedBadge: {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    width: '32px',
    height: '32px',
    background: '#10B981',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContent: {
    padding: '1.5rem',
  },
  cardTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.75rem',
  },
  walkerName: {
    fontSize: '1.375rem',
    fontWeight: 600,
    color: '#1a1a1a',
  },
  availabilityBadge: {
    background: '#FFE8D6',
    color: '#FF6B00',
    padding: '0.25rem 0.75rem',
    borderRadius: '12px',
    fontSize: '0.8125rem',
    fontWeight: 600,
  },
  rating: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.375rem',
    marginBottom: '0.75rem',
  },
  ratingText: {
    fontSize: '0.9375rem',
    fontWeight: 600,
    color: '#1a1a1a',
  },
  location: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.9375rem',
    color: '#666',
    marginBottom: '1rem',
  },
  experience: {
    marginLeft: 'auto',
    background: '#F3F4F6',
    padding: '0.25rem 0.625rem',
    borderRadius: '8px',
    fontSize: '0.8125rem',
  },
  bio: {
    fontSize: '0.9375rem',
    color: '#666',
    lineHeight: 1.6,
    marginBottom: '1rem',
  },
  specialties: {
    marginBottom: '1.5rem',
  },
  specialtyTags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
    marginTop: '0.5rem',
  },
  specialtyTag: {
    background: '#F3F4F6',
    padding: '0.375rem 0.875rem',
    borderRadius: '20px',
    fontSize: '0.8125rem',
    color: '#4a4a4a',
  },
  cardFooter: {
    borderTop: '1px solid #E5E7EB',
    paddingTop: '1.5rem',
  },
  price: {
    marginBottom: '1rem',
  },
  priceLabel: {
    fontSize: '0.875rem',
    color: '#666',
    marginRight: '0.5rem',
  },
  priceAmount: {
    fontSize: '1.375rem',
    fontWeight: 700,
    color: '#FF6B00',
  },
  cardActions: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '0.75rem',
  },
  reserveBtn: {
    background: '#FF6B00',
    color: 'white',
    border: 'none',
  },
  noResults: {
    textAlign: 'center',
    padding: '4rem',
    fontSize: '1.125rem',
    color: '#666',
  },
};