/*
 * Boilerplate container for the 'DocsViewer' component which does
 * some of the heavy lifting.
 */
var React = require('react');
var DocsViewer = require('./docs').default;
//import { Parser } from 'docutils-js/lib/parsers/restructuredtext'
import { Publisher, publishCmdLine } from 'docutils-js/lib/Core'
import { newDocument } from 'docutils-js/lib/utils'
import { StringInput, StringOutput } from 'docutils-js/lib/io'
import baseSettings from 'docutils-js/lib/baseSettings';

const args = { readerName: 'standalone',
	       parserName: 'restructuredtext',
	       usage: '',
	       description: '',
	       enableExitStatus: true,
	       writerName: 'xml' };

const { readerName, parserName, writerName } = args;
const source = new StringInput({source: "test"})
const destination = new StringOutput({})
const settings = baseSettings;
const pub = new Publisher({source, destination, settings});
pub.setComponents(readerName, parserName, writerName);
pub.publish({}, () => {
    console.log(destination.destination)
});

export default (props) => <div><h1>helo123</h1>
    <DocsViewer {...props}/>
    </div>;
