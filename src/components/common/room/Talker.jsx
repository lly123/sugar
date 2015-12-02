const Talker = {
    joinedRoom(roomName) {
        this.room.send(this, {
            from: this.id,
            room: roomName,
            type: this.type,
            title: "OKOKOK!!!"
        });
    }
};

export {Talker as default};