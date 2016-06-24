import _ from "underscore";
import {Promise} from "es6-promise";
import {Room} from "../../../core/room/Room";
import {RoomClient} from "../../../core/client/RoomClient";

class sgRoom {
    constructor() {
        this.restrict = 'A';
        this.controllerAs = 'sgRoomCtrl';
        this.link = {
            pre: this.preLink,
            post: this.postLink
        };

        this._room = Promise.resolve(new Room());
        this._members = [];
    }

    controller($attrs) {
    }

    preLink(scope, elem, attrs) {
        if (attrs['sgRoom']) {
            this._room = new RoomClient(attrs['sgRoom']);
        }

        scope.__sg_joinRoom = (groupName, elem, fn) => this._members.push({
            groupName: groupName,
            elem: elem,
            resolve: fn
        });
    }

    postLink() {
        this._room.then(r =>
            Promise.all(_.map(this._members, m => r.join(m.elem, m.groupName))).then(talkers =>
                _.each(_.zip(_.map(this._members, m => m.resolve), talkers), v => v[0](v[1]))
            )
        );
    }
}

export {
    sgRoom
}
