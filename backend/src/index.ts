import express from 'express';
import cors from 'cors';
import path from 'path';
import { config } from './config/env';
import { initDb } from './utils/db';
import analyzeRoutes from './routes/analyzeRoutes';

const app = express();
const PORT = config.PORT;

// Enable CORS
app.use(cors({
  origin: config.isDev ? ['http://localhost:5173', 'http://localhost:3000'] : '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key']
}));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api', analyzeRoutes);

// Serve Frontend static assets in Production
if (config.NODE_ENV === 'production') {
  const frontendBuildPath = path.join(__dirname, '../../frontend/dist');
  console.log(`Serving static production build assets from: ${frontendBuildPath}`);
  
  app.use(express.static(frontendBuildPath));
  
  // React Router SPA fallback
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(frontendBuildPath, 'index.html'));
    } else {
      res.status(404).json({ error: 'API route not found.' });
    }
  });
} else {
  // Simple development greeting
  app.get('/', (req, res) => {
    res.json({ message: 'TechStack AI Backend running in Development mode. Connect frontend on port 5173.' });
  });
}

// Start Server after Database init
async function bootstrap() {
  try {
    await initDb();
    app.listen(PORT, () => {
      console.log(`===================================================`);
      console.log(`🚀 TechStack AI Backend listening on Port: ${PORT}`);
      console.log(`🖥️  Running environment: ${config.NODE_ENV}`);
      console.log(`===================================================`);
    });
  } catch (error) {
    console.error('Fatal error bootstrapping Express server:', error);
    process.exit(1);
  }
}

bootstrap();
