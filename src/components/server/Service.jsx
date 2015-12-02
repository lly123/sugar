import ReactMixin from 'react-mixin';
import Talker from '../common/room/Talker'

export class Service {
    constructor(id) {
        this.id = id;
        this.type = 'service'
    }
}

ReactMixin(Service.prototype, Talker);
export {Service as default}