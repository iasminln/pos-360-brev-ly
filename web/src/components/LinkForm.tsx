import { useState } from 'react';
import { linkService } from '../services/api';
import type { CreateLinkRequest } from '../types/link';

interface LinkFormProps {
  onLinkCreated: () => void;
}

export function LinkForm({ onLinkCreated }: LinkFormProps) {
  const [formData, setFormData] = useState<CreateLinkRequest>({ originalUrl: '', shortCode: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await linkService.createLink(formData);
      console.log("link criado", formData);
      console.log("response", response);
      setFormData({ originalUrl: '', shortCode: '' });
      onLinkCreated();
    } catch (err) {
      console.log("error", err);
      const errorMessage = (err as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Erro ao criar link';
      setError(errorMessage);
    } finally {
      console.log("finally");
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
            onChange={(e) => setFormData(prev => ({ ...prev, originalUrl: e.target.value }))}
            placeholder="https://exemplo.com"
            className="form-input"
            required
          />
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
              onChange={(e) => setFormData(prev => ({ ...prev, shortCode: e.target.value }))}
              className="form-input input-with-prefix-input"
            />
          </div>
        </div>

        {error && (
          <div className="error-message">
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
