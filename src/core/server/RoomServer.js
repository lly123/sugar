import io from "socket.io";
import {Room} from "../room/Room";
import {info} from "../util/logger";

const SOCKET_MEMBER_ID_PREFIX = "__socket-io__";

export class RoomServer extends Room {
    constructor(server) {
        super();
        this._io = io.listen(server);
        this._events = [];

        this._io.on('connection', socket => {
            info(`Client [${socket.id}] has connected.`);
            socket._s_id = `${SOCKET_MEMBER_ID_PREFIX}-${socket.id}`;

            socket.on("clientEvent", e => {
                this.join(socket, e.groupNames).then(s => {
                    if (e.type == "normal") {
                        s.on(e.event).then(m => {
                            if (!m.__remote__) {
                                socket.emit("serverMessage", m)
                            }
                        });
                    }
                });
            });

            socket.on("clientMessage", m => {
                m.__remote__ = true;
                m.in_groups.forEach(g => this._emitter.emit(g, m));
            });

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
