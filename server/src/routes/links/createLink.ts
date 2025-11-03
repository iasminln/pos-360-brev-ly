import { FastifyInstance } from 'fastify';
import { db } from '../../database/index';
import { schema } from '../../database/schemas';
import { eq } from 'drizzle-orm';
import z from 'zod';

function generateShortCode(length: number = 6): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

async function shortCodeExists(shortCode: string): Promise<boolean> {
  const existing = await db
    .select()
    .from(schema.uploads)
    .where(eq(schema.uploads.shortCode, shortCode))
    .limit(1);
  
  return existing.length > 0;
}

async function generateUniqueShortCode(): Promise<string> {
  let shortCode: string;
  let attempts = 0;
  const maxAttempts = 10;

  do {
    shortCode = generateShortCode();
    attempts++;
    
    if (attempts >= maxAttempts) {
      throw new Error('Não foi possível gerar um código único após várias tentativas');
    }
  } while (await shortCodeExists(shortCode));

  return shortCode;
}

export const createLinkRoute = async (server: FastifyInstance) => {
  server.post('/links',
    async (request, reply) => {
      try {
        const { originalUrl, shortCode: providedShortCode } = request.body as {
          originalUrl: string;
          shortCode?: string;
        };

        const urlPattern = /^https?:\/\/.+/;
        if (!urlPattern.test(originalUrl)) {
          return reply.status(400).send({
            message: 'URL inválida. Deve começar com http:// ou https://'
          });
        }

        let shortCode: string;

        if (providedShortCode) {
          if (await shortCodeExists(providedShortCode)) {
            return reply.status(409).send({
              message: 'Código de encurtamento já existe'
            });
          }
          shortCode = providedShortCode;
        } else {
          shortCode = await generateUniqueShortCode();
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


