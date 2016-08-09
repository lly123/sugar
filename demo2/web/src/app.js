import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.min";
import angular from "angular";
import uirouter from "angular-ui-router";
import sugar from "../../../build/sugar-angular";
import routing from "./app.config";
import teacher from "./features/teacher";
import student from "./features/student";

angular.module('demo', [sugar, uirouter, teacher, student])
    .config(routing);
