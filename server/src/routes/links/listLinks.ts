import { FastifyInstance } from 'fastify';
import { db } from '../../database/index';
import { schema } from '../../database/schemas';

export const listLinksRoute = async (server: FastifyInstance) => {
  server.get('/links', async (request, reply) => {
    try {
      const allLinks = await db.select().from(schema.uploads).orderBy(schema.uploads.createdAt);
      return reply.send(allLinks);
    } catch (error) {
      server.log.error(error);
      return reply.status(500).send({ error: 'Erro interno do servidor' });
    }
  });
}


