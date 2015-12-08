import ReactMixin from 'react-mixin';
import Service from '../components/server/Service'

export default class extends Service {
    constructor(id) {
        super(id);
        this.call(this._tableJoinRoom).on('JoinRoom').from("t01").done();
    }

    _tableJoinRoom(message) {
        this.reply(message, 'InitData', {
            header: ['Title1', 'Title2', 'Title3'],
            rows: [
                ['Row 1-1', 'Row 1-2', 'Row 1-3'],
                ['Row 2-1', 'Row 2-2', 'Row 2-3']
            ]
        });
    }
}