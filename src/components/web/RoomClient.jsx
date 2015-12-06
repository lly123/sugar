import _ from 'underscore';
import Socket from 'socket.io-client'
import Room from '../common/room/Room';

export class RoomClient extends Room {
    constructor(url) {
        super();
        this._connection = Socket(url);
        this._connection.on('message', remoteMsg => {
            _.each(remoteMsg.rooms, r => this._emitter.emit(r, remoteMsg.message));
            console.log('%%%%%########@@@@@@ ', remoteMsg);
        });
    }

    bridge(localRoomName, remoteRoomName) {
        const room = this._findRoom(localRoomName) || this._createRoom(localRoomName);
        if (!_.find(room.linkedRooms, r => r === remoteRoomName)) {
            room.linkedRooms.push(remoteRoomName);
        }
    }

    send(memberInst, message) {
        super.send(memberInst, message, roomMember => {
            _.each(roomMember.rooms, r => {
                if (!_.isEmpty(r.linkedRooms)) {
                    this._connection.emit('message', {
                        remoteRoom: r.name,
                        rooms: r.linkedRooms,
                        message: message
                    });
                }
            });
        });
    }
}

export default function (url) {
    return new RoomClient(url);
}