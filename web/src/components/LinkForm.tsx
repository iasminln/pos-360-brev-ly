import { useState } from 'react';
import { linkService } from '../services/api';
import type { CreateLinkRequest } from '../types/link';
import { IconWarning } from '../icons/icon-warning';

interface LinkFormProps {
  onLinkCreated: () => void;
}

export function LinkForm({ onLinkCreated }: LinkFormProps) {
  const [formData, setFormData] = useState<CreateLinkRequest>({ originalUrl: '', shortCode: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shortCodeError, setShortCodeError] = useState<string | null>(null);
  const [urlError, setUrlError] = useState<string | null>(null);

  const handleShortCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    const filteredValue = value.replace(/[^a-zA-Z0-9_-]/g, '');
    
    if (value !== filteredValue) {
      setShortCodeError('O código só pode conter letras, números, hífen (-) e underscore (_)');
    } else {
      setShortCodeError(null);
    }
    
    setFormData(prev => ({ ...prev, shortCode: filteredValue }));
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, originalUrl: value }));
    
    if (value && !value.match(/^https?:\/\//i)) {
      setUrlError('O link deve começar com http:// ou https://');
    } else {
      setUrlError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.originalUrl && !formData.originalUrl.match(/^https?:\/\//i)) {
      setUrlError('O link deve começar com http:// ou https://');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setUrlError(null);

    try {
      await linkService.createLink(formData);
      setFormData({ originalUrl: '', shortCode: '' });
      setShortCodeError(null);
      setUrlError(null);
      onLinkCreated();
    } catch (err) {
      console.log("error", err);
      const errorMessage = (err as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Erro ao criar link';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2>Novo link</h2>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="originalUrl" className="text-label-uppercase">
            Link Original
          </label>
          <input
            type="url"
            id="originalUrl"
            value={formData.originalUrl}
            onChange={handleUrlChange}
            placeholder="https://exemplo.com"
            className="form-input"
          />
          {urlError && (
            <div className="error-message">
              <IconWarning size={14} color="#B12C4D" />
              {urlError}
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="shortCode" className="text-label-uppercase">
            Link encurtado
          </label>
          <div className="input-with-prefix">
            <span className="input-prefix">brev.ly/</span>
            <input
              type="text"
              id="shortCode"
              value={formData.shortCode}
              onChange={handleShortCodeChange}
              className="form-input input-with-prefix-input"
            />
          </div>
          {shortCodeError && (
            <div className="error-message">
              <IconWarning size={14} color="#B12C4D" />
              {shortCodeError}
            </div>
          )}
        </div>

        {error && (
          <div className="error-message">
            <IconWarning size={14} color="#B12C4D" />
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="btn btn-primary btn-full"
        >
          {isLoading ? (
            <>
              <div className="spinner" />
              Salvando...
            </>
          ) : (
            <>
              Salvar link
            </>
          )}
        </button>
      </form>
    </div>
  );
}
