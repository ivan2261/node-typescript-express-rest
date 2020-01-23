import * as winston from 'winston';
import * as config from 'config';

const options: winston.LoggerOptions = {
    level: config.get('loglevel'),
    transports: [
        // - Write all logs error (and below) to `error.log`.
        new winston.transports.File({ filename: 'error.log', level: 'error' }),

        // - Write to all logs with specified level to console.
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        })
    ]
};

export const logger = winston.createLogger(options);

process.on('unhandledRejection', function (reason, p) {
    logger.warn('Possibly Unhandled Rejection at: Promise ', p, ' reason: ', reason);
});
