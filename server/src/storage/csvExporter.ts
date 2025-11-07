export interface LinkData {
  id: string;
  originalUrl: string;
  shortCode: string;
  clickCount: number;
  createdAt: Date | null;
}

export const generateCSV = (links: LinkData[]): string => {
  const headers = ['ID', 'URL Original', 'Código Curto', 'Quantidade de Acessos', 'Data de Criação'];
  
  const rows = links.map(link => {
    const id = link.id || '';
    const originalUrl = link.originalUrl || '';
    const shortCode = link.shortCode || '';
    const clickCount = link.clickCount || 0;
    const createdAt = link.createdAt
      ? new Date(link.createdAt).toISOString() 
      : '';
    
    const escapeCSV = (value: string) => {
      if (value.includes(',') || value.includes('"') || value.includes('\n')) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    };
    
    return [
      escapeCSV(id),
      escapeCSV(originalUrl),
      escapeCSV(shortCode),
      escapeCSV(clickCount.toString()),
      escapeCSV(createdAt)
    ].join(',');
  });
  
  const csvContent = [headers.join(','), ...rows].join('\n');


  return csvContent;
};

