import socket from 'socket.io'

export default function (server) {
    const io = socket(server);

    io.sockets.on('connection', function (socket) {
        console.log('connected !!!');
    });
}