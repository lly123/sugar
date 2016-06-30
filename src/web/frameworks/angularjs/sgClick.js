import {EventExpressionExecutor} from "../util/EventExpressionExecutor";

class sgClick {
    constructor() {
        this.restrict = 'A';
        this.require = ['^sgRoom', '^sgGroup', '^sgId'];
    }

    link(scope, elem, attrs) {
        elem.on("click", () => {
            elem.$sg(talker => {
                new EventExpressionExecutor(talker, scope, attrs['sgClick']).run();
            });
        });
    }
}

export {
    sgClick
}
