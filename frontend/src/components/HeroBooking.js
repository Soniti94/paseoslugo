import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

export default function HeroBooking() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <section style={styles.hero}>
      <div style={styles.heroContent} className="hero-booking-content">
        <div style={styles.textSection}>
          <h1 style={styles.title}>
            {t('hero.title')} <span style={styles.highlight}>{t('hero.subtitle')}</span>
          </h1>
          <p style={styles.subtitle}>{t('hero.description')}</p>
          <Button
            onClick={() => navigate('/paseadores')}
            style={styles.bookButton}
          >
            {t('hero.bookNow')}
          </Button>
        </div>

        <div style={styles.bookingCard}>
          <h2 style={styles.cardTitle}>Reserva tu servicio</h2>
          <p style={styles.cardText}>
            Completa el formulario de reserva al hacer clic en "Reservar ahora" para elegir tu paseador.
          </p>
          <Button
            onClick={() => navigate('/paseadores')}
            style={styles.cardButton}
          >
            Ver paseadores disponibles
          </Button>
        </div>
      </div>
    </section>
  );
}

const styles = {
  hero: {
    backgroundImage: 'url(https://images.unsplash.com/photo-1546377791-2e01b4449bf0?w=1920&q=80)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: '650px',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  heroContent: {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  gap: '2rem',
  alignItems: 'center',
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '0 1rem',
  },
  textSection: {
    color: 'white',
  },
  title: {
    fontSize: '3.5rem',
    fontWeight: 800,
    lineHeight: 1.15,
    marginBottom: '1rem',
    textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
  },
  highlight: {
    color: '#FF6B00',
  },
  subtitle: {
    fontSize: '1.375rem',
    marginBottom: '2rem',
    textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
  },
  bookButton: {
    background: '#FF6B00',
    color: 'white',
    padding: '1.125rem 2.5rem',
    fontSize: '1.0625rem',
    fontWeight: 600,
    border: 'none',
    borderRadius: '8px',
  },
  bookingCard: {
    background: 'white',
    borderRadius: '16px',
    padding: '2.5rem',
    boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
  },
  cardTitle: {
    fontSize: '1.75rem',
    fontWeight: 700,
    marginBottom: '1rem',
    color: '#1a1a1a',
  },
  cardText: {
    fontSize: '1rem',
    color: '#666',
    marginBottom: '2rem',
    lineHeight: 1.6,
  },
  cardButton: {
    background: '#FF6B00',
    color: 'white',
    width: '100%',
    padding: '1.125rem',
    fontSize: '1.0625rem',
    fontWeight: 600,
  },
};
