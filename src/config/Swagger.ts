import * as fs from 'fs';
import * as path from 'path';
import * as swaggerTools from 'swagger-tools';

export function setupSwagger(app) {
    // resolve the spec
    const spath = path.resolve('./dist/spec.json');
    const file = fs.readFileSync(spath, 'utf8');
    const spec = JSON.parse(file);

    // setup middleware swagger middleware in express
    swaggerTools.initializeMiddleware(spec, (middleware) => {
        app.use(middleware.swaggerUi());
        app.use(middleware.swaggerMetadata());
        app.use(middleware.swaggerValidator({
            validateResponse: true
        }));
    });
}
