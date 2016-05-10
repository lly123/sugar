import _ from "underscore";
import Events from "events";
import {toArray} from "../util/lang";
import {Member} from "./Member";

const EventEmitter = Events.EventEmitter;

class Room {
    constructor() {
        this._emitter = new EventEmitter();
    }

    join(memberInst, groupName) {
        const member = memberInst._s_inst || Member.create(this, memberInst);
        _.map(toArray(groupName), groupName => member.addGroup(groupName));
        member.send('joined');
    }

    groupRegistered(group) {
        throw 'Abstract method for implementation'
    }
}

export {
    Room
}
