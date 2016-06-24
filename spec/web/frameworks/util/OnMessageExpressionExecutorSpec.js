import {RoomClient} from "../../../../src/core/client/RoomClient";
import {OnMessageExpressionExecutor} from "../../../../src/web/frameworks/util/OnMessageExpressionExecutor";

describe("Sugar On Message Expression Executor Test Suite", function () {
    let scope;

    let div1 = document.createElement('div');
    div1._s_id = "div1";

    let div2 = document.createElement('div');
    div2._s_id = "div2";

    beforeEach(inject(function ($rootScope) {
        scope = $rootScope;
        scope.count = 0;

        scope.receiver = function (message) {
            if (message.data == 'hello1') {
                scope.count++;
            }
        };
    }));

    it("should run expression", function (done) {
        new RoomClient('http://localhost:3000').then(r => {
            r.join(div1, "group1").then(talker => {
                new OnMessageExpressionExecutor(talker, scope, "event1>receiver").run();
                new OnMessageExpressionExecutor(talker, scope, "event2@div2>>attr1").run();
            });

            r.join(div2, "group1").then(talker => {
                talker.say('event1', 'hello1');
                talker.say('event2', 'hello2');
            });

            setTimeout(() => {
                if (scope.attr1 == 'hello2' && scope.count == 1) {
                    done();
                }
            }, 4800);
        });
    });
});
