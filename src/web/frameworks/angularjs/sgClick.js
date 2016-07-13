import {EventExpressionExecutor} from "../util/EventExpressionExecutor";

class sgClick {
    constructor() {
        this.restrict = 'A';
        this.require = ['^sgRoom', '^sgGroup', '^sgId'];
    }

    link(scope, elem, attrs) {
        elem.on("click", () => {
            scope.__sg_talker.then(t => new EventExpressionExecutor(t, scope, attrs['sgClick']).run());
        })
    }
}

export {
    sgClick
}
