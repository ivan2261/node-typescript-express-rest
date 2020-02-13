import { Interceptor, InterceptorInterface, Action } from 'routing-controllers';
import { Request } from 'express';

@Interceptor()
export class ResponseDataFormatter implements InterceptorInterface {

    intercept(action: Action, content: Request) {

        return action.response.send({
            success: true,
            data: content
        });
    }
}
