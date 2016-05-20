import _ from "underscore";
import io from "socket.io-client";
import {Room} from "../room/Room";
import {REPLY_GROUP_PREFIX} from "../room/Member";
import {setAdd} from "../util/lang";

const SOCKET_MEMBER_ID = "__socket-io__";

class RoomClient extends Room {
    constructor(url) {
        super();
        this._socket = io.connect(url);

        return new Promise((resolve, reject) => {
            const send_remote_message = m => {
                if (!m.__remote__) {
                    this._socket.emit("clientMessage", m);
                }
            };

            const relay_message = m => {
                const groupName = `${REPLY_GROUP_PREFIX}-${m.id}`;
                this._emitter.once(groupName, m => {
                    setAdd(m.in_groups, groupName);
                    this._socket.emit("clientMessage", m);
                });
                m.__remote__ = true;
                m.in_groups.forEach(g => this._emitter.emit(g, m));
            };

            this._socket._s_id = SOCKET_MEMBER_ID;
            this._socket.on("connect_error", () => reject(this));

            this._socket.on("connect", () => {
                this._socket.on("serverEvents", events => {
                    events.forEach(e => {
                        this.join(this._socket, e.groupNames).then(s => {
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
                    resolve(this);
                });
            });

            this._socket.on("serverMessage", m => {
                if (_.isArray(m)) {
                    m.forEach(v => relay_message(v));
                } else {
                    relay_message(m);
                }
            });
        });
    }

    __registerEvent(id, groupNames, type, event) {
        if (id.indexOf(SOCKET_MEMBER_ID) != 0) {
            this._socket.emit("clientEvent", {
                groupNames: groupNames,
                type: type,
                event: event
            });
        }
    }
}

export {
    RoomClient
}
