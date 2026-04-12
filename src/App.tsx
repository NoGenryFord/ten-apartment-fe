import { Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { ApartmentDetail } from './pages/ApartmentDetail';

function App() {
  return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/apartment/:id" element={<ApartmentDetail />} />
      </Routes>
  );
}

export default App;