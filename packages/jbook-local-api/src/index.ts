import path from 'path';
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { createCellsRouter } from './routes/cells';

interface ServeProps {
  dir: string;
  port: number;
  isDev: boolean;
  filename: string;
}

export async function serve({ dir, isDev, port, filename }: ServeProps) {
  const app = express();

  if (isDev) {
    app.use(
      createProxyMiddleware({
        target: 'http://localhost:3030',
        ws: true,
        logLevel: 'silent',
      })
    );
  } else {
    const modulePath = require.resolve('jbook-client/dist/index.html');
    app.use(express.static(path.dirname(modulePath)));
  }

  app.use(express.json());
  app.use(createCellsRouter(filename, dir));

  return new Promise<void>((resolve, reject) => {
    app.listen(port, resolve).on('error', reject);
  });
}
