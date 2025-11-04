import { FastifyInstance } from 'fastify';
import { db } from '../../database/index';
import { schema } from '../../database/schemas';
import { eq, sql } from 'drizzle-orm';

export const redirectRoute = async (server: FastifyInstance) => {
  server.get('/:shortCode', async (request, reply) => {
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

      const foundLink = link[0]!;
      await db
        .update(schema.uploads)
        .set({
          clickCount: sql`click_count + 1`
        })
        .where(eq(schema.uploads.id, foundLink.id));

      return reply.send({ originalUrl: foundLink.originalUrl, clickCount: foundLink.clickCount });
    } catch (error) {
      server.log.error(error);
      return reply.status(500).send({ error: 'Erro interno do servidor' });
    }
  });
};
