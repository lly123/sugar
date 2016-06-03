import _ from "underscore";
import {Promise} from "es6-promise";
import uuid from "uuid";
import {info} from "../util/logger";
import {setAdd} from "../util/lang";

const PromisePipe = require('promise-pipe')();
const REPLY_GROUP_PREFIX = "__reply__";
const EVENT_REGEX = /^([^@]*)@?(.*)$/;

class Member {
    constructor(room, id) {
        this._room = room;
        this._id = id;
        this._groupNames = [];
        this._pipelines = [];
        this._registerEventCallback = room.__registerEvent.bind(room);
    }

    static create(room, memberInst) {
        const member = new Member(room, memberInst._s_id);
        memberInst.$ = member;

        info(`Created member [${member._id}]`);
        return member;
    }

    addGroup(groupName) {
        setAdd(this._groupNames, groupName, () =>
            this._room._emitter.on(groupName, this.__onMessage.bind(this, groupName, this._pipelines)));
    }

    say(event, data = undefined) {
        const message_id = uuid.v4();

        const promise = new Promise(resolve => {
            const groupName = `${REPLY_GROUP_PREFIX}-${message_id}`;
            this._room._emitter.once(groupName, this.__onMessage.bind(this, groupName, [resolve]));
        });

        const message = {
            id: message_id,
            from: this._id,
            in_groups: [],
            __remote__: false
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
        let ret = this.__addPipeline(this.__eventPipeline(event));
        this._registerEventCallback(this._id, this._groupNames, 'on', event);
        return ret;
    }

    on_all(...events) {
        let cache = [];
        let ret = PromisePipe();

        let eventPipelines = _.map(events, e => this.__eventPipeline(e, cache).then(() => {
            if (_.isEmpty(_.difference(events, _.map(cache, c => c.event)))) {
                let messages = _.map(cache, c => c.message);
                cache.splice(0, cache.length);
                ret(messages);
            }
        }));

        this.__addPipeline(m => _.each(eventPipelines, p => p(m)));
        this._registerEventCallback(this._id, this._groupNames, 'on_all', events);
        return ret;
    }

    on_race(...events) {
        let cache = [];
        let ret = PromisePipe();

        let eventPipelines = _.map(events, e => this.__eventPipeline(e, cache).then(() => {
            if (!_.isEmpty(cache)) {
                let message = cache[0].message;
                cache.splice(0, cache.length);
                ret(message);
            }
        }));

        this.__addPipeline(m => _.each(eventPipelines, p => p(m)));
        return ret;
    }

    __onMessage(groupName, pipelines, message) {
        message.reply = data => {
            return this.say(`${REPLY_GROUP_PREFIX}-${message.id}`, data);
        };

        pipelines.forEach(p => {
            if (message.from != this._id) {
                setAdd(message.in_groups, groupName);
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

        let message_matcher = m => {
            if (event_matcher(m) && id_matcher(m)) {
                if (cache) {
                    let item = _.find(cache, c => c.event == event);
                    if (item) {
                        item.message = m;
                    } else {
                        cache.push({
                            event: event,
                            message: m
                        });
                    }
                }
                return m;
            }
            throw m;
        };

        return PromisePipe().then(message_matcher);
    }
}

export {
    Member, REPLY_GROUP_PREFIX
}
