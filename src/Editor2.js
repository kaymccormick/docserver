import React from 'react';
import ReactDOM from 'react-dom';
import {
  convertToRaw, convertFromRaw, Editor, EditorState,
  ContentState, Modifier, convertFromHTML, RichUtils, getDefaultKeyBinding,
} from 'draft-js';
import {
  StandaloneReader as Reader, baseSettings as settings, parse, StringOutput,
} from 'docutils-js';
import JSONTree from 'react-json-tree';
import Writer from './draftWriter';

/* Some code taken from the 'rich' example in the draft-js source code
   by Facebook. */

// Custom overrides for "code" style.
const styleMap = {
  CODE: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
    fontSize: 16,
    padding: 2,
  },
};

function getBlockStyle(block) {
  switch (block.getType()) {
    case 'blockquote': return 'RichEditor-blockquote';
    default: return null;
  }
}

class StyleButton extends React.Component {
  constructor() {
    super();
    this.onToggle = (e) => {
      e.preventDefault();
      this.props.onToggle(this.props.style);
    };
  }

  render() {
    let className = 'RichEditor-styleButton';
    if (this.props.active) {
      className += ' RichEditor-activeButton';
    }

    return (
      <span className={className} onMouseDown={this.onToggle}>
        {this.props.label}
      </span>
    );
  }
}

const BLOCK_TYPES = [
  { label: 'H1', style: 'header-one' },
  { label: 'H2', style: 'header-two' },
  { label: 'H3', style: 'header-three' },
  { label: 'H4', style: 'header-four' },
  { label: 'H5', style: 'header-five' },
  { label: 'H6', style: 'header-six' },
  { label: 'Blockquote', style: 'blockquote' },
  { label: 'UL', style: 'unordered-list-item' },
  { label: 'OL', style: 'ordered-list-item' },
  { label: 'Code Block', style: 'code-block' },
];

const BlockStyleControls = (props) => {
  const { editorState } = props;
  const selection = editorState.getSelection();
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType();

  return (
    <div className="RichEditor-controls">
      {BLOCK_TYPES.map(type => (
        <StyleButton
          key={type.label}
          active={type.style === blockType}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
        />
      ))}
    </div>
  );
};

const INLINE_STYLES = [
  { label: 'Bold', style: 'BOLD' },
  { label: 'Italic', style: 'ITALIC' },
  { label: 'Underline', style: 'UNDERLINE' },
  { label: 'Monospace', style: 'CODE' },
];

const InlineStyleControls = (props) => {
  const currentStyle = props.editorState.getCurrentInlineStyle();

  return (
    <div className="RichEditor-controls">
      {INLINE_STYLES.map(type => (
        <StyleButton
          key={type.label}
          active={currentStyle.has(type.style)}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
        />
      ))}
    </div>
  );
};


