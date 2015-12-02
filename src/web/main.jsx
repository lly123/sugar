import React from 'react';
import ReactDOM from 'react-dom';
import Room from '../components/common/room/Room';
import Table from '../components/web/table/Table';

const table = ReactDOM.render(
    <Table id="t01" theme="simple"/>,
    document.getElementById("app")
);

Room.join('forAll', table);
