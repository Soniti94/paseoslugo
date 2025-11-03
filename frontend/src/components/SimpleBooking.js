import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Calendar, Clock, Phone, Mail, User } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function SimpleBooking() {
  const [serviceType, setServiceType] = useState('Paseo de perro');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [showContactForm, setShowContactForm] = useState(false);
  
  // Contact form fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [petDetails, setPetDetails] = useState('');

  const handleFindWalkers = () => {
    if (!date || !time) {
      toast.error('Por favor selecciona fecha y hora');
      return;
    }
    setShowContactForm(true);
  };

  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    
    if (!name || !phone || !email) {
      toast.error('Por favor completa todos los campos obligatorios');
      return;
    }

    try {
      const bookingData = {
        service_type: serviceType,
        date,
        time,
        contact: {
          name,
          phone,
          email,
          address
        },
        pet_details: petDetails,
        status: 'pending'
      };

      await axios.post(`${API}/simple-bookings`, bookingData);
      
      toast.success('¡Solicitud enviada! Te contactaremos pronto para confirmar.');
      
      // Reset form
      setServiceType('Paseo de perro');
      setDate('');
      setTime('');
      setShowContactForm(false);
      setName('');
      setPhone('');
      setEmail('');
      setAddress('');
      setPetDetails('');
      
    } catch (error) {
      toast.error('Error al enviar solicitud. Intenta nuevamente.');
      console.error('Booking error:', error);
    }
  };

  if (showContactForm) {
    return (
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <Card style={styles.bookingCard}>
            <h2 style={styles.cardTitle}>Información de Contacto</h2>
            <p style={styles.cardSubtitle}>
              Servicio: <strong>{serviceType}</strong><br />
              Fecha: <strong>{date}</strong> a las <strong>{time}</strong>
            </p>
            
            <form onSubmit={handleSubmitBooking} style={styles.form}>
              <div style={styles.fieldGroup}>
                <Label htmlFor="name">Nombre completo *</Label>
                <div style={styles.inputGroup}>
                  <User size={18} style={styles.inputIcon} />
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Tu nombre"
                    required
                    style={styles.inputWithIcon}
                  />
                </div>
              </div>

              <div style={styles.fieldGroup}>
                <Label htmlFor="phone">Teléfono *</Label>
                <div style={styles.inputGroup}>
                  <Phone size={18} style={styles.inputIcon} />
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+34 xxx xxx xxx"
                    required
                    style={styles.inputWithIcon}
                  />
                </div>
              </div>

              <div style={styles.fieldGroup}>
                <Label htmlFor="email">Email *</Label>
                <div style={styles.inputGroup}>
                  <Mail size={18} style={styles.inputIcon} />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    required
                    style={styles.inputWithIcon}
                  />
                </div>
              </div>

              <div style={styles.fieldGroup}>
                <Label htmlFor="address">Dirección</Label>
                <Input
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Dirección para el servicio"
                  style={styles.input}
                />
              </div>

              <div style={styles.fieldGroup}>
                <Label htmlFor="petDetails">Detalles de tu mascota</Label>
                <textarea
                  id="petDetails"
                  value={petDetails}
                  onChange={(e) => setPetDetails(e.target.value)}
                  placeholder="Raza, edad, personalidad, necesidades especiales..."
                  rows={3}
                  style={{...styles.input, resize: 'vertical'}}
                />
              </div>

              <div style={styles.buttonGroup}>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowContactForm(false)}
                  style={styles.backButton}
                >
                  Volver
                </Button>
                <Button
                  type="submit"
                  style={styles.submitButton}
                >
                  Enviar Solicitud
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section style={styles.hero}>
      <div style={styles.heroContent}>
        <div style={styles.textSection}>
          <h1 style={styles.title}>
            Cuidado de mascotas con amor
            <span style={styles.titleAccent}> en Lugo</span>
          </h1>
          <p style={styles.subtitle}>
            Reserva paseadores y cuidadores de confianza para tu perro o gato
          </p>
          <Button style={styles.ctaButton}>
            Reservar ahora
          </Button>
        </div>

        <Card style={styles.bookingCard}>
          <h2 style={styles.cardTitle}>Reserva tu servicio</h2>
          
          <div style={styles.form}>
            <div style={styles.fieldGroup}>
              <Label style={styles.fieldLabel}>Tipo de servicio</Label>
              <div style={styles.serviceButtons}>
                <button
                  type="button"
                  onClick={() => setServiceType('Paseo de perro')}
                  style={{
                    ...styles.serviceButton,
                    ...(serviceType === 'Paseo de perro' ? styles.serviceButtonActive : {})
                  }}
                >
                  Paseo de perro
                </button>
                <button
                  type="button"
                  onClick={() => setServiceType('Cuidado de mascota')}
                  style={{
                    ...styles.serviceButton,
                    ...(serviceType === 'Cuidado de mascota' ? styles.serviceButtonActive : {})
                  }}
                >
                  Cuidado de mascota
                </button>
              </div>
            </div>

            <div style={styles.fieldGroup}>
              <Label htmlFor="date" style={styles.fieldLabel}>Fecha</Label>
              <div style={styles.inputGroup}>
                <Calendar size={18} style={styles.inputIcon} />
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  style={styles.inputWithIcon}
                />
              </div>
            </div>

            <div style={styles.fieldGroup}>
              <Label htmlFor="time" style={styles.fieldLabel}>Hora</Label>
              <div style={styles.inputGroup}>
                <Clock size={18} style={styles.inputIcon} />
                <Input
                  id="time"
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  style={styles.inputWithIcon}
                />
              </div>
            </div>

            <Button 
              onClick={handleFindWalkers}
              style={styles.findButton}
              className="w-full"
            >
              Buscar paseadores
            </Button>
          </div>
        </Card>
      </div>
    </section>
  );
}

