import io from "socket.io";
import {Room} from "../room/Room";


export class RoomServer extends Room {
    constructor(server) {
        super();
        this._io = io.listen(server);

        this._io.on('connection', socket => {
            console.log(`Client [${socket.id}] has connected.`);
        });

        return Promise.resolve(this);
    }

    // groupRegistered(group) {
    //     this._io.sockets.emit('groups', [group.name]);
    // }
}
