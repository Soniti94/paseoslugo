import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card } from '@/components/ui/card';
import { Bell, MessageCircle, CheckCircle, XCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function Mensajes() {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const { t } = useLanguage();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate('/');
      return;
    }
    loadMessages();
  }, [token]);

  const loadMessages = async () => {
    // Simulated messages - in production, fetch from backend
    const mockMessages = [
      {
        id: '1',
        type: 'booking_confirmed',
        title: 'Reserva confirmada',
        message: 'Tu reserva para el 15 de Noviembre ha sido confirmada con Sonia Sánchez.',
        date: new Date(),
        read: false,
      },
      {
        id: '2',
        type: 'message',
        title: 'Nuevo mensaje de Sonia',
        message: '¡Hola! Confirmo que estaré allí a las 10:00. ¿Hay algo especial que deba saber sobre tu perro?',
        date: new Date(Date.now() - 86400000),
        read: true,
      },
    ];
    setMessages(mockMessages);
    setLoading(false);
  };

  const getIcon = (type) => {
    switch (type) {
      case 'booking_confirmed':
        return <CheckCircle size={24} color="#10B981" />;
      case 'booking_cancelled':
        return <XCircle size={24} color="#EF4444" />;
      case 'message':
        return <MessageCircle size={24} color="#3B82F6" />;
      default:
        return <Bell size={24} color="#666" />;
    }
  };

  if (loading) {
    return <div style={styles.loading}>{t('common.loading')}</div>;
  }

  return (
    <div style={styles.page}>
      <div className="container">
        <div style={styles.header}>
          <h1 style={styles.title}>{t('nav.messages')}</h1>
          <div style={styles.badge}>{messages.filter(m => !m.read).length} nuevos</div>
        </div>

        <div style={styles.messagesList}>
          {messages.map((message) => (
            <Card key={message.id} style={{...styles.messageCard, ...(message.read ? {} : styles.unreadCard)}}>
              <div style={styles.messageIcon}>{getIcon(message.type)}</div>
              <div style={styles.messageContent}>
                <h3 style={styles.messageTitle}>{message.title}</h3>
                <p style={styles.messageText}>{message.message}</p>
                <div style={styles.messageFooter}>
                  <Clock size={14} />
                  <span>{format(message.date, 'PPp', { locale: es })}</span>
                </div>
              </div>
            </Card>
          ))}

          {messages.length === 0 && (
            <div style={styles.noMessages}>
              <Bell size={48} color="#CCC" />
              <p>No tienes mensajes</p>
            </div>
          )}
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
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: 700,
    color: '#1a1a1a',
  },
  badge: {
    background: '#FF6B00',
    color: 'white',
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    fontSize: '0.875rem',
    fontWeight: 600,
  },
  messagesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  messageCard: {
    display: 'flex',
    gap: '1.5rem',
    padding: '1.5rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  unreadCard: {
    background: '#FFF5EF',
    borderLeft: '4px solid #FF6B00',
  },
  messageIcon: {
    flexShrink: 0,
  },
  messageContent: {
    flex: 1,
  },
  messageTitle: {
    fontSize: '1.125rem',
    fontWeight: 600,
    marginBottom: '0.5rem',
    color: '#1a1a1a',
  },
  messageText: {
    fontSize: '0.9375rem',
    color: '#666',
    marginBottom: '0.75rem',
    lineHeight: 1.6,
  },
  messageFooter: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.8125rem',
    color: '#999',
  },
  noMessages: {
    textAlign: 'center',
    padding: '5rem',
    color: '#999',
  },
};