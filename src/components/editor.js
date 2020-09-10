import 'ace-builds';
import 'ace-builds/webpack-resolver';
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/snippets/text.js';
import jQuery from 'jquery';

import {EventAggregator} from 'aurelia-event-aggregator';
import {ContentUpdated} from './messages';
import {inject} from 'aurelia-framework';
import {BodylightEditorItems} from "./bodylightEditorItems";

@inject(EventAggregator)
export class Editor extends BodylightEditorItems{
  indexhelpsrc = "index.md";
  constructor(ea) {
    super();
    this.ea = ea;
    this.helpsrc= this.indexhelpsrc;
  }
  attached() {

    window.$ = window.jQuery = jQuery;
    ace.require('ace/ext/language_tools');
    this.editor = ace.edit('editorref', {
      mode: 'ace/mode/markdown',
      theme: 'ace/theme/chrome',
      enableBasicAutocompletion: false,
      enableSnippets: true,
      enableLiveAutocompletion: false,
      wrap: true,
      maxLines: 30,
      minLines: 30,
      fontSize: 16
    });
    let that = this;

    this.editor.on('change', function(delta){
      //that.generatepreview();
      console.log('editor delta:',delta)
      if (delta.start.row<delta.end.row){

        let content = that.editor.getValue();
        //hack - transform content so bdl-components will be interpreted by aurelia plugin - it needs components without
        //bdl prefix
        //all <bdl- will be repaced to < and </bdl- to </
        const startprefix = /<bdl-/gi;
        const stopprefix = /<\/bdl-/gi;
        const transformedContent = content.replace(startprefix,'<').replace(stopprefix,'</');
        //create customevent - which component is listening to
        let event = new CustomEvent('contentupdate', {detail: {content: transformedContent}});
        //console.log('sending content update')
        document.getElementById('editorref').dispatchEvent(event)
        //that.ea.publish(new ContentUpdated(content));
      }
      /*if (delta.contains('\n')) {
        let content = that.editor.getValue();
        that.ea.publish(new ContentUpdated(content));
      }*/
    })
  }

  addItem(item){
    this.editor.insert(item.def);
    //document.getElementById('editorref').focus();
    this.editor.focus();
  }


  showHelp(item){
    //console.log("changing help",item);
    if (item)
      this.helpsrc = item.doc;
    else
      this.helpsrc = this.indexhelpsrc;
  }

  undo(){
    this.editor.undo();
  }

  redo(){
    this.editor.redo();
  }

  bold(){
    this.editor.insert('****');
    let p = this.editor.getCursorPosition();
    this.editor.moveCursorTo(p.row,p.column-2);
    this.editor.focus();
  }

  italic(){
    this.editor.insert('__');
    let p = this.editor.getCursorPosition();
    this.editor.moveCursorTo(p.row,p.column-1);
    this.editor.focus();
  }

  code(){
    this.editor.insert('``');
    let p = this.editor.getCursorPosition();
    this.editor.moveCursorTo(p.row,p.column-1);
    this.editor.focus();
  }
  equation(){
    this.editor.insert('$$');
    let p = this.editor.getCursorPosition();
    this.editor.moveCursorTo(p.row,p.column-1);
    this.editor.focus();
  }


  h1(){
    this.editor.insert('# ')
    this.editor.focus();

  }
  h2(){
    this.editor.insert('## ')
    this.editor.focus();

  }
  h3(){
    this.editor.insert('### ')
    this.editor.focus();

  }
  h4(){
    this.editor.insert('#### ')
    this.editor.focus();

  }
}
