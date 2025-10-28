import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Smartphone, Trophy, MapPin, Phone, Mail, Clock, Facebook, Instagram, Twitter, Dog } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export default function Footer() {
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    toast.success('¡Gracias por suscribirte!');
    setEmail('');
  };

  return (
    <footer style={styles.footer}>
      {/* Benefits Section */}
      <div style={styles.benefitsSection}>
        <div className="container">
          <div style={styles.benefitsGrid}>
            <div style={styles.benefitCard}>
              <div style={{...styles.benefitIcon, background: '#E0F2FE'}}>
                <Shield size={32} color="#3B82F6" />
              </div>
              <h3 style={styles.benefitTitle}>Seguro incluido</h3>
              <p style={styles.benefitText}>
                Seguro de responsabilidad civil incluido en todos los paseos. 
                Cobertura completa hasta 150.000€.
              </p>
            </div>

            <div style={styles.benefitCard}>
              <div style={{...styles.benefitIcon, background: '#EDE9FE'}}>
                <Smartphone size={32} color="#8B5CF6" />
              </div>
              <h3 style={styles.benefitTitle}>App móvil</h3>
              <p style={styles.benefitText}>
                Gestiona reservas, pagos, seguimiento GPS y comunicación 
                con tu paseador desde nuestra app.
              </p>
            </div>

            <div style={styles.benefitCard}>
              <div style={{...styles.benefitIcon, background: '#FEF3C7'}}>
                <Trophy size={32} color="#F59E0B" />
              </div>
              <h3 style={styles.benefitTitle}>Garantía de calidad</h3>
              <p style={styles.benefitText}>
                Si no estás 100% satisfecho, repetimos el paseo sin coste 
                adicional. Tu satisfacción es nuestra prioridad.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div style={styles.mainFooter}>
        <div className="container">
          <div style={styles.footerGrid}>
            {/* Brand Column */}
            <div style={styles.footerColumn}>
              <div style={styles.brand}>
                <Dog size={32} color="#FF6B00" />
                <h4 style={styles.brandName}>PaseosLugo</h4>
              </div>
              <p style={styles.brandDescription}>
                El servicio de paseos de perros más confiable en Lugo, Galicia. 
                Conectamos dueños de mascotas con paseadores profesionales y verificados.
              </p>
              <div style={styles.socialLinks}>
                <a href="#" style={styles.socialIcon} aria-label="Facebook">
                  <Facebook size={20} />
                </a>
                <a href="#" style={styles.socialIcon} aria-label="Instagram">
                  <Instagram size={20} />
                </a>
                <a href="#" style={styles.socialIcon} aria-label="Twitter">
                  <Twitter size={20} />
                </a>
              </div>
            </div>

            {/* Services Column */}
            <div style={styles.footerColumn}>
              <h5 style={styles.footerHeading}>SERVICIOS</h5>
              <ul style={styles.footerList}>
                <li><Link to="/paseadores" style={styles.footerLink}>Paseo básico</Link></li>
                <li><Link to="/paseadores" style={styles.footerLink}>Paseo estándar</Link></li>
                <li><Link to="/paseadores" style={styles.footerLink}>Paseo premium</Link></li>
                <li><Link to="/paseadores" style={styles.footerLink}>Cuidado especial</Link></li>
                <li><Link to="/paseadores" style={styles.footerLink}>Emergencias</Link></li>
                <li><Link to="/paseadores" style={styles.footerLink}>Cuidado nocturno</Link></li>
              </ul>
            </div>

            {/* Support Column */}
            <div style={styles.footerColumn}>
              <h5 style={styles.footerHeading}>SOPORTE</h5>
              <ul style={styles.footerList}>
                <li><Link to="/" style={styles.footerLink}>Centro de ayuda</Link></li>
                <li><Link to="/" style={styles.footerLink}>Preguntas frecuentes</Link></li>
                <li><Link to="/" style={styles.footerLink}>Política de privacidad</Link></li>
                <li><Link to="/" style={styles.footerLink}>Términos de servicio</Link></li>
                <li><Link to="/" style={styles.footerLink}>Ser paseador</Link></li>
                <li><Link to="/" style={styles.footerLink}>Seguro</Link></li>
              </ul>
            </div>

            {/* Contact Column */}
            <div style={styles.footerColumn}>
              <h5 style={styles.footerHeading}>CONTACTO</h5>
              <div style={styles.contactList}>
                <div style={styles.contactItem}>
                  <MapPin size={18} />
                  <span>Lugo, Galicia, España</span>
                </div>
                <div style={styles.contactItem}>
                  <Phone size={18} />
                  <span>+34 982 123 456</span>
                </div>
                <div style={styles.contactItem}>
                  <Mail size={18} />
                  <span>hola@paseoslugo.com</span>
                </div>
                <div style={styles.contactItem}>
                  <Clock size={18} />
                  <span>L-D: 7:00 - 22:00</span>
                </div>
              </div>

              <div style={styles.newsletter}>
                <h6 style={styles.newsletterHeading}>Newsletter</h6>
                <form onSubmit={handleNewsletterSubmit} style={styles.newsletterForm}>
                  <Input
                    type="email"
                    placeholder="Tu email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={styles.newsletterInput}
                  />
                  <Button type="submit" style={styles.newsletterButton}>
                    Suscribir
                  </Button>
                </form>
              </div>
            </div>
          </div>

          <div style={styles.copyright}>
            <p>© 2025 PaseosLugo. Todos los derechos reservados.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    width: '100%',
  },
  benefitsSection: {
    background: 'white',
    padding: '5rem 0',
  },
  benefitsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '3rem',
  },
  benefitCard: {
    textAlign: 'center',
  },
  benefitIcon: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 1.5rem',
  },
  benefitTitle: {
    fontSize: '1.25rem',
    fontWeight: 700,
    marginBottom: '0.75rem',
    color: '#1a1a1a',
  },
  benefitText: {
    fontSize: '0.9375rem',
    color: '#666',
    lineHeight: 1.7,
  },
  mainFooter: {
    background: '#1E293B',
    color: 'white',
    padding: '4rem 0 2rem',
  },
  footerGrid: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr 1.5fr',
    gap: '3rem',
    marginBottom: '3rem',
  },
  footerColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '0.5rem',
  },
  brandName: {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: 'white',
    margin: 0,
  },
  brandDescription: {
    fontSize: '0.9375rem',
    color: '#CBD5E1',
    lineHeight: 1.7,
    marginBottom: '1rem',
  },
  socialLinks: {
    display: 'flex',
    gap: '1rem',
  },
  socialIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    transition: 'background 0.2s',
    cursor: 'pointer',
  },
  footerHeading: {
    fontSize: '0.875rem',
    fontWeight: 700,
    letterSpacing: '0.05em',
    color: 'white',
    marginBottom: '0.5rem',
  },
  footerList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.625rem',
  },
  footerLink: {
    color: '#CBD5E1',
    textDecoration: 'none',
    fontSize: '0.9375rem',
    transition: 'color 0.2s',
  },
  contactList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.875rem',
  },
  contactItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    color: '#CBD5E1',
    fontSize: '0.9375rem',
  },
  newsletter: {
    marginTop: '1rem',
  },
  newsletterHeading: {
    fontSize: '0.875rem',
    fontWeight: 700,
    color: 'white',
    marginBottom: '0.75rem',
  },
  newsletterForm: {
    display: 'flex',
    gap: '0.5rem',
  },
  newsletterInput: {
    flex: 1,
    background: 'white',
    border: 'none',
    padding: '0.625rem',
    borderRadius: '6px',
  },
  newsletterButton: {
    background: '#FF6B00',
    color: 'white',
    padding: '0.625rem 1.5rem',
    border: 'none',
    borderRadius: '6px',
    fontWeight: 600,
    cursor: 'pointer',
  },
  copyright: {
    borderTop: '1px solid rgba(255,255,255,0.1)',
    paddingTop: '2rem',
    textAlign: 'center',
  },
};
