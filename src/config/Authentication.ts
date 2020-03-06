import * as config from 'config';
import * as expressJwt from 'express-jwt';

const whiteList = [
    /^\/docs/,
    /^\/api-docs/,
    /^\/ping/
];

export function setupAuth(app) {
    app.use(expressJwt({
        secret: config.get('auth.jwt_secret').toString(),
        getToken: fromHeaderOrQuerystring
    }).unless({
        path: whiteList
    }));
}

function fromHeaderOrQuerystring(req) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        return req.headers.authorization.split(' ')[1];
    } else if (req.query && req.query.token) {
        return req.query.token;
    }
    return null;
}
