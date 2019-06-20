import React, {ChangeEvent, KeyboardEvent, MouseEvent} from 'react';
import ReactDOM from 'react-dom';
import Draft, {
  convertToRaw, convertFromRaw, Editor, EditorState,
  ContentState, Modifier, convertFromHTML, RichUtils, getDefaultKeyBinding, DraftEditorCommand, DraftHandleValue,
} from 'draft-js';
import {
  StandaloneReader as Reader, defaults as settings, parse, StringOutput,
} from 'docutils-js';
import JSONTree from 'react-json-tree';
// @ts-ignore
import DraftBlockType = Draft.Model.Constants.DraftBlockType;
// @ts-ignore
import EditorCommand = Draft.Component.Base.EditorCommand;

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

function getBlockStyle(block: DraftBlockType): string {
  // @ts-ignore
  switch (block.getType()) {
    case 'blockquote': return 'RichEditor-blockquote';
    default: return '';
  }
}

interface StyleButtonProps {
  style: string;
  onToggle: (inlineStyle: string) => void;
  active: boolean
  label: string;
}
class StyleButton extends React.Component<StyleButtonProps> {
  private onToggle: (e: MouseEvent) => void;
  constructor(props: StyleButtonProps) {
    super(props);
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
      <span className={className} onMouseDown={(e) => this.onToggle(e)}>
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

const BlockStyleControls = (props: {
  onToggle: (blockStyle: string) => void;
  editorState: EditorState }) => {
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

const InlineStyleControls = (props: { editorState: EditorState;
onToggle: (inlineStyle: string) => void}) => {
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


interface MyEditorProps {
}

export default class MyEditor extends React.Component<MyEditorProps> {
  state: { rawContent?: {};
  input?: string;
  editorState: EditorState; };
  private handleKeyCommand: (command: EditorCommand, editorState: EditorState) => DraftHandleValue;
  private mapKeyToEditorCommand: (e: KeyboardEvent<Element>) => EditorCommand | null;
  private onChange: (editorState: EditorState) => void;
  private focus: any;
  private toggleInlineStyle: (inlineStyle: string) => void;
  private toggleBlockType: (blockType: DraftBlockType) => void;
  private handleDebugClick: any;
  private handleInputChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  private publish: OmitThisParameter<() => void>;
  public constructor(props: MyEditorProps) {
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
    // @ts-ignore
    this.handleKeyCommand = this._handleKeyCommand.bind(this);
    // @ts-ignore
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

  _handleInputChange(event: ChangeEvent<HTMLTextAreaElement>) {
    this.setState({ input: event.target.value, inputModifiedTime: Date.now() });
  }

  _handleDebugClick() {
    const contentState = this.state.editorState.getCurrentContent();
    const blockMap = contentState.getBlockMap().toJS();
    console.log(blockMap);
    Object.entries(blockMap).forEach(([k, v]) => {

      // @ts-ignore
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


  _handleKeyCommand(command: DraftEditorCommand, editorState: EditorState): DraftHandleValue {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.onChange(newState);
      return "handled";
    }
    return "not-handled";
  }

  _mapKeyToEditorCommand(e: KeyboardEvent) {
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

  _toggleBlockType(blockType: DraftBlockType) {
    // @ts-ignore
    // @ts-ignore
    this.onChange(
      RichUtils.toggleBlockType(
        this.state.editorState,
        blockType,
      ),
    );
  }

  _toggleInlineStyle(inlineStyle: string): void {
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
    // @ts-ignore
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
          <JSONTree data={this.state.rawContent!} />
        </div>
      </div>
    );
  }
}
