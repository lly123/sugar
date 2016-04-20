import _ from "underscore";
import {Talker} from "../../core/room/Talker";

var TableTalker = {
    listen() {
        this.on('InitData').call(this._init);
    },

    _init(message) {
        this.setState(message.data);
    }
};

_.extend(TableTalker, Talker);

export {
    TableTalker
};