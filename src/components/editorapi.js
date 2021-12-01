import {saveAs} from 'file-saver';
import jQuery from 'jquery';
import 'ace-builds';
import 'ace-builds/webpack-resolver';
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/snippets/text.js';
import '../acemode/mode-markdown';
import {BodylightStorage} from './project-files/bodylight-storage';
import {FTYPE} from './project-files/bodylight-struct';

export class Editorapi {
  askAttributes=false;
  previewmode=false;
  attrDialog=null;
  dialogclass='./attribute-dialog';
  idindex=1;
  globstr ={}
  bs = new BodylightStorage();
  fmientries = [];
  fmientriessrc = [];
  adobeentries = [];
  projectfiles= [];
  blinking = false;
  autopreview = true;
  filename='project.zip';
  exportfilename='projectexport.zip';
  outputreferences=[];
  currentfmientry = {};

  initAceEditor() {
    window.$ = window.jQuery = jQuery;
    window.editorapi = this;
    const fontsize = 12;
    const maxLines = Math.floor((window.innerHeight - 100) / (fontsize+2));
    ace.require('ace/ext/language_tools');
    this.editor = ace.edit('editorref', {
      mode: 'ace/mode/markdown2',
      theme: 'ace/theme/chrome',
      enableBasicAutocompletion: false, //autocompletion
      enableSnippets: true, //snippets defined in mode
      enableLiveAutocompletion: false, //live autocompletion = when writing
      enableBehaviours: true, //automatically close tags, ", parentheses
      wrap: true,
      maxLines: maxLines,
      minLines: 25,
      fontSize: fontsize
    });

    let that = this;
    this.editor.on('change', function(delta) {
      //render only when new line or deleted line appears
      if (that.autopreview && (delta.start.row !== delta.end.row)) {
        that.renderchange(that);
      }
    });
  }

  async renderchange(that, content) {
    if (!content) content = that.editor.getValue();
    //hack - transform content so bdl-components will be interpreted by aurelia plugin - it needs components without
    //bdl prefix
    //all <bdl- will be replaced to < and </bdl- to </ because preview mode uses aurelia-plugin (components without prefix)
    const startprefix = /<bdl-/gi;
    const stopprefix = /<\/bdl-/gi;
    let transformedContent = content.replace(startprefix, '<').replace(stopprefix, '</');

    //another hack - replace img src to local blob url - if exists
    let filelist = that.projectfiles;//await that.bs.getFileList();
    //generate array of with img_name,bloburl
    //let imglist = [];
    console.log('renderchange() filelist:', filelist);
    for (let fileitem of filelist) {
      if (fileitem.name.endsWith('jpg') || fileitem.name.endsWith('png') || fileitem.name.endsWith('gif') || fileitem.name.endsWith('svg')) {
        //let imgbloburl = await that.bs.loadDocUrl(fileitem.name);
        //let imgname = fileitem.name;
        //console.log('replacing ', fileitem.name, ' by ', fileitem.bloburl);
        //repleace all markdown images - not only first - regex with 'g'
        /*let regex = new RegExp('\\]\\(' + fileitem.name + '\\)', 'g');
        if (fileitem.bloburl !== '') {
          transformedContent = transformedContent.replace(regex, '](' + fileitem.bloburl + ')');
        }*/
        //repleace all image names that begins with quote e.g. in "1.jpg" or with pipe e.g. in list "1.jpg|2.jpg" - not only first - regex with 'g'
        let regex = new RegExp('([|"\'\\(])' + fileitem.name, 'g');
        if (fileitem.bloburl !== '') {
          //keep captured char in group 1 ($1) and replace name with bloburl
          transformedContent = transformedContent.replace(regex, '$1' + fileitem.bloburl );
        }
      }
    }
    console.log('renderchange() transformedcontent:', transformedContent);
    //now replace every (img_name) with (bloburl)
    //create customevent - which component is listening to
    this.sendContentUpdate(transformedContent);
  }

