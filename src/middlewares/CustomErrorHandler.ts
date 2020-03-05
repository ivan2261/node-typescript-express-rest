import { Middleware, ExpressErrorMiddlewareInterface } from 'routing-controllers';
import { CustomError } from '../common/customError';

@Middleware({ type: 'after' })
export class CustomErrorHandler implements ExpressErrorMiddlewareInterface {

    error(err: any, request: any, response: any, next: (err?: any) => any) {
        if (!(err instanceof CustomError)) {
            if (err.name == 'UnauthorizedError') {
                if (err.originalError && err.originalError.name == 'TokenExpiredError') {
                    return response.status('401').send({
                        success: false,
                        error: { code: '-1', message: 'login timeout' }
                    });
                } else {
                    return response.status('403').send({
                        success: false,
                        error: { code: '-1', message: 'forbidden' }
                    });
                }
            } else {
                err = new CustomError('unexpected error', err.message);
                return response.status('500').send({
                    success: false,
                    error: err.toJSON()
                });
            }
        } else {
            return response.status('200').send({
                success: false,
                error: err.toJSON()
            });
        }
    }
}
