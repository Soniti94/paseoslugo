import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Search, Calendar, MapPin, Camera, Award, Heart, Clock, Shield } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div style={styles.landing}>
      {/* Hero Section */}
      <section style={styles.hero} data-testid="hero-section">
        <div className="container" style={styles.heroContent} className="landing-hero-grid">
          <div style={styles.heroText}>
            <h1 style={styles.heroTitle} className="landing-hero-title" data-testid="hero-title">
              Paseos seguros y confiables para tu mejor amigo en <span style={styles.highlight}>Lugo</span>
            </h1>
            <p style={styles.heroSubtitle} className="landing-hero-subtitle" data-testid="hero-subtitle">
              Conectamos a dueños de mascotas con paseadores verificados y experimentados. 
              Tu perro recibirá el ejercicio y la atención que merece mientras tú te ocupas de tus actividades.
            </p>
            <div style={styles.heroButtons} className="landing-hero-buttons">
              <Button
                onClick={() => navigate('/paseadores')}
                style={styles.ctaButton}
                data-testid="hero-cta-paseador"
              >
                Encuentra un paseador
              </Button>
            </div>
            <div style={styles.trustSignals} className="landing-trust-signals">
              <div style={styles.trustItem}>
                <Award size={20} color="#FF6B00" />
                <span>Paseadores verificados</span>
              </div>
              <div style={styles.trustItem}>
                <Shield size={20} color="#FF6B00" />
                <span>Reseñas reales</span>
              </div>
              <div style={styles.trustItem}>
                <Clock size={20} color="#FF6B00" />
                <span>Horarios flexibles</span>
              </div>
            </div>
          </div>
          <div style={styles.heroImage} className="landing-hero-image">
            <img
              src="https://images.unsplash.com/photo-1568572933382-74d440642117?w=600&q=80"
              alt="Person walking dog"
              style={styles.mainImage}
            />
            <div style={styles.floatingBadge}>
              <Shield size={24} color="#10B981" />
              <div>
                <div style={styles.badgeTitle}>Seguro incluido</div>
                <div style={styles.badgeText}>Cobertura completa</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section style={styles.howItWorks} data-testid="how-it-works-section">
        <div className="container">
          <h2 style={styles.sectionTitle}>Cómo funciona</h2>
          <p style={styles.sectionSubtitle}>
            Reservar un paseo para tu perro nunca ha sido tan fácil. En solo unos pocos pasos, 
            tu mascota estará disfrutando de un paseo profesional.
          </p>

          <div style={styles.stepsGrid} className="landing-steps-grid">
            <div style={styles.stepCard} data-testid="step-1">
              <div style={styles.stepNumber}>1</div>
              <div style={styles.stepIcon}>
                <Search size={40} color="#FF6B00" />
              </div>
              <h3 style={styles.stepTitle}>Encuentra tu paseador</h3>
              <p style={styles.stepText}>
                Busca entre nuestros paseadores verificados en Lugo. 
                Filtra por ubicación, precio, especialidades y disponibilidad.
              </p>
            </div>

            <div style={styles.stepCard} data-testid="step-2">
              <div style={styles.stepNumber}>2</div>
              <div style={styles.stepIcon}>
                <Calendar size={40} color="#FF6B00" />
              </div>
              <h3 style={styles.stepTitle}>Reserva el paseo</h3>
              <p style={styles.stepText}>
                Selecciona el día, hora y duración del paseo. 
                Proporciona información sobre tu perro y sus necesidades especiales.
              </p>
            </div>

            <div style={styles.stepCard} data-testid="step-3">
              <div style={styles.stepNumber}>3</div>
              <div style={styles.stepIcon}>
                <MapPin size={40} color="#FF6B00" />
              </div>
              <h3 style={styles.stepTitle}>Seguimiento en tiempo real</h3>
              <p style={styles.stepText}>
                Recibe actualizaciones del paseo con GPS en tiempo real. 
                Sabe exactamente dónde está tu perro en todo momento.
              </p>
            </div>

            <div style={styles.stepCard} data-testid="step-4">
              <div style={styles.stepNumber}>4</div>
              <div style={styles.stepIcon}>
                <Camera size={40} color="#FF6B00" />
              </div>
              <h3 style={styles.stepTitle}>Recibe el reporte</h3>
              <p style={styles.stepText}>
                Al finalizar el paseo, recibirás fotos, un resumen de la actividad 
                y cualquier nota importante sobre tu mascota.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={styles.features}>
        <div className="container">
          <div style={styles.featuresGrid} className="landing-features-grid">
            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>
                <Clock size={32} color="#FF6B00" />
              </div>
              <h4 style={styles.featureTitle}>Cancelación gratuita</h4>
              <p style={styles.featureText}>Hasta 2 horas antes del paseo</p>
            </div>

            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>
                <MapPin size={32} color="#FF6B00" />
              </div>
              <h4 style={styles.featureTitle}>Seguimiento GPS</h4>
              <p style={styles.featureText}>Sigue la ruta del paseo en tiempo real</p>
            </div>

            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>
                <Heart size={32} color="#FF6B00" />
              </div>
              <h4 style={styles.featureTitle}>Garantía de satisfacción</h4>
              <p style={styles.featureText}>Si no estás satisfecho, repetimos el servicio</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Signals */}
      <section style={styles.trustSection}>
        <div className="container">
          <h2 style={styles.sectionTitle}>Nuestros paseadores en Lugo</h2>
          <p style={styles.sectionSubtitle}>
            Todos nuestros paseadores están verificados, asegurados y tienen experiencia 
            demostrable en el cuidado de mascotas. Encuentra el perfecto para tu perro.
          </p>

          <div style={styles.trustGrid}>
            <div style={styles.trustCard}>
              <div style={styles.trustIconCircle}>
                <Award size={32} color="#3B82F6" />
              </div>
              <h4 style={styles.trustCardTitle}>Verificación completa</h4>
              <p style={styles.trustCardText}>DNI, antecedentes y referencias</p>
            </div>

            <div style={styles.trustCard}>
              <div style={styles.trustIconCircle}>
                <Heart size={32} color="#10B981" />
              </div>
              <h4 style={styles.trustCardTitle}>Amantes de los animales</h4>
              <p style={styles.trustCardText}>Pasión genuina por el cuidado</p>
            </div>

            <div style={styles.trustCard}>
              <div style={styles.trustIconCircle}>
                <Clock size={32} color="#8B5CF6" />
              </div>
              <h4 style={styles.trustCardTitle}>Experiencia demostrable</h4>
              <p style={styles.trustCardText}>Mínimo 6 meses de experiencia</p>
            </div>

            <div style={styles.trustCard}>
              <div style={styles.trustIconCircle}>
                <Shield size={32} color="#F59E0B" />
              </div>
              <h4 style={styles.trustCardTitle}>Valoraciones reales</h4>
              <p style={styles.trustCardText}>Solo de clientes verificados</p>
            </div>
          </div>

          <div style={styles.statsBar}>
            <div style={styles.stat}>
              <div style={styles.statNumber}>500+</div>
              <div style={styles.statLabel}>Perros felices</div>
            </div>
            <div style={styles.stat}>
              <div style={styles.statNumber}>50+</div>
              <div style={styles.statLabel}>Paseadores activos</div>
            </div>
            <div style={styles.stat}>
              <div style={styles.statNumber}>4.9</div>
              <div style={styles.statLabel}>Valoración media</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={styles.ctaSection}>
        <div className="container" style={styles.ctaContent}>
          <h2 style={styles.ctaTitle}>Tu perro merece el mejor cuidado. Únete a cientos de dueños satisfechos en Lugo.</h2>
          <div style={styles.ctaButtons}>
            <Button
              onClick={() => navigate('/paseadores')}
              style={styles.ctaButtonLarge}
              data-testid="cta-encuentra-paseador"
            >
              Encuentra un paseador
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

