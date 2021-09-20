import React, {  } from 'react';
import {Editor, EditorState, RichUtils, getDefaultKeyBinding} from 'draft-js';
import { convertToRaw, convertFromRaw } from "draft-js";
import ButtonGroup from '@material-ui/core/ButtonGroup';
import RegularButton  from './../../../components/CustomButtons/Button';
import 'draft-js/dist/Draft.css';
import './RichText.css' 
import './../../../../node_modules/draft-js/dist/Draft'
//Icons
import { 
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  Title,
  FormatQuote,
  FormatListNumbered,
  FormatListBulleted,
  Code,
  FormatSize,
} from '@material-ui/icons';

class NoteEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {editorState: EditorState.createEmpty()};
    
    // eslint-disable-next-line
    //this.focus = () => this.refs.editor.focus();
    this.onChange = (editorState) => { 
      this.setState({editorState}); 
      this.props.setRichTextNote(JSON.stringify(convertToRaw(editorState.getCurrentContent())));
      this.props.setPlainTextNote(editorState.getCurrentContent().getPlainText());
    };

    this.handleKeyCommand = this._handleKeyCommand.bind(this);
    this.mapKeyToEditorCommand = this._mapKeyToEditorCommand.bind(this);
    this.toggleBlockType = this._toggleBlockType.bind(this);
    this.toggleInlineStyle = this._toggleInlineStyle.bind(this);
  }

  componentDidUpdate(prevProps) {
    if(this.props.noteId !== prevProps.noteId){
      // Gets the value of an existing note or creates an empty one
      console.log("Nuevo ID", this.props.noteId)
      if(this.props.plainTextNote !== '' && this.props.noteId !== ""){
        this.setState({editorState: EditorState.createWithContent(convertFromRaw( JSON.parse( this.props.richTextNote)))});
      }
      else{
        this.setState({editorState: EditorState.createEmpty()});
      }
    }
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
        blockType
      )
    );
  }

  _toggleInlineStyle(inlineStyle) {
    this.onChange(
      RichUtils.toggleInlineStyle(
        this.state.editorState,
        inlineStyle
      )
    );
  }

  

  render() {
    const {editorState} = this.state;

    // If the user changes block type before entering any text, we can
    // either style the placeholder or hide it. Let's just hide it now.
    let className = 'RichEditor-editor';
    var contentState = editorState.getCurrentContent();    
    if (!contentState.hasText()) {
      if (contentState.getBlockMap().first().getType() !== 'unstyled') {
        className += ' RichEditor-hidePlaceholder';
      }
    }
    
    return (
      <div className="Editor-container">
        <div style={{paddingBottom: '10px'}}>
          <BlockStyleControls
            color={this.props.color}
            editorState={editorState}
            onToggle={this.toggleBlockType}
          />
        </div>
        <div style={{paddingBottom: '10px'}}>
          <InlineStyleControls
            color={this.props.color}
            editorState={editorState}
            onToggle={this.toggleInlineStyle}
          />
        </div>
        <div 
          className="RichEditor-root" 
        >
          <div onClick={this.focus} className={className}>
            <Editor
              blockStyleFn={getBlockStyle}
              customStyleMap={styleMap}
              editorState={editorState}
              handleKeyCommand={this.handleKeyCommand}
              keyBindingFn={this.mapKeyToEditorCommand}
              onChange={this.onChange}
              placeholder="Escribe tus notas aquí..."
              spellCheck={true}
            />
          </div>
        </div>
      </div>
      
    );
  }
}

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

const BLOCK_TYPES = [
  {label: 'Title 1', style: 'header-one', icon: FormatSize},
  {label: 'Title 2', style: 'header-two', icon: FormatSize},
  {label: 'Title 3', style: 'header-three', icon: FormatSize},
  {label: 'Blockquote', style: 'blockquote', icon: FormatQuote},
  {label: 'UL', style: 'unordered-list-item', icon: FormatListNumbered},
  {label: 'OL', style: 'ordered-list-item', icon: FormatListBulleted},
  {label: 'Code', style: 'code-block', icon: Code},
];

const BlockStyleControls = (props) => {
  const {editorState, color} = props;
  const selection = editorState.getSelection();
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType();
  const onToggle = (style) => {
    props.onToggle(style);
  }

  return (
    <ButtonGroup disableElevation size="small">
      {BLOCK_TYPES.map((type) =>
        <RegularButton 
          key={type.label} 
          variant={type.style === blockType? 'contained' : 'outlined'}
          size="sm"
          startIcon={<type.icon/>}
          color={type.style === blockType? color : 'white'}
          onClick={()=>onToggle(type.style)}
        >
          {type.label} 
        </RegularButton>
      )}
    </ButtonGroup>
  );
};

var INLINE_STYLES = [
  {label: 'Bold', style: 'BOLD', icon: FormatBold },
  {label: 'Italic', style: 'ITALIC', icon: FormatItalic},
  {label: 'Underline', style: 'UNDERLINE', icon: FormatUnderlined},
  {label: 'Monospace', style: 'CODE', icon: Title},
];

const InlineStyleControls = (props) => {
  const currentStyle = props.editorState.getCurrentInlineStyle();
  const { color } = props;
  const onToggle = (style) => {
    props.onToggle(style);
  }
  
  return (
    <ButtonGroup disableElevation size="small">
      {INLINE_STYLES.map((type) =>
        <RegularButton 
          key={type.label} 
          color={currentStyle.has(type.style)? color : 'white'}
          size="sm"
          variant={currentStyle.has(type.style)? 'contained' : 'outlined'}
          startIcon={<type.icon/>}
          onClick={()=>onToggle(type.style)}
        >
          {type.label}
        </RegularButton>
      )}
    </ButtonGroup>
  );
};

export default NoteEditor;