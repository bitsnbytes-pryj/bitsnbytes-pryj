import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import config from './config/index.js';
import { connectDb } from './db/index.js';

// Import routes
import authRoutes from './routes/auth.routes.js';
import eventsRoutes from './routes/events.routes.js';
import rolesRoutes from './routes/roles.routes.js';
import teamRoutes from './routes/team.routes.js';
import projectsRoutes from './routes/projects.routes.js';
import submissionsRoutes from './routes/submissions.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: config.cors.origins,
  credentials: true,
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// General rate limiting
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // limit each IP to 500 requests per windowMs
  message: { success: false, error: 'Too many requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(generalLimiter);

// Health check at root
app.get('/', (_req, res) => {
  res.json({
    success: true,
    data: {
      name: 'Bits&Bytes Prayagraj Admin API',
      version: '1.0.0',
      status: 'running',
    },
  });
});

// API routes
app.use('/auth', authRoutes);
app.use('/events', eventsRoutes);
app.use('/roles', rolesRoutes);
app.use('/team', teamRoutes);
app.use('/projects', projectsRoutes);
app.use('/submissions', submissionsRoutes);
app.use('/dashboard', dashboardRoutes);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error: 'Not found',
  });
});

// Error handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
  });
});

// Start server
async function start() {
  try {
    // Connect to database
    await connectDb();
    console.log('Database connected successfully');

    // Start listening
    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
      console.log(`Environment: ${config.nodeEnv}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();

export default app;