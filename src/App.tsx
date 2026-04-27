import { Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { ApartmentDetail } from './pages/ApartmentDetail';
import { Booking } from './pages/Booking.tsx';
import { Account } from './pages/Account.tsx';
import { ScrollToTopButton } from './components/scrollToTop/ScrollToTopButton';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/apartment/:id" element={<ApartmentDetail />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/account" element={<Account />} />
      </Routes>
      <ScrollToTopButton />
    </>
  );
}

export default App;