import _ from 'underscore';
import Events from 'events';

const EventEmitter = Events.EventEmitter;

export default class {
    constructor() {
        this._emitter = new EventEmitter();
        this._rooms = [];
        this._members = [];
    }

    join(roomName, member) {
        const joinInRoom = function (roomMember, room) {
            if (_.any(roomMember.rooms, r => r.name === room.name)) {
                console.log(`Member [${roomMember.id}] has already existed in room [${room.name}].`);
                return;
            }

            room.members.push(roomMember);
            roomMember.rooms.push(room);

            /**
             * Add room property to this member
             */
            member.room = this;
            member.joinedRoom();
            console.log(`Member [${roomMember.id}] has joined in room [${room.name}].`);
        };

        const room = this._findRoom(roomName) || this._createRoom(roomName);
        const roomMember = this._findMember(member.id) || this._createMember(member.id);
        joinInRoom.call(this, roomMember, room);
    }

    send(member, message) {
        const roomMember = this._findMember(member.id);
        if (!roomMember) {
            throw `Member [${member.id}] doesn't join in any room`;
        }
        _.each(roomMember.rooms, r => this._emitter.emit(r.name, message));
        return roomMember;
    }

    _send(roomNames, message) {
        _.each(roomNames, r => this._emitter.emit(r, message));
    }

    list() {
        _.each(this.rooms, v => console.info(`room: ${v.name}`));
    }

    _findMember(memberId) {
        return _.find(this._members, m => m.id === memberId);
    }

    _createMember(memberId) {
        var member = {
            id: memberId,
            rooms: []
        };
        this._members.push(member);
        console.log(`Member [${memberId}] has been added.`);
        return member;
    }

    _findRoom(roomName) {
        return _.find(this._rooms, r => r.name === roomName);
    }

    _createRoom(roomName) {
        var room = {
            name: roomName,
            members: [],
            linkedRooms: []
        };
        this._rooms.push(room);
        this._emitter.on(roomName, message => this._onMessage(roomName, message));
        console.log(`Room [${roomName}] has been added.`);
        return room;
    }

    _onMessage(roomName, message) {
        console.log(`In room [${roomName}] got message:`, message);
    }
}
