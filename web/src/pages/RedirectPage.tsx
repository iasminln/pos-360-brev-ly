import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { env } from '../env';
import logoRedirect from '../assets/images/logo-redirect.png';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export function RedirectPage() {
  useDocumentTitle('Redirecionando... - Brev.ly');
  const { shortCode } = useParams<{ shortCode: string }>();
  const navigate = useNavigate();
  const [targetUrl, setTargetUrl] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUrl() {
      try {
        const res = await fetch(`${env.VITE_BACKEND_URL}/${shortCode}`);
        if (!res.ok) {
          navigate('/404');
          return;
        }
        const data = await res.json();
        setTargetUrl(data.originalUrl);

        setTimeout(() => {
          window.location.href = data.originalUrl;
        }, 1000);
      } catch {
        navigate('/404');
      }
    }
    fetchUrl();
  }, [shortCode, navigate]);

  if (!targetUrl) return null;

  return (
    <div className="app">
      <main className="main">
        <div className="main-container">
          <div className="card card-redirect">
            <div className="logo-redirect-container"><img src={logoRedirect} alt="Brev.ly" /></div>
            <div className="redirect-loading">
              <h2>Redirecionando...</h2>
              <div className="redirect-spinner"></div>
            </div>
            <div className="redirect-message-container">
              <p>O link será aberto automaticamente em alguns instantes. </p>
              <p>Não foi redirecionado? <a href={targetUrl} target="_blank">Acesse aqui</a></p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
