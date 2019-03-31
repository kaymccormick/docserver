var React = require('react');
import { Publisher, publishCmdLine } from 'docutils-js/lib/Core'
import { newDocument } from 'docutils-js/lib/utils'
import { StringInput, StringOutput } from 'docutils-js/lib/io'
import DocsViewer from './docs2';
import { getComponentForXmlSync } from 'docutils-react/lib/getComponentForXmlSax'
export default class extends React.Component {
    constructor(){
	super();
	this.state = {input: 'testx',
		      output: ''
		     }

	this.handleInputChange = this.handleInputChange.bind(this);
	this.outputRef = React.createRef();
    }
    handleInputChange(event) {
	this.setState( { input: event.target.value});
	const args = { readerName: 'standalone',
		       parserName: 'restructuredtext',
		       usage: '',
		       description: '',
		       enableExitStatus: true,
		       writerName: 'xml' };
	
	const { readerName, parserName, writerName } = args;
	const source = new StringInput({source: event.target.value})
	const destination = new StringOutput({})
	const settings = {}
	const pub = new Publisher({source, destination, settings});
	pub.setComponents(readerName, parserName, writerName);
	pub.publish({}, () => {
	    this.setState({ output: destination.destination,
			    component: getComponentForXmlSync(destination.destination)
			  })
	});
    }
    render() {
	return <div><form><div style={{display: 'grid'}}><div><textarea id="input" onChange={this.handleInputChange} value={this.state.input}/></div><div><textarea ref={this.outputRef} id="output" value={this.state.output}/></div><div>{this.state.component}</div></div></form></div>;
    }
}

