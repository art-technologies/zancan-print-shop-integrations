const path = require('path');
const webpack = require('webpack');

module.exports = {
    mode: "production",
    entry: {
        main: "./src/lib/ethereum.js",
    },
    output: {
        path: path.resolve(__dirname, './ethereum-bundle'),
        filename: "ethereum.min.js"
    },
    resolve: {
        extensions: [".js"],
    },
    plugins: [
        new webpack.optimize.LimitChunkCountPlugin({
            maxChunks: 1,
        }),
    ],
};