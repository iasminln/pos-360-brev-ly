import { FastifyInstance } from 'fastify';
import { createLinkRoute } from './links/createLink';
import { listLinksRoute } from './links/listLinks';
import { getLinkByCodeRoute } from './links/getLinkByCode';
import { redirectRoute } from './links/redirect';
import { deleteLinkRoute } from './links/deleteLink';
import { exportToCsvRoute } from './links/exportToCsv';
import { eventsRoute } from './links/events';
import { healthRoute } from './links/health';

export const registerRoutes = async (server: FastifyInstance) => {
  await createLinkRoute(server);
  await listLinksRoute(server);
  await getLinkByCodeRoute(server);
  await redirectRoute(server);
  await deleteLinkRoute(server);
  await exportToCsvRoute(server);
  await eventsRoute(server);
  await healthRoute(server);
}
