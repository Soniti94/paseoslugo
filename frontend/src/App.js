import '@/App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/contexts/AuthContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Landing from '@/pages/Landing';
import Paseadores from '@/pages/Paseadores';
import PaseadorPerfil from '@/pages/PaseadorPerfil';
import Reservar from '@/pages/Reservar';
import MisReservas from '@/pages/MisReservas';
import Seguimiento from '@/pages/Seguimiento';
import PagoExitoso from '@/pages/PagoExitoso';
import DashboardPaseador from '@/pages/DashboardPaseador';
import EnPaseo from '@/pages/EnPaseo';
import Perfil from '@/pages/Perfil';
import Mensajes from '@/pages/Mensajes';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import TermsOfService from '@/pages/TermsOfService';
import CookiePolicy from '@/pages/CookiePolicy';

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <div className="App">
          <BrowserRouter>
            <Navbar />
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/paseadores" element={<Paseadores />} />
              <Route path="/paseador/:id" element={<PaseadorPerfil />} />
              <Route path="/reservar/:walkerId" element={<Reservar />} />
              <Route path="/mis-reservas" element={<MisReservas />} />
              <Route path="/seguimiento/:bookingId" element={<Seguimiento />} />
              <Route path="/pago-exitoso" element={<PagoExitoso />} />
              <Route path="/dashboard-paseador" element={<DashboardPaseador />} />
              <Route path="/en-paseo/:bookingId" element={<EnPaseo />} />
              <Route path="/perfil" element={<Perfil />} />
              <Route path="/mensajes" element={<Mensajes />} />
              <Route path="/privacidad" element={<PrivacyPolicy />} />
              <Route path="/terminos" element={<TermsOfService />} />
              <Route path="/cookies" element={<CookiePolicy />} />
            </Routes>
            <Footer />
            <Toaster position="top-center" />
          </BrowserRouter>
        </div>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;