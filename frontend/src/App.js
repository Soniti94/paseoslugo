import '@/App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Landing from '@/pages/Landing';
import Paseadores from '@/pages/Paseadores';
import PaseadorPerfil from '@/pages/PaseadorPerfil';
import Reservar from '@/pages/Reservar';
import MisReservas from '@/pages/MisReservas';
import Seguimiento from '@/pages/Seguimiento';
import PagoExitoso from '@/pages/PagoExitoso';
import DashboardPaseador from '@/pages/DashboardPaseador';
import EnPaseo from '@/pages/EnPaseo';

function App() {
  return (
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
          </Routes>
          <Toaster position="top-center" />
        </BrowserRouter>
      </div>
    </AuthProvider>
  );
}

export default App;