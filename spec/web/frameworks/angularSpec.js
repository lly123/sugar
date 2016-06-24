import sugar from "../../../src/web/frameworks/angularjs/sugar";

describe("DOM Parser Test Suite", function () {
    var compile, scope;

    const HTML =
        "<div data-sg-room='http://localhost:3000'>" +
        "<div data-sg-group='local'>" +
        "<div data-sg-id='{{sgId2}}' data-sg-on='event>receiver'>World</div>" +
        "</div>" +
        "<div data-sg-group='local'>" +
        "<div data-sg-id='{{sgId1}}' data-sg-say='event:message>receiver2'>Hello</div>" +
        "</div>" +
        "</div>";

    beforeEach(angular.mock.module("sugar"));

    beforeEach(inject(function ($compile, $rootScope) {
        compile = $compile;
        scope = $rootScope;
    }));

    it("should parse dom", function (done) {
        scope.sgId1 = "sg1";
        scope.sgId2 = "sg2";

        scope.message = "Hello";

        scope.receiver = function (m) {
            m.reply("Welcome");
        };

        scope.receiver2 = function (m) {
            if (m.data == "Welcome") {
                done();
            }
        };

        var node = compile(HTML)(scope);
        scope.$digest();
        document.body.insertAdjacentHTML('beforeend', node.html());
    });
});