export default class MyEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
      input: `This is a top-level paragraph.

    This paragraph belongs to a first-level block quote.

        This paragraph belongs to a second-level block quote.

Another top-level paragraph.

        This paragraph belongs to a second-level block quote.

    This paragraph belongs to a first-level block quote.  The
    second-level block quote above is inside this first-level
    block quote.`,
      rawContent: { },
    };
    this.onChange = editorState => this.setState({ editorState });
    this.handleSectionClick = this.handleSectionClick.bind(this);
    this.handleDebugClick = this._handleDebugClick.bind(this);
    this.toggleBlockType = this._toggleBlockType.bind(this);
    this.toggleInlineStyle = this._toggleInlineStyle.bind(this);
    this.handleKeyCommand = this._handleKeyCommand.bind(this);
    this.mapKeyToEditorCommand = this._mapKeyToEditorCommand.bind(this);
    this.handleInputChange = this._handleInputChange.bind(this);
    this.publish = this._publish.bind(this);
  }

  componentDidMount() {
    this.publish();
  }

  _publish() {
    const blocksFromHTML = convertFromHTML('<emphasis>hi</emphasis>');
    const state = ContentState.createFromBlockArray(
      blocksFromHTML.contentBlocks,
      blocksFromHTML.entityMap,
    );
    this.state = { editorState: EditorState.createWithContent(state) };

  //   const reader = new Reader({ parseFn: parse });
  //   const docSource = this.state.input;
  //   const document = reader.read2(docSource, settings);
  //   const writer = new Writer();
  //   const destination = new StringOutput();
  //   writer.write(document, destination);
  //
  //   const rawContent = {
  //     entityMap: {},
  //     blocks: writer.output,
  //   };
  //   const blocks = convertFromRaw(rawContent);
  //   const editorState = EditorState.createWithContent(blocks/* , decorator */);
  //   const rawContent2 = convertToRaw(editorState.getCurrentContent());
  //   this.setState({ editorState, rawContent: rawContent2 });
  //
  }

  _handleInputChange(event) {
    this.setState({ input: event.target.value, inputModifiedTime: Date.now() });
  }

  _handleDebugClick() {
    const contentState = this.state.editorState.getCurrentContent();
    const blockMap = contentState.getBlockMap().toJS();
    console.log(blockMap);
    Object.entries(blockMap).forEach(([k, v]) => {
      Object.entries(v).forEach(([k2, v2]) => {
        if (typeof v2 === 'object') {
          v2 = JSON.stringify(v2);
        }
        console.log(`level 2: ${k2} = ${v2}`);
      });
    });
  }

  handleSectionClick() {
    /*        const contentState = this.state.editorState.getCurrentContent();
                  const contentStateWithEntity = contentState.createEntity('SECTION', 'MUTABLE');

                  const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
                  const contentStateWithLink = Modifier.applyEntity(
                  contentStateWithEntity,
                  selectionState,
                  entityKey,
                  );
                  const newEditorState = EditorState.push(editorState, { currentContent: contentStateWithLink });
        */
  }


  _handleKeyCommand(command, editorState) {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.onChange(newState);
      return true;
    }
    return false;
  }

  _mapKeyToEditorCommand(e) {
    if (e.keyCode === 9 /* TAB */) {
      const newEditorState = RichUtils.onTab(
        e,
        this.state.editorState,
        4, /* maxDepth */
      );
      if (newEditorState !== this.state.editorState) {
        this.onChange(newEditorState);
      }
      return;
    }
    return getDefaultKeyBinding(e);
  }

  _toggleBlockType(blockType) {
    this.onChange(
      RichUtils.toggleBlockType(
        this.state.editorState,
        blockType,
      ),
    );
  }

  _toggleInlineStyle(inlineStyle) {
    this.onChange(
      RichUtils.toggleInlineStyle(
        this.state.editorState,
        inlineStyle,
      ),
    );
  }

  render() {
    const { editorState } = this.state;
    let className = 'RichEditor-editor';
    const contentState = editorState.getCurrentContent();
    if (!contentState.hasText()) {
      if (contentState.getBlockMap().first().getType() !== 'unstyled') {
        className += ' RichEditor-hidePlaceholder';
      }
    }
    return (
      <div>
        <div>
          <form>
            <p><button onClick={(e) => { e.preventDefault(); this.publish(); }}>Publish</button></p>
            <p><textarea style={{ width: '40em', height: '15em' }} id="input" onChange={this.handleInputChange} value={this.state.input} /></p>
          </form>
        </div>
        <div className="RichEditor-root">
          <button onClick={this.handleDebugClick}>Debug</button>
          <BlockStyleControls
            editorState={editorState}
            onToggle={this.toggleBlockType}
          />
          <InlineStyleControls
            editorState={editorState}
            onToggle={this.toggleInlineStyle}
          />
          <div className={className} onClick={this.focus}>
            <Editor
              blockStyleFn={getBlockStyle}
              customStyleMap={styleMap}
              editorState={editorState}
              handleKeyCommand={this.handleKeyCommand}
              keyBindingFn={this.mapKeyToEditorCommand}
              onChange={this.onChange}
              placeholder="Tell a story..."
              ref="editor"
              spellCheck
            />
          </div>
        </div>
        <div>
          <JSONTree data={this.state.rawContent} />
        </div>
      </div>
    );
  }
}
