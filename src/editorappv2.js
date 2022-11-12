import {inject} from 'aurelia-framework';
import {Editorapi} from './components/editorapi';
import {version} from '../package.json';
import {EventAggregator} from 'aurelia-event-aggregator';
import { BodylightEditorItems } from './components/bodylightEditorItems';

@inject(Editorapi,EventAggregator,BodylightEditorItems)
export class Editorappv2 {
  dialogwidth=0;
  editorwidth=0;
  moving=false;
  editmode=false;
  projectmode=false;

  constructor(api,ea,bei) {
    this.api = api;
    this.api.ea = ea;
    this.basicitems = bei.basicitems;
    this.advanceditems = bei.advanceditems;
    this.version = version;

  }

  attached(){this.api.previewmode = false;
    this.api.bodylightdialog=false;
    this.api.animationdialog=false;

}
  
  fullmode = true;
  switchmode() {
      this.fullmode = ! this.fullmode;
  }

  togglepreview(){    
    this.api.previewmode = !this.api.previewmode;
  }

  toggleeditor(){
    this.editmode = !this.editmode;
  }

  toggleproject() {
    this.projectmode = !this.projectmode;
  }

  openbodylightdialog() {
    this.api.bodylightdialog = true;
    this.api.askAttributes = true;
    //this.api.askAttributesItem = '';
  }

  closebodylightdialog() {
    this.api.bodylightdialog = false;
  }
  openanimationdialog() {
    this.api.animationdialog = true;
  }

  closeanimationdialog() {
    this.api.animationdialog = false;
  }

  identifyItem() {
    let selectionRange = this.api.editor.getSelectionRange();
    let res = this.api.editor.find(/</g, { backwards: true, start: selectionRange, wrap: true, caseSensitive: false, wholeWord: false, regExp: true});
    let res2 = this.api.editor.find(/>/g, { backwards: false, start: selectionRange, wrap: true, caseSensitive: false, wholeWord: false, regExp: true});
    let res3 = this.api.editor.find(/<\//g, { backwards: false, start: res2, wrap: true, caseSensitive: false, wholeWord: false, regExp: true});
    let res4 = this.api.editor.find(/>/g, { backwards: false, start: res3, wrap: true, caseSensitive: false, wholeWord: false, regExp: true});

    res4.start = res.start;
    this.api.editor.selection.setSelectionRange(res4);
    let item = this.api.editor.getSelectedText();
    console.log('identifyItem item:', item);

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
  }

  sharedmodel() {
    this.api.sharedmodel = !this.api.sharedmodel;
    let modelmdcontent = 'rendered model.md';
    //opening md file
    if (this.api.sharedmodel) {
      this.api.bs.loadDocContent('model.md')
        .then(content => {
          //if (content)
          //console.log('content of the file ' + file.name, content);
          if (content) {
            //content directly accessible as string
            if (typeof (content) === 'string') {
              this.api.sharedmodelcontent = content; //store shared model.md content
              this.api.renderchange(this.api, content, 'modelmdref');
              //this.api.sharedmodelmdcontent = content;
              //this.generatepreview();
            }
            if (content instanceof Blob) {
              //read content of blob
              const reader = new FileReader();
              reader.addEventListener('loadend', () => {
                this.api.sharedmodelcontent = reader.result; //store shared model.md content
                // reader.result contains the contents of blob as a typed array
                this.api.renderchange(this.api, this.api.sharedmodelcontent, 'modelmdref');
                //this.api.sharedmodelmdcontent = content;
                //this.generatepreview();
              });
              reader.readAsText(content);
            }
          } else console.warn('model.md no content')
        })
        .catch(err => console.warn('model.md cannot open file. Error:', err));
    }
  }

  addItem(item) {
    //delegate to api
    this.api.addItem(item);
    this.api.helpsrc = item.doc;
  }


  showHelp(item) {
    //console.log("changing help",item);
    this.api.helpsrc = item.doc;
  }


}
