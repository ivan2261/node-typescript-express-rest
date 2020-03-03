import * as express from 'express';
import * as path from 'path';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as health from 'express-ping';
import * as expressValidator from 'express-validator';

import { useExpressServer, useContainer, Action } from 'routing-controllers';
import { Container } from 'typedi';

import { setupLogging } from './Logging';
import { setupSwagger } from './Swagger';
import { setupAuth } from './Authentication';

export class ExpressConfig {

    app: express.Express;

    constructor() {
        this.app = express();

        setupSwagger(this.app);
        setupLogging(this.app);
        setupAuth(this.app);

        this.app.use(cors());
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(health.ping());
        this.app.use(expressValidator());

        this.setupControllers();
    }

    setupControllers() {
        useContainer(Container);

        useExpressServer(this.app, {
            defaultErrorHandler: false,
            controllers: [path.resolve(__dirname, '../controllers/*')],
            middlewares: [path.resolve(__dirname, '../middlewares/*')],
            interceptors: [path.resolve(__dirname, '../interceptors/*')],

            authorizationChecker: async (action: Action, roles: string[]) => {
                const token = action.request.headers['authorization'];
                // TODO: 权限控制
                return true;
            }
        });
    }

}
