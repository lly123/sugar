const express = require('express');
const app = express();
const server = require('http').Server(app);
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

import RoomServer from './components/server/RoomServer'
const roomServer = RoomServer(server);

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static('./build/web'));

var TableService = {
    id: 'tableService',
    joinedRoom: function () {
        console.log('LALALLA!');
    }
};

roomServer.join("server", TableService);

// catch 404 and forward to error handler
app.use(function (req, res) {
    res.status(404);
    res.end('Not Found');
});

const port = process.env.PORT || 8080;
server.listen(port);