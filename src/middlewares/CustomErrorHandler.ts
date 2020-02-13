import { Middleware, ExpressErrorMiddlewareInterface } from 'routing-controllers';
import { CustomError } from '../common/customError';

@Middleware({ type: 'after' })
export class CustomErrorHandler implements ExpressErrorMiddlewareInterface {

    error(error: any, request: any, response: any, next: (err?: any) => any) {
        if (!(error instanceof CustomError)) {
            error = new CustomError('unexpected error', error.message);
        }

        return response.send({
            success: false,
            error: error.toJSON()
        });
    }
}
