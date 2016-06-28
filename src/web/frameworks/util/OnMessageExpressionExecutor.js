const ON_MESSAGE_ATTR_REGEX = /^(.+?)>>(.+)$/;
const ON_MESSAGE_FUNC_REGEX = /^(.+?)>(.+)$/;
const EVENT_AND_SPLITTER = /\s*&\s*/;
const EVENT_OR_SPLITTER = /\s*\|\s*/;

class OnMessageExpressionExecutor {
    constructor(talker, scope, expr) {
        this._talker = talker;
        this._scope = scope;
        this._expr = expr.trim();
    }

    run() {
        let ret = OnMessageExpressionExecutor.__parse(this._expr);
        switch (ret.type) {
            case 1:
                this.__on_event(ret.on).then(message => this._scope.$apply(this._scope[ret.attr] = message.data));
                break;
            case 2:
                this.__on_event(ret.on).then(this._scope[ret.func].bind(this._talker));
                break;
        }
    }

    static __parse(expr) {
        var group;

        group = expr.match(ON_MESSAGE_ATTR_REGEX);
        if (group) {
            return {
                type: 1,
                on: group[1].trim(),
                attr: group[2].trim()
            }
        }

        group = expr.match(ON_MESSAGE_FUNC_REGEX);
        if (group) {
            return {
                type: 2,
                on: group[1].trim(),
                func: group[2].trim()
            }
        }
    }

    __on_event(on) {
        if (on.search(EVENT_AND_SPLITTER) > -1) {
            return this._talker.on_all(...on.split(EVENT_AND_SPLITTER));
        }

        if (on.search(EVENT_OR_SPLITTER) > -1) {
            return this._talker.on_race(...on.split(EVENT_OR_SPLITTER));
        }

        return this._talker.on(on);
    }
}

export {
    OnMessageExpressionExecutor
}
