import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import {
  handleDiagnoseRequest,
  handleHealthRequest,
  getCityCurrencyInfo,
  generateFallbackDiagnosis,
} from './src/server/diagnoseHandler';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export { getCityCurrencyInfo };

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware for parsing JSON with ample limit for photos
  app.use(express.json({ limit: '20mb' }));
  app.use(express.urlencoded({ extended: true, limit: '20mb' }));

  // CORS middleware for Capacitor and cross-origin requests
  app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Credentials', 'true');
    } else {
      res.setHeader('Access-Control-Allow-Origin', '*');
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
    if (req.method === 'OPTIONS') {
      return res.status(204).end();
    }
    next();
  });

  // API Endpoints
  app.get('/api/health', handleHealthRequest);
  app.post('/api/diagnose', handleDiagnoseRequest);

  // Error handling middleware to catch unhandled errors and body parsing issues gracefully
  app.use((err: any, req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error('Express handled server error:', err?.message || err);
    if (req.path === '/api/diagnose') {
      const fallback = generateFallbackDiagnosis('general', req.body?.description || '', req.body?.city || 'Бишкек', Boolean(req.body?.imageBase64));
      return res.status(200).json(fallback);
    }
    return res.status(500).json({ error: 'Internal Server Error', message: err?.message || 'Unknown error' });
  });

  // Serve Vite in development or static files in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Smart Repair Assistant server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
