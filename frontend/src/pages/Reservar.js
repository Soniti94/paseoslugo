import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarIcon, Clock, MapPin } from 'lucide-react';
import { toast } from 'sonner';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const SERVICES = {
  basico: { name: 'Paseo Básico', price: 6.0, duration: 30 },
  estandar: { name: 'Paseo Estándar', price: 8.0, duration: 45 },
  premium: { name: 'Paseo Premium', price: 10.0, duration: 60 },
  especial: { name: 'Cuidado Especial', price: 25.0, duration: 45 },
};

export default function Reservar() {
  const { walkerId } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const [walker, setWalker] = useState(null);
  const [dogs, setDogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [selectedDog, setSelectedDog] = useState('');
  const [serviceType, setServiceType] = useState('estandar');
  const [date, setDate] = useState(null);
  const [time, setTime] = useState('10:00');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!token) {
      toast.error('Debes iniciar sesión para reservar');
      navigate('/paseadores');
      return;
    }
    loadData();
  }, [token]);

  const loadData = async () => {
    try {
      const [walkerRes, dogsRes] = await Promise.all([
        axios.get(`${API}/walkers/${walkerId}`),
        axios.get(`${API}/dogs`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      setWalker(walkerRes.data);
      setDogs(dogsRes.data);

      if (dogsRes.data.length > 0) {
        setSelectedDog(dogsRes.data[0].id);
      }
    } catch (err) {
      toast.error('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedDog) {
      toast.error('Debes tener un perro registrado');
      return;
    }

    if (!date) {
      toast.error('Selecciona una fecha');
      return;
    }

    setProcessing(true);

    try {
      // Create booking
      const service = SERVICES[serviceType];
      const bookingRes = await axios.post(
        `${API}/bookings`,
        {
          walker_id: walkerId,
          dog_id: selectedDog,
          service_type: serviceType,
          date: format(date, 'yyyy-MM-dd'),
          time: time,
          duration: service.duration,
          amount: service.price,
          location: location || walker.location,
          notes: notes,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const bookingId = bookingRes.data.id;

      // Create Stripe checkout session
      const checkoutRes = await axios.post(
        `${API}/payments/checkout/session`,
        {
          booking_id: bookingId,
          origin_url: window.location.origin,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Redirect to Stripe
      window.location.href = checkoutRes.data.url;
    } catch (err) {
      console.error(err);
      toast.error('Error al crear la reserva');
      setProcessing(false);
    }
  };

  if (loading) {
    return <div style={styles.loading}>Cargando...</div>;
  }

  if (!walker) {
    return <div style={styles.loading}>Paseador no encontrado</div>;
  }

  const selectedService = SERVICES[serviceType];

  return (
    <div style={styles.page}>
      <div className="container">
        <h1 style={styles.title} data-testid="reservar-title">Reservar paseo con {walker.user_name}</h1>

        <div style={styles.grid} className="reservar-grid">
          {/* Left: Form */}
          <div style={styles.formSection}>
            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.formGroup}>
                <Label htmlFor="dog">Selecciona tu perro</Label>
                {dogs.length > 0 ? (
                  <Select value={selectedDog} onValueChange={setSelectedDog}>
                    <SelectTrigger data-testid="dog-select">
                      <SelectValue placeholder="Selecciona un perro" />
                    </SelectTrigger>
                    <SelectContent>
                      {dogs.map((dog) => (
                        <SelectItem key={dog.id} value={dog.id}>
                          {dog.name} - {dog.breed || dog.size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <p style={styles.noDogs}>No tienes perros registrados. <a href="/mis-reservas">Añade uno primero.</a></p>
                )}
              </div>

              <div style={styles.formGroup}>
                <Label>Tipo de servicio</Label>
                <div style={styles.serviceOptions} className="reservar-service-options">
                  {Object.entries(SERVICES).map(([key, service]) => (
                    <div
                      key={key}
                      style={{
                        ...styles.serviceOption,
                        ...(serviceType === key ? styles.serviceOptionActive : {}),
                      }}
                      onClick={() => setServiceType(key)}
                      data-testid={`service-${key}`}
                    >
                      <div style={styles.serviceName}>{service.name}</div>
                      <div style={styles.servicePrice}>{service.price}€</div>
                      <div style={styles.serviceDuration}>{service.duration} min</div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={styles.formGroup}>
                <Label>Fecha del paseo</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      style={styles.dateButton}
                      data-testid="date-picker-btn"
                    >
                      <CalendarIcon size={16} style={{ marginRight: '0.5rem' }} />
                      {date ? format(date, 'PPP', { locale: es }) : 'Selecciona una fecha'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      disabled={(date) => date < new Date()}
                      locale={es}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div style={styles.formGroup}>
                <Label htmlFor="time">Hora</Label>
                <Select value={time} onValueChange={setTime}>
                  <SelectTrigger data-testid="time-select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'].map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div style={styles.formGroup}>
                <Label htmlFor="location">Ubicación (opcional)</Label>
                <Input
                  id="location"
                  placeholder={walker.location}
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  data-testid="location-input"
                />
              </div>

              <div style={styles.formGroup}>
                <Label htmlFor="notes">Notas adicionales (opcional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Información especial sobre tu perro..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  data-testid="notes-textarea"
                />
              </div>

              <Button
                type="submit"
                disabled={processing || dogs.length === 0}
                style={styles.submitBtn}
                className="w-full"
                data-testid="submit-booking-btn"
              >
                {processing ? 'Procesando...' : `Pagar ${selectedService.price}€`}
              </Button>
            </form>
          </div>

          {/* Right: Summary */}
          <div style={styles.summarySection} className="reservar-summary">
            <div style={styles.summaryCard}>
              <h3 style={styles.summaryTitle}>Resumen de la reserva</h3>

              <div style={styles.summaryItem}>
                <span style={styles.summaryLabel}>Paseador:</span>
                <span style={styles.summaryValue}>{walker.user_name}</span>
              </div>

              <div style={styles.summaryItem}>
                <span style={styles.summaryLabel}>Servicio:</span>
                <span style={styles.summaryValue}>{selectedService.name}</span>
              </div>

              <div style={styles.summaryItem}>
                <span style={styles.summaryLabel}>Duración:</span>
                <span style={styles.summaryValue}>{selectedService.duration} minutos</span>
              </div>

              {date && (
                <div style={styles.summaryItem}>
                  <span style={styles.summaryLabel}>Fecha:</span>
                  <span style={styles.summaryValue}>{format(date, 'PPP', { locale: es })}</span>
                </div>
              )}

              <div style={styles.summaryItem}>
                <span style={styles.summaryLabel}>Hora:</span>
                <span style={styles.summaryValue}>{time}</span>
              </div>

              <div style={styles.summaryDivider} />

              <div style={styles.summaryTotal}>
                <span style={styles.totalLabel}>Total:</span>
                <span style={styles.totalValue}>{selectedService.price}€</span>
              </div>

              <div style={styles.benefits}>
                <h4 style={styles.benefitsTitle}>Incluye:</h4>
                <ul style={styles.benefitsList}>
                  <li><Clock size={16} /> Cancelación gratuita hasta 2h antes</li>
                  <li><MapPin size={16} /> Seguimiento GPS en tiempo real</li>
                  <li>Reporte con fotos al finalizar</li>
                  <li>Seguro de responsabilidad civil</li>
                </ul>
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
  title: {
    fontSize: '2.5rem',
    fontWeight: 700,
    marginBottom: '3rem',
    color: '#1a1a1a',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 400px',
    gap: '2.5rem',
  },
  formSection: {
    background: 'white',
    borderRadius: '16px',
    padding: '2.5rem',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  noDogs: {
    padding: '1rem',
    background: '#FFF5EF',
    borderRadius: '8px',
    color: '#666',
  },
  serviceOptions: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '1rem',
  },
  serviceOption: {
    background: '#F9FAFB',
    padding: '1.25rem',
    borderRadius: '12px',
    cursor: 'pointer',
    border: '2px solid transparent',
    transition: 'all 0.2s',
  },
  serviceOptionActive: {
    background: '#FFF5EF',
    border: '2px solid #FF6B00',
  },
  serviceName: {
    fontWeight: 600,
    marginBottom: '0.5rem',
    color: '#1a1a1a',
  },
  servicePrice: {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: '#FF6B00',
  },
  serviceDuration: {
    fontSize: '0.875rem',
    color: '#666',
  },
  dateButton: {
    justifyContent: 'flex-start',
    width: '100%',
  },
  submitBtn: {
    background: '#FF6B00',
    color: 'white',
    padding: '1.125rem',
    fontSize: '1.0625rem',
    fontWeight: 600,
    marginTop: '1rem',
  },
  summarySection: {
    position: 'sticky',
    top: '6rem',
    alignSelf: 'start',
  },
  summaryCard: {
    background: 'white',
    borderRadius: '16px',
    padding: '2rem',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
  },
  summaryTitle: {
    fontSize: '1.375rem',
    fontWeight: 700,
    marginBottom: '1.5rem',
    color: '#1a1a1a',
  },
  summaryItem: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '1rem',
  },
  summaryLabel: {
    color: '#666',
  },
  summaryValue: {
    fontWeight: 600,
    color: '#1a1a1a',
  },
  summaryDivider: {
    height: '1px',
    background: '#E5E7EB',
    margin: '1.5rem 0',
  },
  summaryTotal: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '2rem',
  },
  totalLabel: {
    fontSize: '1.25rem',
    fontWeight: 700,
    color: '#1a1a1a',
  },
  totalValue: {
    fontSize: '1.75rem',
    fontWeight: 700,
    color: '#FF6B00',
  },
  benefits: {
    background: '#F9FAFB',
    padding: '1.25rem',
    borderRadius: '12px',
  },
  benefitsTitle: {
    fontSize: '1rem',
    fontWeight: 600,
    marginBottom: '0.75rem',
    color: '#1a1a1a',
  },
  benefitsList: {
    listStyle: 'none',
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.625rem',
    fontSize: '0.875rem',
    color: '#666',
  },
};
