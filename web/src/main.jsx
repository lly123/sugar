import React from 'react';
import ReactDOM from 'react-dom';
import Room from './components/room/room';
import Table from './components/table/table';

const table = ReactDOM.render(
    <Table id="t01" theme="simple"/>,
    document.getElementById("app")
);

Room.join('forAll', table);
