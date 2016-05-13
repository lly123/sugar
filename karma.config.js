module.exports = function (config) {
    config.set({
        browsers: ['PhantomJS'],
        files: [
            {pattern: 'test-context.js', watched: false}
        ],
        plugins: [
            require("karma-webpack"),
            "karma-jasmine",
            "karma-phantomjs-launcher",
            "karma-express-http-server"
        ],
        frameworks: ['jasmine', 'express-http-server'],
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
                var Http = require('http');
                var sugar = require('./build/sugar');

                const server = Http.Server(app);
                sugar.roomServer(server);
                server.listen(3000);
            }
        }
    });
};

