import io from "socket.io";
import {Room} from "../room/Room";


export class RoomServer extends Room {
    constructor(server) {
        super();
        this._io = io.listen(server);

        this._io.on('connection', socket => {
            console.log('Client has connected.', socket.id);

            socket.on('groupNames', msg => {
                console.log('***', msg, '\n');

                // groupNames.forEach(groupName => {
                //     unionDictValue(this._clientGroups, groupName, [socket], s => s.id);
                // })
            });
            //
            // socket.on('message', remoteMsg => {
            //     remoteMsg.message._reply = message => {
            //         socket.emit('message', {
            //             groupName: remoteMsg.originalGroupName,
            //             message: message
            //         })
            //     };
            //     this.sendToGroups(remoteMsg.groupNames, remoteMsg.message);
            // });
        });
    }

    // groupRegistered(group) {
    //     this._io.sockets.emit('groups', [group.name]);
    // }
}
