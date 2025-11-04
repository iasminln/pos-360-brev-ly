import { useState, useEffect } from 'react';
import { Trash2, Copy } from 'lucide-react';
import { linkService } from '../services/api';
import type { Link } from '../types/link';
import { IconDownload } from '../icons/icon-download';
import { IconLink } from '../icons/icon-link';
import { env } from '../env';

const frontendUrl = env.VITE_FRONTEND_URL;

export function LinkList() {
  const [links, setLinks] = useState<Link[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadLinks = async () => {
    try {
      setIsLoading(true);
      const data = await linkService.getAllLinks();
      setLinks(data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar links');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLinks();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar este link?')) return;

    try {
      const response = await linkService.deleteLink(id);
      console.log("response", response);
      console.log("link deletado", id);
      await loadLinks();
    } catch (err) {
      alert('Erro ao deletar link');
      console.error(err);
    }
  };

  const handleCopy = (shortCode: string) => {
    const shortUrl = `${frontendUrl}/${shortCode}`;
    navigator.clipboard.writeText(shortUrl);
    alert('Link copiado para a área de transferência!');
  };

  const handleExportToCsv = async () => {
    try {
      const response = await linkService.exportLinksToCsv();
      const downloadUrl = response.url;

      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = response.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error(err);
      alert('Erro ao exportar CSV');
    }
  };

  const ListLinksHeader = () => {
    let disableButton = false;
    if (links.length === 0 || isLoading || error) {
      disableButton = true;
    }

    return (
      <div className="link-list-header">
        <h2>Meus links</h2>
        <button className="btn btn-secondary" onClick={handleExportToCsv} disabled={disableButton}>
          <IconDownload size={16} color="#1F2025" /> Baixar CSV
        </button>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="card">
        <ListLinksHeader />
        <div className="loading">
          <div className="spinner" />
          <span className="text-label-uppercase">Carregando links...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <ListLinksHeader />
        <div className="empty-state">
          <p className="error-message">{error}</p>
          <button
            onClick={() => loadLinks()}
            className="btn btn-primary"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  if (links.length === 0) {
    return (
      <div className="card">
        <ListLinksHeader />
        <div className="empty-state">
          <IconLink size={32} color="#74798B" />
          <p className="text-label-uppercase">Ainda não existem links cadastrados</p>
        </div>
      </div>
    );
  }

  console.log(links);

  return (
    <div className="card">
      <ListLinksHeader />

      <div>
        {links.map((link) => (
          <div key={link.id} className="link-item">
            <div className="link-left">
              <a href={`/${link.shortCode}`} className="link-code" target="_blank">
                {`${frontendUrl}/${link.shortCode}`}
              </a>
              <a href={link.originalUrl} className="link-url" target="_blank">
                {link.originalUrl}
              </a>
            </div>

            <div className="link-right">
              <span className="link-stats">
                {link.clickCount} acessos
              </span>
              <div className="link-actions">
                <button
                  onClick={() => handleCopy(link.shortCode)}
                  className="action-btn copy"
                  title="Copiar link"
                >
                  <Copy size={16} />
                </button>
                <button
                  onClick={() => handleDelete(link.id)}
                  className="action-btn delete"
                  title="Deletar link"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
