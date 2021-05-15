process.env['NODE_CONFIG_DIR'] = __dirname + '/configs';

import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import Routes from '@/interfaces/route.interface';
import errorMiddleware from '@middlewares/error.middleware';
import { logger, stream } from '@utils/logger';

const App = (routes: Routes[]) => {
  const app: express.Application = express();
  const port: string | number = process.env.PORT || 3000;
  const env: string = process.env.NODE_ENV || 'development';

  const listen = (): void => {
    app.listen(port, () => {
      logger.info(`=================================`);
      logger.info(`======= ENV: ${env} =======`);
      logger.info(`🚀 App listening on the port ${port}`);
      logger.info(`=================================`);
    });
  }

  const getServer = (): express.Application => {
    return app;
  }

  const initializeMiddlewares = (): void => {
    if (env === 'production') {
      app.use(morgan('combined', { stream }));
      app.use(cors({ origin: 'your.domain.com', credentials: true }));
    } else {
      app.use(morgan('dev', { stream }));
      app.use(cors({ origin: true, credentials: true }));
    }

    app.use(hpp());
    app.use(helmet());
    app.use(compression());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());
  }

  const initializeRoutes = (): void => {
    routes.forEach(route => {
      app.use('/', route.router);
    });
  }

  const initializeSwagger = (): void => {
    const options = {
      swaggerDefinition: {
        info: {
          title: 'REST API',
          version: '1.0.0',
          description: 'Example docs',
        },
      },
      apis: ['swagger.yaml'],
    };

    const specs = swaggerJSDoc(options);
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
  }

  const initializeErrorHandling = (): void => {
    app.use(errorMiddleware);
  }

  return {
    getServer, listen, initializeErrorHandling,
    initializeMiddlewares, initializeRoutes, initializeSwagger,
  }
}

export default App;
