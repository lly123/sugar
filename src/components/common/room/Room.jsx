import _ from 'underscore';
import Events from 'events';

const EventEmitter = Events.EventEmitter;

export default class {
    constructor() {
        this._emitter = new EventEmitter();
        this._rooms = [];
        this._members = [];
    }

    join(roomName, memberInst) {
        const joinInRoom = function (member, room) {
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
            memberInst._joinedRoom();

            console.log(`Member [${member.id}] has joined in room [${room.name}].`);
        };

        const room = this._findRoom(roomName) || this._createRoom(roomName);
        const member = this._findMember(memberInst) || this._createMember(memberInst);
        joinInRoom.call(this, member, room);
    }

    send(memberInst, message, fn) {
        const member = this._findMember(memberInst);
        if (!member) {
            throw `Member [${memberInst._s_id}] doesn't join in any room`
        }
        _.each(member.rooms, r => this._emitter.emit(r.name, message));

        if (fn) {
            fn(member);
        }
        return member;
    }

    deliverRemoteMessage(socket, remoteMsg) {
        _.each(remoteMsg.rooms, r => {
            var room = this._findRoom(r);
            if (room) {
                var hasLinkedRoom = _.any(room.linkedRooms, r => r.name === remoteMsg.remoteRoom);
                if (!hasLinkedRoom) {
                    room.linkedRooms.push({
                        name: remoteMsg.remoteRoom,
                        connection: socket
                    });

                    console.log(`Room [${room.name}] add link room [${remoteMsg.remoteRoom}].`);
                }
                this._emitter.emit(room.name, remoteMsg.message)
            }
        });
    }

    list() {
        _.each(this.rooms, v => console.info(`room: ${v.name}`));
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
            linkedRooms: []
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
