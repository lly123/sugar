import Events from "events";
import {toArray, setAdd} from "../util/lang";
import {Member} from "./Member";
import {Promise} from "es6-promise";

const EventEmitter = Events.EventEmitter;

class Room {
    constructor() {
        this._emitter = new EventEmitter();
        this._groupNames = [];
        return Promise.resolve(this);
    }

    join(memberInst, groupName) {
        const member = memberInst._s_inst || Member.create(this, memberInst);

        toArray(groupName).forEach(n => {
            setAdd(this._groupNames, n);
            member.addGroup(n);
        });

        return Promise.resolve(memberInst.$);
    }
}

export {
    Room
}
