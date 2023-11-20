import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';

class Pienut {
  constructor() {
    dotenv.config();
    this.app = express();
    this.app.use(cookieParser());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));

    // Initialize empty arrays to store middleware and routes
    this.middlewareStack = [];
    this.routeStack = [];
  }

  useRoute(path, router) {
    this.routeStack.push({ path, router });
  }

  useMiddleware(middleware) {
    this.middlewareStack.push(middleware);
  }

  useCors(corsOptions) {
    this.app.use(cors(corsOptions));
  }

  start() {
    // Register all middleware
    this.middlewareStack.forEach((middleware) => {
      this.app.use(middleware);
    });

    // Register all routes
    this.routeStack.forEach((route) => {
      this.app.use(route.path, route.router);
    });

    // Handle 404 route
    this.app.all('*', (req, res) => {
      res.status(404).json({
        success: false,
        status: 404,
        message: `Route [${req.path}] not found`,
      });
    });

    // Handle internal errors
    this.app.use((err, req, res, next) => {
      if (res.headersSent) {
        return next(err);
      }
      if (err) {
        console.log('error:', err);
        const appDebug =
          process.env.APP_DEBUG.toLowerCase() == 'true' ? true : false;

        let statusCode = err.status || 500;
        let errorMessage = {};

        if (parseInt(statusCode / 100) == 5) {
          // internal server error, show it only in debug mode
          errorMessage = appDebug ? err.message : 'Internal server error';
        } else {
          // other errors, show the message
          errorMessage = err.message;
        }

        res.status(statusCode).json({
          success: false,
          status: statusCode,
          message: errorMessage,
        });
      } else {
        next();
      }
    });

    // Start listening on the port
    const PORT = process.env.PORT || 9859;
    this.app.listen(PORT, () => {
      console.log(`Pienut dev server is running on ${PORT}`);
    });
  }
}

export default Pienut;
