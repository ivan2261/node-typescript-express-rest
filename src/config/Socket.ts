import * as io from 'socket.io';
import * as socketioJwt from 'socketio-jwt';
import * as config from 'config';
import * as glob from 'glob';
import * as path from 'path';
import { defaultMetadataRegistry } from 'event-dispatch/MetadataRegistry';
import { logger } from '../common/logger';

// include subscribers dynamically
let files = glob.sync('./dist/subscribers/*.js');
files.map(f => { return require(path.resolve(f)); });

export function setupSockets(app) {
    let server = io(app);

    // use jwt
    server.use(socketioJwt.authorize({
        secret: config.get('auth.jwt_secret').toString(),
        handshake: true
    }));

    server.use((socket: any, next) => {
        socket.request.user = socket.decoded_token;
        return next();
    });

    server.on('connection', (socket) => {
        logger.info('Web Sockets initalized');

        // bind applicable subscribers to the socket
        defaultMetadataRegistry
            .collectEventsHandlers
            .forEach(eventHandler => {
                const eventNamesForThisHandler = Object.keys(eventHandler);
                eventNamesForThisHandler.forEach(eventName => {
                    const callback = eventHandler[eventName];
                    socket.on(eventName, (data) => {
                        callback({ socket, data });
                    });
                });
            });
    });

    return io;
}
