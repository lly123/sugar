import {Promise} from "es6-promise";

class sgGroup {
    constructor() {
        this.restrict = 'A';
        this.require = '^sgRoom';
        this.controllerAs = 'sgGroupCtrl';
        this.link = {
            pre: this.preLink
        }
    }

    controller() {
    }

    preLink(scope, elem, attrs) {
        let groupName = attrs['sgGroup'];

        scope.__sg_joinGroup = (elem, fn) => {
            new Promise((resolve) => {
                scope.__sg_joinRoom(groupName, elem, resolve)
            }).then((talker) => fn(talker))
        }
    }
}

export {
    sgGroup
}
