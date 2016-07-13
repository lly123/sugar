import {Promise} from "es6-promise";

class sgId {
    constructor() {
        this.restrict = 'A';
        this.require = ['^sgRoom', '^sgGroup'];
        this.controllerAs = 'sgIdCtrl';
        this.link = {
            pre: this.preLink
        }
    }

    controller() {
    }

    preLink(scope, elem, attrs) {
        scope.__sg_talker = new Promise(resolve => {
            elem.__sgId = attrs['sgId'];

            scope.__sg_joinGroup(elem, talker => {
                scope.$on('$destroy', () => scope.__sg_quitRoom(elem));
                resolve(talker)
            })
        })
    }
}

export {
    sgId
}
