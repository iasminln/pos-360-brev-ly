import { FastifyInstance } from 'fastify';
import { db } from '../../database/index';
import { schema } from '../../database/schemas';
import { eq } from 'drizzle-orm';

export const deleteLinkRoute = async (server: FastifyInstance) => {
  server.delete('/links/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: string };

      const deletedLink = await db
        .delete(schema.uploads)
        .where(eq(schema.uploads.id, id))
        .returning();

      if (deletedLink.length === 0) {
        return reply.status(404).send({ error: 'Link não encontrado' });
      }

      return reply.status(204).send();
    } catch (error) {
      server.log.error(error);
      return reply.status(500).send({ error: 'Erro interno do servidor' });
    }
  });
}


