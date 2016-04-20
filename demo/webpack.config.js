const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const nodeExternals = require('webpack-node-externals');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TARGET = process.env.npm_lifecycle_event;

const common = {};

if (TARGET === 'start' || !TARGET) {
    module.exports = merge(common, {
        devServer: {
            contentBase: path.join(__dirname, 'build'),
            // Enable history API fallback so HTML5 History API based
            // routing works. This is a good default that will come
            // in handy in more complicated setups.
            historyApiFallback: true,
            hot: true,
            inline: true,
            progress: true,

            // Display only errors to reduce the amount of output.
            stats: 'errors-only',

            // Parse host and port from env so this is easy to customize.
            //
            // If you use Vagrant or Cloud9, set
            // host: process.env.HOST || '0.0.0.0';
            //
            // 0.0.0.0 is available to all network devices unlike default
            // localhost
            host: process.env.HOST,
            port: process.env.PORT || 8080
        },

        plugins: [
            new webpack.HotModuleReplacementPlugin()
        ]
    });
}

if (TARGET === 'build-web') {
    module.exports = merge(common, {
        entry: {
            // "app" : path.join(__dirname, 'src/server/app.js'),
            "main": path.join(__dirname, 'src/web/main.js')
        },
        output: {
            path: path.join(__dirname, 'build'),
            publicPath: './',
            filename: '[name].js'
        },
        target: 'web',
        externals: {
            'react': 'React',
            'react-dom': 'ReactDOM',
            'socket.io-client': 'io',
            'socket.io': 'io'
        },
        module: {
            loaders: [
                {
                    test: /\.jsx?$/,
                    loaders: ['babel?' + JSON.stringify({
                        presets: ['es2015', 'react']
                    })],
                    include: [
                        path.join(__dirname, 'src')
                    ]
                },

                {
                    test: /\.styl/,
                    loader: 'style!css!stylus'
                }
            ]
        },
        plugins: [
            new CopyWebpackPlugin([
                {from: 'bower_components/react/**/*'},
                {from: 'bower_components/socket.io-client/**/*'}
            ]),
            new HtmlWebpackPlugin({
                filename: 'index.html',
                template: 'src/web/index.html',
                excludeChunks: ['app'],
                hash: true
            })
        ]
    });
}

if (TARGET === 'build-server') {
    module.exports = merge(common, {
        entry: {
            "app": path.join(__dirname, 'src/server/app.js')
        },
        output: {
            path: path.join(__dirname, 'build'),
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
                        presets: ['es2015', 'react']
                    })],
                    include: [
                        path.join(__dirname, 'src')
                    ]
                }
            ]
        }
    });
}
