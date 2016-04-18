import ReactMixin from "react-mixin";
import Talker from "../room/Talker";

export class Service {
    constructor(id) {
        this._s_id = id;
        this._s_type = 'service'
    }
}

ReactMixin(Service.prototype, Talker);
export {Service as default}