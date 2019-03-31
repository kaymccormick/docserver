/*
 * Boilerplate container for the 'DocsViewer' component which does
 * some of the heavy lifting.
 */
var React = require('react');
var DocsViewer = require('./docs').default;
import { Parser } from 'docutils-js/lib/parsers/restructuredtext'
import { Publisher, publishCmdLine } from 'docutils-js/lib/Core'
import { newDocument } from 'docutils-js/lib/utils'

publishCmdLine({  argv: ['in.rst'],
  writerName: 'xml',
		  description: '',
}, (...args) => {
})

export default (props) => <div><h1>helo123</h1>
    <DocsViewer {...props}/>
    </div>;
