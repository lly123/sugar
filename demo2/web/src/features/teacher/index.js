import angular from "angular";
import uirouter from "angular-ui-router";
import routing from "./routes";
import {TeacherController} from "./TeacherController";

export default angular.module('demo.teacher', [uirouter])
    .config(routing)
    .controller('TeacherController', TeacherController)
    .name;
