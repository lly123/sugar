import _ from "underscore";
import {Promise} from "es6-promise";
import uuid from "uuid";
import {info} from "../util/logger";
import {Talker} from "../room/Talker";
import {setAdd} from "../util/lang";

const REPLY_GROUP_PREFIX = "__reply__";

class Member {
    constructor(room, id) {
        this._room = room;
        this._id = id;
        this._groupNames = [];
        this._pipelines = [];
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
        setAdd(this._groupNames, groupName, () =>
            this._room._emitter.on(groupName, this.onMessage.bind(this, this._pipelines)));
    }

    send(event, data = undefined) {
        const message_id = uuid.v4();

        const promise = new Promise(resolve => {
            this._room._emitter.once(`${REPLY_GROUP_PREFIX}-${message_id}`, this.onMessage.bind(this, [resolve]));
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

    onMessage(pipelines, message) {
        message.reply = data => {
            return this.send(`${REPLY_GROUP_PREFIX}-${message.id}`, data);
        };

        pipelines.forEach(p => {
            if (message.from != this._id) {
                p(message);
            }
        });
    }

    addPipeline(pipeline) {
        this._pipelines.push(pipeline);
        return pipeline;
    }
}

export {
    Member
}
