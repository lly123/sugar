import Socket from 'socket.io-client'
import Room from '../common/room/Room';

export class RoomClient extends Room {
    constructor(url) {
        super();
        this._connection = Socket(url);
    }

    bridge(localRoomName, remoteRoomName) {
    }
}

export default function (url) {
    return new RoomClient(url);
}