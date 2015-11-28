import _ from 'underscore';
import Events from 'events';

const EventEmitter = Events.EventEmitter;

class Room {
    constructor() {
        this.emitter = new EventEmitter();
        this.rooms = [];
    }

    join(roomName, receiver, receiverId = receiver.props.id) {
        if (_.isUndefined(receiverId)) {
            throw `Receiver is must be given.`
        }

        const joinInRoom = function (receiver, room) {
            room.members.push(receiver);
            console.debug(`receiver ${receiverId} has joined in room ${room.name}.`);
        };


        var room = _.find(this.rooms, r => r.name === roomName);
        if (room) {
            if (!_.any(room.members, m => m.id = receiverId)) {
                joinInRoom(receiver, room);
            } else {
                console.debug(`receiver ${receiverId} has existed in room ${roomName}.`);
            }
        } else {
            room = {
                name: roomName,
                members: []
            };
            this.rooms.push(room);
            console.debug(`room ${roomName} has been added.`);
            joinInRoom(receiver, room);
        }
    }

    list() {
        _.each(this.rooms, v => console.info(`room: ${v.name}`));
    }
}

const room = new Room();
export {room as default}