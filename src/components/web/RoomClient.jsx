import _ from 'underscore';
import Socket from 'socket.io-client'
import Room from '../common/room/Room';

export class RoomClient extends Room {
    constructor(url) {
        super();
        this._connection = Socket(url);
        this._connection.on('message', remoteMsg => {
            console.log('%%%%%########@@@@@@ ', remoteMsg);
            this.sendToRooms([remoteMsg.roomName], remoteMsg.message);
        });
    }

    bridge(localRoomName, remoteRoomName) {
        const room = this._findRoom(localRoomName) || this._createRoom(localRoomName);
        if (!_.find(room.remoteRoomNames, r => r === remoteRoomName)) {
            room.remoteRoomNames.push(remoteRoomName);
        }
    }

    send(memberInst, message) {
        var roomMember = super.send(memberInst, message);
        _.each(roomMember.rooms, r => {
            if (!_.isEmpty(r.remoteRoomNames)) {
                this._connection.emit('message', {
                    originalRoomName: r.name,
                    roomNames: r.remoteRoomNames,
                    message: message
                });
            }
        });
    }
}

export default function (url) {
    return new RoomClient(url);
}