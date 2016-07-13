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
        scope.__sg_talker.then(t => new OnMessageExpressionExecutor(t, scope, attrs['sgOn']).run())
    }
}

export {
    sgOn
}
