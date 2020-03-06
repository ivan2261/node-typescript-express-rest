import { EventSubscriber, On } from 'event-dispatch';

@EventSubscriber()
export class UserSubscriber {

    @On('onUserCreate')
    onUserCreate({ socket, data }) {
        console.log(data);
    }

}
