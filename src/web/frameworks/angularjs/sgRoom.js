import {Promise} from "es6-promise";
import {Room} from "../../../core/room/Room";
import {RoomClient} from "../../../core/client/RoomClient";

class sgRoom {
    constructor() {
        this.restrict = 'A';
        this.controllerAs = 'sgRoomCtrl';
        this.link = {
            pre: this.preLink
        };

        this._room = Promise.resolve(new Room());
    }

    controller() {
    }

    preLink(scope, elem, attrs) {
        if (attrs['sgRoom']) {
            this._room = new RoomClient(attrs['sgRoom']);
        }

        scope.__sg_joinRoom = (groupName, elem, fn) => {
            this._room.then(r => r.join(elem, groupName).then(talker => fn(talker)));
        };

        scope.__sg_quitRoom = elem => {
            this._room.then(r => r.quit(elem));
        };
    }
}

export {
    sgRoom
}
