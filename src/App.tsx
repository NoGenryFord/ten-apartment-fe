import { Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { ApartmentDetail } from './pages/ApartmentDetail';
import { Booking } from './pages/Booking';
import { Account } from './pages/Account';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Contacts } from './pages/Contacts';
import { About } from './pages/About';
import { ScrollToTopButton } from './components/scrollToTop/ScrollToTopButton';
import { ScrollToTopOnRouteChange } from './components/scrollToTop/ScrollToTopOnRouteChange';
import { SiteFooter } from './components/siteFooter/SiteFooter';

function App() {
  return (
    <>
      <ScrollToTopOnRouteChange />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/apartment/:id" element={<ApartmentDetail />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/account" element={<Account />} />
        <Route path="/contacts" element={<Contacts />} />
        <Route path="/about" element={<About />} />
      </Routes>
      <ScrollToTopButton />
      <SiteFooter />
    </>
  );
}

export default App;