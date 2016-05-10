import _ from "underscore";
import Socket from "socket.io-client";
import {Room} from "../room/Room";
import {union} from "../util/lang";

export class RoomClient extends Room {
    constructor(url) {
        super();
        this._remoteGroups = [];
        this._connection = Socket(url);

        this._connection.on('groups', groupNames => {
            this._remoteGroups = union(this._remoteGroups, groupNames);
        });

        this._connection.on('message', remoteMsg => {
            this.sendToGroups([remoteMsg.groupName], remoteMsg.message);
        });
    }

    groupRegistered(group) {
        this._connection.emit('groups', [group.name]);
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
