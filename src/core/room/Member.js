import _ from "underscore";
import {Promise} from "es6-promise";
import uuid from "uuid";
import {info} from "../util/logger";
import {setAdd, EMPTY_FUNC} from "../util/lang";

const PromisePipe = require('promise-pipe')();
const REPLY_GROUP_PREFIX = "__reply__";
const EVENT_REGEX = /^([^@]*)@?(.*)$/;

class Member {
    constructor(room, id) {
        this._room = room;
        this._id = id;
        this._groups = [];
        this._pipelines = [];
        this._registerEventCallback = room.__registerEvent.bind(room);
    }

    static create(room, memberInst) {
        const member = new Member(room, memberInst.__sgId);
        memberInst.$__sgInst__ = member;

        info(`Created member [${member._id}]`);
        return member;
    }

    quit() {
        this._groups.forEach(g => {
            g.quit();
            info(`Member [${this._id}] has quited group [${g.name}]`)
        });
    }

    addGroup(groupName) {
        let messageHandler = this.__onMessage.bind(this, groupName, this._pipelines);

        let group = {
            name: groupName,
            join: () => this._room._emitter.on(groupName, messageHandler),
            quit: () => this._room._emitter.removeListener(groupName, messageHandler)
        };

        setAdd(this._groups, group, () => {
            group.join();
            info(`Member [${this._id}] has joined group [${group.name}]`)
        }, EMPTY_FUNC, v => v.name);
    }

    say(event, data = undefined) {
        const message_id = uuid.v4();

        const promise = new Promise(resolve => {
            const groupName = `${REPLY_GROUP_PREFIX}-${message_id}`;
            const listener = this.__onMessage.bind(this, groupName, [resolve]);
            this._room._emitter.once(groupName, listener);
            setTimeout(() => this._room._emitter.removeListener(groupName, listener), this._room._replyTimeout);
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
            this._groups.forEach(g => this._room._emitter.emit(g.name, message));
        }

        return promise;
    }

    on(event) {
        let ret = this.__addPipeline(this.__eventPipeline(event));
        this._registerEventCallback(this._id, _.map(this._groups, g => g.name), 'on', event);
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
        this._registerEventCallback(this._id, _.map(this._groups, g => g.name), 'on_all', events);
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
        this._registerEventCallback(this._id, _.map(this._groups, g => g.name), 'on_race', events);
        return ret;
    }

    __onMessage(groupName, pipelines, message) {
        if (message.from == this._id) return;

        message.reply = data => {
            return this.say(`${REPLY_GROUP_PREFIX}-${message.id}`, data);
        };

        pipelines.forEach(p => {
            setAdd(message.in_groups, groupName);
            p(message);
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
