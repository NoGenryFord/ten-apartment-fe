import { Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { ApartmentDetail } from './pages/ApartmentDetail';
import { Booking } from './pages/Booking.tsx';
import { ScrollToTopButton } from './components/scrollToTop/ScrollToTopButton';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/apartment/:id" element={<ApartmentDetail />} />
        <Route path="/booking" element={<Booking />} />
      </Routes>
      <ScrollToTopButton />
    </>
  );
}

export default App;