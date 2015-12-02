import Express from 'express';
import Http from 'http';
import Logger from 'morgan';
import CookieParser from 'cookie-parser';
import BodyParser from 'body-parser';
import RoomServer from './components/server/RoomServer'

const app = Express();
const server = Http.Server(app);
const roomServer = RoomServer(server);

app.use(Logger('dev'));
app.use(BodyParser.json());
app.use(CookieParser());
app.use(Express.static('./build/web'));

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

const port = process.env.PORT || 8888;
server.listen(port);