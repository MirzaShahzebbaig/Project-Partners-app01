import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB, isMongoDBConnected } from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import teamRoutes from './routes/teamRoutes.js';
import milestoneRoutes from './routes/milestoneRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import communityRoutes from './routes/communityRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Middleware
// Allowed browser origins: the Vite dev client, the configured CLIENT_URL, and the
// Android (Capacitor) app whose WebView origin is http(s)://localhost or capacitor://localhost.
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  'http://localhost',
  'https://localhost',
  'capacitor://localhost',
  'ionic://localhost',
  ...(process.env.EXTRA_ORIGINS ? process.env.EXTRA_ORIGINS.split(',').map(o => o.trim()) : [])
];
app.use(cors({
  origin: (origin, cb) => {
    // No origin = same-origin / curl / server-to-server; also allow LAN dev origins on port 5173
    if (!origin || allowedOrigins.includes(origin) || /^http:\/\/(\d{1,3}\.){3}\d{1,3}:5173$/.test(origin)) return cb(null, true);
    return cb(null, false);
  },
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(morgan('dev'));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/milestones', milestoneRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/feedback', feedbackRoutes);

// API Health & Diagnostics Endpoint
app.get('/api/health', (req, res) => {
  const dbStatus = isMongoDBConnected() ? 'connected (mongodb)' : 'active (embedded academic store)';
  res.status(200).json({
    status: 'success',
    platform: 'ProjectPartner API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    database: dbStatus,
    message: 'ProjectPartner Backend Service is operational'
  });
});

// Database Connection Diagnostics Endpoint
app.get('/api/database/status', (req, res) => {
  const connected = isMongoDBConnected();
  res.json({
    status: 'success',
    database: {
      type: connected ? 'MongoDB (Cloud/Local)' : 'Academic Embedded Store (Zero-Config Active)',
      connected: connected,
      uri: process.env.MONGODB_URI ? process.env.MONGODB_URI.replace(/:([^:@]{1,})@/, ':****@') : 'embedded',
      readyState: mongoose.connection.readyState,
      note: connected
        ? 'Connected directly to MongoDB instance.'
        : 'Running on embedded resilient store. To connect MongoDB Atlas, set MONGODB_URI in server/.env.'
    }
  });
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.resolve(__dirname, '../client/dist');

// Serve Frontend Static Files if built
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  // Client-side SPA fallback for non-API routes
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  // Root API Welcome Endpoint if client is not built
  app.get('/', (req, res) => {
    res.json({
      message: 'Welcome to ProjectPartner API - Smart Student-Mentor Project Collaboration Platform',
      documentation: '/api/health',
      endpoints: [
        '/api/auth',
        '/api/projects',
        '/api/applications',
        '/api/teams',
        '/api/milestones',
        '/api/admin'
      ]
    });
  });
}

// 404 Handler for undefined API routes
app.use((req, res, next) => {
  res.status(404).json({
    status: 'error',
    message: `API Route ${req.originalUrl} not found`
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Internal Server Error'
  });
});

const server = app.listen(PORT, () => {
  console.log(`🚀 ProjectPartner Server running on port ${PORT}`);
  console.log(`🔗 Health check available at http://localhost:${PORT}/api/health`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n⚠️  Port ${PORT} is already in use by another running Node process.`);
    console.error(`💡  To free the port, close your other terminal tab or run in PowerShell:`);
    console.error(`    Stop-Process -Id (Get-NetTCPConnection -LocalPort ${PORT} -ErrorAction SilentlyContinue).OwningProcess -Force\n`);
    process.exit(1);
  } else {
    console.error('Server error:', err);
  }
});
