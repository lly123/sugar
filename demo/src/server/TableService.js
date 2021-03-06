import {Service} from "../../../build/sugar";

export class TableService extends Service {
    constructor(id) {
        super(id);
        this.from("t01").on('joined').call(this._tableJoinRoom);
    }

    _tableJoinRoom(message) {
        this.reply(message, 'InitData', {
            header: ['Title1', 'Title2', 'Title3'],
            rows: [
                ['Row 1-1', 'Row 1-2', 'Row 1-3'],
                ['Row 2-1', 'Row 2-2', 'Row 2-3'],
                ['Row 2-1', 'Row 2-2', 'Row 2-3'],
                ['Row 2-1', 'Row 2-2', 'Row 2-3'],
                ['Row 2-1', 'Row 2-2', 'Row 2-3'],
                ['Row 2-1', 'Row 2-2', 'Row 2-3'],
                ['Row 2-1', 'Row 2-2', 'Row 2-3'],
                ['Row 2-1', 'Row 2-2', 'Row 2-3'],
                ['Row 2-1', 'Row 2-2', 'Row 2-3'],
                ['Row 2-1', 'Row 2-2', 'Row 2-3'],
                ['Row 2-1', 'Row 2-2', 'Row 2-3'],
                ['Row 2-1', 'Row 2-2', 'Row 2-3'],
                ['Row 2-1', 'Row 2-2', 'Row 2-3'],
                ['Row 2-1', 'Row 2-2', 'Row 2-3'],
                ['Row 2-1', 'Row 2-2', 'Row 2-3'],
                ['Row 2-1', 'Row 2-2', 'Row 2-3'],
                ['Row 2-1', 'Row 2-2', 'Row 2-3'],
                ['Row 2-1', 'Row 2-2', 'Row 2-3'],
                ['Row 2-1', 'Row 2-2', 'Row 2-3'],
                ['Row 2-1', 'Row 2-2', 'Row 2-3'],
                ['Row 2-1', 'Row 2-2', 'Row 2-3'],
                ['Row 2-1', 'Row 2-2', 'Row 2-3'],
                ['Row 2-1', 'Row 2-2', 'Row 2-3'],
                ['Row 2-1', 'Row 2-2', 'Row 2-3'],
                ['Row 2-1', 'Row 2-2', 'Row 2-3'],
                ['Row 2-1', 'Row 2-2', 'Row 2-3'],
                ['Row 2-1', 'Row 2-2', 'Row 2-3'],
                ['Row 2-1', 'Row 2-2', 'Row 2-3'],
                ['Row 2-1', 'Row 2-2', 'Row 2-3'],
                ['Row 2-1', 'Row 2-2', 'Row 2-3'],
                ['Row 20-1', 'Row 20-2', 'Row 20-3']
            ]
        });
    }
}