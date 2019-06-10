
import { getComponentForXmlSync } from 'docutils-react/lib/getComponentForXmlSax';
import Modal from 'react-modal';
import {
 defaults as baseSettings, Publisher, newDocument, StringInput, StringOutput,
} from 'docutils-js';
import DocsViewer from './docs2';

const React = require('react');

const customStyles = {
    content: {
	top: '50%',
	left: '50%',
	right: 'auto',
	bottom: 'auto',
	marginRight: '-50%',
	transform: 'translate(-50%, -50%)',
    },
};


export default class extends React.Component {
    constructor() {
	super();
	this.state = {
 input: '',
		      inputModifiedTime: Date.now(),
		      output: '',
		      enabled: true,
		      modalIsOpen: false,
		      error: null,
		     };

	this.openModal = this.openModal.bind(this);
	this.afterOpenModal = this.afterOpenModal.bind(this);
	this.closeModal = this.closeModal.bind(this);

	this.handleInputChange = this.handleInputChange.bind(this);
	this.handleSectionClick = this.handleSectionClick.bind(this);

	this.outputRef = React.createRef();
    }

    onTimeout() {
/*	if((this.state.publishTime == null || (Date.now() - this.state.publishTime > 250)) && (this.state.inputModifiedTime > this.state.publishTime)) {
	    this.publish();
	}
	setTimeout(this.onTimeout.bind(this), 500); */
    }

    publish() {
	const args = {
 readerName: 'standalone',
		       parserName: 'restructuredtext',
		       usage: '',
		       description: '',
		       enableExitStatus: true,
		       writerName: 'xml',
};

	const { readerName, parserName, writerName } = args;
	if (!this.state.input) {
	    return;
	}
	const source = new StringInput({ source: this.state.input });
	const destination = new StringOutput({});
	const settings = baseSettings;
	const pub = new Publisher({ source, destination, settings });
	pub.setComponents(readerName, parserName, writerName);
	pub.publish({}, (error) => {
	    if (error) {
		console.log(error.stack.constructor.name);
		this.setState({
		    modalIsOpen: true,
		    error,
});
		return;
	    }
	    this.setState({
 output: destination.destination,
			    publishTime: Date.now(),
			    component: getComponentForXmlSync(destination.destination),
			  });
	});
    }

    componentDidMount() {
//	this.timer = setTimeout(this.onTimeout.bind(this), 1500);
    }

    openModal() {
	this.setState({ modalIsOpen: true });
    }

    afterOpenModal() {
	// references are now sync'd and can be accessed.
	this.subtitle.style.color = '#f00';
    }

    closeModal() {
	this.setState({ modalIsOpen: false });
    }

    handleSectionClick(event) {
	/* Do something related to inserting code for a 'section' in the source */
	event.preventDefault();
    }

    handleInputChange(event) {
	this.setState({ input: event.target.value, inputModifiedTime: Date.now() });
    }

    render() {
	return <div>
	    <Modal
        isOpen={this.state.modalIsOpen}
        onAfterOpen={this.afterOpenModal}
        onRequestClose={this.closeModal}
        style={customStyles}
        contentLabel="Error"
        >
            <h2 ref={subtitle => this.subtitle = subtitle}>Error</h2>
	    <p>{(this.state.error ? this.state.error.message : '') || null}</p>
	    <div>{(this.state.error ? this.state.error.stack.split('\n').map(x => <div>{x}</div>) : null)}</div>
            <button onClick={this.closeModal}>close</button>
            </Modal>
	    <form><div style={{
display: 'grid', gridColumnGap: '10px', gridTemplateRows: '1fr 1fr', gridTemplateColumns: '1fr 1fr',
}}>
	    <div style={{ gridColumn: '1', gridRow: '1' }}>
	    <div>
<button onClick={this.handleSectionClick}>Section</button>
	    <button onClick={(e) => { this.publish(); e.preventDefault(); }}>Publish</button>
	    </div>
	    <div><fieldset {...this.state.enabled ? {} : { disabled: 'disabled' }}>
	    <textarea style={{ width: '40em', height: '15em' }} id="input" onChange={this.handleInputChange} value={this.state.input}/>
	    </fieldset>
	    </div>
	    </div>
	    <div style={{
 gridColumn: '2', gridRow: '1 / 3', fontFamily: 'monospace', whiteSpace: 'pre-wrap',
}}>{this.state.output}</div><div style={{ gridColumn: '1', gridRow: '2' }}>{this.state.component}</div></div></form></div>;
    }
}
