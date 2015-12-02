import socket from 'socket.io'
import Room from '../common/room/Room';

export default function (server) {
    const io = socket(server);

    io.sockets.on('connection', function (socket) {
        console.log('connected !!!');
    });

    return Room;
}