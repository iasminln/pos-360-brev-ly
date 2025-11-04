import { useEffect, useState } from 'react';
import '../index.css';

interface ToastProps {
  message: string;
  onClose: () => void;
}

export function Toast({ message, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 10);

    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => {
        onClose();
      }, 300);
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`toast ${isVisible ? 'toast-visible' : ''} ${isExiting ? 'toast-exiting' : ''}`}>
      <div className="toast-content">
        <span className="toast-message">{message}</span>
      </div>
    </div>
  );
}

