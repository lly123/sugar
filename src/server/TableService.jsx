import ReactMixin from 'react-mixin';
import Service from '../components/server/Service'

export default class extends Service {
    constructor(id) {
        super(id);
        this.call(this._tableJoinRoom).from("t01").done();
    }

    _tableJoinRoom(message) {
        console.log('----**** ', message);
        this._say('LALALA!!!');
    }
}