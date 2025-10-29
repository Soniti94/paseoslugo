import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { User, Mail, Phone, MapPin, Edit, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function Perfil() {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [pets, setPets] = useState([]);
  const [showAddPet, setShowAddPet] = useState(false);

  // User data
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  // Pet data
  const [petName, setPetName] = useState('');
  const [petType, setPetType] = useState('dog');
  const [petBreed, setPetBreed] = useState('');
  const [petWeight, setPetWeight] = useState('');
  const [petAge, setPetAge] = useState('');

  useEffect(() => {
    if (!token) {
      navigate('/');
      return;
    }
    loadProfile();
    loadPets();
  }, [token]);

  const loadProfile = async () => {
    try {
      const response = await axios.get(`${API}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setName(response.data.name);
      setEmail(response.data.email);
      setPhone(response.data.phone || '');
      setAddress(response.data.address || '');
    } catch (err) {
      toast.error('Error al cargar perfil');
    } finally {
      setLoading(false);
    }
  };

  const loadPets = async () => {
    try {
      const response = await axios.get(`${API}/dogs`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPets(response.data);
    } catch (err) {
      console.error('Error loading pets');
    }
  };

  const handleSaveProfile = async () => {
    try {
      await axios.patch(
        `${API}/auth/me`,
        {
          name,
          phone,
          address,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(t('profile.saved') || 'Perfil actualizado');
      setEditing(false);
    } catch (err) {
      toast.error('Error al actualizar perfil');
    }
  };

  const handleAddPet = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${API}/dogs`,
        {
          name: petName,
          breed: petBreed,
          size: petType === 'dog' ? 'Mediano' : 'Pequeño',
          age: parseInt(petAge) || null,
          special_needs: [],
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(t('profile.petAdded') || 'Mascota añadida');
      setShowAddPet(false);
      setPetName('');
      setPetBreed('');
      setPetWeight('');
      setPetAge('');
      loadPets();
    } catch (err) {
      toast.error('Error al añadir mascota');
    }
  };

  if (loading) {
    return <div style={styles.loading}>{t('common.loading')}</div>;
  }

  return (
    <div style={styles.page}>
      <div className="container">
        <h1 style={styles.title}>{t('profile.title')}</h1>

        <Tabs defaultValue="personal" style={styles.tabs}>
          <TabsList>
            <TabsTrigger value="personal">{t('profile.personalInfo')}</TabsTrigger>
            <TabsTrigger value="pets">{t('profile.myPets')}</TabsTrigger>
          </TabsList>

          <TabsContent value="personal">
            <Card style={styles.card}>
              <div style={styles.cardHeader}>
                <h2 style={styles.cardTitle}>{t('profile.personalInfo')}</h2>
                <Button
                  variant="outline"
                  onClick={() => editing ? handleSaveProfile() : setEditing(true)}
                  data-testid="edit-profile-btn"
                >
                  <Edit size={16} style={{ marginRight: '0.5rem' }} />
                  {editing ? t('common.save') : t('common.edit')}
                </Button>
              </div>

              <div style={styles.form}>
                <div style={styles.fieldGroup}>
                  <Label htmlFor="name">{t('profile.name')}</Label>
                  <div style={styles.inputWithIcon}>
                    <User size={18} style={styles.icon} />
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={!editing}
                      data-testid="name-input"
                    />
                  </div>
                </div>

                <div style={styles.fieldGroup}>
                  <Label htmlFor="email">{t('profile.email')}</Label>
                  <div style={styles.inputWithIcon}>
                    <Mail size={18} style={styles.icon} />
                    <Input
                      id="email"
                      value={email}
                      disabled
                      data-testid="email-input"
                    />
                  </div>
                </div>

                <div style={styles.fieldGroup}>
                  <Label htmlFor="phone">{t('profile.phone')}</Label>
                  <div style={styles.inputWithIcon}>
                    <Phone size={18} style={styles.icon} />
                    <Input
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      disabled={!editing}
                      data-testid="phone-input"
                    />
                  </div>
                </div>

                <div style={styles.fieldGroup}>
                  <Label htmlFor="address">{t('profile.address')}</Label>
                  <div style={styles.inputWithIcon}>
                    <MapPin size={18} style={styles.icon} />
                    <Input
                      id="address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      disabled={!editing}
                      data-testid="address-input"
                    />
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="pets">
            <Card style={styles.card}>
              <div style={styles.cardHeader}>
                <h2 style={styles.cardTitle}>{t('profile.myPets')}</h2>
                <Dialog open={showAddPet} onOpenChange={setShowAddPet}>
                  <DialogTrigger asChild>
                    <Button data-testid="add-pet-btn">
                      <Plus size={16} style={{ marginRight: '0.5rem' }} />
                      {t('profile.addPet')}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{t('profile.addPet')}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleAddPet} style={styles.form}>
                      <div style={styles.fieldGroup}>
                        <Label htmlFor="pet-name">{t('hero.petName')}</Label>
                        <Input
                          id="pet-name"
                          value={petName}
                          onChange={(e) => setPetName(e.target.value)}
                          required
                        />
                      </div>
                      <div style={styles.fieldGroup}>
                        <Label htmlFor="pet-breed">{t('hero.petBreed')}</Label>
                        <Input
                          id="pet-breed"
                          value={petBreed}
                          onChange={(e) => setPetBreed(e.target.value)}
                          required
                        />
                      </div>
                      <div style={styles.fieldGroup}>
                        <Label htmlFor="pet-age">{t('hero.petAge')}</Label>
                        <Input
                          id="pet-age"
                          type="number"
                          value={petAge}
                          onChange={(e) => setPetAge(e.target.value)}
                        />
                      </div>
                      <Button type="submit" className="w-full">
                        {t('profile.addPet')}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              <div style={styles.petsGrid}>
                {pets.map((pet) => (
                  <div key={pet.id} style={styles.petCard}>
                    <div style={styles.petAvatar}>{pet.name.charAt(0)}</div>
                    <div style={styles.petInfo}>
                      <h4 style={styles.petName}>{pet.name}</h4>
                      <p style={styles.petDetails}>
                        {pet.breed || pet.size} {pet.age ? `• ${pet.age} años` : ''}
                      </p>
                    </div>
                  </div>
                ))}
                {pets.length === 0 && (
                  <p style={styles.noPets}>{t('profile.noPets') || 'No tienes mascotas registradas'}</p>
                )}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
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
  title: {
    fontSize: '2.5rem',
    fontWeight: 700,
    marginBottom: '2rem',
    color: '#1a1a1a',
  },
  tabs: {
    marginTop: '2rem',
  },
  card: {
    padding: '2rem',
    marginTop: '1.5rem',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
  },
  cardTitle: {
    fontSize: '1.5rem',
    fontWeight: 600,
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
  inputWithIcon: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  icon: {
    position: 'absolute',
    left: '0.75rem',
    color: '#666',
  },
  petsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '1.5rem',
  },
  petCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem',
    background: '#F9FAFB',
    borderRadius: '12px',
  },
  petAvatar: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    background: '#FFE8D6',
    color: '#FF6B00',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem',
    fontWeight: 700,
  },
  petInfo: {
    flex: 1,
  },
  petName: {
    fontSize: '1.125rem',
    fontWeight: 600,
    marginBottom: '0.25rem',
    color: '#1a1a1a',
  },
  petDetails: {
    fontSize: '0.875rem',
    color: '#666',
  },
  noPets: {
    textAlign: 'center',
    padding: '3rem',
    color: '#666',
    gridColumn: '1 / -1',
  },
};