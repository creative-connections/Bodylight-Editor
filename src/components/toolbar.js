import {Editorapi} from './editorapi';
import {inject} from 'aurelia-framework';
import localForage from 'localforage';
import {BodylightEditorItems} from './bodylightEditorItems';

@inject(Editorapi)
export class Toolbar extends BodylightEditorItems {
  showButtons =false;
  uploaddialog = false;
  filename='webapplication.md'
  isDragging=false;

  constructor(api) {
    super();
    this.api = api;
  }

  attached() {
    localForage.getItem('bodylight-projects')
      .then(projects =>{
        this.projects = projects;
      })
      .catch(error=>{
        console.log('Projects localforage:', error);
      });
  }

  newSinglePageProject() {
    const projlen = this.projects ? this.projects.length : 0;
    let name = prompt('Project name :', 'WebApplication' + projlen);
    this.projects.push({name: name, type: 'single'});
  }
  newMultiPageProject() {
    const projlen = this.projects ? this.projects.length : 0;
    let name = prompt('Project name :', 'WebApplication' + projlen);
    this.projects.push({name: name, type: 'multi'});
  }

  exportAsZip() {}

  addItem(item) {
    //delegate to api
    this.api.addItem(item);
  }


  showHelp(item) {
    //console.log("changing help",item);
    this.api.helpsrc = item.doc;
  }

  undo() {
    this.api.editor.undo();
  }

  redo() {
    this.api.editor.redo();
  }

  bold() {
    this.api.editor.insert('****');
    let p = this.api.editor.getCursorPosition();
    this.api.editor.moveCursorTo(p.row, p.column - 2);
    this.api.editor.focus();
  }

  italic() {
    this.api.editor.insert('__');
    let p = this.api.editor.getCursorPosition();
    this.api.editor.moveCursorTo(p.row, p.column - 1);
    this.api.editor.focus();
  }
  underline() {
    this.api.editor.insert('<u></u>');
    let p = this.api.editor.getCursorPosition();
    this.api.editor.moveCursorTo(p.row, p.column - 4);
    this.api.editor.focus();
  }


  code() {
    this.api.editor.insert('``');
    let p = this.api.editor.getCursorPosition();
    this.api.editor.moveCursorTo(p.row, p.column - 1);
    this.api.editor.focus();
  }
  equation() {
    this.api.editor.insert('$$');
    let p = this.api.editor.getCursorPosition();
    this.api.editor.moveCursorTo(p.row, p.column - 1);
    this.api.editor.focus();
  }


  h1() {
    this.api.editor.insert('# ');
    this.api.editor.focus();
  }
  h2() {
    this.api.editor.insert('## ');
    this.api.editor.focus();
  }
  h3() {
    this.api.editor.insert('### ');
    this.api.editor.focus();
  }
  h4() {
    this.api.editor.insert('#### ');
    this.api.editor.focus();
  }
  division13() {
    this.api.editor.insert('<div class="w3-row">\n<div class="w3-third">\n');
    let p = this.api.editor.getCursorPosition();
    this.api.editor.insert('\n</div>\n<div class="w3-third">\n</div>\n<div class="w3-third">\n</div></div>');
    this.api.editor.moveCursorTo(p.row, p.column);
    this.api.editor.focus();
  }
  division12() {
    this.api.editor.insert('<div class="w3-row">\n<div class="w3-half">\n');
    let p = this.api.editor.getCursorPosition();
    this.api.editor.insert('\n</div>\n<div class="w3-half">\n</div>\n</div>');
    this.api.editor.moveCursorTo(p.row, p.column);
    this.api.editor.focus();
  }
  division1323() {
    this.api.editor.insert('<div class="w3-row">\n<div class="w3-third">\n');
    let p = this.api.editor.getCursorPosition();
    this.api.editor.insert('\n</div>\n<div class="w3-twothird">\n</div>\n</div>');
    this.api.editor.moveCursorTo(p.row, p.column);
    this.api.editor.focus();
  }

  //handles download button click, asks for filename and use file-saver.saveAs package to save the blob
  download() {
    this.api.download();
  }

  //opens upload dialog with button/area to dragndrop file
  upload() {
    this.uploaddialog = ! this.uploaddialog;
  }
  //handles after file is loaded
  handleFileLoad(event) {
    console.log('handlefileload event:', event);
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

  save() {

  }
  load() {

  }

  preview() {
    this.api.previewmode = ! this.api.previewmode;
    //call resize on Adobe Animate - after 0.5s
    if (window.ani) {
      setTimeout(function() {window.ani.handleResize();}, 500);
    }
  }

  autopreview() {
    this.api.autopreview = ! this.api.autopreview;
  }

  generatepreview() {
    this.api.renderchange(this.api);
  }

  identifyItem() {
    let selectionRange = this.api.editor.getSelectionRange();
    let res = this.api.editor.find(/</g, { backwards: true, start: selectionRange, wrap: true, caseSensitive: false, wholeWord: false, regExp: true});
    let res2 = this.api.editor.find(/>/g, { backwards: false, start: selectionRange, wrap: true, caseSensitive: false, wholeWord: false, regExp: true});
    let res3 = this.api.editor.find(/<\//g, { backwards: false, start: res2, wrap: true, caseSensitive: false, wholeWord: false, regExp: true});
    let res4 = this.api.editor.find(/>/g, { backwards: false, start: res3, wrap: true, caseSensitive: false, wholeWord: false, regExp: true});
    //console.log('identifyItem res1', selectionRange);
    //console.log('identifyItem res1', res);
    //console.log('identifyItem res4', res4);
    //set Range object from res to res4
    res4.start = res.start;
    this.api.editor.selection.setSelectionRange(res4);
    let item = this.api.editor.getSelectedText();
    console.log('identifyItem item:', item);
    //let itemtag =  var reTagCatcher = /(<.[^(><.)]+>)/g;

    try {
      let itemtag = item.match(/<(bdl-[^(<> )]+)/g)[0].substr(1);
      console.log('identifyItem tag:', itemtag);
      let matchitem = this.basicitems.filter(x => x.name === itemtag);
      let myitem = {};
      if (matchitem && matchitem.length > 0) {
        myitem.name = itemtag; myitem.def = item; myitem.doc = matchitem[0].doc; myitem.dialog = matchitem[0].dialog;
      } else {
        matchitem = this.advanceditems.filter(x => x.name === itemtag);
        if (matchitem && matchitem.length > 0) {
          myitem.name = itemtag; myitem.def = item; myitem.doc = matchitem[0].doc; myitem.dialog = matchitem[0].dialog;
        }
      }
      if (myitem.name) {
        this.api.addItem(myitem);
        //let dialog know to update
        if (myitem.name === 'bdl-fmi') {
          let ev = new CustomEvent('fmidialoginit');
          document.dispatchEvent(ev);
        }
      } else console.error('identifyItem - tag not found in basic/advanced items', itemtag);
    } catch (err) {
      console.log('identifyItem - tag not found', err);
    }


    //from cursor find previous '<' tag and then find '>' and '</...>'
  }
}
