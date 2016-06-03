import io from "socket.io-client";
import {Room} from "../room/Room";
import {toArray} from "../util/lang";

const SOCKET_MEMBER_ID = "__socket-io__";

class RoomClient extends Room {
    constructor(url) {
        super();
        this._socket = io.connect(url);

        return new Promise((resolve, reject) => {
            const send_to_remote = Room.send_to_remote.bind(this, this._socket, "clientMessage");
            const relay_message = Room.relay_message.bind(this, this._socket, "clientMessage");
            
            this._socket._s_id = SOCKET_MEMBER_ID;
            this._socket.on("connect_error", () => reject(this));

            this._socket.on("connect", () => {
                this._socket.on("serverEvents", events => {
                    events.forEach(e => {
                        this.join(this._socket, e.groupNames).then(s => {
                            switch (e.type) {
                                case "on":
                                    s.on(e.event).then(send_to_remote);
                                    break;
                                case "on_all":
                                    s.on_all(...e.event).then(send_to_remote);
                                    break;
                            }
                        });
                    });
                    resolve(this);
                });
            });

            this._socket.on("serverMessage", m => {
                toArray(m).forEach(v => relay_message(v));
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
