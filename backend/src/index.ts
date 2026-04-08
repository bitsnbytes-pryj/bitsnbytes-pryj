import express from 'express';
import { config } from './config/index.js';
import { corsMiddleware } from './middleware/cors.js';
import { rateLimiter } from './middleware/rateLimiter.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { logger } from './utils/logger.js';

// Import routes
import contactRoutes from './routes/contact.routes.js';
import joinRoutes from './routes/join.routes.js';
import eventRoutes from './routes/event.routes.js';
import eventRegisterRoutes from './routes/event-register.routes.js';
import roleRoutes from './routes/role.routes.js';
import roleApplyRoutes from './routes/role-apply.routes.js';
import feedbackRoutes from './routes/feedback.routes.js';
import teamRoutes from './routes/team.routes.js';
import projectRoutes from './routes/project.routes.js';
import healthRoutes from './routes/health.routes.js';

// Create Express app
const app = express();

// Trust proxy (for Railway/Heroku deployments)
app.set('trust proxy', 1);

// Basic middleware
app.use(corsMiddleware);
app.use(rateLimiter);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// API routes
app.use('/contact', contactRoutes);
app.use('/join', joinRoutes);
app.use('/events', eventRoutes);
app.use('/event-register', eventRegisterRoutes);
app.use('/roles', roleRoutes);
app.use('/role-apply', roleApplyRoutes);
app.use('/feedback', feedbackRoutes);
app.use('/team', teamRoutes);
app.use('/projects', projectRoutes);
app.use('/health', healthRoutes);

// Root endpoint
app.get('/', (_req, res) => {
  res.json({
    success: true,
    data: {
      name: 'Bits&Bytes Prayagraj Public API',
      version: '1.0.0',
      description: 'Public API for the Bits&Bytes Prayagraj community',
      endpoints: {
        'POST /contact': 'Submit a contact form',
        'POST /join': 'Submit a join application',
        'POST /event-register': 'Register for an event',
        'POST /role-apply': 'Apply for a role',
        'POST /feedback': 'Submit feedback',
        'GET /events': 'List all events',
        'GET /events/:id': 'Get event details',
        'GET /roles': 'List all open roles',
        'GET /roles/:id': 'Get role details',
        'GET /team': 'List team members',
        'GET /projects': 'List all projects',
        'GET /projects/:id': 'Get project details',
        'GET /health': 'Health check endpoint',
      },
    },
  });
});

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
app.listen(config.port, () => {
  logger.info(`Server started on port ${config.port}`, {
    environment: config.nodeEnv,
    port: config.port,
  });
});

export default app;