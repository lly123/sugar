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
        elem.__sgId = attrs['sgId'];

        let talkerPromise = new Promise(resolve => {
            scope.__sg_joinGroup(elem, resolve);
        });

        elem.$sg = fn => {
            talkerPromise.then(talker => fn(talker))
        };
    }
}

export {
    sgId
}
