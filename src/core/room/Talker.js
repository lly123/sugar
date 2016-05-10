import _ from "underscore";


const add_condition = function (self, func) {
    var ret = self;
    if (!ret.condition) {
        ret = _.clone(Talker);
        ret.self = self;
        ret.condition = m => true;
    }

    const previous = ret.condition;
    ret.condition = m => func(m) && previous(m);
    return ret;
};

const Talker = {
    say(event, data = undefined) {
        return this._s_inst.send(event, data);
    },

    on(event) {
        return add_condition(this, m => m["event"] == event);
    },

    from(id) {
        return add_condition(this, m => m["from"] == id);
    },

    then(func) {
        if (this.condition) {
            this.self._s_inst.addCallback(this.condition, func);
        }
    }
};

export {
    Talker
};
