import 'ace-builds';
import 'ace-builds/webpack-resolver';
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/snippets/text.js';
import jQuery from 'jquery';
import {saveAs} from 'file-saver';

import {EventAggregator} from 'aurelia-event-aggregator';
import {ContentUpdated} from './messages';
import {inject} from 'aurelia-framework';
import {BodylightEditorItems} from "./bodylightEditorItems";

@inject(EventAggregator)
export class Editor extends BodylightEditorItems{
  indexhelpsrc = "index.md";
  uploaddialog = false;
  filename="webapplication.md"
  isDragging=false;
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
      maxLines: 50,
      minLines: 25,
      fontSize: 14
    });
    let that = this;

    this.editor.on('change', function(delta){
      if (delta.start.row<delta.end.row){
        that.renderchange(that)
      }
    })
  }

  preview(){
    this.renderchange(this);
    this.editor.focus();
  }


  renderchange(that){
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

  //handles download button click, asks for filename and use file-saver.saveAs package to save the blob
  download() {
    let filename = prompt('File name (*.md):', this.filename);
    if (filename) {
      if (!filename.endsWith('.md')) filename = filename.concat('.md');
        let content = this.editor.getValue();
        let blob = new Blob([content], {type: 'text/plain;charset=utf-8'});
        saveAs(blob, filename);
      }
  }
  //opens upload dialog with button/area to dragndrop file
  upload(){
    this.uploaddialog= ! this.uloaddialog;
  }

  //handles after file is loaded
  handleFileLoad(event) {
    console.log('handlefileload event:',event)
    let data = event.target.result;
    console.log('handlefile data:', data);
    window.editor.editor.setValue(data);
    window.editor.editor.focus();
  }

  drag(event) {
    this.isDragging = true;
    event.preventDefault();
  }


  drop(event) {
    this.isDragging = false;
    event.preventDefault();
    this.dragNdrop(event);
  }

  //starts file loading
  dragNdrop(event) {
    const reader = new FileReader();
    //sets global variable to this instance
    window.editor = this;
    reader.onload = this.handleFileLoad;
    let files = event.target.files || event.dataTransfer.files;
    console.log(files);
    this.filename = files[0].name;
    reader.readAsText(files[0]);
    this.uploaddialog = false;
  }

}
