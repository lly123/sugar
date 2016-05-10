module.exports = function (config) {
    config.set({
        browsers: ['PhantomJS'],
        files: [
            {pattern: 'test-context.js', watched: false}
        ],
        plugins: [
            require("karma-webpack"),
            "karma-jasmine",
            "karma-phantomjs-launcher"
        ],
        frameworks: ['jasmine'],
        preprocessors: {
            'test-context.js': ['webpack']
        },
        webpack: {
            module: {
                loaders: [
                    {
                        test: /\.jsx?$/,
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
        }
    });
};

