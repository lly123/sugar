import React from "react";
import ReactDOM from "react-dom";
import RoomClient from "../components/sugar/client/RoomClient";
import Table from "../components/web/table/Table";

const table = ReactDOM.render(
    <Table id="t01" theme="simple"/>,
    document.getElementById("app")
);

const room = RoomClient('http://localhost:8888');
room.bridge('forAll', 'server');
room.join('forAll', table);
