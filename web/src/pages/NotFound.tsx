import image404 from '../public/images/404.png';

export function NotFound() {
  return (
    <div className="app">
      <main className="main">
        <div className="card card-redirect">
          <div className="empty-state">
            <div className="logo-redirect-container">
              <img src={image404} alt="Brev.ly" />
            </div>
            <h2>Link não encontrado</h2>
            <p>O link que você está tentando acessar não existe, foi removido ou é uma URL inválida. Saiba mais em <a href="/">brev.ly</a>.</p>
          </div>
        </div>
      </main>
    </div>
  );
}

