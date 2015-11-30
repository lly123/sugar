import _ from 'underscore';
import Events from 'events';

const EventEmitter = Events.EventEmitter;

class Room {
    constructor() {
        this.emitter = new EventEmitter();
        this.rooms = [];
        this.members = [];
    }

    join(roomName, member, memberId = member.props.id) {
        const findRoom = function () {
            var room = _.find(this.rooms, r => r.name === roomName);
            if (!room) {
                room = {
                    name: roomName,
                    members: []
                };
                this.rooms.push(room);
                console.debug(`room ${roomName} has been added.`);
            }
            return room;
        };

        const findMember = function () {
            var roomMember = _.find(this.members, m => m.id === memberId);
            if (!roomMember) {
                roomMember = {
                    id: memberId,
                    rooms: []
                };
                this.members.push(roomMember);
                console.debug(`member ${memberId} has been added.`);
            }
            return roomMember;
        };

        const joinInRoom = function (roomMember, room) {
            if (_.any(roomMember.rooms, r => r.name === room.name)) {
                console.debug(`member ${roomMember.id} has already existed in room ${room.name}.`);
                return;
            }

            room.members.push(roomMember);
            roomMember.rooms.push(room);

            ///**
            // * Add room to this member
            // */
            //member.room = this;
            console.debug(`member ${roomMember.id} has joined in room ${room.name}.`);
        };

        const room = findRoom.call(this);
        const roomMember = findMember.call(this);
        joinInRoom.call(this, roomMember, room);
    }

    list() {
        _.each(this.rooms, v => console.info(`room: ${v.name}`));
    }
}

const room = new Room();
export {room as default}