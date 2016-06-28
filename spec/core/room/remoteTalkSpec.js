import {RoomClient} from "../../../src/core/client/RoomClient";

describe("Remote Talk Test Suite", function () {
    it("should calculate numbers", function (done) {
        let div1 = document.createElement('div');
        div1.__sgId = "div1";

        new RoomClient('http://localhost:3000').then(r => {
            r.join(div1, "group1").then(talker => {
                const p1 = new Promise(resolve => {
                    talker.on("sumResult").then(m => {
                        expect(m.data).toEqual(6);
                        resolve();
                    });

                    talker.say("sum", [1, 2, 3]);
                });

                const p2 = new Promise(resolve => {
                    talker.say("multiply", [1, 3, 5]).then(m => {
                        expect(m.data).toEqual(15);
                        m.reply("thanks").then(n => {
                            expect(n.data).toEqual("you are welcome");
                            resolve();
                        })
                    });
                });

                const p3 = new Promise(resolve => {
                    talker.on("addResult").then(m => {
                        expect(m.data).toEqual(300);
                        resolve();
                    });

                    talker.say("leftValue", 100);
                    talker.say("rightValue", 200);
                    talker.say("add");
                });

                const p4 = new Promise(resolve => {
                    talker.on_all("message_from", "message_to", "message_text").then(messages => {
                        expect(messages[0].data).toEqual("server");
                        expect(messages[1].data).toEqual("client");
                        expect(messages[2].data).toEqual("hello");
                        resolve();
                    });

                    talker.say("send me a message");
                });

                const p5 = new Promise(resolve => {
                    talker.on_race("red", "blue", "yellow").then(message => {
                        expect(message.data).toEqual("blue color");
                        resolve();
                    });

                    talker.say("send me a color");
                });

                Promise.all([p1, p2, p3, p4, p5]).then(() => done());
            });
        });
    });
});
