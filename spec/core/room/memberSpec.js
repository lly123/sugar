import {Room} from "../../../src/core/room/Room";
import {Member} from "../../../src/core/room/Member";

describe("Member Test Suite", function () {
    it("should create member", function () {
        let div1 = document.createElement('div');
        div1._s_id = "div1";

        let room = new Room();
        let member = Member.create(room, div1);
        expect(div1.$._s_inst).toBe(member);
    });

    it("should join member in group", function (done) {
        let div1 = document.createElement('div');
        let div2 = document.createElement('div');
        div1._s_id = "div1";
        div2._s_id = "div2";

        let room = new Room();
        room.join(div2, "group1");

        div2.$.from("div1").on("joined").then(m => {
            expect(m.event).toEqual("joined");
            expect(m.from).toEqual("div1");
            done();
        });

        room.join(div1, "group1");
    }, 1000);

    it("should say and receive message", function (done) {
        let div1 = document.createElement('div');
        let div2 = document.createElement('div');
        div1._s_id = "div1";
        div2._s_id = "div2";

        let room = new Room();
        room.join(div1, "group1");
        room.join(div2, "group1");

        div2.$.on("hello").then(m => {
            expect(m.event).toEqual("hello");
            expect(m.data.content).toEqual("world");
            done();
        });

        div1.$.say("hello", {content: "world"});
    }, 1000);

    it("should receive and reply message", function (done) {
        let div1 = document.createElement('div');
        let div2 = document.createElement('div');
        div1._s_id = "div1";
        div2._s_id = "div2";

        let room = new Room();
        room.join(div1, "group1");
        room.join(div2, "group1");

        div2.$.on("hello").then(m => {
            m.reply('first').then(m => {
                expect(m.data).toEqual("second");
                done();
            });
        });

        div1.$.say("hello", {content: "world"}).then(v => {
            v.reply('second');
        });
    }, 1000);
});