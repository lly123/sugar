const Talker = {
    joinedRoom() {
        this.room.send(this, {
            from: this.id,
            title: "OKOKOK!!!"
        });
    }
};

export {Talker as default};