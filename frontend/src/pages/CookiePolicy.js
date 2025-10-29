import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';

export default function CookiePolicy() {
  const { t } = useLanguage();

  return (
    <div style={styles.page}>
      <div className="container" style={styles.content}>
        <h1 style={styles.title}>Política de Cookies</h1>
        <p style={styles.lastUpdated}>Última actualización: Octubre 2025</p>

        <section style={styles.section}>
          <h2 style={styles.subtitle}>1. ¿Qué son las cookies?</h2>
          <p style={styles.text}>
            Las cookies son pequeños archivos de texto que se almacenan en su dispositivo cuando 
            visita nuestro sitio web. Nos ayudan a mejorar su experiencia y proporcionar funcionalidades esenciales.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.subtitle}>2. ¿Cómo usamos las cookies?</h2>
          <p style={styles.text}>
            En PaseosLugo utilizamos cookies para:
          </p>
          <ul style={styles.list}>
            <li>Mantener su sesión iniciada</li>
            <li>Recordar sus preferencias (idioma, configuración)</li>
            <li>Mejorar el rendimiento del sitio</li>
            <li>Analizar el uso del sitio para mejoras futuras</li>
            <li>Proporcionar contenido personalizado</li>
          </ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.subtitle}>3. Tipos de cookies que utilizamos</h2>
          
          <div style={styles.cookieType}>
            <h3 style={styles.cookieTitle}>Cookies esenciales</h3>
            <p style={styles.text}>
              Necesarias para el funcionamiento básico del sitio. No se pueden desactivar.
            </p>
            <ul style={styles.list}>
              <li><strong>session_token:</strong> Mantiene su sesión activa</li>
              <li><strong>language:</strong> Guarda su preferencia de idioma</li>
            </ul>
          </div>

          <div style={styles.cookieType}>
            <h3 style={styles.cookieTitle}>Cookies analíticas</h3>
            <p style={styles.text}>
              Nos ayudan a entender cómo interactúa con nuestro sitio.
            </p>
            <ul style={styles.list}>
              <li><strong>Google Maps:</strong> Proporciona funcionalidad de mapas y seguimiento GPS</li>
            </ul>
          </div>

          <div style={styles.cookieType}>
            <h3 style={styles.cookieTitle}>Cookies de terceros</h3>
            <p style={styles.text}>
              Servicios externos que utilizamos para mejorar la funcionalidad.
            </p>
            <ul style={styles.list}>
              <li><strong>Stripe:</strong> Procesamiento seguro de pagos</li>
              <li><strong>Google OAuth:</strong> Inicio de sesión con Google</li>
            </ul>
          </div>
        </section>

        <section style={styles.section}>
          <h2 style={styles.subtitle}>4. Duración de las cookies</h2>
          <p style={styles.text}>
            <strong>Cookies de sesión:</strong> Se eliminan cuando cierra su navegador.<br />
            <strong>Cookies persistentes:</strong> Permanecen hasta 7 días o hasta que las elimine manualmente.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.subtitle}>5. Cómo gestionar cookies</h2>
          <p style={styles.text}>
            Puede controlar y eliminar cookies a través de la configuración de su navegador:
          </p>
          <ul style={styles.list}>
            <li><strong>Chrome:</strong> Configuración → Privacidad y seguridad → Cookies</li>
            <li><strong>Firefox:</strong> Opciones → Privacidad y seguridad → Cookies</li>
            <li><strong>Safari:</strong> Preferencias → Privacidad → Cookies</li>
            <li><strong>Edge:</strong> Configuración → Cookies y permisos del sitio</li>
          </ul>
          <p style={styles.text}>
            <strong>Nota:</strong> Bloquear todas las cookies puede afectar la funcionalidad del sitio.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.subtitle}>6. Actualizaciones de esta política</h2>
          <p style={styles.text}>
            Podemos actualizar esta política de cookies ocasionalmente. Le notificaremos 
            cualquier cambio significativo mediante un aviso en nuestro sitio web.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.subtitle}>7. Contacto</h2>
          <p style={styles.text}>
            Si tiene preguntas sobre nuestra política de cookies, contáctenos en: 
            <a href="mailto:privacidad@paseoslugo.com" style={styles.link}>privacidad@paseoslugo.com</a>
          </p>
        </section>

        <div style={styles.footer}>
          <Link to="/privacidad" style={styles.link}>Política de Privacidad</Link>
          {' • '}
          <Link to="/terminos" style={styles.link}>Términos de Servicio</Link>
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
    marginBottom: '1rem',
  },
  cookieType: {
    background: '#F9FAFB',
    padding: '1.5rem',
    borderRadius: '12px',
    marginBottom: '1.5rem',
  },
  cookieTitle: {
    fontSize: '1.125rem',
    fontWeight: 600,
    marginBottom: '0.75rem',
    color: '#FF6B00',
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