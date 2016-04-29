import _ from "underscore";
import Events from "events";

const EventEmitter = Events.EventEmitter;

export class Room {
    constructor() {
        this._emitter = new EventEmitter();
        this._groups = [];
        this._members = [];
    }

    join(groupName, memberInst) {
        const group = _.find(this._groups, g => g.name === groupName) || this._createGroup(groupName);
        const member = _.find(this._members, m => m.id === memberInst._s_id) || this._createMember(memberInst);
        this._joinGroup(member, group);
    }

    send(memberInst, message) {
        const member = _.find(this._members, m => m.id === memberInst._s_id);
        this.sendToRooms(_.map(member.groups, g => g.name), message);
        return member;
    }

    sendToRooms(groupNames, message) {
        _.each(groupNames, n => this._emitter.emit(n, message));
    }

    _joinGroup(member, group) {
        if (_.any(member.groups, g => g.name === group.name)) {
            throw `Member [${member.id}] has already existed in group [${group.name}].`;
        }

        group.members.push(member);
        member.groups.push(group);

        member.inst.say('joined');

        console.log(`Member [${member.id}] joined in group [${group.name}].`);
    }

    _createMember(memberInst) {
        var member = {
            id: memberInst._s_id,
            inst: memberInst,
            groups: []
        };
        this._members.push(member);

        this._registerMember(member);

        console.log(`Created member [${memberInst._s_id}].`);
        return member;
    }

    _createGroup(groupName) {
        var group = {
            name: groupName,
            members: [],
            remoteGroupNames: []
        };
        this._groups.push(group);

        this._registerGroup(group);

        console.log(`Created group [${groupName}].`);
        return group;
    }

    _registerMember(member) {
        member.inst._s_room = this;
    }

    _registerGroup(group) {
        this._emitter.on(group.name, message => {
            console.log(`In group [${group.name}] got message:`, message);

            _.each(group.members, m => {
                if (message.from !== m.id) {
                    m.inst._onMessage(group, message)
                }
            });
        });
    }
}
