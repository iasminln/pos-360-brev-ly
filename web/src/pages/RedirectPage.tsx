import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { env } from '../env';
import logoRedirect from '../public/logo-redirect.png';

export function RedirectPage() {
  const { shortCode } = useParams<{ shortCode: string }>();
  const [loading, setLoading] = useState(true);
  const [targetUrl, setTargetUrl] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUrl() {
      try {
        const res = await fetch(`${env.VITE_BACKEND_URL}/${shortCode}`);
        if (!res.ok) throw new Error('Link não encontrado');
        const data = await res.json();
        setTargetUrl(data.originalUrl);

        // setTimeout(() => {
        //   window.location.href = data.originalUrl;
        // }, 1500);
      } catch (err) {
        setTargetUrl(null);
      } finally {
        setLoading(false);
      }
    }
    fetchUrl();
  }, [shortCode]);

  if (loading) return <p>Carregando...</p>;

  if (!targetUrl) return <p>Link não encontrado 😢</p>;

  return (
    <div className="app">
      <main className="main">
        <div className="card card-redirect">
          <div className="logo-redirect-container"><img src={logoRedirect} alt="Brev.ly" /></div>
          <h2>Redirecionando...</h2>
          <div className="redirect-message-container">
            <p>O link será aberto automaticamente em alguns instantes. </p>
            <p>Não foi redirecionado? <a href={targetUrl} target="_blank">Acesse aqui</a></p>
          </div>
        </div>
      </main>
    </div>
  );
}
