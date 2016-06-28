import angular from "angular";
import uirouter from "angular-ui-router";
import routing from "./routes";
import {Controller} from "./Controller";

export default angular.module('demo.teacher', [uirouter])
    .config(routing)
    .controller('Controller', Controller)
    .name;
