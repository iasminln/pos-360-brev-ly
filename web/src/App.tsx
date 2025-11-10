import { Routes, Route, HashRouter } from 'react-router-dom';
import { Home } from './pages/Home';
import { RedirectPage } from './pages/RedirectPage';
import { NotFound } from './pages/NotFound';


function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/404" element={<NotFound />} />
        <Route path="/:shortCode" element={<RedirectPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
