import {saveAs} from 'file-saver';
import jQuery from 'jquery';
import 'ace-builds';
import 'ace-builds/webpack-resolver';
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/snippets/text.js';
import '../acemode/mode-markdown';
//import {EventAggregator} from 'aurelia-event-aggregator';
import {BodylightStorage} from './project-files/bodylight-storage';
//import {ContentUpdated} from './messages';

export class Editorapi {
  askAttributes=false;
  attrDialog=null;
  dialogclass='./attribute-dialog';
  idindex=1;
  globstr ={}
  bs = new BodylightStorage();
  fmientries = [];
  fmientriessrc = [];
  adobeentries = [];

  initAceEditor() {
    window.$ = window.jQuery = jQuery;
    ace.require('ace/ext/language_tools');
    this.editor = ace.edit('editorref', {
      mode: 'ace/mode/markdown2',
      theme: 'ace/theme/chrome',
      enableBasicAutocompletion: false, //autocompletion
      enableSnippets: true, //snippets defined in mode
      enableLiveAutocompletion: false, //live autocompletion = when writing
      enableBehaviours: true, //automatically close tags, ", parentheses
      wrap: true,
      maxLines: 50,
      minLines: 25,
      fontSize: 14
    });
    let that = this;

    this.editor.on('change', function(delta) {
      if (delta.start.row !== delta.end.row) {
        that.renderchange(that);
      }
    });
  }

  renderchange(that) {
    let content = that.editor.getValue();
    //hack - transform content so bdl-components will be interpreted by aurelia plugin - it needs components without
    //bdl prefix
    //all <bdl- will be repaced to < and </bdl- to </
    const startprefix = /<bdl-/gi;
    const stopprefix = /<\/bdl-/gi;
    const transformedContent = content.replace(startprefix, '<').replace(stopprefix, '</');
    //create customevent - which component is listening to
    let event = new CustomEvent('contentupdate', {detail: {content: transformedContent}});
    //console.log('sending content update')
    document.getElementById('editorref').dispatchEvent(event);
    //that.ea.publish(new ContentUpdated(content));
  }

  addItem(item) {
    //shows atribute dialog
    this.askAttributes = true;
    this.askAttributesItem = item;
    this.dialogclass = item.dialog ? item.dialog : './attribute-dialog';
    console.log('additem dialogclass:', this.dialogclass);
    //TODO do xml parsing
    this.askAttributesItemsArray = this.convertXmlToAttributesItems(item.def);
    //[{title: 'min', value: 10}, {title: 'max', value: 100}, {title: 'default', value: 10}, {title: 'step', value: 1}];
    //from reference
    //focus on first input in attr dialog
    if (this.attrDialog) this.attrDialog.getElementsByTagName('input')[0].focus();
    //inserts default definition
    //this.editor.insert(item.def);
    //document.getElementById('editorref').focus();
    //this.editor.focus();
  }

  convertXmlToAttributesItems(itemdef) {
    let parser = new DOMParser();
    let xmlDoc = parser.parseFromString(itemdef, 'text/xml');
    let itemsarray = [];
    let firstelement = xmlDoc.documentElement;
    for (let child of firstelement.attributes) {
      itemsarray.push({title: child.nodeName, value: child.nodeValue});
    }
    return itemsarray;
  }

  submit() {
    //in askAttributesItemsArray is values = reconstruct XML def
    let d = document.implementation.createDocument('', '', null);
    let e = d.createElement(this.askAttributesItem.name);
    for (let attr of this.askAttributesItemsArray) e.setAttribute(attr.title, attr.value);
    d.appendChild(e);
    const serializer = new XMLSerializer();
    let xmlStr = serializer.serializeToString(d);
    //console.log('submit() serialized xml');
    if (xmlStr.endsWith('/>')) xmlStr = xmlStr.slice(0, -2) + '></' + this.askAttributesItem.name + '>';
    this.editor.insert(xmlStr + '\n');
    this.editor.focus();
    //inserts tag and attributes into globalstructure - for further use
    if (! this.globstr[this.askAttributesItem.name]) this.globstr[this.askAttributesItem] = [];
    this.globstr[this.askAttributesItem.name].push({tag: this.askAttributesItem.name, attr: this.askAttributesItemsArray});
    this.idindex++;
    //return xmlStr;
  }

  submitattr(elementname, attributes) {
    if (!elementname) { //args are not set - take them from variables submitattr1 adn submitattr2 (set by callback)
      elementname = this.submitattr1;
      attributes = this.submitattr2;
    }

    let d = document.implementation.createDocument('', '', null);
    let e = d.createElement(elementname);
    for (let attr of Object.keys(attributes)) e.setAttribute(attr, attributes[attr]);
    d.appendChild(e);
    const serializer = new XMLSerializer();
    let xmlStr = serializer.serializeToString(d);
    //console.log('submit() serialized xml');
    if (xmlStr.endsWith('/>')) xmlStr = xmlStr.slice(0, -2) + '></' + elementname + '>';
    this.editor.insert(xmlStr + '\n');
    this.editor.focus();
    //inserts tag and attributes into globalstructure - for further use
    if (! this.globstr[elementname]) this.globstr[elementname] = [];
    this.globstr[this.askAttributesItem.name].push({tag: elementname, attr: this.askAttributesItemsArray});
    this.idindex++;
    //return xmlStr;
  }

