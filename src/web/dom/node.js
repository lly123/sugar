import _ from "underscore";

const ATTR_PREFIX = 'sg-';
const ATTR_DATA_PREFIX = 'data-sg-';
const ID = 'id';
const INIT = 'init';

class Node {
    constructor(node) {
        this._node = node;
    }

    isSugarNode() {
        return !_.isEmpty(this.id());
    }

    id() {
        return this.__getAttribute(ID);
    }

    init() {
        return this.__getAttribute(INIT)
    }

    __getAttribute(attr) {
        return this._node.getAttribute(ATTR_DATA_PREFIX + attr) || this._node.getAttribute(ATTR_PREFIX + attr);
    }
}

export {
    Node
}
