import Events from "events";
import {toArray, setAdd} from "../util/lang";
import {Member} from "./Member";
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

    __registerEvent(groupNames, type, event) {
        info(`Registered event [${event}] of type [${type}] in [${groupNames}]`);
    }
}

export {
    Room
}
