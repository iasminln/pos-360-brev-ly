import { fastify } from "fastify";
import { fastifyCors } from "@fastify/cors";
import { registerRoutes } from './routes';
import { env } from './env';
import { serializerCompiler, validatorCompiler, hasZodFastifySchemaValidationErrors } from 'fastify-type-provider-zod';


const server = fastify();

server.setValidatorCompiler(validatorCompiler);
server.setSerializerCompiler(serializerCompiler);


server.setErrorHandler((error, _request, reply) => {
  if (hasZodFastifySchemaValidationErrors(error)) {
    return reply.status(400).send({ message: 'Validation error', issues: error.validation });
  }

  return reply.status(500).send({ error: "Internal Server Error" });
});

server.register(fastifyCors, {
  origin: "*",
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});
server.register(registerRoutes);

server.listen({ port: 3333, host: '0.0.0.0' }).then(() => {
  console.log(`🚀 Servidor rodando em http://0.0.0.0:3333`);
})
