import _ from 'underscore';

const JOIN_ROOM = 'JoinRoom';

const Talker = {
    _say(event) {
        this._s_room.send(this, {
            from: this._s_id,
            type: this._s_type,
            event: event
        });
    },

    _joinedRoom() {
        this._say(JOIN_ROOM);
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
    },

    call(func) {
        var condition = {
            owner: this
        };

        const builder = {
            on(event) {
                condition.event = event;
                return builder;
            },

            from(id) {
                condition.id = id;
                return builder;
            },

            ofType(type) {
                condition.type = type;
                return builder;
            },

            done() {
                if (_.isEmpty(condition)) {
                    throw `Need to set conditions when call ${func.name}`
                }

                console.log('XXXXXX ', condition.event, condition.id, condition.type);

                condition.owner._s_callbacks = condition.owner._s_callbacks || [];
                condition.owner._s_callbacks.push({
                    condition: condition,
                    func: func
                });
            }
        };

        return builder;
    }
};

export {Talker as default};