import io from "socket.io-client";
import {Room} from "../room/Room";

class RoomClient extends Room {
    constructor(url) {
        super();
        this._socket = io.connect(url);

        return new Promise((resolve, reject) => {
            this._socket.on('connect', () => resolve(this));
            this._socket.on('connect_error', () => reject(this));
        });
    }

    // groupRegistered(group) {
    //     this._connection.emit('groups', [group.name]);
    // }
    //
    // send(memberInst, message) {
    //     const member = super.send(memberInst, message);
    //
    //     _.each(member.groups, g => {
    //         if (!_.isEmpty(g.remoteGroupNames)) {
    //             this._connection.emit('message', {
    //                 originalGroupName: g.name,
    //                 groupNames: g.remoteGroupNames,
    //                 message: message
    //             });
    //         }
    //     });
    // }
}

export {
    RoomClient
}
