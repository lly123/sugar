import angular from "angular";
import uirouter from "angular-ui-router";
import routing from "./routes";
import {StudentController} from "./StudentController";

export default angular.module('demo.student', [uirouter])
    .config(routing)
    .controller('StudentController', StudentController)
    .name;
