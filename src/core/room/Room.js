import _ from "underscore";
import Events from "events";

const EventEmitter = Events.EventEmitter;

export class Room {
    constructor() {
        this._emitter = new EventEmitter();
        this._rooms = [];
        this._members = [];
    }

    join(roomName, memberInst) {
        const room = this._findRoom(roomName) || this._createRoom(roomName);
        const member = this._findMember(memberInst) || this._createMember(memberInst);
        this._joinInRoom(member, room, memberInst);
    }

    send(memberInst, message) {
        const member = this._findMember(memberInst);
        if (!member) {
            throw `Member [${memberInst._s_id}] doesn't join in any room`
        }
        this.sendToRooms(_.map(member.rooms, r => r.name), message);
        return member;
    }

    sendToRooms(roomNames, message) {
        _.each(roomNames, n => this._emitter.emit(n, message));
    }

    _joinInRoom(member, room, memberInst) {
        if (_.any(member.rooms, r => r.name === room.name)) {
            console.log(`Member [${member.id}] has already existed in room [${room.name}].`);
            return;
        }

        room.members.push(member);
        member.rooms.push(room);

        /**
         * Add room property to this member
         */
        memberInst._s_room = this;
        memberInst.joinedRoom();

        console.log(`Member [${member.id}] has joined in room [${room.name}].`);
    }

    _findMember(memberInst) {
        return _.find(this._members, m => m.id === memberInst._s_id);
    }

    _createMember(memberInst) {
        var member = {
            id: memberInst._s_id,
            inst: memberInst,
            rooms: []
        };
        this._members.push(member);
        console.log(`Member [${memberInst._s_id}] has been added.`);
        return member;
    }

    _findRoom(roomName) {
        return _.find(this._rooms, r => r.name === roomName);
    }

    _createRoom(roomName) {
        var room = {
            name: roomName,
            members: [],
            remoteRoomNames: []
        };
        this._rooms.push(room);

        this._emitter.on(roomName, message => {
            console.log(`In room [${room.name}] got message:`, message);
            _.each(room.members, m => {
                if (message.from !== m.id) {
                    m.inst._onMessage(room, message)
                }
            });
        });

        console.log(`Room [${roomName}] has been added.`);
        return room;
    }
}
