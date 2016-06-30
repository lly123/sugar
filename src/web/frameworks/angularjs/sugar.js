import {sgId} from "./sgId";
import {sgRoom} from "./sgRoom";
import {sgGroup} from "./sgGroup";
import {sgSay} from "./sgSay";
import {sgOn} from "./sgOn";
import {sgClick} from "./sgClick";

export default angular.module('sugar', [])
    .directive('sgRoom', () => new sgRoom())
    .directive('sgGroup', () => new sgGroup())
    .directive('sgId', () => new sgId())
    .directive('sgSay', () => new sgSay())
    .directive('sgOn', () => new sgOn())
    .directive('sgClick', () => new sgClick())
    .name;
