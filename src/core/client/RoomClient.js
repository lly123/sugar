import io from "socket.io-client";
import {Room} from "../room/Room";

class RoomClient extends Room {
    constructor(url) {
        super();
        this._socket = io.connect(url);

        this._socket.on('connect', () => {
            this._socket.emit('groupNames', this._groupNames);
        });

        //
        // this._connection.on('message', remoteMsg => {
        //     this.sendToGroups([remoteMsg.groupName], remoteMsg.message);
        // });
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
