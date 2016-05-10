import Socket from "socket.io";
import {Room} from "../room/Room";
import {unionDictValue} from "../util/lang";


export class RoomServer extends Room {
    constructor(server) {
        super();
        this._clientGroups = {};
        this._io = Socket(server);

        this._io.on('connection', socket => {
            console.log('Client has connected.');

            socket.emit('groups', _.map(this._groups, g => g.name));

            socket.on('groups', groupNames => {
                groupNames.forEach(groupName => {
                    unionDictValue(this._clientGroups, groupName, [socket], s => s.id);
                })
            });

            socket.on('message', remoteMsg => {
                remoteMsg.message._reply = message => {
                    socket.emit('message', {
                        groupName: remoteMsg.originalGroupName,
                        message: message
                    })
                };
                this.sendToGroups(remoteMsg.groupNames, remoteMsg.message);
            });
        });
    }

    groupRegistered(group) {
        this._io.sockets.emit('groups', [group.name]);
    }
}
