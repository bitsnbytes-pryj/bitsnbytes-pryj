import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { config } from './config/index.js';
import { connectDb } from './db/index.js';

// Import routes
import authRoutes from './routes/auth.routes.js';
import adminEventsRoutes from './routes/admin/events.routes.js';
import adminTeamRoutes from './routes/admin/team.routes.js';
import adminProjectsRoutes from './routes/admin/projects.routes.js';
import adminRolesRoutes from './routes/admin/roles.routes.js';
import adminSubmissionsRoutes from './routes/admin/submissions.routes.js';
import adminDashboardRoutes from './routes/admin/dashboard.routes.js';
import webhookRoutes from './routes/webhooks.routes.js';

const app = express();

// Trust proxy (for Railway/Heroku deployments)
app.set('trust proxy', 1);

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
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
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
      name: 'Bits&Bytes Prayagraj API',
      version: '1.0.0',
      status: 'running',
      description: 'Consolidated API for Bits&Bytes Prayagraj',
      endpoints: {
        auth: {
          'POST /auth/login': 'Admin login',
          'GET /auth/me': 'Get current user',
        },
        admin: {
          'GET/POST /admin/events': 'List/Create events',
          'GET/PUT/DELETE /admin/events/:id': 'Event CRUD',
          'GET/POST /admin/team': 'List/Create team members',
          'GET/PUT/DELETE /admin/team/:id': 'Team CRUD',
          'GET/POST /admin/projects': 'List/Create projects',
          'GET/PUT/DELETE /admin/projects/:id': 'Project CRUD',
          'GET/POST /admin/roles': 'List/Create roles',
          'GET/PUT/DELETE /admin/roles/:id': 'Role CRUD',
          'GET /admin/submissions/*': 'View submissions',
          'GET /admin/dashboard/stats': 'Dashboard statistics',
        },
        webhooks: {
          'POST /webhooks/forms/contact': 'Contact form webhook',
          'POST /webhooks/forms/join': 'Join application webhook',
          'POST /webhooks/forms/event-register': 'Event registration webhook',
          'POST /webhooks/forms/role-apply': 'Role application webhook',
          'POST /webhooks/forms/feedback': 'Feedback webhook',
        },
      },
    },
  });
});

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({ success: true, status: 'healthy' });
});

// API routes
app.use('/auth', authRoutes);
app.use('/admin/events', adminEventsRoutes);
app.use('/admin/team', adminTeamRoutes);
app.use('/admin/projects', adminProjectsRoutes);
app.use('/admin/roles', adminRolesRoutes);
app.use('/admin/submissions', adminSubmissionsRoutes);
app.use('/admin/dashboard', adminDashboardRoutes);
app.use('/webhooks', webhookRoutes);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error: 'Not found',
  });
});

// Error handler
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