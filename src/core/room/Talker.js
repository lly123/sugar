import _ from "underscore";

const EVENT_REGEX = /^([^@]*)@?(.*)$/;

const Talker = {
    say(event, data = undefined) {
        return this._s_inst.send(event, data);
    },

    on(event) {
        if (!_.isString(event) || _.isEmpty(event)) {
            throw "Event is illegal."
        }

        const match = EVENT_REGEX.exec(event);
        if (match) {
            let event_matcher = m => _.isEmpty(match[1]) ?
                true :
                ("event" in m) ?
                    (match[1].match(/^\/.+\/$/) ? eval(match[1]).test(m["event"]) : match[1] == m["event"]) :
                    false;

            let id_matcher = m => _.isEmpty(match[2]) ? true : ("from" in m) && (m["from"] == match[2]);

            let matcher = m => event_matcher(m) && id_matcher(m) ? m : undefined;

            return {
                _matcher: matcher,
                then: func => this._s_inst.addCallback(matcher, func)
            }
        }
    },

    on_all(...events) {
        let event_matchers = _.map(events, e => Talker.on(e)._matcher);

        const matcher = _.partial((s, m) => {
            let not_matches = _.filter(event_matchers, f => _.isUndefined(f(m)));

            if (event_matchers.length == not_matches.length) {
                return undefined;
            }

            s.push(m);

            if (not_matches.length == 0) {
                return s;
            }

            event_matchers = not_matches;
            return undefined;
        }, []);

        return {
            then: func => this._s_inst.addCallback(matcher, func)
        }
    },

    on_any(...events) {
        const event_matchers = _.map(events, e => Talker.on(e)._matcher);
        const matcher = m => _.find(event_matchers, f => !_.isUndefined(f(m))) ? m : undefined;

        return {
            then: func => this._s_inst.addCallback(matcher, func)
        }
    }
};

export {
    Talker
};
