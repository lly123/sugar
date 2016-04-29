import Socket from "socket.io";
import {Room} from "../room/Room";

export class RoomServer extends Room {
    constructor(server) {
        super();
        this.io = Socket(server);
        this.io.on('connection', socket => {
            console.log('Client has connected.');

            socket.on('message', remoteMsg => {
                remoteMsg.message._reply = message => {
                    socket.emit('message', {
                        groupName: remoteMsg.originalGroupName,
                        message: message
                    })
                };
                this.sendToRooms(remoteMsg.groupNames, remoteMsg.message);
            });
        });
    }
}
