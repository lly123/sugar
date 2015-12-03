import _ from 'underscore';
import Socket from 'socket.io-client'
import Room from '../common/room/Room';

export class RoomClient extends Room {
    constructor(url) {
        super();
        this._connection = Socket(url);
    }

    bridge(localRoomName, remoteRoomName) {
        const room = this._findRoom(localRoomName) || this._createRoom(localRoomName);
        if (!_.find(room.linkedRooms, r => r === remoteRoomName)) {
            room.linkedRooms.push(remoteRoomName);
        }
    }

    send(member, message) {
        const roomMember = super.send(member, message);
        _.each(roomMember.rooms, r => {
            if (!_.isEmpty(r.linkedRooms)) {
                this._connection.emit('message', {
                    rooms: r.linkedRooms,
                    message: message
                });
            }
        });
    }
}

export default function (url) {
    return new RoomClient(url);
}