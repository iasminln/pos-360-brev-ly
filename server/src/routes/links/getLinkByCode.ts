import { FastifyInstance } from 'fastify';
import { db } from '../../database/index';
import { schema } from '../../database/schemas';
import { eq } from 'drizzle-orm';

export const getLinkByCodeRoute = async (server: FastifyInstance) => {
  server.get('/links/:shortCode', async (request, reply) => {
    try {
      const { shortCode } = request.params as { shortCode: string };

      const link = await db
        .select()
        .from(schema.uploads)
        .where(eq(schema.uploads.shortCode, shortCode))
        .limit(1);

      if (link.length === 0) {
        return reply.status(404).send({ error: 'Link não encontrado' });
      }

      return reply.send(link[0]);
    } catch (error) {
      server.log.error(error);
      return reply.status(500).send({ error: 'Erro interno do servidor' });
    }
  });
}


