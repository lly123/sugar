import _ from 'underscore';
import Talker from '../Talker'

var TableTalker = {
    listen() {
        this.call(this._init).on('InitData').done();
    },

    _init(message) {
        this.setState(message.data);
    }
};

_.extend(TableTalker, Talker);
export {TableTalker as default};