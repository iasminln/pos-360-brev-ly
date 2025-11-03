import { fastify } from "fastify";
import { fastifyCors } from "@fastify/cors";
// import { registerRoutes } from './routes';
import { createLinkRoute } from './routes/links/createLink';
import { env } from './env';
import { serializerCompiler, validatorCompiler, hasZodFastifySchemaValidationErrors } from 'fastify-type-provider-zod';

const server = fastify();

server.setValidatorCompiler(validatorCompiler);
server.setSerializerCompiler(serializerCompiler);


server.setErrorHandler((error, request, reply) => {
  if (hasZodFastifySchemaValidationErrors(error)) {
    return reply.status(400).send({ message: 'Validation error', issues: error.validation });
  }

  return reply.status(500).send({ error: "Internal Server Error" });
});

console.log(env.DATABASE_URL);

server.register(fastifyCors, { origin: "*" });
// server.register(registerRoutes);
// server.register(createLinkRoute);

server.listen({ port: 3333, host: '0.0.0.0' }).then(() => {
  console.log(`🚀 Servidor rodando em http://0.0.0.0:3333`);
})
