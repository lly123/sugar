const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const nodeExternals = require('webpack-node-externals');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TARGET = process.env.npm_lifecycle_event;

const common = {
    entry: [
        'webpack-dev-server/client?http://0.0.0.0:8080',
        path.join(__dirname, 'web/src/app.js')
    ],
    output: {
        path: path.join(__dirname, 'build/web'),
        publicPath: './',
        filename: 'app.js'
    },
    target: 'web',
    externals: {
        'socket.io-client': 'io',
        'socket.io': 'io'
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                loaders: [
                    'babel?' + JSON.stringify({
                        presets: ['es2015']
                    })
                ],
                include: [
                    path.join(__dirname, 'web/src')
                ]
            },

            {test: /bootstrap/, loader: 'imports?jQuery=jquery'},

            {test: /\.styl/, loader: 'style!css!stylus'},
            {test: /\.css$/, loader: 'style!css'},
            {test: /\.html$/, loader: "html"},
            {test: /\.(woff|woff2)$/, loader: "url-loader?limit=10000&mimetype=application/font-woff"},
            {test: /\.ttf$/, loader: "file-loader"},
            {test: /\.eot$/, loader: "file-loader"},
            {test: /\.svg$/, loader: "file-loader"}
        ]
    }
};

if (TARGET === 'start' || !TARGET) {
    module.exports = merge(common, {
        devServer: {
            contentBase: path.join(__dirname, 'build/web'),
            // Enable history API fallback so HTML5 History API based
            // routing works. This is a good default that will come
            // in handy in more complicated setups.
            // historyApiFallback: true,
            // hot: true,
            // inline: true,
            // progress: true,

            // Display only errors to reduce the amount of output.
            // stats: 'errors-only',

            // Parse host and port from env so this is easy to customize.
            //
            // If you use Vagrant or Cloud9, set
            // host: process.env.HOST || '0.0.0.0';
            //
            // 0.0.0.0 is available to all network devices unlike default
            // localhost
            host: process.env.HOST,
            port: 8080
        },
        plugins: [
            new webpack.HotModuleReplacementPlugin()
        ]
    });
}

if (TARGET === 'build-web') {
    module.exports = merge(common, {
        plugins: [
            new HtmlWebpackPlugin({
                filename: 'index.html',
                template: 'web/index.html',
                hash: true
            }),
            new CopyWebpackPlugin([
                {from: 'bower_components/socket.io-client/**/*'}
            ])
        ]
    });
}

if (TARGET === 'build-server') {
    module.exports = {
        entry: {
            "app": path.join(__dirname, 'server/app.js')
        },
        output: {
            path: path.join(__dirname, 'build/server'),
            publicPath: './',
            filename: '[name].js'
        },
        target: 'node',
        externals: [nodeExternals()],
        module: {
            loaders: [
                {
                    test: /\.jsx?$/,
                    loaders: ['babel?' + JSON.stringify({
                        presets: ['es2015']
                    })],
                    include: [
                        path.join(__dirname, 'server')
                    ]
                }
            ]
        },
        plugins: [
            new webpack.IgnorePlugin(/vertx/)
        ]
    };
}
