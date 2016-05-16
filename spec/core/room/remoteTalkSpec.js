import {RoomClient} from "../../../src/core/client/RoomClient";
import {Member} from "../../../src/core/room/Member";

describe("Remote Talk Test Suite", function () {
    it("should create member", function (done) {
        let div1 = document.createElement('div');
        div1._s_id = "div1";

        new RoomClient('http://localhost:3000').then(r => {
            let member = Member.create(r, div1);
            console.log('>>>>');
            done();
        });
    });
});
