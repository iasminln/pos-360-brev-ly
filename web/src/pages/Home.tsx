import { useState } from 'react';
import { LinkForm } from '../components/LinkForm';
import { LinkList } from '../components/LinkList';
import logoBrevLy from '../public/images/logo-brev-ly.svg';

export function Home() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleLinkCreated = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="app">
      <main className="main">
        <div className="header">
          <img src={logoBrevLy} alt="Brev.ly" className="logo" />
        </div>
        <div className="main-content">
          <LinkForm onLinkCreated={handleLinkCreated} />
          <LinkList key={refreshKey} />
        </div>
      </main>
    </div>
  );
}

