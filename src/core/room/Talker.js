import _ from "underscore";

const Talker = {
    say(event, data = undefined) {
        this._s_room.send(this, {
            from: this._s_id,
            event: event,
            data: data
        });
    },

    reply(remoteMsg, event, data = undefined) {
        remoteMsg._reply({
            from: this._s_id,
            event: event,
            data: data
        });
    },

    _onMessage(group, message) {
        console.log(`Member [${this._s_id}] got message in group [${group.name}]:`, message);

        for (let v of this._s_callbacks) {
            if (v.condition(message)) {
                v.func.call(v.self, message);
            }
        }
    }
};

const new_condition = function (self) {
    var ret = _.clone(Caller);
    ret.self = self;
    ret.condition = _ => true;
    return ret;
};

const Caller = {
    on(event) {
        var ret = this.condition ? this : new_condition(this);
        const previous = ret.condition;
        ret.condition = message => event == message.event && previous(message);
        return ret;
    },

    from(id) {
        var ret = this.condition ? this : new_condition(this);
        const previous = ret.condition;
        ret.condition = message => id == message.from && previous(message);
        return ret;
    },

    call(func) {
        if (!this.condition) {
            throw `Need to set conditions before call ${func.name}`
        }

        this.self._s_callbacks = this.self._s_callbacks || [];
        this.self._s_callbacks.push({
            self: this.self,
            condition: this.condition,
            func: func
        });
    }
};

_.extend(Talker, Caller);

export {
    Talker
};
