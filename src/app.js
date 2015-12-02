const express = require('express');
const app = express();
const server = require('http').Server(app);
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const roomServer = require('./components/server/RoomServer');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'web')));
roomServer(server);

// catch 404 and forward to error handler
app.use(function (req, res) {
    res.status(404);
    res.end('Not Found');
});

const port = process.env.PORT || 8080;
server.listen(port);