import {union, unionDictValue} from "../../../src/core/util/lang";

describe("Lang Test Suite", function () {
    it("should union arrays", function () {
        expect(union([1, 2, 3], [2, 3, 5])).toEqual([1, 2, 3, 5]);
    });

    it("should union dict value", function () {
        let tmp = {"key1": [1, 3]};
        unionDictValue(tmp, "key1", [1, 2, 3]);
        expect(tmp).toEqual({"key1": [1, 3, 2]});
    });

    it("should union dict value by key", function () {
        let tmp = {"key1": ["abc", "bcd"]};
        unionDictValue(tmp, "key1", ["bcd", "cba"], k => k.slice(0, 1));
        expect(tmp).toEqual({"key1": ["abc", "bcd", "cba"]});
    });
});