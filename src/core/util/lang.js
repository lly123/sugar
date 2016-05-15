import _ from "underscore";

const EMPTY_FUNC = () => {
};

function toArray(obj) {
    return _.isArray(obj) ? obj : [obj]
}

function union(arr1, arr2, key = (x => x)) {
    let tmp = arr1.slice(0);
    arr2.forEach(v => {
        if (!_.find(tmp, t => key(t) == key(v))) {
            tmp.push(v)
        }
    });
    return tmp;
}

function unionDictValue(dict, dictKey, arr, key = (x => x)) {
    dict[dictKey] = union(dictKey in dict ? dict[dictKey] : [], arr, key);
}

function setAdd(arr, value, resolve = EMPTY_FUNC, reject = EMPTY_FUNC, key = (v => v)) {
    if (_.isEmpty(arr) || !_.any(arr, v => key(v) == key(value))) {
        arr.push(value);
        resolve();
    } else {
        reject();
    }
}

export {
    toArray, union, unionDictValue, setAdd
};
