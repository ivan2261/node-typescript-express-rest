import * as config from 'config';
import * as passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import * as expressJwt from 'express-jwt';

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeader(),
    secretOrKey: config.get('auth.jwt_secret').toString()
};

function verify(payload, done) {
    const id = payload.sub;
    return id !== undefined;
    /*
    User.findOne({ id: jwt_payload.sub }, (err, user) => {
        if (err) return done(err, false);
  
        if (user) {
          done(null, user);
        } else {
          done(null, false);
          // or you could create a new account
        }
    });
    */
}

export function setupAuth(app) {
    // app.use(passport.initialize());
    // passport.use(new JwtStrategy(opts, verify));

    app.use(expressJwt({
        secret: config.get('auth.jwt_secret').toString(),
        getToken: fromHeader
    }).unless({ path: [/^\/docs/, /^\/api-docs/, /^\/ping/] }));
}

function fromHeader(req) {
    const tokenHeader = req.headers.Authorization || req.headers.authorization;
    if (tokenHeader && (tokenHeader as string).split(' ')[0] === 'Bearer') {
        return (tokenHeader as string).split(' ')[1];
    }
}
