import { ExpressConfig } from './Express';
import { setupSockets } from './Socket';
import { connectMongo } from './Mongo';
import { logger } from '../common/logger';
import * as config from 'config';
import { cron } from '../jobs/cron';

export class Application {

    server: any;
    express: ExpressConfig;

    constructor() {
        // Connect to MongoDB
        connectMongo();

        this.express = new ExpressConfig();

        const port = config.get('ports.http');
        const debugPort = config.get('ports.debug');
        const loglevel = config.get('loglevel');

        // Start Webserver
        this.server = this.express.app.listen(port, () => {
            logger.info(`
    ------------
    Server Started!
    App is running in ${this.express.app.get('env')} mode
    Logging initialized at ${loglevel} level

    Http: http://localhost:${port}
    Health: http://localhost:${port}/ping

    API Docs: http://localhost:${port}/docs
    API Spec: http://localhost:${port}/api-docs
    ------------
            `);
        });

        // Start Websockets
        setupSockets(this.server);

        // Register cron job
        cron.start();
    }

}
