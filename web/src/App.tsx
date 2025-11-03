import { useState } from 'react';
import { LinkForm } from './components/LinkForm';
import { LinkList } from './components/LinkList';
import logoBrevLy from './public/logo-brev-ly.svg';

function App() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleLinkCreated = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="app">
      <main className="main">
        <img src={logoBrevLy} alt="Brev.ly" className="header-logo" />
        <div className="main-content">
          <LinkForm onLinkCreated={handleLinkCreated} />
          <LinkList key={refreshKey} />
        </div>
      </main>
    </div>
  );
}

export default App;
