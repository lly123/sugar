const ON_MESSAGE_ATTR_REGEX = /^(.+?)>>(.+)$/;
const ON_MESSAGE_FUNC_REGEX = /^(.+?)>(.+)$/;

class OnMessageExpressionExecutor {
    constructor(talker, scope, expression) {
        this._talker = talker;
        this._scope = scope;
        this._expression = expression;
    }

    run() {
        let ret = this.__parse();
        switch (ret.type) {
            case 1:
                this._talker.on(ret.on).then(message => this._scope[ret.attr] = message.data);
                break;
            case 2:
                this._talker.on(ret.on).then(this._scope[ret.func].bind(this._talker));
                break;
        }
    }

    __parse() {
        var group;

        group = this._expression.match(ON_MESSAGE_ATTR_REGEX);
        if (group) {
            return {
                type: 1,
                on: group[1],
                attr: group[2]
            }
        }

        group = this._expression.match(ON_MESSAGE_FUNC_REGEX);
        if (group) {
            return {
                type: 2,
                on: group[1],
                func: group[2]
            }
        }
    }
}

export {
    OnMessageExpressionExecutor
}
