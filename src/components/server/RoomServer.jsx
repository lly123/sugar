import _ from 'underscore';
import Socket from 'socket.io'
import Room from '../common/room/Room';

export class RoomServer extends Room {
    constructor(server) {
        super();
        this.io = Socket(server);
        this.io.on('connection', socket => {
            console.log('Client has connected.');
            socket.on('message', remoteMsg => {
                remoteMsg.message.reply = event => {
                    socket.emit('message', {
                        roomName: remoteMsg.originalRoomName,
                        message: {
                            from: this._s_id,
                            type: this._s_type,
                            event: event
                        }
                    });
                };
                this.sendToRooms(remoteMsg.roomNames, remoteMsg.message);
            });
        });
    }
}

export default function (server) {
    return new RoomServer(server);
}