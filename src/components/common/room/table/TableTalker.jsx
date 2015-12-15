import _ from 'underscore';
import Talker from '../Talker'

var TableTalker = {
    listen() {
        this.on('InitData').call(this._init);
    },

    _init(message) {
        this.setState(message.data);
    }
};

_.extend(TableTalker, Talker);
export {TableTalker as default};