const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
    entry: {
        "sugar": path.join(__dirname, 'src/core/sugar.js'),
        // "sugar.web.table": path.join(__dirname, 'src/web/table/Table.js')
    },
    output: {
        path: path.join(__dirname, 'build'),
        filename: '[name].js',
        library: true,
        libraryTarget: 'commonjs2'
    },
    target: 'node',
    externals: [nodeExternals()],
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                loader: 'babel',
                query: {
                    presets: ['es2015', 'react']
                },
                include: [
                    path.join(__dirname, 'src')
                ]
            }
        ]
    }
};
