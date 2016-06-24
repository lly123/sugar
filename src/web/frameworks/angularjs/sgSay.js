import {Promise} from "es6-promise";
import {EventExpressionExecutor} from "../util/EventExpressionExecutor";

class sgSay {
    constructor() {
        this.restrict = 'A';
        this.require = ['^sgRoom', '^sgGroup', '^sgId'];
        this.link = {
            pre: this.preLink
        }
    }

    preLink(scope, elem, attrs) {
        elem.$sg(talker => {
            new EventExpressionExecutor(talker, scope, attrs['sgSay']).run();
        });
    }
}

export {
    sgSay
}
