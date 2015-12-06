import _ from 'underscore';
import Socket from 'socket.io'
import Room from '../common/room/Room';

export class RoomServer extends Room {
    constructor(server) {
        super();
        this.io = Socket(server);
        this.io.on('connection', socket => {
            console.log('Client has connected.');
            socket.on('message', remoteMsg => super.deliverRemoteMessage(socket, remoteMsg));
        });
    }

    send(memberInst, message) {
        super.send(memberInst, message, roomMember => {
            _.each(roomMember.rooms, r => {
                if (!_.isEmpty(r.linkedRooms)) {
                    _.each(r.linkedRooms, lr => {
                        lr.connection.emit('message', {
                            remoteRoom: r.name,
                            rooms: [lr.name],
                            message: message
                        })
                    });
                }
            });
        });
    }
}

export default function (server) {
    return new RoomServer(server);
}