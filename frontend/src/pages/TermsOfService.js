import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';

export default function TermsOfService() {
  const { t } = useLanguage();

  return (
    <div style={styles.page}>
      <div className="container" style={styles.content}>
        <h1 style={styles.title}>Términos de Servicio</h1>
        <p style={styles.lastUpdated}>Última actualización: Octubre 2025</p>

        <section style={styles.section}>
          <h2 style={styles.subtitle}>1. Aceptación de los términos</h2>
          <p style={styles.text}>
            Al acceder y utilizar PaseosLugo, usted acepta estar sujeto a estos Términos de Servicio. 
            Si no está de acuerdo con alguna parte de los términos, no podrá utilizar nuestros servicios.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.subtitle}>2. Servicios ofrecidos</h2>
          <p style={styles.text}>
            PaseosLugo ofrece servicios de:
          </p>
          <ul style={styles.list}>
            <li>Paseo de perros y gatos</li>
            <li>Cuidado de mascotas a domicilio</li>
            <li>Conexión entre dueños de mascotas y paseadores verificados</li>
            <li>Seguimiento GPS en tiempo real durante los paseos</li>
          </ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.subtitle}>3. Reservas y pagos</h2>
          <p style={styles.text}>
            <strong>Reservas:</strong> Todas las reservas deben realizarse a través de nuestra plataforma 
            y requieren pago anticipado para ser confirmadas.
          </p>
          <p style={styles.text}>
            <strong>Pago obligatorio:</strong> El pago es obligatorio en el momento de la reserva. 
            Aceptamos pagos a través de Stripe.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.subtitle}>4. Política de cancelación y reembolsos</h2>
          <div style={styles.highlightBox}>
            <p style={styles.text}>
              <strong>Cancelación con más de 2 horas de antelación:</strong><br />
              Se reembolsará el importe total de la reserva menos 3€ de gastos de gestión.
            </p>
            <p style={styles.text}>
              <strong>Cancelación con menos de 2 horas de antelación:</strong><br />
              Se cobrará el importe completo del servicio. No se realizarán reembolsos.
            </p>
            <p style={styles.text}>
              <strong>Tiempo de reembolso:</strong><br />
              Los reembolsos aprobados se procesan en un plazo de 5-10 días hábiles.
            </p>
          </div>
        </section>

        <section style={styles.section}>
          <h2 style={styles.subtitle}>5. Responsabilidades del cliente</h2>
          <p style={styles.text}>
            Como cliente, usted se compromete a:
          </p>
          <ul style={styles.list}>
            <li>Proporcionar información precisa sobre su mascota</li>
            <li>Informar sobre cualquier condición médica o comportamiento especial</li>
            <li>Asegurar que su mascota esté al día con sus vacunas</li>
            <li>Estar disponible durante el horario reservado</li>
            <li>Respetar las políticas de cancelación</li>
          </ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.subtitle}>6. Responsabilidades de los paseadores</h2>
          <p style={styles.text}>
            Nuestros paseadores están verificados y se comprometen a:
          </p>
          <ul style={styles.list}>
            <li>Proporcionar un servicio profesional y amoroso</li>
            <li>Mantener la seguridad de su mascota en todo momento</li>
            <li>Seguir las instrucciones específicas proporcionadas</li>
            <li>Compartir actualizaciones mediante el seguimiento GPS</li>
            <li>Informar inmediatamente sobre cualquier incidente</li>
          </ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.subtitle}>7. Seguro</h2>
          <p style={styles.text}>
            Todos nuestros paseadores están cubiertos por un seguro de responsabilidad civil. 
            Sin embargo, recomendamos que los dueños mantengan su propio seguro de mascotas.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.subtitle}>8. Limitación de responsabilidad</h2>
          <p style={styles.text}>
            PaseosLugo actúa como intermediario entre clientes y paseadores. 
            No nos hacemos responsables de daños directos o indirectos derivados del uso del servicio, 
            excepto donde la ley lo requiera.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.subtitle}>9. Modificación de términos</h2>
          <p style={styles.text}>
            Nos reservamos el derecho de modificar estos términos en cualquier momento. 
            Los cambios se notificarán a través de la plataforma y entrarán en vigor inmediatamente.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.subtitle}>10. Contacto</h2>
          <p style={styles.text}>
            Para consultas sobre estos términos, contáctenos en: 
            <a href="mailto:legal@paseoslugo.com" style={styles.link}>legal@paseoslugo.com</a>
          </p>
        </section>

        <div style={styles.footer}>
          <Link to="/privacidad" style={styles.link}>Política de Privacidad</Link>
          {' • '}
          <Link to="/cookies" style={styles.link}>Política de Cookies</Link>
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
  highlightBox: {
    background: '#FFF5EF',
    border: '2px solid #FF6B00',
    borderRadius: '12px',
    padding: '1.5rem',
    marginTop: '1rem',
  },
  link: {
    color: '#FF6B00',
    textDecoration: 'none',
    fontWeight: 500,
  },
  footer: {
    textAlign: 'center',
    marginTop: '3rem',
    paddingTop: '2rem',
    borderTop: '1px solid #E5E7EB',
    fontSize: '0.9375rem',
  },
};