"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
/*
 * Boilerplate container for the 'DocsViewer' component which does
 * some of the heavy lifting.
 */
var docutils_js_1 = require("docutils-js");
var args = {
    readerName: 'standalone',
    parserName: 'restructuredtext',
    usage: '',
    description: '',
    enableExitStatus: true,
    writerName: 'xml'
};
var readerName = args.readerName, parserName = args.parserName, writerName = args.writerName;
var source = new docutils_js_1.StringInput({ source: 'test' });
var destination = new docutils_js_1.StringOutput({});
var settings = docutils_js_1.defaults;
var pub = new docutils_js_1.Publisher({ source: source, destination: destination, settings: settings });
pub.setComponents(readerName, parserName, writerName);
pub.publish({}, function () {
    console.log(destination.destination);
});
exports["default"] = (function (props) { return (React.createElement("div", null,
    React.createElement("h1", null, "helo123"),
    React.createElement(DocsViewer, __assign({}, props)))); });
