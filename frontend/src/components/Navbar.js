import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dog, LogOut, User, Menu, X, MessageSquare, ShoppingCart, UserCircle, Globe } from 'lucide-react';
import { toast } from 'sonner';

export default function Navbar() {
  const { user, logout, login, register, loginWithGoogle } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const [showAuth, setShowAuth] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regName, setRegName] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(loginEmail, loginPassword);
      setShowAuth(false);
      toast.success(t('nav.welcomeBack') || '¡Bienvenido!');
    } catch (err) {
      toast.error(t('nav.invalidCredentials') || 'Credenciales inválidas');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await register(regEmail, regPassword, regName);
      setShowAuth(false);
      toast.success(t('nav.accountCreated') || '¡Cuenta creada con éxito!');
    } catch (err) {
      toast.error(t('nav.registerError') || 'Error al registrar');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setShowMobileMenu(false);
    toast.success(t('nav.loggedOut') || 'Sesión cerrada');
  };

  const handleNavClick = (path) => {
    navigate(path);
    setShowMobileMenu(false);
  };

  const handleHowItWorksClick = (e) => {
    e.preventDefault();
    setShowMobileMenu(false);
    
    // Si no estamos en la landing, navegar primero
    if (window.location.pathname !== '/') {
      navigate('/');
      // Esperar a que la página cargue y luego hacer scroll
      setTimeout(() => {
        const section = document.getElementById('como-funciona');
        if (section) {
          section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else {
      // Ya estamos en landing, solo hacer scroll
      const section = document.getElementById('como-funciona');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <>
      <nav style={styles.navbar}>
        <div className="container" style={styles.navContainer}>
          <Link to="/" style={styles.logo} data-testid="navbar-logo">
            <Dog size={28} color="#FF6B00" />
            <span style={styles.logoText}>{t('common.appName')}</span>
          </Link>

          {/* Desktop Menu */}
          <div style={styles.desktopMenu} className="desktop-only">
            <Link to="/paseadores" style={styles.navLink} data-testid="nav-paseadores">{t('nav.walkers')}</Link>
            <Link to="/" style={styles.navLink}>{t('nav.howItWorks')}</Link>
            <Link to="/contacto" style={styles.navLink}>{t('nav.contact')}</Link>
          </div>

          {/* Desktop User Menu */}
          <div style={styles.navRight}>
            {user ? (
              <>
                <div style={styles.userMenuDesktop} className="desktop-only">
                  <button
                    onClick={() => navigate('/mensajes')}
                    style={styles.iconButton}
                    data-testid="nav-messages"
                  >
                    <MessageSquare size={20} />
                  </button>
                  <button
                    onClick={() => navigate('/mis-reservas')}
                    style={styles.iconButton}
                    data-testid="nav-cart"
                  >
                    <ShoppingCart size={20} />
                  </button>
                  <button
                    onClick={() => navigate('/perfil')}
                    style={styles.iconButton}
                    data-testid="nav-profile"
                  >
                    <UserCircle size={20} />
                  </button>
                </div>
              </>
            ) : (
              <div style={styles.desktopButtons} className="desktop-only">
                <Button onClick={() => setShowAuth(true)} style={styles.loginBtn} data-testid="nav-login-btn">
                  {t('nav.login')}
                </Button>
              </div>
            )}

            {/* Language Selector */}
            <div style={styles.languageSelector} className="desktop-only">
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger style={styles.langTrigger} data-testid="language-selector">
                  <Globe size={16} style={{ marginRight: '0.5rem' }} />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="gl">Galego</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Mobile menu button */}
            <button style={styles.mobileMenuBtn} onClick={() => setShowMobileMenu(!showMobileMenu)} data-testid="mobile-menu-btn">
              {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div style={styles.mobileMenuContent} data-testid="mobile-menu">
            <Link to="/paseadores" style={styles.mobileLink} onClick={() => handleNavClick('/paseadores')}>
              {t('nav.walkers')}
            </Link>
            <Link to="/" style={styles.mobileLink} onClick={() => handleNavClick('/')}>
              {t('nav.howItWorks')}
            </Link>
            <Link to="/contacto" style={styles.mobileLink} onClick={() => handleNavClick('/contacto')}>
              {t('nav.contact')}
            </Link>
            
            {user ? (
              <>
                <div style={styles.mobileDivider}></div>
                <div style={styles.mobileUserInfo}>
                  <User size={18} color="#FF6B00" />
                  <span>{user.name}</span>
                </div>
                <Link to="/mensajes" style={styles.mobileLink} onClick={() => handleNavClick('/mensajes')}>
                  <MessageSquare size={18} style={{ marginRight: '0.5rem' }} />
                  {t('nav.messages')}
                </Link>
                <Link to="/mis-reservas" style={styles.mobileLink} onClick={() => handleNavClick('/mis-reservas')}>
                  <ShoppingCart size={18} style={{ marginRight: '0.5rem' }} />
                  {t('nav.myReservations')}
                </Link>
                <Link to="/perfil" style={styles.mobileLink} onClick={() => handleNavClick('/perfil')}>
                  <UserCircle size={18} style={{ marginRight: '0.5rem' }} />
                  {t('nav.profile')}
                </Link>
                <button style={styles.mobileLogoutBtn} onClick={handleLogout}>
                  <LogOut size={18} />
                  <span>{t('nav.logout')}</span>
                </button>
              </>
            ) : (
              <>
                <div style={styles.mobileDivider}></div>
                <button 
                  style={styles.mobileLoginBtn} 
                  onClick={() => {
                    setShowAuth(true);
                    setShowMobileMenu(false);
                  }}
                >
                  {t('nav.login')}
                </button>
              </>
            )}

            <div style={styles.mobileDivider}></div>
            <div style={styles.mobileLangSelector}>
              <Globe size={18} style={{ marginRight: '0.5rem' }} />
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger style={styles.mobileLangTrigger}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="gl">Galego</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </nav>

      <Dialog open={showAuth} onOpenChange={setShowAuth}>
        <DialogContent data-testid="auth-dialog">
          <DialogHeader>
            <DialogTitle>{t('nav.loginOrRegister') || 'Iniciar sesión o registrarse'}</DialogTitle>
          </DialogHeader>
          
          <Tabs defaultValue="login">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login" data-testid="login-tab">{t('nav.login')}</TabsTrigger>
              <TabsTrigger value="register" data-testid="register-tab">{t('nav.register')}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} style={styles.form}>
                <div>
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                    data-testid="login-email-input"
                  />
                </div>
                <div>
                  <Label htmlFor="login-password">{t('profile.password') || 'Contraseña'}</Label>
                  <Input
                    id="login-password"
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    data-testid="login-password-input"
                  />
                </div>
                <Button type="submit" className="w-full" data-testid="login-submit-btn">{t('nav.login')}</Button>
                <div style={styles.divider}>
                  <span>{t('common.or') || 'o'}</span>
                </div>
                <Button type="button" variant="outline" className="w-full" onClick={loginWithGoogle} data-testid="google-login-btn">
                  <img src="https://www.google.com/favicon.ico" alt="Google" style={styles.googleIcon} />
                  {t('nav.continueWithGoogle') || 'Continuar con Google'}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="register">
              <form onSubmit={handleRegister} style={styles.form}>
                <div>
                  <Label htmlFor="reg-name">{t('profile.name')}</Label>
                  <Input
                    id="reg-name"
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    required
                    data-testid="register-name-input"
                  />
                </div>
                <div>
                  <Label htmlFor="reg-email">Email</Label>
                  <Input
                    id="reg-email"
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    required
                    data-testid="register-email-input"
                  />
                </div>
                <div>
                  <Label htmlFor="reg-password">{t('profile.password') || 'Contraseña'}</Label>
                  <Input
                    id="reg-password"
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    required
                    data-testid="register-password-input"
                  />
                </div>
                <p style={styles.roleNote}>{t('nav.registerAsOwner') || 'Te registrarás como dueño de mascota. Si deseas ser paseador, contacta con nosotros.'}</p>
                <Button type="submit" className="w-full" data-testid="register-submit-btn">{t('nav.createAccount') || 'Crear cuenta'}</Button>
                <div style={styles.divider}>
                  <span>{t('common.or') || 'o'}</span>
                </div>
                <Button type="button" variant="outline" className="w-full" onClick={loginWithGoogle} data-testid="google-register-btn">
                  <img src="https://www.google.com/favicon.ico" alt="Google" style={styles.googleIcon} />
                  {t('nav.continueWithGoogle') || 'Continuar con Google'}
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
    background: 'white',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    padding: '1rem 0',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
  },
  navContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.625rem',
    textDecoration: 'none',
    fontSize: '1.5rem',
    fontWeight: 700,
  },
  logoText: {
    color: '#1a1a1a',
    fontFamily: 'Work Sans, sans-serif',
  },
  desktopMenu: {
    display: 'flex',
    gap: '2rem',
    alignItems: 'center',
  },
  navLink: {
    color: '#4a4a4a',
    textDecoration: 'none',
    fontSize: '0.9375rem',
    fontWeight: 500,
    transition: 'color 0.2s',
  },
  navRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  userMenuDesktop: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  iconButton: {
    background: 'transparent',
    border: 'none',
    color: '#4a4a4a',
    cursor: 'pointer',
    padding: '0.5rem',
    borderRadius: '8px',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  desktopButtons: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  loginBtn: {
    background: 'transparent',
    border: 'none',
    color: '#1a1a1a',
    fontWeight: 600,
    cursor: 'pointer',
  },
  languageSelector: {
    minWidth: '140px',
  },
  langTrigger: {
    border: '1px solid #E5E7EB',
  },
  mobileMenuBtn: {
    display: 'block',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#1a1a1a',
    padding: '0.5rem',
  },
  mobileMenuContent: {
    display: 'flex',
    flexDirection: 'column',
    padding: '1rem',
    gap: '0.75rem',
    borderTop: '1px solid #eee',
    background: 'white',
  },
  mobileLink: {
    color: '#4a4a4a',
    textDecoration: 'none',
    fontSize: '1rem',
    padding: '0.75rem',
    borderRadius: '8px',
    transition: 'background 0.2s',
    display: 'flex',
    alignItems: 'center',
  },
  mobileDivider: {
    height: '1px',
    background: '#E5E7EB',
    margin: '0.5rem 0',
  },
  mobileUserInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.75rem',
    background: '#FFF5EF',
    borderRadius: '8px',
    fontSize: '0.9375rem',
    fontWeight: 500,
  },
  mobileLoginBtn: {
    background: 'white',
    border: '2px solid #FF6B00',
    color: '#FF6B00',
    padding: '0.875rem',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  mobileLogoutBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    background: '#FEE2E2',
    border: 'none',
    color: '#DC2626',
    padding: '0.875rem',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
    width: '100%',
    justifyContent: 'center',
  },
  mobileLangSelector: {
    display: 'flex',
    alignItems: 'center',
    padding: '0.75rem',
  },
  mobileLangTrigger: {
    flex: 1,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    marginTop: '1rem',
  },
  divider: {
    textAlign: 'center',
    position: 'relative',
    margin: '0.5rem 0',
  },
  googleIcon: {
    width: '18px',
    marginRight: '0.5rem',
  },
  roleNote: {
    fontSize: '0.875rem',
    color: '#666',
    fontStyle: 'italic',
    marginTop: '-0.5rem',
  },
};