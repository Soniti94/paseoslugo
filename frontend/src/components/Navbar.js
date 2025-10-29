import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dog, LogOut, User, Menu, X } from 'lucide-react';
import { toast } from 'sonner';

export default function Navbar() {
  const { user, logout, login, register, loginWithGoogle } = useAuth();
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
      toast.success('¡Bienvenido!');
    } catch (err) {
      toast.error('Credenciales inválidas');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await register(regEmail, regPassword, regName);
      setShowAuth(false);
      toast.success('¡Cuenta creada con éxito!');
    } catch (err) {
      toast.error('Error al registrar');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setShowMobileMenu(false);
    toast.success('Sesión cerrada');
  };

  const handleNavClick = (path) => {
    navigate(path);
    setShowMobileMenu(false);
  };

  return (
    <>
      <nav style={styles.navbar}>
        <div className="container" style={styles.navContainer}>
          <Link to="/" style={styles.logo} data-testid="navbar-logo">
            <Dog size={28} color="#FF6B00" />
            <span style={styles.logoText}>PaseosLugo</span>
          </Link>

          {/* Desktop Menu */}
          <div style={styles.desktopMenu} className="desktop-only">
            <Link to="/paseadores" style={styles.navLink} data-testid="nav-paseadores">Paseadores</Link>
            <Link to="/" style={styles.navLink}>Cómo funciona</Link>
            <Link to="/" style={styles.navLink}>Contacto</Link>
          </div>

          {/* Desktop User Menu */}
          <div style={styles.navRight}>
            {user ? (
              <>
                <div style={styles.userMenuDesktop} className="desktop-only">
                  <span style={styles.userName} data-testid="user-name">{user.name}</span>
                  <Button variant="outline" size="sm" onClick={() => navigate('/mis-reservas')} data-testid="nav-mis-reservas">
                    Mis Reservas
                  </Button>
                  <Button variant="ghost" size="icon" onClick={handleLogout} data-testid="nav-logout">
                    <LogOut size={18} />
                  </Button>
                </div>
              </>
            ) : (
              <div style={styles.desktopButtons} className="desktop-only">
                <Button onClick={() => setShowAuth(true)} style={styles.loginBtn} data-testid="nav-login-btn">
                  Iniciar sesión
                </Button>
                <Button onClick={() => navigate('/paseadores')} className="btn-primary" style={styles.reservarBtn} data-testid="nav-reservar-btn">
                  Reservar paseo
                </Button>
              </div>
            )}

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
              Paseadores
            </Link>
            <Link to="/" style={styles.mobileLink} onClick={() => handleNavClick('/')}>
              Cómo funciona
            </Link>
            <Link to="/" style={styles.mobileLink} onClick={() => handleNavClick('/')}>
              Contacto
            </Link>
            
            {user ? (
              <>
                <div style={styles.mobileDivider}></div>
                <div style={styles.mobileUserInfo}>
                  <User size={18} color="#FF6B00" />
                  <span>{user.name}</span>
                </div>
                <Link to="/mis-reservas" style={styles.mobileLink} onClick={() => handleNavClick('/mis-reservas')}>
                  Mis Reservas
                </Link>
                <button style={styles.mobileLogoutBtn} onClick={handleLogout}>
                  <LogOut size={18} />
                  <span>Cerrar sesión</span>
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
                  Iniciar sesión
                </button>
                <button 
                  style={styles.mobileReservarBtn}
                  onClick={() => handleNavClick('/paseadores')}
                >
                  Reservar paseo
                </button>
              </>
            )}
          </div>
        )}
      </nav>

      <Dialog open={showAuth} onOpenChange={setShowAuth}>
        <DialogContent data-testid="auth-dialog">
          <DialogHeader>
            <DialogTitle>Iniciar sesión o registrarse</DialogTitle>
          </DialogHeader>
          
          <Tabs defaultValue="login">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login" data-testid="login-tab">Iniciar sesión</TabsTrigger>
              <TabsTrigger value="register" data-testid="register-tab">Registrarse</TabsTrigger>
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
                  <Label htmlFor="login-password">Contraseña</Label>
                  <Input
                    id="login-password"
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    data-testid="login-password-input"
                  />
                </div>
                <Button type="submit" className="w-full" data-testid="login-submit-btn">Iniciar sesión</Button>
                <div style={styles.divider}>
                  <span>o</span>
                </div>
                <Button type="button" variant="outline" className="w-full" onClick={loginWithGoogle} data-testid="google-login-btn">
                  <img src="https://www.google.com/favicon.ico" alt="Google" style={styles.googleIcon} />
                  Continuar con Google
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="register">
              <form onSubmit={handleRegister} style={styles.form}>
                <div>
                  <Label htmlFor="reg-name">Nombre completo</Label>
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
                  <Label htmlFor="reg-password">Contraseña</Label>
                  <Input
                    id="reg-password"
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    required
                    data-testid="register-password-input"
                  />
                </div>
                <p style={styles.roleNote}>Te registrarás como dueño de mascota. Si deseas ser paseador, contacta con nosotros.</p>
                <Button type="submit" className="w-full" data-testid="register-submit-btn">Crear cuenta</Button>
                <div style={styles.divider}>
                  <span>o</span>
                </div>
                <Button type="button" variant="outline" className="w-full" onClick={loginWithGoogle} data-testid="google-register-btn">
                  <img src="https://www.google.com/favicon.ico" alt="Google" style={styles.googleIcon} />
                  Continuar con Google
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
    gap: '1rem',
  },
  userName: {
    fontSize: '0.9375rem',
    fontWeight: 500,
    color: '#1a1a1a',
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
  reservarBtn: {
    display: 'inline-block',
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
  mobileReservarBtn: {
    background: '#FF6B00',
    border: 'none',
    color: 'white',
    padding: '0.875rem',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background 0.2s',
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