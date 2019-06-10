/*
 * Boilerplate container for the 'DocsViewer' component which does
 * some of the heavy lifting.
 */
import {
 defaults as baseSettings, StringInput, StringOutput, newDocument, Publisher,
} from 'docutils-js';

const React = require('react');
const DocsViewer = require('./docs').default;

const args = {
 readerName: 'standalone',
	       parserName: 'restructuredtext',
	       usage: '',
	       description: '',
	       enableExitStatus: true,
	       writerName: 'xml',
};

const { readerName, parserName, writerName } = args;
const source = new StringInput({ source: 'test' });
const destination = new StringOutput({});
const settings = baseSettings;
const pub = new Publisher({ source, destination, settings });
pub.setComponents(readerName, parserName, writerName);
pub.publish({}, () => {
    console.log(destination.destination);
});

export default props => <div><h1>helo123</h1>
    <DocsViewer {...props}/>
    </div>;
