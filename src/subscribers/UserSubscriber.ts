import { EventSubscriber, On } from 'event-dispatch';

@EventSubscriber()
export class UserSubscriber {

    @On('onUserCreate')
    onUserCreate({ socket, name }) {
        // console.log('name', socket, name);
    }

}
