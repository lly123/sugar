import {Node} from "./Node";


class Parser {
    constructor(root) {
        this._root = root;
    }

    run(enterFunc, exitFunc) {
        Parser.__traverse(this._root, enterFunc, exitFunc);
    }

    static __traverse(n, enterFunc, exitFunc) {
        let node = new Node(n);
        if (node.isSugarNode()) {
            enterFunc(Parser.__findAttributes(node), n);
        } else {
            let children = n.children;
            for (var i = 0; i < children.length; i++) {
                Parser.__traverse(children[i], enterFunc, exitFunc);
            }
        }
    }

    static __findAttributes(node) {
        return {
            id: node.id(),
            init: node.init()
        };
    }
}

export {
    Parser
}
