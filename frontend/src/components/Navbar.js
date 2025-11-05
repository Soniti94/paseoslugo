import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Dog, Menu, X, MessageSquare, ShoppingCart, UserCircle, Globe, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

export default function Navbar() {
  const navigate = useNavigate();
  const { user, login, register, logout } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');

  const handleNavClick = (path) => {
    navigate(path);
    setShowMobileMenu(false);
  };

  const handleHowItWorksClick = (e) => {
    e.preventDefault();
    setShowMobileMenu(false);
    
    if (window.location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const section = document.getElementById('como-funciona');
        if (section) {
          section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else {
      const section = document.getElementById('como-funciona');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await login(loginEmail, loginPassword);
      toast.success('¡Bienvenido!');
      setShowAuthDialog(false);
      setLoginEmail('');
      setLoginPassword('');
    } catch (error) {
      toast.error('Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await register(registerEmail, registerPassword, registerName);
      toast.success('¡Cuenta creada con éxito!');
      setShowAuthDialog(false);
      setRegisterName('');
      setRegisterEmail('');
      setRegisterPassword('');
    } catch (error) {
      toast.error('Error al crear cuenta');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    setShowMobileMenu(false);
    navigate('/');
  };

  return (
    <>
      <nav style={styles.navbar}>
        <div className="container" style={styles.navContainer}>
          <Link to="/" style={styles.logo}>
            <Dog size={32} color="#FF6B00" />
            <span style={styles.logoText}>PaseosLugo</span>
          </Link>

          <div style={styles.desktopMenu} className="desktop-only">
            <Link to="/paseadores" style={styles.navLink}>{t('nav.walkers')}</Link>
            <a href="#como-funciona" onClick={handleHowItWorksClick} style={styles.navLink}>{t('nav.howItWorks')}</a>
            <Link to="/contacto" style={styles.navLink}>{t('nav.contact')}</Link>
          </div>

          {user ? (
            <div style={styles.userMenuDesktop} className="desktop-only">
              <button onClick={() => navigate('/mensajes')} style={styles.iconButton}>
                <MessageSquare size={20} />
              </button>
              <button onClick={() => navigate('/mis-reservas')} style={styles.iconButton}>
                <ShoppingCart size={20} />
              </button>
              <button onClick={() => navigate('/perfil')} style={styles.iconButton}>
                <UserCircle size={20} />
              </button>
              <button onClick={handleLogout} style={{...styles.iconButton, color: '#EF4444'}}>
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <div className="desktop-only">
              <Button onClick={() => setShowAuthDialog(true)}>
                Iniciar sesión
              </Button>
            </div>
          )}

          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger style={styles.languageSelector}>
              <Globe size={16} style={{ marginRight: '0.5rem' }} />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="es">Español</SelectItem>
              <SelectItem value="gl">Galego</SelectItem>
              <SelectItem value="en">English</SelectItem>
            </SelectContent>
          </Select>

          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            style={styles.mobileMenuButton}
            className="mobile-only"
          >
            {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {showMobileMenu && (
          <div style={styles.mobileMenu} className="mobile-only">
            <Link to="/paseadores" style={styles.mobileLink} onClick={() => handleNavClick('/paseadores')}>
              {t('nav.walkers')}
            </Link>
            <a href="#como-funciona" style={styles.mobileLink} onClick={handleHowItWorksClick}>
              {t('nav.howItWorks')}
            </a>
            <Link to="/contacto" style={styles.mobileLink} onClick={() => handleNavClick('/contacto')}>
              {t('nav.contact')}
            </Link>

            {user ? (
              <>
                <div style={styles.mobileDivider}></div>
                <div style={styles.mobileUserInfo}>
                  <span>{user.name}</span>
                </div>
                <Link to="/mensajes" style={styles.mobileLink} onClick={() => handleNavClick('/mensajes')}>
                  💬 Mensajes
                </Link>
                <Link to="/mis-reservas" style={styles.mobileLink} onClick={() => handleNavClick('/mis-reservas')}>
                  🛒 Reservas
                </Link>
                <Link to="/perfil" style={styles.mobileLink} onClick={() => handleNavClick('/perfil')}>
                  👤 Perfil
                </Link>
                <button onClick={handleLogout} style={{...styles.mobileLink, ...styles.logoutButton}}>
                  <LogOut size={18} />
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <div style={styles.mobileDivider}></div>
                <button
                  onClick={() => {
                    setShowMobileMenu(false);
                    setShowAuthDialog(true);
                  }}
                  style={styles.mobileAuthButton}
                >
                  Iniciar sesión
                </button>
              </>
            )}
          </div>
        )}
      </nav>

      <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Iniciar sesión o registrarse</DialogTitle>
          </DialogHeader>
          
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Iniciar sesión</TabsTrigger>
              <TabsTrigger value="register">Registrarse</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="loginEmail">Email</Label>
                  <Input
                    id="loginEmail"
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="loginPassword">Contraseña</Label>
                  <Input
                    id="loginPassword"
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                  />
                </div>
                
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Iniciando...' : 'Iniciar sesión'}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="registerName">Nombre</Label>
                  <Input
                    id="registerName"
                    value={registerName}
                    onChange={(e) => setRegisterName(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="registerEmail">Email</Label>
                  <Input
                    id="registerEmail"
                    type="email"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="registerPassword">Contraseña</Label>
                  <Input
                    id="registerPassword"
                    type="password"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    required
                  />
                </div>
                
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Creando...' : 'Crear cuenta'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
}

const styles = {
  navbar: {
    backgroundColor: 'white',
    borderBottom: '1px solid #E5E5E5',
    position: 'sticky',
    top: 0,
    zIndex: 50,
  },
  navContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1rem 0',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
  },
  logoText: {
    fontSize: '1.5rem',
    fontWeight: 700,
    marginLeft: '0.5rem',
    color: '#1a1a1a',
  },
  desktopMenu: {
    display: 'flex',
    gap: '2rem',
  },
  navLink: {
    textDecoration: 'none',
    color: '#666',
    fontWeight: 500,
    transition: 'color 0.2s',
  },
  userMenuDesktop: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  iconButton: {
    background: 'none',
    border: 'none',
    padding: '0.5rem',
    borderRadius: '50%',
    cursor: 'pointer',
    color: '#666',
    transition: 'all 0.2s',
  },
  languageSelector: {
    width: '120px',
    fontSize: '0.875rem',
  },
  mobileMenuButton: {
    background: 'none',
    border: 'none',
    padding: '0.5rem',
    cursor: 'pointer',
    color: '#666',
  },
  mobileMenu: {
    backgroundColor: 'white',
    borderTop: '1px solid #E5E5E5',
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  mobileLink: {
    textDecoration: 'none',
    color: '#666',
    padding: '0.75rem',
    borderRadius: '8px',
    transition: 'background-color 0.2s',
  },
  mobileDivider: {
    height: '1px',
    backgroundColor: '#E5E5E5',
    margin: '0.5rem 0',
  },
  mobileUserInfo: {
    padding: '0.5rem 0.75rem',
    fontSize: '0.875rem',
    color: '#666',
    fontWeight: 500,
  },
  logoutButton: {
    background: 'none',
    border: 'none',
    textAlign: 'left',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: '#EF4444',
  },
  mobileAuthButton: {
    background: '#FF6B00',
    color: 'white',
    border: 'none',
    padding: '0.75rem',
    borderRadius: '8px',
    fontWeight: 500,
    cursor: 'pointer',
  },
};
