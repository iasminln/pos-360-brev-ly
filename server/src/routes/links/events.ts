import { FastifyInstance } from 'fastify';
import { db } from '../../database/index';
import { schema } from '../../database/schemas';

export const eventsRoute = async (server: FastifyInstance) => {
  server.get('/events', async (request, reply) => {
    try {
      reply.raw.setHeader('Access-Control-Allow-Origin', '*');
      reply.raw.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      reply.raw.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

      reply.raw.setHeader('Content-Type', 'text/event-stream');
      reply.raw.setHeader('Cache-Control', 'no-cache');
      reply.raw.setHeader('Connection', 'keep-alive');
      reply.raw.flushHeaders?.();

      const sendData = async () => {
        const links = await db.select({
          shortCode: schema.uploads.shortCode,
          clickCount: schema.uploads.clickCount,
        }).from(schema.uploads);
        reply.raw.write(`data: ${JSON.stringify(links)}\n\n`);
      };

      await sendData();

      const interval = setInterval(sendData, 5000);
      request.raw.on('close', () => clearInterval(interval));
    } catch (error) {
      server.log.error(error);
      reply.status(500).send({ error: 'Internal Server Error' });
    }
  });
};
