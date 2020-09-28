import jQuery from 'jquery';
import 'ace-builds';
import 'ace-builds/webpack-resolver';
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/snippets/text.js';
import '../acemode/mode-markdown';

//import {ContentUpdated} from './messages';

export class Editorapi {
  askAttributes=false;
  attrDialog=null;
  dialogclass='./attribute-dialog';
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
    //return xmlStr;
  }

  submitattr(elementname, attributes) {
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
  }
}
