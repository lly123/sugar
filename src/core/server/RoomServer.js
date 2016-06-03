import io from "socket.io";
import {Room} from "../room/Room";
import {info} from "../util/logger";
import {toArray} from "../util/lang";

const SOCKET_MEMBER_ID_PREFIX = "__socket-io__";

export class RoomServer extends Room {
    constructor(server) {
        super();
        this._io = io.listen(server);
        this._events = [];

        this._io.on('connection', socket => {
            const send_to_remote = Room.send_to_remote.bind(this, socket, "serverMessage");
            const relay_message = Room.relay_message.bind(this, socket, "serverMessage");

            info(`Client [${socket.id}] has connected.`);
            socket._s_id = `${SOCKET_MEMBER_ID_PREFIX}-${socket.id}`;

            socket.on("clientEvent", e => {
                this.join(socket, e.groupNames).then(s => s[e.type](...toArray(e.event)).then(send_to_remote));
            });

            socket.on("clientMessage", m => toArray(m).forEach(v => relay_message(v)));

            socket.emit("serverEvents", this._events);
        });

        return Promise.resolve(this);
    }

    __registerEvent(id, groupNames, type, event) {
        if (id.indexOf(SOCKET_MEMBER_ID_PREFIX) != 0) {
            const data = {
                groupNames: groupNames,
                type: type,
                event: event
            };
            this._io.sockets.emit("serverEvents", [data]);
            this._events.push(data);
        }
    }
}
