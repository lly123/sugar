import {RoomClient} from "../../../../src/core/client/RoomClient";
import {EventExpressionExecutor} from "../../../../src/web/frameworks/util/EventExpressionExecutor";

describe("Sugar Event Expression Executor Test Suite", function () {
    let scope;
    let div1 = document.createElement('div');
    div1.__sgId = "div1";

    beforeEach(inject(function ($rootScope) {
        scope = $rootScope;
        scope.count = 0;

        scope.message1 = "hello 1";
        scope.message2 = "hello 2";
        scope.message3 = "hello 3";

        scope.func = function () {
            this.say('event', 'message');
            scope.count++;
        };

        scope.receiver1 = function (message) {
            if (message.data == 'reply message') {
                scope.count++;
            }
        };

        scope.receiver2 = function (message) {
            if (message.data == 'reply: hello 2') {
                scope.count++;
            }
        };
    }));

    it("should run expression", function (done) {
        new RoomClient('http://localhost:3000').then(r => {
            r.join(div1, "group1").then(talker => {
                new EventExpressionExecutor(talker, scope, "event").run();
                new EventExpressionExecutor(talker, scope, "event:message1").run();
                new EventExpressionExecutor(talker, scope, ">func").run();
                new EventExpressionExecutor(talker, scope, "event>receiver1").run();
                new EventExpressionExecutor(talker, scope, "event>>attr1").run();
                new EventExpressionExecutor(talker, scope, "event:message2>receiver2").run();
                new EventExpressionExecutor(talker, scope, "event:message3>>attr2").run();

                setTimeout(() => {
                    if ((scope.attr1 == 'reply message' && scope.attr2 == 'reply: hello 3') && scope.count == 3) {
                        done();
                    }
                }, 4800);
            });
        });
    });
});
