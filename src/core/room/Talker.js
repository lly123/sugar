import _ from "underscore";
import {Promise} from "es6-promise";
import {setAdd} from "../util/lang";

const PromisePipe = require('promise-pipe')();
const EVENT_REGEX = /^([^@]*)@?(.*)$/;
const EMPTY_FUNC = () => {
};

const Talker = {
    say(event, data = undefined) {
        return this._s_inst.send(event, data);
    },

    on(event) {
        return this._s_inst.addPipeline(this.__eventPipeline(event));
    },

    on_all(...events) {
        let cache = {
            events: [],
            messages: []
        };
        let eventPipelines = _.map(events, e => this.__eventPipeline(e, cache));
        let ret = PromisePipe();

        this._s_inst.addPipeline(m => {
            _.each(eventPipelines, p => {
                p(m).then(() => {
                    if (_.isEmpty(_.difference(events, cache.events))) {
                        cache.events.splice(0, cache.events.length);
                        ret(cache.messages);
                    }
                });
            });
        });

        return ret;
    },

    // on_all(...events) {
    //     let event_matchers = _.map(events, e => Talker.on(e)._matcher);
    //
    //     const matcher = _.partial((s, m) => {
    //         let not_matches = _.filter(event_matchers, f => _.isUndefined(f(m)));
    //
    //         if (event_matchers.length == not_matches.length) {
    //             return undefined;
    //         }
    //
    //         s.push(m);
    //
    //         if (not_matches.length == 0) {
    //             return s;
    //         }
    //
    //         event_matchers = not_matches;
    //         return undefined;
    //     }, []);
    //
    //     return {
    //         then: func => this._s_inst.addCallback(matcher, func)
    //     }
    // },
    //
    // on_any(...events) {
    //     const event_matchers = _.map(events, e => Talker.on(e)._matcher);
    //     const matcher = m => _.find(event_matchers, f => !_.isUndefined(f(m))) ? m : undefined;
    //
    //     return {
    //         then: func => this._s_inst.addCallback(matcher, func)
    //     }
    // }

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
};

export {
    Talker
};
