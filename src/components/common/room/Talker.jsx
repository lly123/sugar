const JOIN_ROOM = 'JoinRoom';

const Talker = {
    _joinedRoom() {
        this.room.send(this, {
            from: this.id,
            type: this.type,
            event: JOIN_ROOM
        });
    },

    _onMessage(room, message) {
        console.log(`Member [${this.id}] get message in room [${room.name}]:`, message);
    }
};

export {Talker as default};