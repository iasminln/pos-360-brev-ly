import { FastifyInstance } from 'fastify';

export const healthRoute = async (server: FastifyInstance) => {
  server.get('/health', async (_request, reply) => {
    return reply.status(200).send({ message: 'OK' });
  });
}
