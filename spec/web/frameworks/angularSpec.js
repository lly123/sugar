import sugar from "../../../src/web/frameworks/angularjs/sugar";

describe("DOM Parser Test Suite", function () {
    var compile, scope;

    const HTML =
        "<div data-sg-room='http://localhost:3000'>" +
        "   <div data-sg-group='local'>" +
        "       <div data-sg-id='{{sgId2}}' data-sg-on='chat&hi>receiver'>Richard</div>" +
        "   </div>" +
        "   <div data-sg-group='local'>" +
        "       <div data-sg-id='{{sgId3}}' data-sg-say='hi:msg1>receiver3'>Tommy</div>" +
        "   </div>" +
        "   <div data-sg-group='local, group1'>" +
        "       <div data-sg-id='{{sgId1}}' data-sg-say='chat:msg2>receiver2, event:msg2>receiver2'>Alan</div>" +
        "   </div>" +
        "</div>";

    beforeEach(angular.mock.module("sugar"));

    beforeEach(inject(function ($compile, $rootScope) {
        compile = $compile;
        scope = $rootScope;
    }));

    it("should parse dom", function (done) {
        let count = 0;
        scope.sgId1 = "sg1";
        scope.sgId2 = "sg2";
        scope.sgId3 = "sg3";

        scope.msg1 = "Tommy";
        scope.msg2 = "Alan";

        scope.receiver = function (messages) {
            messages.forEach(m => {
                m.reply("Hello " + m.data)
            });
        };

        scope.receiver2 = function (m) {
            if (m.data == "Hello Alan" || m.data == "reply: Alan") {
                count++;
            }
        };

        scope.receiver3 = function (m) {
            if (m.data == "Hello Tommy") {
                count++;
            }
        };

        var node = compile(HTML)(scope);
        scope.$digest();
        document.body.insertAdjacentHTML('beforeend', node.html());

        setTimeout(() => {
            if (count == 3) {
                done();
            }
        }, 4800);
    });
});
