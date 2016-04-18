import Socket from "socket.io";
import Room from "../room/Room";

export class RoomServer extends Room {
    constructor(server) {
        super();
        this.io = Socket(server);
        this.io.on('connection', socket => {
            console.log('Client has connected.');
            socket.on('message', remoteMsg => {
                remoteMsg.message._reply = message => {
                    socket.emit('message', {
                        roomName: remoteMsg.originalRoomName,
                        message: message
                    })
                };
                this.sendToRooms(remoteMsg.roomNames, remoteMsg.message);
            });
        });
    }
}

export default function (server) {
    return new RoomServer(server);
}