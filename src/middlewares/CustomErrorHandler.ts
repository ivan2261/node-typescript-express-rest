import { Middleware, ExpressErrorMiddlewareInterface } from 'routing-controllers';
import { CustomError } from '../common/customError';

@Middleware({ type: 'after' })
export class CustomErrorHandler implements ExpressErrorMiddlewareInterface {

    error(error: any, request: any, response: any, next: (err?: any) => any) {
        if (!(error instanceof CustomError)) {
            if (error.name == 'UnauthorizedError') {
                return response.status('401').send({
                    success: false,
                    error: { code: '-1', message: 'Forbidden' }
                });
            }

            error = new CustomError('unexpected error', error.message);
        }

        return response.status('500').send({
            success: false,
            error: error.toJSON()
        });
    }
}
