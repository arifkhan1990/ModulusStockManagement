import express, { type Request, Response, NextFunction } from "express";
import helmet from "helmet";
import compression from "compression";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import config from "./config";
import { initDatabase } from "./db";
import { globalRateLimit, apiRateLimit } from "./middleware/rate-limit";
import { cacheMiddleware } from "./middleware/cache";
import { tenantMiddleware } from "./middleware/tenant";

// Create Express app
const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: config.isDev ? false : undefined,
  crossOriginEmbedderPolicy: false,
}));

// Compression middleware for reducing payload size
app.use(compression());

// Apply global rate limiting
app.use(globalRateLimit);

// API-specific rate limiting
app.use('/api', apiRateLimit);

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));

// Multi-tenancy middleware for SaaS
app.use('/api', tenantMiddleware);

// Apply caching for GET requests (3600s = 1 hour)
app.use('/api', cacheMiddleware(3600));

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// Self-executing async function to start the server
(async () => {
  try {
    // Initialize the database connection
    await initDatabase();
    console.log("Database initialized successfully");

    // Register routes and get the HTTP server
    const server = await registerRoutes(app);

    // Global error handler
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";

      res.status(status).json({ message });
      throw err;
    });

    // Setup Vite in development or serve static files in production
    if (config.isDev) {
      await setupVite(app, server);
    } else {
      serveStatic(app);
    }

    // Start the server
    const { port, host } = config.server;
    server.listen({
      port,
      host,
      reusePort: true,
    }, () => {
      log(`Server running on port ${port} in ${config.environment} mode`);
    });
  } catch (error) {
    console.error("Failed to start the server:", error);
    process.exit(1);
  }
})();