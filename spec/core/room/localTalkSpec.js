describe("Local Talk Test Suite", function () {
    // it("should create member", function (done) {
    //     let div1 = document.createElement('div');
    //     div1._s_id = "div1";
    //
    //     let r = new Room();
    //     let member = Member.create(r, div1);
    //     expect(div1.$).toBe(member);
    //     done();
    // });
    //
    // it("should join member in group", function (done) {
    //     let div1 = document.createElement('div');
    //     let div2 = document.createElement('div');
    //     div1._s_id = "div1";
    //     div2._s_id = "div2";
    //
    //     let r = new Room();
    //     Promise.all([r.join(div1, "group1"), r.join(div2, "group1")]).then(talkers => {
    //         talkers[1].on("joined@div1").then(m => {
    //             expect(m.event).toEqual("joined");
    //             expect(m.from).toEqual("div1");
    //             expect(m.in_groups).toEqual(["group1"]);
    //             done();
    //         });
    //
    //         talkers[0].say("joined");
    //     });
    // });
    //
    // it("should say and receive message", function (done) {
    //     let div1 = document.createElement('div');
    //     let div2 = document.createElement('div');
    //     div1._s_id = "div1";
    //     div2._s_id = "div2";
    //
    //     let r = new Room();
    //     Promise.all([r.join(div1, "group1"), r.join(div2, "group1")]).then(talkers => {
    //         talkers[1].on("hello").then(m => {
    //             expect(m.event).toEqual("hello");
    //             expect(m.data.content).toEqual("world");
    //             done();
    //         });
    //
    //         talkers[0].say("hello", {content: "world"});
    //     });
    // });
    //
    // it("should receive and reply message", function (done) {
    //     let div1 = document.createElement('div');
    //     let div2 = document.createElement('div');
    //     div1._s_id = "div1";
    //     div2._s_id = "div2";
    //
    //     let r = new Room();
    //     Promise.all([r.join(div1, "group1"), r.join(div2, "group1")]).then(talkers => {
    //         talkers[1].on("hello").then(m => {
    //             m.reply('first').then(m => {
    //                 expect(m.data).toEqual("second");
    //                 done();
    //             });
    //         });
    //
    //         talkers[0].say("hello", {content: "world"}).then(v => {
    //             expect(v.data).toEqual("first");
    //             v.reply("second");
    //         });
    //     });
    // });
    //
    // it("should receive message by regex", function (done) {
    //     let div1 = document.createElement('div');
    //     let div2 = document.createElement('div');
    //     div1._s_id = "div1";
    //     div2._s_id = "div2";
    //
    //     let r = new Room();
    //     Promise.all([r.join(div1, "group1"), r.join(div2, "group1")]).then(talkers => {
    //         talkers[1].on("/he/").then(m => {
    //             expect(m.data.content).toEqual("world");
    //             done();
    //         });
    //
    //         talkers[0].say("hello", {content: "world"});
    //     });
    // });
    //
    // it("should meet 'all' condition", function (done) {
    //     let div1 = document.createElement('div');
    //     let div2 = document.createElement('div');
    //     let div3 = document.createElement('div');
    //     div1._s_id = "div1";
    //     div2._s_id = "div2";
    //     div3._s_id = "div3";
    //
    //     let r = new Room();
    //     Promise.all([
    //         r.join(div1, "group1"),
    //         r.join(div2, ["group1", "group2"]),
    //         r.join(div3, ["group1", "group2", "group3"])
    //     ]).then(talkers => {
    //         talkers[1].on_all("hello", "@div3", "foo@div3").then(messages => {
    //             expect(messages.length).toBe(2);
    //             expect(messages[0].event).toEqual("hello");
    //             expect(messages[0].in_groups).toEqual(["group1"]);
    //             expect(messages[1].event).toEqual("foo");
    //             expect(messages[1].in_groups).toEqual(["group1", "group2"]);
    //             done();
    //         });
    //
    //         talkers[0].say("hello", {content: "world"});
    //         talkers[2].say("foo", {content: "world"});
    //     });
    // });
    //
    // it("should meet 'any' condition", function (done) {
    //     let div1 = document.createElement('div');
    //     let div2 = document.createElement('div');
    //     let div3 = document.createElement('div');
    //     div1._s_id = "div1";
    //     div2._s_id = "div2";
    //     div3._s_id = "div3";
    //
    //     let r = new Room();
    //     Promise.all([r.join(div1, "group1"), r.join(div2, "group1"), r.join(div3, "group1")]).then(talkers => {
    //         talkers[1].on_race("hello", "@div3", "foo@div3").then(m => {
    //             expect(m.event).toEqual("hello");
    //             done();
    //         });
    //
    //         talkers[0].say("hello", {content: "world"});
    //         talkers[2].say("foo", {content: "world"});
    //     });
    // });
});
