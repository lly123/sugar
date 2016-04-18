import _ from "underscore";
import Talker from "../room/Talker";

class Service {
    constructor(id) {
        this._s_id = id;
        this._s_type = 'service'
    }
}

_.extend(Service.prototype, Talker);
export {Service as default}