const styles = {
  hero: {
    background: 'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url("https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=1200") center/cover',
    minHeight: '90vh',
    display: 'flex',
    alignItems: 'center',
    padding: '2rem 0',
  },
  heroContent: {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: '2rem',
  alignItems: 'center',
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '0 1rem',
  width: '100%',
  boxSizing: 'border-box',
  },
  textSection: {
    color: 'white',
  },
  title: {
    fontSize: '3.5rem',
    fontWeight: 800,
    lineHeight: 1.1,
    marginBottom: '1.5rem',
  },
  titleAccent: {
    color: '#FF6B00',
  },
  subtitle: {
    fontSize: '1.25rem',
    marginBottom: '2rem',
    opacity: 0.9,
  },
  ctaButton: {
    background: '#FF6B00',
    color: 'white',
    padding: '1rem 2rem',
    fontSize: '1.125rem',
    fontWeight: 600,
    border: 'none',
    borderRadius: '8px',
  },
  bookingCard: {
  background: 'white',
  padding: '1.5rem',
  borderRadius: '16px',
  boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
  width: '100%',
  maxWidth: '400px',
  justifySelf: 'center',
  boxSizing: 'border-box',
  },
  cardTitle: {
    fontSize: '1.75rem',
    fontWeight: 700,
    marginBottom: '1.5rem',
    color: '#1a1a1a',
    textAlign: 'center',
  },
  cardSubtitle: {
    fontSize: '1rem',
    marginBottom: '1.5rem',
    color: '#666',
    textAlign: 'center',
    background: '#f8f9fa',
    padding: '1rem',
    borderRadius: '8px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  fieldLabel: {
    fontSize: '0.875rem',
    fontWeight: 600,
    color: '#374151',
    textTransform: 'uppercase',
    letterSpacing: '0.025em',
  },
  serviceButtons: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '0.5rem',
  },
  serviceButton: {
    padding: '0.75rem 1rem',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    background: 'white',
    color: '#6b7280',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  serviceButtonActive: {
    borderColor: '#FF6B00',
    background: '#FF6B00',
    color: 'white',
  },
  inputGroup: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: '12px',
    zIndex: 1,
    color: '#9ca3af',
  },
  inputWithIcon: {
    paddingLeft: '40px',
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '1rem',
  },
  findButton: {
    background: '#FF6B00',
    color: 'white',
    padding: '1rem',
    fontSize: '1rem',
    fontWeight: 600,
    border: 'none',
    borderRadius: '8px',
    marginTop: '0.5rem',
  },
  buttonGroup: {
    display: 'flex',
    gap: '1rem',
    marginTop: '1rem',
  },
  backButton: {
    flex: 1,
  },
  submitButton: {
    flex: 2,
    background: '#FF6B00',
    color: 'white',
  },
};
