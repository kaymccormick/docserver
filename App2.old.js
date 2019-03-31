var React = require('react');
import { Publisher, publishCmdLine } from 'docutils-js/lib/Core'
import { newDocument } from 'docutils-js/lib/utils'
import { StringInput, StringOutput } from 'docutils-js/lib/io'
import RichTextEditor from 'react-rte';

export default class extends React.Component {
    constructor(){
	super();
	this.state = {input: RichTextEditor.createEmptyValue(),
		      output: RichTextEditor.createEmptyValue()}
	this.handleInputChange = this.handleInputChange.bind(this);
	this.outputRef = React.createRef();
    }
    handleInputChange(input) {
	this.setState({input});

	const args = { readerName: 'standalone',
		       parserName: 'restructuredtext',
		       usage: '',
		       description: '',
		       enableExitStatus: true,
		       writerName: 'xml' };
	
	const { readerName, parserName, writerName } = args;
	const source = new StringInput({source: input.toString('raw')})
	const destination = new StringOutput({})
	const settings = {}
	const pub = new Publisher({source, destination, settings});
	pub.setComponents(readerName, parserName, writerName);
	pub.publish({}, () => {
	    this.setState({ output: RichTextEditor.createValueFromString(destination.destination, 'xmlk
') });
	});
    }
    render() {
	return <div><form><div style={{display: 'grid', gridTemplateCols: '1fr 1fr'}}><div><RichTextEditor id="input" onChange={this.handleInputChange} value={this.state.input}/></div><div><RichTextEditor ref={this.outputRef} id="output" value={this.state.output}/></div></div></form></div>;
    }
}

