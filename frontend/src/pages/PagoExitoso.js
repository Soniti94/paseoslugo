import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { CheckCircle, Loader2, XCircle } from 'lucide-react';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function PagoExitoso() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  
  const [paymentStatus, setPaymentStatus] = useState('checking'); // checking, success, failed, timeout
  const [attempts, setAttempts] = useState(0);
  const maxAttempts = 10;

  useEffect(() => {
    if (sessionId && token) {
      pollPaymentStatus();
    } else if (!sessionId) {
      setPaymentStatus('failed');
    }
  }, [sessionId, token]);

  const pollPaymentStatus = async (currentAttempt = 0) => {
    if (currentAttempt >= maxAttempts) {
      setPaymentStatus('timeout');
      return;
    }

    try {
      const response = await axios.get(
        `${API}/payments/checkout/status/${sessionId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.payment_status === 'paid') {
        setPaymentStatus('success');
      } else if (response.data.status === 'expired') {
        setPaymentStatus('failed');
      } else {
        // Continue polling
        setTimeout(() => {
          setAttempts(currentAttempt + 1);
          pollPaymentStatus(currentAttempt + 1);
        }, 2000); // Poll every 2 seconds
      }
    } catch (error) {
      console.error('Error checking payment status:', error);
      // Retry on error
      setTimeout(() => {
        setAttempts(currentAttempt + 1);
        pollPaymentStatus(currentAttempt + 1);
      }, 2000);
    }
  };

  const renderContent = () => {
    if (paymentStatus === 'checking') {
      return (
        <>
          <div style={styles.iconCircle}>
            <Loader2 size={64} color="#FF6B00" className="animate-spin" />
          </div>
          <h1 style={styles.title}>Verificando pago...</h1>
          <p style={styles.message}>
            Estamos confirmando tu pago. Por favor espera un momento.
          </p>
        </>
      );
    }

    if (paymentStatus === 'success') {
      return (
        <>
          <div style={{...styles.iconCircle, background: '#D1FAE5'}}>
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
        </>
      );
    }

    if (paymentStatus === 'timeout') {
      return (
        <>
          <div style={{...styles.iconCircle, background: '#FEF3C7'}}>
            <Loader2 size={64} color="#F59E0B" />
          </div>
          <h1 style={styles.title}>Verificación en progreso</h1>
          <p style={styles.message}>
            La verificación del pago está tomando más tiempo de lo esperado. 
            Por favor revisa tu email para la confirmación o contacta con nosotros.
          </p>
          <div style={styles.actions}>
            <Button
              onClick={() => navigate('/mis-reservas')}
              style={styles.primaryBtn}
            >
              Ver mis reservas
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/contacto')}
            >
              Contactar soporte
            </Button>
          </div>
        </>
      );
    }

    // Failed
    return (
      <>
        <div style={{...styles.iconCircle, background: '#FEE2E2'}}>
          <XCircle size={64} color="#EF4444" />
        </div>
        <h1 style={styles.title}>Pago no completado</h1>
        <p style={styles.message}>
          No pudimos confirmar tu pago. Por favor intenta nuevamente o contacta con soporte.
        </p>
        <div style={styles.actions}>
          <Button
            onClick={() => navigate('/paseadores')}
            style={styles.primaryBtn}
          >
            Intentar nuevamente
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/contacto')}
          >
            Contactar soporte
          </Button>
        </div>
      </>
    );
  };

  return (
    <div style={styles.page}>
      <div className="container" style={styles.content}>
        <div style={styles.card}>
          {renderContent()}
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