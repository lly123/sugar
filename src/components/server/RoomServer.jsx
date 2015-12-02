import Socket from 'socket.io'
import Room from '../common/room/Room';

export class RoomServer extends Room {
    constructor(server) {
        super();
        this.io = Socket(server);
        this.io.sockets.on('connection', function (socket) {
            console.log('XXXXXX connected !!!');
        });
    }
}

export default function (server) {
    return new RoomServer(server);
}