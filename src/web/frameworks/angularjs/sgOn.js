import {Promise} from "es6-promise";
import {OnMessageExpressionExecutor} from "../util/OnMessageExpressionExecutor";

class sgOn {
    constructor() {
        this.restrict = 'A';
        this.require = ['^sgRoom', '^sgGroup', '^sgId'];
        this.link = {
            pre: this.preLink
        }
    }

    preLink(scope, elem, attrs) {
        elem.$sg(talker => {
            new OnMessageExpressionExecutor(talker, scope, attrs['sgOn']).run();
        });
    }
}

export {
    sgOn
}
