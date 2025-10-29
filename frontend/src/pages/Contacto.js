import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { toast } from 'sonner';

export default function Contacto() {
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate sending (in production, this would call backend)
    setTimeout(() => {
      toast.success(t('contact.success') || '¡Mensaje enviado! Te responderemos pronto.');
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
      setLoading(false);
    }, 1000);
  };

  return (
    <div style={styles.page}>
      <div className="container">
        <div style={styles.hero}>
          <h1 style={styles.title}>{t('nav.contact') || 'Contacto'}</h1>
          <p style={styles.subtitle}>
            {t('contact.subtitle') || '¿Tienes alguna pregunta? Estamos aquí para ayudarte'}
          </p>
        </div>

        <div style={styles.content}>
          <div style={styles.infoSection}>
            <Card style={styles.infoCard}>
              <div style={styles.infoIcon}>
                <Mail size={24} color="#FF6B00" />
              </div>
              <h3 style={styles.infoTitle}>Email</h3>
              <a href="mailto:info@paseoslugo.com" style={styles.infoLink}>
                info@paseoslugo.com
              </a>
            </Card>

            <Card style={styles.infoCard}>
              <div style={styles.infoIcon}>
                <Phone size={24} color="#FF6B00" />
              </div>
              <h3 style={styles.infoTitle}>Teléfono</h3>
              <a href="tel:+34642123169" style={styles.infoLink}>
                +34 642 123 169
              </a>
            </Card>

            <Card style={styles.infoCard}>
              <div style={styles.infoIcon}>
                <MapPin size={24} color="#FF6B00" />
              </div>
              <h3 style={styles.infoTitle}>Dirección</h3>
              <p style={styles.infoText}>
                Centro de Lugo<br />
                Lugo, Galicia
              </p>
            </Card>
          </div>

          <Card style={styles.formCard}>
            <h2 style={styles.formTitle}>
              {t('contact.formTitle') || 'Envíanos un mensaje'}
            </h2>
            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.fieldGroup}>
                <Label htmlFor="name">{t('contact.name') || 'Nombre'}</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Tu nombre"
                />
              </div>

              <div style={styles.fieldGroup}>
                <Label htmlFor="email">{t('contact.email') || 'Email'}</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="tu@email.com"
                />
              </div>

              <div style={styles.fieldGroup}>
                <Label htmlFor="subject">{t('contact.subject') || 'Asunto'}</Label>
                <Input
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                  placeholder="¿En qué podemos ayudarte?"
                />
              </div>

              <div style={styles.fieldGroup}>
                <Label htmlFor="message">{t('contact.message') || 'Mensaje'}</Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows={6}
                  placeholder="Escribe tu mensaje aquí..."
                  style={styles.textarea}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading}
                style={styles.submitButton}
              >
                <Send size={18} style={{ marginRight: '0.5rem' }} />
                {loading ? 'Enviando...' : (t('contact.send') || 'Enviar mensaje')}
              </Button>
            </form>
          </Card>
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
  hero: {
    textAlign: 'center',
    marginBottom: '3rem',
  },
  title: {
    fontSize: '3rem',
    fontWeight: 700,
    color: '#1a1a1a',
    marginBottom: '1rem',
  },
  subtitle: {
    fontSize: '1.25rem',
    color: '#666',
  },
  content: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '3rem',
    maxWidth: '1000px',
    margin: '0 auto',
  },
  infoSection: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
  },
  infoCard: {
    padding: '2rem',
    textAlign: 'center',
  },
  infoIcon: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    background: '#FFE8D6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 1rem',
  },
  infoTitle: {
    fontSize: '1.25rem',
    fontWeight: 600,
    marginBottom: '0.5rem',
    color: '#1a1a1a',
  },
  infoLink: {
    color: '#FF6B00',
    textDecoration: 'none',
    fontWeight: 500,
  },
  infoText: {
    color: '#666',
    lineHeight: 1.6,
  },
  formCard: {
    padding: '2.5rem',
  },
  formTitle: {
    fontSize: '1.75rem',
    fontWeight: 600,
    marginBottom: '2rem',
    color: '#1a1a1a',
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
  textarea: {
    resize: 'vertical',
  },
  submitButton: {
    marginTop: '1rem',
  },
};
