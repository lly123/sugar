import {RoomClient} from "../../../src/core/client/RoomClient";

describe("Remote Talk Test Suite", function () {
    it("should create member", function (done) {
        let div1 = document.createElement('div');
        div1._s_id = "div1";

        new RoomClient('http://localhost:3000').then(r => {
            r.join(div1, "group1").then(talker => {
                talker.on("result").then(m => {
                    expect(m.data).toEqual(6);
                    done();
                });

                talker.say("sum", [1, 2, 3]);
            });
        });
    }, 10000);
});
