import _ from "underscore";

const EVENT_MESSAGE_ATTR_REGEX = /^(.+?):(.+?)>>(.+)$/;
const EVENT_MESSAGE_FUNC_REGEX = /^(.+?):(.+?)>(.+)$/;
const EVENT_ATTR_REGEX = /^(.+?)>>(.+)$/;
const EVENT_FUNC_REGEX = /^(.+?)>(.+)$/;
const EVENT_MESSAGE_REGEX = /^(.+?):(.+)$/;
const FUNC_REGEX = /^>(.+)$/;
const EVENT_REGEX = /^(.+)$/;

const FIELD_SPLITTER = /\s*,\s*/;

const OBJECT_MESSAGE = /^\{(.+?)}$/;

const APPEND_ATTR = /^\+(.+)$/;
const DEL_ATTR = /^\-(.+?)(?:\s*\((.+?)\))?$/;

class EventExpressionExecutor {
    constructor(talker, scope, expr) {
        this._talker = talker;
        this._scope = scope;
        this._expr = expr.trim();
    }

    run() {
        let ret = EventExpressionExecutor.__parse(this._expr);
        switch (ret.type) {
            case 1:
                this._talker.say(ret.event, this.__generateEventMessage(ret.message))
                    .then(m => this._scope.$apply(
                        () => EventExpressionExecutor.scope_attr_setter(this._scope, ret.attr, m.data)));
                break;
            case 2:
                this._talker.say(ret.event, this.__generateEventMessage(ret.message))
                    .then(m => this._scope.$apply(() => this._scope[ret.func].call(this._talker, m)));
                break;
            case 3:
                this._talker.say(ret.event)
                    .then(m => this._scope.$apply(
                        () => EventExpressionExecutor.scope_attr_setter(this._scope, ret.attr, m.data)));
                break;
            case 4:
                this._talker.say(ret.event)
                    .then(m => this._scope.$apply(() => this._scope[ret.func].call(this._talker, m)));
                break;
            case 5:
                this._talker.say(ret.event, this.__generateEventMessage(ret.message));
                break;
            case 6:
                this._scope.$apply(() => this._scope[ret.func].call(this._talker));
                break;
            case 7:
                this._talker.say(ret.event);
                break;
        }
    }

    static __parse(expr) {
        var group;

        group = expr.match(EVENT_MESSAGE_ATTR_REGEX);
        if (group) {
            return {
                type: 1,
                event: group[1].trim(),
                message: group[2].trim(),
                attr: group[3].trim()
            }
        }

        group = expr.match(EVENT_MESSAGE_FUNC_REGEX);
        if (group) {
            return {
                type: 2,
                event: group[1].trim(),
                message: group[2].trim(),
                func: group[3].trim()
            }
        }

        group = expr.match(EVENT_ATTR_REGEX);
        if (group) {
            return {
                type: 3,
                event: group[1].trim(),
                attr: group[2].trim()
            }
        }

        group = expr.match(EVENT_FUNC_REGEX);
        if (group) {
            return {
                type: 4,
                event: group[1].trim(),
                func: group[2].trim()
            }
        }

        group = expr.match(EVENT_MESSAGE_REGEX);
        if (group) {
            return {
                type: 5,
                event: group[1].trim(),
                message: group[2].trim()
            }
        }

        group = expr.match(FUNC_REGEX);
        if (group) {
            return {
                type: 6,
                func: group[1].trim()
            }
        }

        group = expr.match(EVENT_REGEX);
        if (group) {
            return {
                type: 7,
                event: group[1].trim()
            }
        }
    }

    __generateEventMessage(message) {
        let match = message.match(OBJECT_MESSAGE);
        if (match) {
            let self = this;
            let fields = match[1].trim().split(FIELD_SPLITTER);
            let o = {};
            fields.forEach(f => {
                let replace_dot_in_field_with_underscore = f.replace(/\./g, '_');
                o[replace_dot_in_field_with_underscore] = eval("self._scope." + f);
            });
            return o
        } else {
            return eval("this._scope." + message)
        }
    }

    static scope_attr_setter(scope, attr, data) {
        var match;

        match = attr.match(APPEND_ATTR);
        if (match) {
            attr = match[1];
            if (scope[attr] && _.isArray(scope[attr])) {
                scope[attr].push(data)
            } else {
                scope[attr] = [data]
            }
            return
        }

        match = attr.match(DEL_ATTR);
        if (match) {
            attr = match[1];
            let fields = match[2].trim().split(FIELD_SPLITTER);

            if (scope[attr] && _.isArray(scope[attr])) {
                let arr = scope[attr];
                for (let i = arr.length - 1; i >= 0; i--) {
                    if (EventExpressionExecutor.is_same_object(arr[i], data, fields)) arr.splice(i, 1);
                }
            }
            return
        }

        scope[attr] = data
    }

    static is_same_object(o1, o2, fields) {
        return _.isEqual(_.pick(o1, ...fields), _.pick(o2, ...fields))
    }
}

export {
    EventExpressionExecutor
}
