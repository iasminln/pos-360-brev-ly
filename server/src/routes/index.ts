import { FastifyInstance } from 'fastify';
import { createLinkRoute } from './links/createLink';
import { listLinksRoute } from './links/listLinks';
import { getLinkByCodeRoute } from './links/getLinkByCode';
import { redirectRoute } from './links/redirect';
import { deleteLinkRoute } from './links/deleteLink';
import { exportToCsvRoute } from './links/exportToCsv';
import { getCsvFromR2Route } from './links/getCsvFromR2';

export const registerRoutes = async (server: FastifyInstance) => {
  await createLinkRoute(server);
  await listLinksRoute(server);
  await getLinkByCodeRoute(server);
  await redirectRoute(server);
  await deleteLinkRoute(server);
  await exportToCsvRoute(server);
  await getCsvFromR2Route(server);
}


