import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';

export default function PrivacyPolicy() {
  const { t } = useLanguage();

  return (
    <div style={styles.page}>
      <div className="container" style={styles.content}>
        <h1 style={styles.title}>Política de Privacidad</h1>
        <p style={styles.lastUpdated}>Última actualización: Octubre 2025</p>

        <section style={styles.section}>
          <h2 style={styles.subtitle}>1. Información que recopilamos</h2>
          <p style={styles.text}>
            En PaseosLugo recopilamos la siguiente información:
          </p>
          <ul style={styles.list}>
            <li>Datos personales: nombre, correo electrónico, teléfono y dirección</li>
            <li>Información de mascotas: nombre, raza, peso, edad y necesidades especiales</li>
            <li>Datos de reservas: servicios contratados, fechas, horarios y ubicaciones</li>
            <li>Información de pago: gestionada de forma segura a través de Stripe</li>
            <li>Datos de localización durante el servicio (con su consentimiento)</li>
          </ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.subtitle}>2. Cómo utilizamos su información</h2>
          <p style={styles.text}>
            Utilizamos la información recopilada para:
          </p>
          <ul style={styles.list}>
            <li>Proporcionar y mejorar nuestros servicios de cuidado de mascotas</li>
            <li>Procesar reservas y pagos</li>
            <li>Comunicarnos con usted sobre sus reservas</li>
            <li>Enviar actualizaciones y notificaciones del servicio</li>
            <li>Garantizar la seguridad de su mascota mediante seguimiento GPS</li>
            <li>Cumplir con obligaciones legales y regulatorias</li>
          </ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.subtitle}>3. Compartir información</h2>
          <p style={styles.text}>
            Compartimos su información únicamente con:
          </p>
          <ul style={styles.list}>
            <li>Paseadores verificados asignados a su reserva</li>
            <li>Procesadores de pago (Stripe) para transacciones seguras</li>
            <li>Proveedores de servicios esenciales (Google Maps para tracking)</li>
            <li>Autoridades cuando sea legalmente requerido</li>
          </ul>
          <p style={styles.text}>
            Nunca vendemos su información personal a terceros.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.subtitle}>4. Seguridad de datos</h2>
          <p style={styles.text}>
            Implementamos medidas de seguridad técnicas y organizativas para proteger 
            su información personal contra acceso no autorizado, pérdida o alteración.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.subtitle}>5. Sus derechos</h2>
          <p style={styles.text}>
            Bajo el RGPD, usted tiene derecho a:
          </p>
          <ul style={styles.list}>
            <li>Acceder a sus datos personales</li>
            <li>Rectificar datos inexactos</li>
            <li>Solicitar la eliminación de sus datos</li>
            <li>Oponerse al procesamiento de sus datos</li>
            <li>Solicitar la portabilidad de sus datos</li>
            <li>Retirar su consentimiento en cualquier momento</li>
          </ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.subtitle}>6. Cookies</h2>
          <p style={styles.text}>
            Utilizamos cookies para mejorar su experiencia. Consulte nuestra{' '}
            <Link to="/cookies" style={styles.link}>Política de Cookies</Link> para más información.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.subtitle}>7. Contacto</h2>
          <p style={styles.text}>
            Para cualquier consulta sobre privacidad, contáctenos en: 
            <a href="mailto:privacidad@paseoslugo.com" style={styles.link}>privacidad@paseoslugo.com</a>
          </p>
        </section>
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
  content: {
    maxWidth: '800px',
    margin: '0 auto',
    background: 'white',
    padding: '3rem',
    borderRadius: '16px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: 700,
    marginBottom: '0.5rem',
    color: '#1a1a1a',
  },
  lastUpdated: {
    fontSize: '0.875rem',
    color: '#999',
    marginBottom: '2rem',
  },
  section: {
    marginBottom: '2.5rem',
  },
  subtitle: {
    fontSize: '1.5rem',
    fontWeight: 600,
    marginBottom: '1rem',
    color: '#1a1a1a',
  },
  text: {
    fontSize: '1rem',
    lineHeight: 1.7,
    color: '#4a4a4a',
    marginBottom: '1rem',
  },
  list: {
    paddingLeft: '1.5rem',
    lineHeight: 1.8,
    color: '#4a4a4a',
  },
  link: {
    color: '#FF6B00',
    textDecoration: 'none',
    fontWeight: 500,
  },
};