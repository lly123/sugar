import _ from "underscore";
import Socket from "socket.io-client";
import {Room} from "../room/Room";

export class RoomClient extends Room {
    constructor(url) {
        super();
        this._connection = Socket(url);
        this._connection.on('message', remoteMsg => {
            this.sendToRooms([remoteMsg.groupName], remoteMsg.message);
        });
    }

    bridge(groupName, remoteGroupName) {
        const group = _.find(this._groups, g => g.name === groupName) || this._createGroup(groupName);
        if (!_.find(group.remoteGroupNames, r => r === remoteGroupName)) {
            group.remoteGroupNames.push(remoteGroupName);
        }
    }

    send(memberInst, message) {
        const member = super.send(memberInst, message);
        _.each(member.groups, g => {
            if (!_.isEmpty(g.remoteGroupNames)) {
                this._connection.emit('message', {
                    originalGroupName: g.name,
                    groupNames: g.remoteGroupNames,
                    message: message
                });
            }
        });
    }
}
