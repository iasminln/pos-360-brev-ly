import { FastifyInstance } from 'fastify';
import { db } from '../../database/index';
import { schema } from '../../database/schemas';
import { generateCSV } from '../../storage/csvExporter';
import { uploadFileToR2, getPublicUrl, getSignedUrlForFile } from '../../storage/client';

export const exportToCsvRoute = async (server: FastifyInstance) => {
  server.post('/links/export-csv', async (_request, reply) => {
    try {
      const allLinks = await db.select().from(schema.uploads).orderBy(schema.uploads.createdAt);

      if (allLinks.length === 0) {
        return reply.status(404).send({ 
          error: 'Nenhum link encontrado para exportar' 
        });
      }

      const csvContent = generateCSV(allLinks);

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const fileName = `links-export-${timestamp}.csv`;

      // Faz upload para R2
      await uploadFileToR2(fileName, csvContent, 'text/csv; charset=utf-8');

      // Tenta obter URL pública, caso contrário gera URL assinada
      const publicUrl = getPublicUrl(fileName);
      let downloadUrl: string;

      if (publicUrl) {
        downloadUrl = publicUrl;
      } else {
        // Gera URL assinada válida por 1 hora
        downloadUrl = await getSignedUrlForFile(fileName, 3600);
      }

      return reply.send({
        message: 'CSV exportado com sucesso',
        fileName,
        url: downloadUrl,
        totalLinks: allLinks.length,
      });
    } catch (error: any) {
      server.log.error(error);
      
      if (error.message?.includes('Configurações do Cloudflare R2')) {
        return reply.status(500).send({ 
          error: 'Configuração do Cloudflare R2 não encontrada. Verifique as variáveis de ambiente.' 
        });
      }

      return reply.status(500).send({ 
        error: 'Erro ao exportar CSV para Cloudflare R2',
        details: error.message 
      });
    }
  });
};

