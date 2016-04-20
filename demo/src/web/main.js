import React from "react";
import ReactDOM from "react-dom";
import {roomClient} from "../../../build/sugar";
import {Table} from "../../../build/sugar.web.table";

require('./css/table/table.styl');

const table = ReactDOM.render(
    <Table id="t01" theme="simple"/>,
    document.getElementById("app")
);

const room = roomClient('http://localhost:8888');
room.bridge('forAll', 'server');
room.join('forAll', table);