const styles = {
  landing: {
    minHeight: '100vh',
  },
  hero: {
    background: 'linear-gradient(135deg, #FFF5EF 0%, #FFEEDD 100%)',
    padding: '5rem 0 4rem',
  },
  heroContent: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '4rem',
    alignItems: 'center',
  },
  heroText: {
    maxWidth: '600px',
  },
  heroTitle: {
    fontSize: '3.5rem',
    lineHeight: 1.15,
    marginBottom: '1.5rem',
    color: '#1a1a1a',
    fontWeight: 800,
  },
  highlight: {
    color: '#FF6B00',
  },
  heroSubtitle: {
    fontSize: '1.125rem',
    color: '#666',
    marginBottom: '2rem',
    lineHeight: 1.7,
  },
  heroButtons: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '2.5rem',
  },
  ctaButton: {
    background: '#FF6B00',
    color: 'white',
    padding: '1rem 2rem',
    fontSize: '1.0625rem',
    fontWeight: 600,
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  ctaSecondary: {
    padding: '1rem 2rem',
    fontSize: '1.0625rem',
    fontWeight: 600,
    borderRadius: '8px',
  },
  trustSignals: {
    display: 'flex',
    gap: '2rem',
    flexWrap: 'wrap',
  },
  trustItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.9375rem',
    color: '#4a4a4a',
  },
  heroImage: {
    position: 'relative',
  },
  mainImage: {
    width: '100%',
    height: '500px',
    objectFit: 'cover',
    borderRadius: '20px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
  },
  floatingBadge: {
    position: 'absolute',
    bottom: '2rem',
    left: '2rem',
    background: 'white',
    padding: '1rem 1.5rem',
    borderRadius: '12px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.875rem',
  },
  badgeTitle: {
    fontWeight: 600,
    fontSize: '0.9375rem',
    color: '#1a1a1a',
  },
  badgeText: {
    fontSize: '0.8125rem',
    color: '#666',
  },
  howItWorks: {
    padding: '6rem 0',
    background: 'white',
  },
  sectionTitle: {
    fontSize: '2.75rem',
    fontWeight: 700,
    textAlign: 'center',
    marginBottom: '1rem',
    color: '#1a1a1a',
  },
  sectionSubtitle: {
    fontSize: '1.125rem',
    textAlign: 'center',
    color: '#666',
    marginBottom: '4rem',
    maxWidth: '700px',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  stepsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '2rem',
  },
  stepCard: {
    background: '#FAFAFA',
    padding: '2rem',
    borderRadius: '16px',
    position: 'relative',
  },
  stepNumber: {
    position: 'absolute',
    top: '-1.25rem',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '3rem',
    height: '3rem',
    background: '#FFE8D6',
    color: '#FF6B00',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.25rem',
    fontWeight: 700,
  },
  stepIcon: {
    marginTop: '1.5rem',
    marginBottom: '1.25rem',
    textAlign: 'center',
  },
  stepTitle: {
    fontSize: '1.25rem',
    fontWeight: 600,
    marginBottom: '0.75rem',
    color: '#1a1a1a',
  },
  stepText: {
    fontSize: '0.9375rem',
    color: '#666',
    lineHeight: 1.6,
  },
  features: {
    padding: '4rem 0',
    background: '#F9FAFB',
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '2rem',
  },
  featureCard: {
    background: '#FFF9F0',
    padding: '2.5rem',
    borderRadius: '16px',
    textAlign: 'center',
  },
  featureIcon: {
    marginBottom: '1.25rem',
    display: 'flex',
    justifyContent: 'center',
  },
  featureTitle: {
    fontSize: '1.125rem',
    fontWeight: 600,
    marginBottom: '0.5rem',
    color: '#1a1a1a',
  },
  featureText: {
    fontSize: '0.9375rem',
    color: '#666',
  },
  trustSection: {
    padding: '6rem 0',
    background: 'white',
  },
  trustGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '2rem',
    marginBottom: '4rem',
  },
  trustCard: {
    textAlign: 'center',
  },
  trustIconCircle: {
    width: '80px',
    height: '80px',
    background: '#F3F4F6',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 1.5rem',
  },
  trustCardTitle: {
    fontSize: '1.0625rem',
    fontWeight: 600,
    marginBottom: '0.5rem',
    color: '#1a1a1a',
  },
  trustCardText: {
    fontSize: '0.9375rem',
    color: '#666',
  },
  statsBar: {
    display: 'flex',
    justifyContent: 'center',
    gap: '6rem',
    padding: '3rem',
    background: '#FFF9F0',
    borderRadius: '16px',
  },
  stat: {
    textAlign: 'center',
  },
  statNumber: {
    fontSize: '3rem',
    fontWeight: 700,
    color: '#FF6B00',
    marginBottom: '0.5rem',
  },
  statLabel: {
    fontSize: '1rem',
    color: '#666',
  },
  ctaSection: {
    background: '#FF6B00',
    padding: '5rem 0',
  },
  ctaContent: {
    textAlign: 'center',
  },
  ctaTitle: {
    fontSize: '2.5rem',
    fontWeight: 700,
    color: 'white',
    marginBottom: '2.5rem',
    maxWidth: '800px',
    margin: '0 auto 2.5rem',
  },
  ctaButtons: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
  },
  ctaButtonLarge: {
    background: 'white',
    color: '#FF6B00',
    padding: '1.125rem 2.5rem',
    fontSize: '1.0625rem',
    fontWeight: 600,
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  ctaSecondaryLarge: {
    background: 'transparent',
    color: 'white',
    border: '2px solid white',
    padding: '1.125rem 2.5rem',
    fontSize: '1.0625rem',
    fontWeight: 600,
    borderRadius: '8px',
  },
};