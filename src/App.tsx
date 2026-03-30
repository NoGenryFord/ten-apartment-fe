import { Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';

function App() {
  return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/apartment/:id" element={<div className="p-10 text-center text-2xl">Страница квартиры в разработке</div>} />
      </Routes>
  );
}

export default App;