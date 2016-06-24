const EVENT_MESSAGE_ATTR_REGEX = /^(.+?):(.+?)>>(.+)$/;
const EVENT_MESSAGE_FUNC_REGEX = /^(.+?):(.+?)>(.+)$/;
const EVENT_ATTR_REGEX = /^(.+?)>>(.+)$/;
const EVENT_FUNC_REGEX = /^(.+?)>(.+)$/;
const EVENT_MESSAGE_REGEX = /^(.+?):(.+)$/;
const FUNC_REGEX = /^>(.+)$/;
const EVENT_REGEX = /^(.+)$/;
const EVENT_SPLITTER = /\s*,\s*/;

class EventExpressionExecutor {
    constructor(talker, scope, expression) {
        this._talker = talker;
        this._scope = scope;
        this._expressions = expression.trim().split(EVENT_SPLITTER);
    }

    run() {
        this._expressions.forEach(expr => {
            let ret = EventExpressionExecutor.__parse(expr);
            switch (ret.type) {
                case 1:
                    this._talker.say(ret.event, this._scope[ret.message])
                        .then(message => this._scope[ret.attr] = message.data);
                    break;
                case 2:
                    this._talker.say(ret.event, this._scope[ret.message])
                        .then(this._scope[ret.func].bind(this._talker));
                    break;
                case 3:
                    this._talker.say(ret.event)
                        .then(message => this._scope[ret.attr] = message.data);
                    break;
                case 4:
                    this._talker.say(ret.event)
                        .then(this._scope[ret.func].bind(this._talker));
                    break;
                case 5:
                    this._talker.say(ret.event, this._scope[ret.message]);
                    break;
                case 6:
                    this._scope[ret.func].call(this._talker);
                    break;
                case 7:
                    this._talker.say(ret.event);
                    break;
            }
        });
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
}

export {
    EventExpressionExecutor
}
