import Events from "events";
import {toArray, setAdd} from "../util/lang";
import {Member, REPLY_GROUP_PREFIX} from "./Member";
import {Promise} from "es6-promise";
import {info} from "../util/logger";

const EventEmitter = Events.EventEmitter;

class Room {
    constructor() {
        this._emitter = new EventEmitter();
        this._groupNames = [];
    }

    join(memberInst, groupName) {
        const member = memberInst.$ || Member.create(this, memberInst);

        toArray(groupName).forEach(n => {
            setAdd(this._groupNames, n);
            member.addGroup(n);
        });

        return Promise.resolve(memberInst.$);
    }

    static send_to_remote(socket, remoteMessageEvent, message) {
        if (!message.__remote__) {
            socket.emit(remoteMessageEvent, message);
        }
    }

    static relay_message(socket, remoteMessageEvent, message) {
        const groupName = `${REPLY_GROUP_PREFIX}-${message.id}`;

        this._emitter.once(groupName, m => {
            setAdd(m.in_groups, groupName);
            socket.emit(remoteMessageEvent, m);
        });

        message.__remote__ = true;
        message.in_groups.forEach(g => this._emitter.emit(g, message));
    }

    __registerEvent(groupNames, type, event) {
        info(`Registered event [${event}] of type [${type}] in [${groupNames}]`);
    }
}

export {
    Room
}
