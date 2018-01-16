import PubSub from './lib/pubsub-js';

export default class ErrorHandler {
    publishErrors(obj) {
        for(let i = 0; i < obj.errors.length; i++){
            PubSub.publish("validation-error", obj.errors[i]);
        }
    }
}