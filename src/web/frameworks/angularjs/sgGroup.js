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
        let groupNames = attrs['sgGroup'].trim().split(/\s*,\s*/);

        scope.__sg_joinGroup = (elem, fn) => {
            groupNames.forEach(groupName => {
                new Promise((resolve) => {
                    scope.__sg_joinRoom(groupName, elem, resolve)
                }).then((talker) => fn(talker))
            });
        }
    }
}

export {
    sgGroup
}
