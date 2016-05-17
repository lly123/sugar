import _ from "underscore";
import {Promise} from "es6-promise";
import uuid from "uuid";
import {info} from "../util/logger";
import {setAdd} from "../util/lang";


const PromisePipe = require('promise-pipe')();
const REPLY_GROUP_PREFIX = "__reply__";
const EVENT_REGEX = /^([^@]*)@?(.*)$/;
const EMPTY_FUNC = () => {
};


class Member {
    constructor(room, id) {
        this._room = room;
        this._id = id;
        this._groupNames = [];
        this._pipelines = [];
    }

    static create(room, memberInst) {
        const member = new Member(room, memberInst._s_id);
        memberInst.$ = member;

        info(`Created member [${member._id}]`);
        return member;
    }

    addGroup(groupName) {
        setAdd(this._groupNames, groupName, () =>
            this._room._emitter.on(groupName, this.__onMessage.bind(this, this._pipelines)));
    }

    say(event, data = undefined) {
        const message_id = uuid.v4();

        const promise = new Promise(resolve => {
            this._room._emitter.once(`${REPLY_GROUP_PREFIX}-${message_id}`, this.__onMessage.bind(this, [resolve]));
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

    on(event) {
        return this.__addPipeline(this.__eventPipeline(event));
    }

    on_all(...events) {
        let cache = {
            events: [],
            messages: []
        };
        let ret = PromisePipe();

        let eventPipelines = _.map(events, e => this.__eventPipeline(e, cache).then(() => {
            if (_.isEmpty(_.difference(events, cache.events))) {
                cache.events.splice(0, cache.events.length);
                ret(cache.messages);
            }
        }));

        this.__addPipeline(m => _.each(eventPipelines, p => p(m)));
        return ret;
    }

    on_race(...events) {
        let cache = {
            events: [],
            messages: []
        };
        let ret = PromisePipe();

        let eventPipelines = _.map(events, e => this.__eventPipeline(e, cache).then(() => {
            if (!_.isEmpty(cache.events)) {
                cache.events.splice(0, cache.events.length);
                ret(cache.messages[0]);
            }
        }));

        this.__addPipeline(m => _.each(eventPipelines, p => p(m)));
        return ret;
    }

    __onMessage(pipelines, message) {
        message.reply = data => {
            return this.say(`${REPLY_GROUP_PREFIX}-${message.id}`, data);
        };

        pipelines.forEach(p => {
            if (message.from != this._id) {
                p(message);
            }
        });
    }

    __addPipeline(pipeline) {
        this._pipelines.push(pipeline);
        return pipeline;
    }

    __eventPipeline(event, cache = undefined) {
        if (!_.isString(event) || _.isEmpty(event)) {
            throw `The format of event [${event}] is illegal.`
        }

        const match = EVENT_REGEX.exec(event);
        if (!match) {
            throw `The format of event [${event}] is illegal.`
        }

        let event_matcher = m => _.isEmpty(match[1]) ?
            true :
            ("event" in m) ?
                (match[1].match(/^\/.+\/$/) ? eval(match[1]).test(m["event"]) : match[1] == m["event"]) :
                false;

        let id_matcher = m => _.isEmpty(match[2]) ? true : ("from" in m) && (m["from"] == match[2]);

        let matcher = m => {
            if (cache && _.any(cache.events, e => e == event)) {
                return m;
            }

            if (event_matcher(m) && id_matcher(m)) {
                if (cache) {
                    setAdd(cache.events, event);
                    setAdd(cache.messages, m, EMPTY_FUNC, EMPTY_FUNC, m => m.id);
                }
                return m;
            }
            throw m;
        };

        return PromisePipe().then(matcher);
    }
}

export {
    Member
}
