import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

export default function PagoExitoso() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');

  return (
    <div style={styles.page}>
      <div className="container" style={styles.content}>
        <div style={styles.card}>
          <div style={styles.iconCircle}>
            <CheckCircle size={64} color="#10B981" />
          </div>
          
          <h1 style={styles.title} data-testid="success-title">¡Pago exitoso!</h1>
          <p style={styles.message}>
            Tu reserva ha sido confirmada. El paseador recibirá la notificación y podrás
            ver los detalles en tu sección de reservas.
          </p>
          
          {sessionId && (
            <p style={styles.sessionId}>ID de sesión: {sessionId.substring(0, 20)}...</p>
          )}
          
          <div style={styles.actions}>
            <Button
              onClick={() => navigate('/mis-reservas')}
              style={styles.primaryBtn}
              data-testid="ver-reservas-btn"
            >
              Ver mis reservas
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/paseadores')}
              data-testid="nueva-reserva-btn"
            >
              Hacer otra reserva
            </Button>
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
    padding: '5rem 0',
  },
  content: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    background: 'white',
    padding: '4rem 3rem',
    borderRadius: '20px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    textAlign: 'center',
    maxWidth: '600px',
  },
  iconCircle: {
    width: '120px',
    height: '120px',
    background: '#D1FAE5',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 2rem',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: 700,
    marginBottom: '1rem',
    color: '#1a1a1a',
  },
  message: {
    fontSize: '1.125rem',
    color: '#666',
    marginBottom: '2rem',
    lineHeight: 1.7,
  },
  sessionId: {
    fontSize: '0.875rem',
    color: '#999',
    marginBottom: '2.5rem',
    fontFamily: 'monospace',
  },
  actions: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
  },
  primaryBtn: {
    background: '#FF6B00',
    color: 'white',
    padding: '1rem 2rem',
  },
};