import React from 'react';
import ReactDOM from 'react-dom';
import Room from './components/room/room';
import Table from './components/table/table';

const table = <Table id="t01" theme="simple"/>;

Room.join('forAll', table);

ReactDOM.render(
    table,
    document.getElementById("app")
);
