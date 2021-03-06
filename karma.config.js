module.exports = function (config) {
    config.set({
        browsers: ['PhantomJS'],
        files: [
            {pattern: 'test-context.js', watched: false}
        ],
        plugins: [
            require("karma-webpack"),
            "karma-angular",
            "karma-jasmine",
            "karma-phantomjs-launcher",
            "karma-express-http-server"
        ],
        frameworks: ['angular', 'jasmine', 'express-http-server'],
        preprocessors: {
            'test-context.js': ['webpack']
        },
        webpack: {
            module: {
                loaders: [
                    {
                        test: /\.jsx?$/,
                        exclude: /node_modules/,
                        loader: 'babel',
                        query: {
                            presets: ['es2015', 'react']
                        }
                    }
                ]
            },
            watch: true
        },
        webpackServer: {
            noInfo: true
        },
        expressHttpServer: {
            appVisitor: function (app, log) {
                var _ = require('underscore');
                var Http = require('http');
                var sugar = require('./build/sugar');
                const server = Http.Server(app);

                sugar.roomServer(server).then(function (r) {
                    r.join({__sgId: 'service1'}, "group1").then(function (talker) {
                        talker.on("sum").then(function (m) {
                            talker.say("sumResult", _.reduce(m.data, function (s, v) {
                                return s + v
                            }, 0))
                        });

                        talker.on("multiply").then(function (m) {
                            m.reply(_.reduce(m.data, function (s, v) {
                                return s * v
                            }, 1)).then(function (m) {
                                m.reply("you are welcome");
                            })
                        });

                        talker.on_all("leftValue", "rightValue", "add").then(function (messages) {
                            talker.say("addResult", parseInt(messages[0].data) + parseInt(messages[1].data));
                        });

                        talker.on("send me a message").then(function () {
                            talker.say("message_from", "server");
                            talker.say("message_to", "client");
                            talker.say("message_text", "hello");
                        });

                        talker.on("send me a color").then(function () {
                            talker.say("blue", "blue color");
                            talker.say("red", "red color");
                            talker.say("yellow", "yellow color");
                        });

                        talker.on("event").then(function (message) {
                            console.log('Received message:', message.event, message.data, '\n');
                            message.reply(message.data ? 'reply: ' + message.data : 'reply message');
                        });
                    })
                });

                server.listen(3000);
            }
        }
    });
};

