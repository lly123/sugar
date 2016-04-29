import _ from "underscore";
import {Talker} from "../room/Talker";

class Service {
    constructor(id) {
        this._s_id = id;
    }
}

_.extend(Service.prototype, Talker);

export {
    Service
}