import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarIcon, Dog as DogIcon, Cat } from 'lucide-react';
import { toast } from 'sonner';

export default function HeroBooking() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user } = useAuth();

  const [petType, setPetType] = useState('dog');
  const [serviceType, setServiceType] = useState('walk');
  const [address, setAddress] = useState('');
  const [date, setDate] = useState(null);
  const [time, setTime] = useState('10:00');
  const [petName, setPetName] = useState('');
  const [petBreed, setPetBreed] = useState('');
  const [petWeight, setPetWeight] = useState('');
  const [petAge, setPetAge] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');

  const handleBooking = () => {
    if (!user) {
      toast.error(t('hero.loginRequired') || 'Debes iniciar sesión para reservar');
      return;
    }

    if (!address || !date || !petName || !petBreed || !petWeight) {
      toast.error('Por favor completa todos los campos obligatorios');
      return;
    }

    // Guardar datos en sessionStorage
    sessionStorage.setItem('bookingData', JSON.stringify({
      petType,
      serviceType,
      address,
      date: format(date, 'yyyy-MM-dd'),
      time,
      petName,
      petBreed,
      petWeight,
      petAge,
      additionalInfo,
    }));

    navigate('/paseadores');
  };

  return (
    <section style={styles.hero}>
      <div style={styles.heroContent}>
        <div style={styles.textSection}>
          <h1 style={styles.title}>
            {t('hero.title')} <span style={styles.highlight}>{t('hero.subtitle')}</span>
          </h1>
          <p style={styles.subtitle}>{t('hero.description')}</p>
        </div>

        <div style={styles.bookingCard}>
          {/* Pet Type Selection */}
          <div style={styles.section}>
            <Label style={styles.sectionLabel}>{t('hero.selectPet')}</Label>
            <div style={styles.buttonGroup}>
              <button
                style={{
                  ...styles.typeButton,
                  ...(petType === 'dog' ? styles.typeButtonActive : {}),
                }}
                onClick={() => setPetType('dog')}
                data-testid=\"pet-type-dog\"
              >
                <DogIcon size={24} />
                <span>{t('hero.dog')}</span>
              </button>
              <button
                style={{
                  ...styles.typeButton,
                  ...(petType === 'cat' ? styles.typeButtonActive : {}),
                }}
                onClick={() => setPetType('cat')}
                data-testid=\"pet-type-cat\"
              >
                <Cat size={24} />
                <span>{t('hero.cat')}</span>
              </button>
            </div>
          </div>

          {/* Service Type Selection */}
          <div style={styles.section}>
            <Label style={styles.sectionLabel}>{t('hero.selectService')}</Label>
            <div style={styles.buttonGroup}>
              <button
                style={{
                  ...styles.serviceButton,
                  ...(serviceType === 'walk' ? styles.serviceButtonActive : {}),
                }}
                onClick={() => setServiceType('walk')}
                data-testid=\"service-walk\"
              >
                {t('hero.walkService')}
              </button>
              <button
                style={{
                  ...styles.serviceButton,
                  ...(serviceType === 'home_care' ? styles.serviceButtonActive : {}),
                }}
                onClick={() => setServiceType('home_care')}
                data-testid=\"service-home-care\"
              >
                {t('hero.homeCareService')}
              </button>
            </div>
          </div>

          {/* Address, Date, Time */}
          <div style={styles.gridSection}>
            <div style={styles.fieldGroup}>
              <Label htmlFor=\"address\">{t('hero.address')}*</Label>
              <Input
                id=\"address\"
                placeholder={t('hero.addressPlaceholder')}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                data-testid=\"address-input\"
              />
            </div>

            <div style={styles.fieldGroup}>
              <Label>{t('hero.date')}*</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant=\"outline\"
                    style={styles.dateButton}
                    data-testid=\"date-picker\"
                  >
                    <CalendarIcon size={16} style={{ marginRight: '0.5rem' }} />
                    {date ? format(date, 'PPP', { locale: es }) : t('hero.date')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent align=\"start\">
                  <Calendar
                    mode=\"single\"
                    selected={date}
                    onSelect={setDate}
                    disabled={(date) => date < new Date()}
                    locale={es}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div style={styles.fieldGroup}>
              <Label htmlFor=\"time\">{t('hero.time')}*</Label>
              <Input
                id=\"time\"
                type=\"time\"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
                data-testid=\"time-input\"
              />
            </div>
          </div>

          {/* Pet Information */}
          <div style={styles.section}>
            <Label style={styles.sectionLabel}>{t('hero.petInfo')}</Label>
            <div style={styles.gridSection}>
              <div style={styles.fieldGroup}>
                <Label htmlFor=\"pet-name\">{t('hero.petName')}*</Label>
                <Input
                  id=\"pet-name\"
                  value={petName}
                  onChange={(e) => setPetName(e.target.value)}
                  required
                  data-testid=\"pet-name-input\"
                />
              </div>

              <div style={styles.fieldGroup}>
                <Label htmlFor=\"pet-breed\">{t('hero.petBreed')}*</Label>
                <Input
                  id=\"pet-breed\"
                  value={petBreed}
                  onChange={(e) => setPetBreed(e.target.value)}
                  required
                  data-testid=\"pet-breed-input\"
                />
              </div>

              <div style={styles.fieldGroup}>
                <Label htmlFor=\"pet-weight\">{t('hero.petWeight')}*</Label>
                <Input
                  id=\"pet-weight\"
                  type=\"number\"
                  value={petWeight}
                  onChange={(e) => setPetWeight(e.target.value)}
                  required
                  data-testid=\"pet-weight-input\"
                />
              </div>

              <div style={styles.fieldGroup}>
                <Label htmlFor=\"pet-age\">{t('hero.petAge')}</Label>
                <Input
                  id=\"pet-age\"
                  type=\"number\"
                  value={petAge}
                  onChange={(e) => setPetAge(e.target.value)}
                  data-testid=\"pet-age-input\"
                />
              </div>
            </div>

            <div style={styles.fieldGroup}>
              <Label htmlFor=\"additional-info\">{t('hero.additionalInfo')}</Label>
              <Textarea
                id=\"additional-info\"
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
                rows={3}
                data-testid=\"additional-info-textarea\"
              />
            </div>
          </div>

          {/* Book Button */}
          <Button
            onClick={handleBooking}
            style={styles.bookButton}
            className=\"w-full\"
            data-testid=\"book-now-btn\"
          >
            {t('hero.bookNow')}
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
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '3rem 1.5rem',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '3rem',
    alignItems: 'center',
    width: '100%',
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
  bookingCard: {
    background: 'white',
    borderRadius: '16px',
    padding: '2rem',
    boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
  },
  section: {
    marginBottom: '1.5rem',
  },
  sectionLabel: {
    fontSize: '1rem',
    fontWeight: 600,
    marginBottom: '0.75rem',
    display: 'block',
    color: '#1a1a1a',
  },
  buttonGroup: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '0.75rem',
  },
  typeButton: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '1rem',
    border: '2px solid #E5E7EB',
    borderRadius: '12px',
    background: 'white',
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontSize: '0.9375rem',
    fontWeight: 500,
  },
  typeButtonActive: {
    background: '#FFF5EF',
    border: '2px solid #FF6B00',
    color: '#FF6B00',
  },
  serviceButton: {
    padding: '0.875rem',
    border: '2px solid #E5E7EB',
    borderRadius: '12px',
    background: 'white',
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontSize: '0.9375rem',
    fontWeight: 500,
  },
  serviceButtonActive: {
    background: '#FFF5EF',
    border: '2px solid #FF6B00',
    color: '#FF6B00',
  },
  gridSection: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '1rem',
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  dateButton: {
    justifyContent: 'flex-start',
    width: '100%',
  },
  bookButton: {
    background: '#FF6B00',
    color: 'white',
    padding: '1.125rem',
    fontSize: '1.0625rem',
    fontWeight: 600,
    marginTop: '1rem',
  },
};
