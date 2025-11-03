import { FastifyInstance } from 'fastify';
import { db } from '../../database/index';
import { schema } from '../../database/schemas';
import { eq } from 'drizzle-orm';

async function shortCodeExists(shortCode: string): Promise<boolean> {
  const existing = await db
    .select()
    .from(schema.uploads)
    .where(eq(schema.uploads.shortCode, shortCode))
    .limit(1);

  return existing.length > 0;
}

export const createLinkRoute = async (server: FastifyInstance) => {
  server.post('/links',
    async (request, reply) => {
      try {
        const { originalUrl, shortCode } = request.body as {
          originalUrl: string;
          shortCode: string;
        };

        if (!originalUrl) {
          return reply.status(400).send({
            message: 'URL original é obrigatória'
          });
        }

        if (!shortCode) {
          return reply.status(400).send({
            message: 'Código de encurtamento é obrigatório'
          });
        }

        const urlPattern = /^https?:\/\/.+/;
        if (!urlPattern.test(originalUrl)) {
          return reply.status(400).send({
            message: 'URL inválida. Deve começar com http:// ou https://'
          });
        }

        if (await shortCodeExists(shortCode)) {
          return reply.status(409).send({
            message: 'Código de encurtamento já existe'
          });
        }

        const newLink = await db
          .insert(schema.uploads)
          .values({
            originalUrl,
            shortCode,
          })
          .returning();

        return reply.status(201).send(newLink[0]);
      } catch (error) {
        server.log.error(error);
        return reply.status(500).send({
          message: 'Erro interno do servidor'
        });
      }
    });
}


