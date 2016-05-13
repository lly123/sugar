import Events from "events";
import {toArray, setAdd} from "../util/lang";
import {Member} from "./Member";

const EventEmitter = Events.EventEmitter;

class Room {
    constructor() {
        this._emitter = new EventEmitter();
        this._groupNames = [];
    }

    join(memberInst, groupName) {
        const member = memberInst._s_inst || Member.create(this, memberInst);

        toArray(groupName).forEach(n => {
            setAdd(this._groupNames, n);
            member.addGroup(n);
        });

        member.send('joined');
    }
}

export {
    Room
}
