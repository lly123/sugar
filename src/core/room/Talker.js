import _ from "underscore";

const Talker = {
    joinedRoom() {
        this.say('JoinRoom');
    },

    say(event, data = null) {
        var message = {
            from: this._s_id,
            type: this._s_type,
            event: event
        };

        if (data) {
            message.data = data;
        }

        this._s_room.send(this, message);
    },

    reply(remoteMsg, event, data) {
        remoteMsg._reply({
            from: this._s_id,
            type: this._s_type,
            event: event,
            data: data
        });
    },

    _onMessage(room, message) {
        console.log(`Member [${this._s_id}] get message in room [${room.name}]:`, message);

        for (let v of this._s_callbacks) {
            if (v.condition.event && (v.condition.event !== message.event)) {
                continue;
            }

            if (v.condition.id && (v.condition.id !== message.from)) {
                continue;
            }

            if (v.condition.type && (v.condition.type !== message.type)) {
                continue;
            }

            v.func.call(v.condition.owner, message);
        }
    }
};

var Caller = {
    on(event) {
        if (this.condition) {
            this.condition.event = event;
            return this;
        } else {
            var ret = _.clone(this.self);
            ret.condition = {
                owner: this,
                event: event
            };
            return ret;
        }
    },

    from(id) {
        if (this.condition) {
            this.condition.id = id;
            return this;
        } else {
            var ret = _.clone(this.self);
            ret.condition = {
                owner: this,
                id: id
            };
            return ret;
        }
    },

    ofType(type) {
        if (this.condition) {
            this.condition.type = type;
            return this;
        } else {
            var ret = _.clone(this.self);
            ret.condition = {
                owner: this,
                type: type
            };
            return ret;
        }
    },

    call(func) {
        if (_.isEmpty(this.condition)) {
            throw `Need to set conditions when call ${func.name}`
        }
        this.condition.owner._s_callbacks = this.condition.owner._s_callbacks || [];
        this.condition.owner._s_callbacks.push({
            condition: this.condition,
            func: func
        });
    }
};
Caller.self = Caller;

_.extend(Talker, Caller);

export {
    Talker
};