  sendContentUpdate(content) {
    //create customevent - which component is listening to
    let event = new CustomEvent('contentupdate', {detail: {content: content}});
    //console.log('sending content update')
    document.getElementById('editorref').dispatchEvent(event);
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

    //change the tabs in project div to components
    let event = new CustomEvent('changetab', {detail: {id: 'components'}});
    document.dispatchEvent(event);
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
    if (! this.globstr[this.askAttributesItem.name]) this.globstr[this.askAttributesItem.name] = [];
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
  readFmiEntryDescription(blob) {
    window.editorapi = this;
    if (blob) {
      if (typeof blob === 'string') this.handleModelDescriptionText(blob);
      else {
        const reader = new FileReader();
        //sets global variable to this instance
        //window.editor = this;
        reader.onload = this.handleModelDescription;
        //handler do not know 'this', must set global variable
        reader.readAsText(blob);
      }
    } else console.warn('empty blob for fmi modeldescription.xml')
  }

  handleModelDescription(event) {
    console.log('handlefileload event:', event);
    let data = event.target.result;
    editorapi.handleModelDescriptionText(data);
  }

  handleModelDescriptionText(data) {
    let parser = new DOMParser();
    let xmlDoc = parser.parseFromString(data, 'text/xml');
    console.log('handleModelDescription xmldoc:', xmlDoc);
    //handler do not know 'this', must set global variable
    editorapi.currentfmientry.fminame = xmlDoc.documentElement.getElementsByTagName('CoSimulation')[0].getAttribute('modelIdentifier');
    editorapi.currentfmientry.guid = xmlDoc.documentElement.getAttribute('guid');
    editorapi.currentfmientry.modelvariables = [];
    for (let varnode of xmlDoc.documentElement.getElementsByTagName('ModelVariables')[0].children) {
      //console.log('parsing varnode:', varnode);
      editorapi.currentfmientry.modelvariables.push({
        name: varnode.getAttribute('name'),
        reference: varnode.getAttribute('valueReference'),
        description: varnode.getAttribute('description'),
        tunable: (varnode.getAttribute('variability') === 'tunable'),
        fixed: (varnode.getAttribute('variability') === 'fixed'),
        parameter: (varnode.getAttribute('causality') === 'parameter'),
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
      //this.bs.setFmiListEntries(this.fmientries);
      //this.bs.setFmiListSrcs(this.fmientriessrc);
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
    //this.bs.setFmiListEntries(this.fmientries);
    //this.bs.setFmiListSrcs(this.fmientriessrc);
  }

  setProjectFiles(pf){
    this.projectfiles = pf;
  }

  getFmiEntries() {
    this.fmientries = this.projectfiles.filter(file => file.type.value === FTYPE.MODELFILE.value);
    //this.currentfmientry = {src: this.fmientries[0].name};
    //this.currentfmientry{src: 'FILL src of JS file', fminame: 'FILL fminame from modeldescription.xml', guid: '', valuereferences: '', valuelabels: '', inputs: ''};
    //fixing fmientries - removing obsolete storage - fmientries from project file list
    /*let that = this;
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
      });*/
    //set to first entry in list
  }

  async updateCurrentFmiEntry(src) {
    //updates structs based on selected src
    console.log('updateCurrentFmiEntry src:', src);
    //parse modeldescription
    this.currentfmientry.name = src;
    await this.updateFMIVariableList();
    /*if (this.fmientries.length === 0) this.getFmiEntries(); //gets fmi entries from project list
    this.currentfmientry = this.fmientries.find(entryitem => src === entryitem.name);
    this.currentfmientryindex = this.fmientries.indexOf(this.currentfmientry);
    console.log('found currentfmientry:', this.currentfmientry);
    console.log('   from fmientries', this.fmientries);
     */
  }

  updateFMIVariableList() {
    //console.log('updatefmivariablelist debug this',this);
    if (this.currentfmientry && this.currentfmientry.name) {
      let modelname = this.currentfmientry.name.slice(0, -3); //remove '.js' extension
      //fix #14 read the variables
      this.bs.getBlob(modelname + '.xml')
        .then(blob => {
          this.readFmiEntryDescription(blob);
        });
    }
    //TODO fix duplicates - either read from modelDescription each time, or store modeldescription par JS with FMU
  }

  initProjectName() {
    this.bs.getProjectName()
      .then(value =>{if (value) this.filename = value;});
    this.bs.getExportProjectName()
      .then(value =>{if (value) this.exportfilename = value;});
  }

  setProjectName(name) {
    this.bs.setProjectName(name);
    this.filename = name;
  }

  setExportProjectName(name) {
    this.bs.setExportProjectName(name);
    this.exportfilename = name;
  }

  addAdobeEntry(filename) {
    this.adobeentries.push(filename);
  }

  //get script element and registers 'onload' callback to be called when the script is loaded
  insertScript(txt, id) {
    console.log('insertscript() id:', id);
    //if it is already registered - then return
    if (document.getElementById(id)) return;
    //create script with attribute id="$id" to prevent duplicate scripts
    let script = document.createElement('script');
    script.setAttribute('id', id);
    let prior = document.getElementsByTagName('script')[0];
    script.async = 1;
    //no callback, ...
    //let inlinescript = document.createTextNode(txt);
    script.innerHTML = txt;
    //script.appendChild(inlinescript);
    prior.parentNode.appendChild(script);//, prior);
    return script;
  }

  /**
   * Removes script with id beginning with idprefix
   * @param idprefix
   */
  removeScriptById(idprefix) {
    let script = document.getElementById(idprefix);
    if (script) script.remove();
  }

  /**
   * Inserts script filename and sets its id, can be called by external api
   * @param filename
   * @param id
   */
  insertScriptById(filename, id = 'adobeobj') {
    let file = {name: filename};
    this.removeScriptById(id);
    return this.insertScriptFile(file, null, id);
  }

  /**
   * Calls api insertscript to insert the project file or blob content into DOM
   * @param bodylightfile - expects name property to contain filename - for identification purposes
   * @param blob - if defined, gets content from this blob as text and inserts it into DOM
   * @param id - if defined, script with id will be added - otherwise the id is filename from bodylightfile
   */
  insertScriptFile(bodylightfile, blob, id) {
    //read content of the file and insert content into the DOM
    console.log('insertScriptFile() inserting script file into DOM', bodylightfile);
    if (blob) {
      //blob is defined, read the content of the blob
      return blob.text()
        .then(txtvalue => {
          return this.insertScript(txtvalue, id ? id : bodylightfile.name);
        });
    }
    //blob is not defined, but might be in local storage, load it from there
    return this.bs.loadDocContent(bodylightfile.name)
      .then(blob2 => blob2.text())
      .then(txtvalue => {
        return this.insertScript(txtvalue, id ? id : bodylightfile.name);
      });
  }

  /**
   * Discovers animable objects in Adobe Animation
   * Should be called when a dialog needs animobjs for select form etc.
   */
  discoverAdobeAnimate() {
    if (window.ani && window.ani.exportRoot) {
      this.animobjs = this.discoverChildren(window.ani.exportRoot, '', '_anim');
      //console.log('discoverAdobeAnimate() animobjs:', this.animobjs);
      this.textobjs = this.discoverChildren(window.ani.exportRoot, '', '_text');
      this.playobjs = this.discoverChildren(window.ani.exportRoot, '', '_play');
    } else {
      console.log('error, Animate object is not yet accessible. Try to refresh after while');
    }
  }

  // returns array of strings in form @preffix.name in case name contains @suffix
  // root is root element array like, it's property name is checked for prefix
  //in form prefix - root name e.g. ['ventricles.ventriclesTotal.VentricleLeft_anim','ventricles.ventriclesTotal.VentricleRight_anim']
  discoverChildren(root, prefix, suffix) {
    let discovered = [];
    //console.log('discovering', prefix);
    if (root.children) {
    //depth first
      for (let child of root.children) {
        //object including suffix is what we need to discover
        if (child.name && child.name.includes(suffix)) {
          discovered.push(prefix + child.name);
        }
        //index needed when 'name' is undefined - so access via index in array
        let index = 0;
        if (!child.name) index = root.children.indexOf(child); //name is not defined then discover index
        if (child.children) {
          discovered = discovered.concat(
            //recursive calling to discover names in all children
            this.discoverChildren(
              child,
              child.name ? prefix + child.name + '.' : prefix + 'children.' + index + '.',
              //add name into the discovered childre, e.g. full.myname
              //otherwise add children.$index - e.g. full.children.1
              suffix
            )
          );
        }
      }
    }
    return discovered;
  }

  stopblink() {
    if (this.blinking) {
      this.blinking = false;
      //disable ticker
      //console.log('last alpha for object', objname);
      window.createjs.Ticker.removeEventListener('tick', window.ani.stage);
    }
  }

  startblink() {
    if (!this.blinking) {
      this.blinking = true;
      //stopall animation
      window.ani.stage.stop();
      //enable ticker
      window.createjs.Ticker.addEventListener('tick', window.ani.stage);
    }
  }

  //blinks object in adobe animate 3 times, every blink will take 3 seconds
  blink(objname) {
    //this.blinking = true;
    this.startblink();
    console.log('blink "' + objname + '"');
    let that2 = this;
    //do blink now
    setTimeout( function() {that2.blinkthread(objname);}, 0);
    setTimeout( function() {that2.blinkthread(objname);}, 2000);
    setTimeout( function() {that2.blinkthread(objname);}, 4000);
    //schedule blinkin in 4 seconds
    //setTimeout( function() {that2.scheduleblink(objname);}, 5000);
  }

  scheduleblink(objname) {
    //test if blinking should be performed
    if (this.blinking) {
      let that3 = this;
      setTimeout(function() {
        that3.blinkthread(objname);
      }, 0);
    }
  }

  blinkthread(objname) {
    let k = 0;
    for (let j = 0; j < 2; j++) {
      for (let i = -1; i <= 1; i += 0.1) {
        let that = this;
        k++;
        setTimeout(function() {
          that.setAnimationValue(objname, Math.abs(i), (i === -1 && j === 0), (i > 0.99 && j === 1), j === 0);
        }, 50 * k);
      }
    }
  }

  //
  /**
   * set the animation value of the object objname
   * @param objname to blink effect
   * @param value, value between 0 and 1 to be set for 'alpha' property of the object
   * @param first, boolean value whether this is first in blinking sequence, enables animation
   * @param last, boolean value whether this is last in blinking sequence, disables animation
   * @param doalpha, boolean value if animate as alpha or animate as values
   */
  setAnimationValue(objname, value, first, last, doalpha) {
    //console.log('adobe-animate() setting window.ani.exportRoot.children[0][' + objname + '].alpha(' + value + ')');
    if (window.ani.exportRoot) {
      //resolve path from string
      const resolvePath = (object, path, defaultValue) => path
        .split('.')
        .reduce((o, p) => o ? o[p] : defaultValue, object);
      let myobj = resolvePath(window.ani.exportRoot, objname, undefined);
      //some animation are in unnamed children root, backward compatibility with already done anim
      if (!myobj) myobj = resolvePath(window.ani.exportRoot.children[0], objname, undefined);
      //myobj is resolved in structure
      if (myobj) {
        if (doalpha) {//animate via setting alpha
          if (last) myobj.alpha = 1;
          else myobj.alpha = value;
        } else { //do animation
          //if (last) myobj.gotoAndStop(Math.floor(100));
          //for values between 0..1 do 100x
          if (myobj.hasOwnProperty('gotoAndStop')) { //fix issue - not animatable
            if (value < 1) myobj.gotoAndStop(Math.floor(100 * value));
            else myobj.gotoAndStop(value);
          }
        }
      }
    }
  }
}