  /** shared utility to download currently edited file as MD file
   * prompts for filename, adds MD extension
   */
  download() {
    let filename = prompt('File name (*.md):', this.filename);
    if (filename) {
      if (!filename.endsWith('.md')) filename = filename.concat('.md');
      let content = this.editor.getValue();
      let blob = new Blob([content], {type: 'text/plain;charset=utf-8'});
      saveAs(blob, filename);
    }
  }

  /**
   * increment index of fmi entries
   */
  newFmiEntry() {
    if (! this.fmientries) this.fmientries = [];
    if (! this.fmientriessrc) this.fmientriessrc = [];
    this.currentfmientry = {src: 'FILL src of JS file', fminame: 'FILL fminame from modeldescription.xml', guid: '', valuereferences: '', valuelabels: '', inputs: ''};
    this.currentfmientryindex = this.fmientries.push(this.currentfmientry);
    console.log('editorapi newfmientry() fmientryindex', this.currentfmientryindex);
  }

  /**
   * reads modeldescription.xml from blob
   * @param blob
   */
  setFmiEntryDescription(blob) {
    const reader = new FileReader();
    //sets global variable to this instance
    //window.editor = this;
    reader.onload = this.handleModelDescription;
    //handler do not know 'this', must set global variable
    window.editorapi = this;
    reader.readAsText(blob);
  }

  handleModelDescription(event) {
    console.log('handlefileload event:', event);
    let data = event.target.result;
    let parser = new DOMParser();
    let xmlDoc = parser.parseFromString(data, 'text/xml');
    console.log('handleModelDescription xmldoc:', xmlDoc);
    //handler do not know 'this', must set global variable
    editorapi.currentfmientry.fminame = xmlDoc.documentElement.getElementsByTagName('CoSimulation')[0].getAttribute('modelIdentifier');
    editorapi.currentfmientry.guid = xmlDoc.documentElement.getAttribute('guid');
    editorapi.currentfmientry.modelvariables = [];
    for (let varnode of xmlDoc.documentElement.getElementsByTagName('ModelVariables')[0].children) {
      //console.log('parsing varnode:', varnode);
      editorapi.currentfmientry.modelvariables.push( {
        name: varnode.getAttribute('name'),
        reference: varnode.getAttribute('valueReference'),
        description: varnode.getAttribute('description'),
        tunable: (varnode.getAttribute('variability') === 'tunable'),
        start: (varnode.children.length > 0 ? varnode.children[0].getAttribute('start') : 0)
      });
    }
  }

  deleteFmiEntry(file) {
    let entry = this.fmientries.find(entryitem => file.name === entryitem.src);
    if (entry) {
      let entryindex = this.fmientries.indexOf(entry);
      this.fmientries.splice(entryindex, 1);
      let srcentry = this.fmientriessrc.find(entryitem => entryitem.src === file.name);
      if (srcentry) {
        let srcindex = this.fmientriessrc.indexOf(srcentry);
        this.fmientriessrc.splice(srcindex, 1);
      }
      this.bs.setFmiListEntries(this.fmientries);
      this.bs.setFmiListSrcs(this.fmientriessrc);
    }
  }

  /**
   * sets src of current fmientry and adds the src with index into fmientriessrc array
   * @param src
   */
  setFmiEntrySrc(src) {
    this.currentfmientry.src = src;
    //if (! this.fmientriessrc) this.fmientriessrc = [];
    this.fmientriessrc.push({index: this.currentfmientryindex, src: src});
    //store in localstorage
    this.bs.setFmiListEntries(this.fmientries);
    this.bs.setFmiListSrcs(this.fmientriessrc);
  }

  getFmiEntries() {
    let that = this;
    this.bs.getFMIListEntries()
      .then(value=> {
        that.fmientries = value;
        if (that.fmientries && that.fmientries.length > 0) {
          that.currentfmientry = that.fmientries[0];
          that.currentfmientryindex = 1;
        } else {
          that.currentfmientry = {};
          that.currentfmientryindex = 0;
        }
        this.bs.getFMIListSrcs()
          .then(value2=> that.fmientriessrc = value2);
      });
    //set to first entry in list
  }

  addAdobeEntry(filename) {
    this.adobeentries.push(filename);
  }

  //get script element and registers 'onload' callback to be called when the script is loaded
  insertScript(txt, id) {
    console.log('insertscript');
    //if it is already registered - then return
    if (document.getElementById(id)) return;
    //create script with attribute id="$id" to prevent duplicate scripts
    let script = document.createElement('script');
    script.setAttribute('id', id);
    let prior = document.getElementsByTagName('script')[0];
    script.async = 1;
    //no callback, ...
    let inlinescript = document.createTextNode(txt);
    script.appendChild(inlinescript);
    prior.parentNode.insertBefore(script, prior);
  }
}
