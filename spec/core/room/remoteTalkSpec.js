import {RoomClient} from "../../../src/core/client/RoomClient";

describe("Remote Talk Test Suite", function () {
    it("should calculate numbers", function (done) {
        let div1 = document.createElement('div');
        div1._s_id = "div1";

        new RoomClient('http://localhost:3000').then(r => {
            r.join(div1, "group1").then(talker => {
                const p1 = new Promise(resolve => {
                    talker.on("result").then(m => {
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

                Promise.all([p1, p2]).then(() => done());
            });
        });
    });
});
