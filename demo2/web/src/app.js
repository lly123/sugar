import "bootstrap/dist/css/bootstrap.css";
import angular from "angular";
import uirouter from "angular-ui-router";
import sugar from "../../../build/sugar-angular";
import routing from "./app.config";
import teacher from "./features/teacher";

angular.module('demo', [sugar, uirouter, teacher])
    .config(routing);
