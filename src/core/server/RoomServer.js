import _ from "underscore";
import io from "socket.io";
import {Room} from "../room/Room";
import {REPLY_GROUP_PREFIX} from "../room/Member";
import {info} from "../util/logger";
import {setAdd} from "../util/lang";

const SOCKET_MEMBER_ID_PREFIX = "__socket-io__";

export class RoomServer extends Room {
    constructor(server) {
        super();
        this._io = io.listen(server);
        this._events = [];

        this._io.on('connection', socket => {
            const send_remote_message = m => {
                if (!m.__remote__) {
                    socket.emit("serverMessage", m);
                }
            };

            const relay_message = m => {
                const groupName = `${REPLY_GROUP_PREFIX}-${m.id}`;
                this._emitter.once(groupName, m => {
                    setAdd(m.in_groups, groupName);
                    socket.emit("serverMessage", m);
                });
                m.__remote__ = true;
                m.in_groups.forEach(g => this._emitter.emit(g, m));
            };

            info(`Client [${socket.id}] has connected.`);
            socket._s_id = `${SOCKET_MEMBER_ID_PREFIX}-${socket.id}`;

            socket.on("clientEvent", e => {
                this.join(socket, e.groupNames).then(s => {
                    switch (e.type) {
                        case "on":
                            s.on(e.event).then(send_remote_message);
                            break;
                        case "on_all":
                            s.on_all(...e.event).then(send_remote_message);
                            break;
                    }
                });
            });

            socket.on("clientMessage", m => {
                if (_.isArray(m)) {
                    m.forEach(v => relay_message(v));
                } else {
                    relay_message(m);
                }
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
