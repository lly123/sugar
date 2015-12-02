import _ from 'underscore';
import Events from 'events';

const EventEmitter = Events.EventEmitter;

class Room {
    constructor() {
        this._emitter = new EventEmitter();
        this._rooms = [];
        this._members = [];
    }

    join(roomName, member) {
        const joinInRoom = function (roomMember, room) {
            if (_.any(roomMember.rooms, r => r.name === room.name)) {
                console.log(`member [${roomMember.id}] has already existed in room [${room.name}].`);
                return;
            }

            room.members.push(roomMember);
            roomMember.rooms.push(room);

            /**
             * Add room property to this member
             */
            member.room = this;
            member.joinedRoom();
            console.log(`member [${roomMember.id}] has joined in room [${room.name}].`);
        };

        const room = this._findRoom(roomName);
        const roomMember = this._findMember(member);
        joinInRoom.call(this, roomMember, room);
    }

    send(member, message) {
        const roomMember = this._findMember(member);
        if (!roomMember) {
            throw `member [${member.id}] doesn't join in any room`;
        }
        _.each(roomMember.rooms, r => this._emitter.emit(r.name, message));
    }

    list() {
        _.each(this.rooms, v => console.info(`room: ${v.name}`));
    }

    _findMember(member) {
        var roomMember = _.find(this._members, m => m.id === member.id);
        if (!roomMember) {
            roomMember = {
                id: member.id,
                rooms: []
            };
            this._members.push(roomMember);
            console.log(`member [${member.id}] has been added.`);
        }
        return roomMember;
    }

    _findRoom(roomName) {
        var room = _.find(this._rooms, r => r.name === roomName);
        if (!room) {
            room = {
                name: roomName,
                members: []
            };
            this._rooms.push(room);
            this._emitter.on(room.name, this._onMessage);
            console.log(`room [${roomName}] has been added.`);
        }
        return room;
    }

    _onMessage(message) {
        console.log(message);
    }
}

const room = new Room();
export {room as default}