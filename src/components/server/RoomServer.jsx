import _ from 'underscore';
import Socket from 'socket.io'
import Room from '../common/room/Room';

export class RoomServer extends Room {
    constructor(server) {
        super();
        this.io = Socket(server);
        this.io.sockets.on('connection', socket => {
            console.log('Client has connected.');
            socket.on('message', remoteMsg => super._send(remoteMsg.rooms, remoteMsg.message));
        });
    }
}

export default function (server) {
    return new RoomServer(server);
}