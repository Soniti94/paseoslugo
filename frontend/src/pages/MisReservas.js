import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, MapPin, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function MisReservas() {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [dogs, setDogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddDog, setShowAddDog] = useState(false);

  // Add dog form
  const [dogName, setDogName] = useState('');
  const [dogBreed, setDogBreed] = useState('');
  const [dogSize, setDogSize] = useState('Mediano');
  const [dogAge, setDogAge] = useState('');

  useEffect(() => {
    if (!token) {
      navigate('/');
      return;
    }
    loadData();
  }, [token]);

  const loadData = async () => {
    try {
      const [bookingsRes, dogsRes] = await Promise.all([
        axios.get(`${API}/bookings`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API}/dogs`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      setBookings(bookingsRes.data);
      setDogs(dogsRes.data);
    } catch (err) {
      toast.error('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  const handleAddDog = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${API}/dogs`,
        {
          name: dogName,
          breed: dogBreed,
          size: dogSize,
          age: parseInt(dogAge) || null,
          special_needs: [],
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Perro añadido correctamente');
      setShowAddDog(false);
      loadData();
    } catch (err) {
      toast.error('Error al añadir perro');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending_payment: { text: 'Pendiente pago', color: '#F59E0B' },
      confirmed: { text: 'Confirmada', color: '#10B981' },
      in_progress: { text: 'En progreso', color: '#3B82F6' },
      completed: { text: 'Completada', color: '#6B7280' },
      cancelled: { text: 'Cancelada', color: '#EF4444' },
    };
    const badge = badges[status] || badges.pending_payment;
    return (
      <span style={{ ...styles.statusBadge, background: badge.color }}>
        {badge.text}
      </span>
    );
  };

  if (loading) {
    return <div style={styles.loading}>Cargando...</div>;
  }

  return (
    <div style={styles.page}>
      <div className="container">
        <div style={styles.header}>
          <h1 style={styles.title} data-testid="mis-reservas-title">Mis Reservas</h1>
          <Dialog open={showAddDog} onOpenChange={setShowAddDog}>
            <DialogTrigger asChild>
              <Button data-testid="add-dog-btn">Añadir perro</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Añadir un nuevo perro</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddDog} style={styles.dogForm}>
                <div>
                  <Label htmlFor="dog-name">Nombre</Label>
                  <Input
                    id="dog-name"
                    value={dogName}
                    onChange={(e) => setDogName(e.target.value)}
                    required
                    data-testid="dog-name-input"
                  />
                </div>
                <div>
                  <Label htmlFor="dog-breed">Raza</Label>
                  <Input
                    id="dog-breed"
                    value={dogBreed}
                    onChange={(e) => setDogBreed(e.target.value)}
                    data-testid="dog-breed-input"
                  />
                </div>
                <div>
                  <Label htmlFor="dog-size">Tamaño</Label>
                  <Select value={dogSize} onValueChange={setDogSize}>
                    <SelectTrigger data-testid="dog-size-select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pequeño">Pequeño</SelectItem>
                      <SelectItem value="Mediano">Mediano</SelectItem>
                      <SelectItem value="Grande">Grande</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="dog-age">Edad (años)</Label>
                  <Input
                    id="dog-age"
                    type="number"
                    value={dogAge}
                    onChange={(e) => setDogAge(e.target.value)}
                    data-testid="dog-age-input"
                  />
                </div>
                <Button type="submit" className="w-full" data-testid="submit-dog-btn">
                  Añadir perro
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Dogs Section */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Mis perros</h2>
          <div style={styles.dogsGrid} className="dogs-grid">
            {dogs.map((dog) => (
              <div key={dog.id} style={styles.dogCard} data-testid={`dog-card-${dog.id}`}>
                <div style={styles.dogAvatar}>{dog.name.charAt(0)}</div>
                <div style={styles.dogInfo}>
                  <h4 style={styles.dogName}>{dog.name}</h4>
                  <p style={styles.dogDetails}>
                    {dog.breed || dog.size} {dog.age ? `• ${dog.age} años` : ''}
                  </p>
                </div>
              </div>
            ))}
            {dogs.length === 0 && (
              <p style={styles.noDogs} data-testid="no-dogs">
                No tienes perros registrados. Haz clic en "Añadir perro" para comenzar.
              </p>
            )}
          </div>
        </div>

        {/* Bookings Section */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Historial de reservas</h2>
          <div style={styles.bookingsGrid}>
            {bookings.map((booking) => (
              <div key={booking.id} style={styles.bookingCard} data-testid={`booking-card-${booking.id}`}>
                <div style={styles.bookingHeader}>
                  <div>
                    <h4 style={styles.bookingWalker}>{booking.walker_name}</h4>
                    <p style={styles.bookingDog}>{booking.dog_name}</p>
                  </div>
                  {getStatusBadge(booking.status)}
                </div>

                <div style={styles.bookingDetails}>
                  <div style={styles.bookingDetail}>
                    <Calendar size={18} color="#666" />
                    <span>{booking.date}</span>
                  </div>
                  <div style={styles.bookingDetail}>
                    <Clock size={18} color="#666" />
                    <span>{booking.time} • {booking.duration} min</span>
                  </div>
                  {booking.location && (
                    <div style={styles.bookingDetail}>
                      <MapPin size={18} color="#666" />
                      <span>{booking.location}</span>
                    </div>
                  )}
                </div>

                <div style={styles.bookingFooter}>
                  <span style={styles.bookingPrice}>{booking.amount}€</span>
                  {booking.status === 'confirmed' && (
                    <Button
                      size="sm"
                      onClick={() => navigate(`/seguimiento/${booking.id}`)}
                      data-testid="ver-seguimiento-btn"
                    >
                      Ver seguimiento
                    </Button>
                  )}
                  {booking.status === 'in_progress' && (
                    <Button
                      size="sm"
                      onClick={() => navigate(`/seguimiento/${booking.id}`)}
                      style={{ background: '#3B82F6' }}
                      data-testid="seguir-paseo-btn"
                    >
                      Seguir paseo
                    </Button>
                  )}
                  {booking.status === 'completed' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate(`/seguimiento/${booking.id}`)}
                      data-testid="ver-reporte-btn"
                    >
                      Ver reporte
                    </Button>
                  )}
                </div>
              </div>
            ))}
            {bookings.length === 0 && (
              <div style={styles.noBookings} data-testid="no-bookings">
                <p>No tienes reservas todavía.</p>
                <Button onClick={() => navigate('/paseadores')} style={{ marginTop: '1rem' }}>
                  Buscar paseadores
                </Button>
              </div>
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
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '3rem',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: 700,
    color: '#1a1a1a',
  },
  section: {
    marginBottom: '4rem',
  },
  sectionTitle: {
    fontSize: '1.75rem',
    fontWeight: 700,
    marginBottom: '1.5rem',
    color: '#1a1a1a',
  },
  dogsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '1.5rem',
  },
  dogCard: {
    background: 'white',
    padding: '1.5rem',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  dogAvatar: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    background: '#FFE8D6',
    color: '#FF6B00',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem',
    fontWeight: 700,
  },
  dogInfo: {
    flex: 1,
  },
  dogName: {
    fontSize: '1.125rem',
    fontWeight: 600,
    marginBottom: '0.25rem',
    color: '#1a1a1a',
  },
  dogDetails: {
    fontSize: '0.875rem',
    color: '#666',
  },
  noDogs: {
    padding: '2rem',
    textAlign: 'center',
    color: '#666',
    gridColumn: '1 / -1',
  },
  dogForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  bookingsGrid: {
    display: 'grid',
    gap: '1.5rem',
  },
  bookingCard: {
    background: 'white',
    padding: '1.5rem',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  },
  bookingHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1rem',
  },
  bookingWalker: {
    fontSize: '1.25rem',
    fontWeight: 600,
    marginBottom: '0.25rem',
    color: '#1a1a1a',
  },
  bookingDog: {
    fontSize: '0.9375rem',
    color: '#666',
  },
  statusBadge: {
    color: 'white',
    padding: '0.375rem 0.875rem',
    borderRadius: '12px',
    fontSize: '0.8125rem',
    fontWeight: 600,
  },
  bookingDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    marginBottom: '1.25rem',
  },
  bookingDetail: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.9375rem',
    color: '#666',
  },
  bookingFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: '1px solid #E5E7EB',
    paddingTop: '1.25rem',
  },
  bookingPrice: {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: '#FF6B00',
  },
  noBookings: {
    padding: '4rem',
    textAlign: 'center',
    background: 'white',
    borderRadius: '12px',
    color: '#666',
  },
};