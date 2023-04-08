const path = require('path');

const src = path.resolve(__dirname, 'src');
const dist = path.resolve(__dirname, 'dist');

const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: {
        // popup script
        popup: path.join(src, 'scripts/popup/popup.js'),

        // content script
        content: path.join(src, 'scripts/content/content-script.js'),

        // background script
        background: path.join(src, 'scripts/background/background.js'),

        constant: path.join(src, 'scripts/constant.js'),
        environment: path.join(src, 'scripts/environment-prod.js')
    },
    output: {
        path: dist,
        filename: '[name].min.js'
    },
    optimization: {
        minimizer: [new UglifyJsPlugin()],
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                {
                    from: '*.html',
                    to: '.',
                    context: 'src'
                },
                {
                    from: 'style.css',
                    to: '.',
                    context: 'src/css'
                },
                {
                    from: 'ic_logo.png',
                    to: '.',
                    context: 'src/images'
                },
                {
                    from: 'cannot_record.png',
                    to: '.',
                    context: 'src/images'
                },
                {
                    from: '*.gif',
                    to: '.',
                    context: 'src/images'
                },
            ]
        })
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015', 'env']
                }
            }
        ]
    },
    resolve: {
        extensions: ['.js']
    }
};
