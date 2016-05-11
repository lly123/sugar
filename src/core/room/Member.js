import _ from "underscore";
import {Promise} from "es6-promise";
import uuid from "uuid";
import {info} from "../util/logger";
import {Talker} from "../room/Talker";

const REPLY_GROUP_PREFIX = "__reply__";

class Member {
    constructor(room, id) {
        this._room = room;
        this._id = id;
        this._groupNames = [];
        this._callbacks = [];
    }

    static create(room, memberInst) {
        const member = new Member(room, memberInst._s_id);
        member._inst = memberInst;

        memberInst.$ = _.extend({
            _s_inst: member
        }, Talker);

        info(`Created member [${member._id}]`);
        return member;
    }

    addGroup(groupName) {
        if (!_.find(this._groupNames, n => n == groupName)) {
            this._groupNames.push(groupName);
            this._room._emitter.on(groupName, this.onMessage.bind(this, this._callbacks));
        }
    }

    send(event, data = undefined) {
        const message_id = uuid.v4();

        const promise = new Promise(resolve => {
            this._room._emitter.once(`${REPLY_GROUP_PREFIX}-${message_id}`, this.onMessage.bind(this, [
                {
                    matcher: m => m,
                    func: m => resolve(m)
                }
            ]));
        });

        const message = {
            id: message_id,
            from: this._id
        };

        if (data) {
            message['data'] = data;
        }

        if (event.indexOf(REPLY_GROUP_PREFIX) == 0) {
            this._room._emitter.emit(event, message);
        } else {
            message['event'] = event;
            this._groupNames.forEach(n => this._room._emitter.emit(n, message));
        }

        return promise;
    }

    onMessage(callbacks, message) {
        message.reply = data => {
            return this.send(`${REPLY_GROUP_PREFIX}-${message.id}`, data);
        };

        callbacks.forEach(c => {
            if (message.from != this._id) {
                let ret = c.matcher(message);
                if (!_.isUndefined(ret)) {
                    c.func.call(this, ret);
                }
            }
        });
    }

    addCallback(matcher, func) {
        this._callbacks.push({
            matcher: matcher,
            func: func
        });
    }
}

export {
    Member
}
