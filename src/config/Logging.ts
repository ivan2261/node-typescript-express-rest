import { logger } from '../common/logging';

export function setupLogging(app) {
    app.use(expressLogging());
}

function expressLogging() {
    return (req: any, res: any, next: () => any) => {
        const start = new Date().getTime();

        next();

        let logLevel: string = 'info';
        if (req.status >= 500) {
            logLevel = 'error';
        } else if (req.status >= 400) {
            logLevel = 'warn';
        } else if (req.status >= 100) {
            logLevel = 'info';
        }

        const ms = new Date().getTime() - start;
        const msg: string = `${req.method} ${req.originalUrl} ${req.status} ${ms}ms`;

        logger.log(logLevel, msg);
    };
}
