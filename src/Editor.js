import React from 'react';
import ReactDOM from 'react-dom';
import {Editor, EditorState, ContentState, Modifier, convertFromHTML, RichUtils} from 'draft-js';

const blocksFromHTML = convertFromHTML('test');

const state = ContentState.createFromBlockArray(
  blocksFromHTML.contentBlocks,
  blocksFromHTML.entityMap
);



export default class MyEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {editorState: EditorState.createEmpty()};
      this.onChange = (editorState) => this.setState({editorState});
      this.handleSectionClick = this.handleSectionClick.bind(this);
      this.handleDebugbClick = this.handleDebugClick.bind(this);
  }

    handleDebugClick() {
	const contentState = this.state.editorState.getCurrentContent();
	const blockMap = contentState.getBlockMap();
    }
    handleSectionClick() {
	const contentState = this.state.editorState.getCurrentContent();
	const contentStateWithEntity = contentState.createEntity('SECTION', 'MUTABLE')

	const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
	const contentStateWithLink = Modifier.applyEntity(
	    contentStateWithEntity,
	    selectionState,
	    entityKey
	);
	const newEditorState = EditorState.push(editorState, { currentContent: contentStateWithLink });
    }
    handleKeyCommand(command, editorState) {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.onChange(newState);
      return 'handled';
    }
    return 'not-handled';
    }
    
  render() {
      return (
	      <div>
	      <div>
	      <button onClick={this.handleSectionClick}>Section</button>
	      <button onClick={this.handleDebugClick}>Debug</button>
	      </div>
	      <div style={{ padding: '.66rem', height: '30rem', border: '3px inset gray'}}>
              <Editor editorState={this.state.editorState} onChange={this.onChange} />
	      </div>
	      </div>
    );
  }
}

