import Express from "express";
import Http from "http";
import Logger from "morgan";
import CookieParser from "cookie-parser";
import BodyParser from "body-parser";
import {roomServer} from "../../build/sugar";
import {QuizService} from "./QuizService";

const app = Express();
const server = Http.Server(app);

app.use(Logger('dev'));
app.use(BodyParser.json());
app.use(CookieParser());
app.use(Express.static('./build/web'));

roomServer(server).then(function (r) {
    new QuizService(r);
});

// catch 404 and forward to error handler
app.use(function (req, res) {
    res.status(404);
    res.end('Not Found');
});

server.listen(3000);
