const Talker = {
    joinedRoom() {
        this.room.send(this, {
            title: "OKOKOK!!!"
        });
    }
};

export {Talker as default};