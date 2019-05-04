import React from 'react';
import ReactDOM from 'react-dom';
import {ContentState, Editor, EditorState, convertFromHTML} from 'draft-js';

const blocksFromHTML = convertFromHTML(`test`);

const state = ContentState.createFromBlockArray(
  blocksFromHTML.contentBlocks,
  blocksFromHTML.entityMap
);



export default class MyEditor extends React.Component {
  constructor(props) {
    super(props);
      this.state = {editorState: EditorState.createWithContent(state)};
    this.onChange = (editorState) => this.setState({editorState});
  }
  render() {
      return (
	      <div style={{ borderStyle: '1px solid black'}}>
              <Editor editorState={this.state.editorState} onChange={this.onChange} />
	      </div>
    );
  }
}

