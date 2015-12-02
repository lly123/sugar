const Talker = {
    joinedRoom() {
        this.room.send(this, {
            from: this.id,
            type: this.type,
            title: "OKOKOK!!!"
        });
    }
};

export {Talker as default};