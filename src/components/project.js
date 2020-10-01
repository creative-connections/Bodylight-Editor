import * as localForage from 'localforage';
import {Editorapi} from './editorapi';
import {EventAggregator} from 'aurelia-event-aggregator';
import {inject} from 'aurelia-framework';

const FTYPE = {
  MDFILE: {name: 'MDFILE', value: 0, title: 'Web simulator (markdown)', faclass: 'fa fa-file-text'},
  MODELFILE: {name: 'MODELFILE', value: 1, title: 'Model FMU/JS(js)', faclass: 'fa fa-file-code-o'},
  ADOBEANIMATE: {name: 'ADOBEANIMATE', value: 2, title: 'Adobe Animate CreateJS(js)', faclass: 'fa fa-file-image-o'},
  OTHERJS: {name: 'OTHERJS', value: 5, title: 'Other Javascript(js) ', faclass: 'fa fa-file-o'},
  ANIMATEDGIF: {name: 'ANIMATEDGIF', value: 3, title: 'Animated GIF(gif)', faclass: 'fa fa-file-movie-o'},
  IMAGE: {name: 'IMAGE', value: 4, title: 'Common image(png,jpg)', faclass: 'fa fa-file-image-o'}
};
const LFKEYS = {
  FILELIST: 'BodylightEditor.Filelist',
  FILECONTENT: 'BodylightEditor.Content'
};
const DEMOFILES = [
  {name: 'index.md', type: FTYPE.MDFILE, active: false},
  {name: 'BurkhoffFMI.js', type: FTYPE.MODELFILE, active: false},
  {name: 'SrdceCelek.js', type: FTYPE.ADOBEANIMATE, active: false},
  {name: 'heart.gif', type: FTYPE.ANIMATEDGIF, active: false}
];

const DEMOCONTENT = '# Introduction \n' +
  'you may use markdown to tag **bold** or __italic__ \n' +
  '## Sections\n' +
  'sections can be added using one or multipla hash symbols `#`. \n' +
  '## Mathematics\n' +
  'katex is supported thus writing LATEX like syntax between `$` symbol will render the math.\n' +
  'E.g. Dirichlet integral  $\\int_{0}^\\infty\\frac{\\sin(x)}{x}dx = \\frac{\\pi}{2}$\n' +
  '## Bodylight components\n' +
  'Bodylight web components can be rendered directly, use full xml-tags with closing tags not self-closing.\n' +
  '<bdl-range min="10" max="20" step="2" default="15"></bdl-range>\n' +
  '## Animation\n' +
  'Adobe Animate can be exported into CreateJS components, these can be imported.\n' +
  '## Animated GIF\n' +
  'Animated GIF can be imported, component `bdl-animate-gif` can handle animation and controls animation per each frame.';

@inject(Editorapi, EventAggregator)
export class Project {
  showButtons = false;
  uploaddialog = false;
  currentfile=null;
  askFile=false;
  constructor(api, ea) {
    this.api = api;
    this.ea = ea;
  }

  /**
   * Callback when the component is attached,
   * get file list from the local storage
   */
  attached() {
    localForage.getItem(LFKEYS.FILELIST)
      .then(value=>{
        if (value) this.files = value;
        else {
          console.log('localforage value', value);
          this.files = DEMOFILES;
          this.updatelf();
        }
      })
      .catch(error=>{
        console.log('Project.attached() localforage error:', error);
        //set demo files
        this.files = DEMOFILES;
      });

    this.ea.subscribe('file-dialog', fileitems =>{
      //assign type in fileitems[0].value will be name of the FTYPE in string
      this.currentfile.type = FTYPE[fileitems[0].value];
    });
  }

  /**
   * Callback when the component is detached, closed e.g. by browser,
   * stores file list and content of the files internally
   */
  detached() {

  }

  /**
   * stores files in localforage
   */
  updatelf() {
    localForage.setItem(LFKEYS.FILELIST, this.files);
  }

  /**
   * Opens file content in editor
   * @param file
   */
  open(file) {
    //no action needed when opening same file
    if (this.currentfile === file) return;
    //save-content of previous file and open content of selected file
    if (this.currentfile) {
      this.currentfile.active = false;
      if (this.currentfile.type.value === FTYPE.MDFILE.value) {this.saveDocContent(this.currentfile.name, this.api.editor.getValue());}
    }
    this.currentfile = file;
    this.currentfile.active = true;
    if (this.currentfile.type.value === FTYPE.MDFILE.value) {
      //opening md file
      this.loadDocContent(this.currentfile.name)
        .then(content =>{
          //if (content)
          console.log('content of the file ' + this.currentfile.name, content);
          if (content) this.api.editor.setValue(content);
          else this.api.editor.setValue('');
        })
        .catch(err=>console.log('project open file error', err));
    } else {
      //opening js file or gif file
      this.api.askFile = true;
      this.api.askFileRef = this.currentfile;
      this.api.askFileItems = [{title: 'File Type', value: '', options: [FTYPE.MODELFILE, FTYPE.ADOBEANIMATE, FTYPE.OTHERJS]}];
      /*this.loadDocContent(this.currentfile.name)
        .then(result =>{
          let reader = new FileReader();
          window.api = this.api;
          reader.onload = function(evt) {
            let data = evt.target.result;
            window.api.editor.setValue(data);
          };
          reader.readAsText(result);
        })
        .catch(error =>{
          console.log(error);
        });*/
    }
  }

  /**
   * Delete file and it's content from project
   * @param file
   */
  delete(file) {
    this.deleteDoc(file.name)
      .then(result=>{
        let i = this.files.indexOf(file);
        this.files.splice(i, 1);
        this.updatelf();
      });
  }

  /**
   * Creates new empty document file
   */
  create() {
    let filename = prompt('Web simulator document file name (*.md):', 'index.md');
    if (filename) {
      if (!filename.endsWith('.md')) filename = filename.concat('.md');
      //solve name clash
      let nameclash = this.files.find(element => element.name === filename);
      while (nameclash) {
        filename = this.add1toname(filename);
        // eslint-disable-next-line no-loop-func
        nameclash = this.files.find(element => element.name === filename);
      }
      let newfile = {name: filename, type: FTYPE.MDFILE};
      this.files.push(newfile);
      this.updatelf();

      let content = DEMOCONTENT;
      if (this.currentfile) {
        this.currentfile.active = false;
        if (this.currentfile.type.value === FTYPE.MDFILE.value) {this.saveDocContent(this.currentfile.name, this.api.editor.getValue());}
      }
      this.currentfile = newfile;
      this.currentfile.active = true;
      this.api.editor.setValue(content);
      this.api.editor.focus();


      //let blob = new Blob([content], {type: 'text/plain;charset=utf-8'});
      //saveAs(blob, filename);
    }
  }

  add1toname(name) {
    let endswith08 = /[0-8]$/g;
    let endswith09 = /9$/g;
    let names = name.split('.', 2);
    if (endswith08.test(names[0])) {
      //increment last character
      let l = names[0].length;
      let n = parseInt(names[0][l - 1], 10) + 1;
      let newname = names[0].substr(0, l - 1) + n + '.' + names[1];
      return newname;
    }
    if (endswith09.test(names[0])) {
      //9 becomes 10
      let newname = names[0].substr(0, names[0].length - 1) + '10.' + names[1];
      return newname;
    }
    let newname = names[0] + '1.' + names[1];
    return newname;
  }

  saveDocContent(filename, content) {
    return localForage.setItem(LFKEYS.FILECONTENT + '.' + filename, content);
  }

  loadDocContent(filename) {
    return localForage.getItem(LFKEYS.FILECONTENT + '.' + filename);
  }

  saveBlobContent(filename, blob) {
    return localForage.setItem(LFKEYS.FILECONTENT + '.' + filename, blob);
  }

  deleteDoc(filename) {
    return localForage.removeItem(LFKEYS.FILECONTENT + '.' + filename);
  }

  toggleMenu() {
    this.showButtons = ! this.showButtons;
  }

  //opens upload dialog with button/area to dragndrop file
  upload() {
    this.uploaddialog = ! this.uploaddialog;
  }
  //handles after file is loaded
  handleFileLoad(event) {
    console.log('handlefileload event:', event);
    let data = event.target.result;
    //console.log('handlefile data:', data);
    //window.editor.editor.setValue(data);
    //window.editor.editor.focus();
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
    let filename = files[0].name;
    this.saveBlobContent(filename, files[0].slice(0, files[0].size, files[0].type))
      .then(result =>{
        let newfile = {name: filename, type: FTYPE.MODELFILE};
        this.files.push(newfile);
        this.updatelf();
        console.log('result saveing blob', result);
        this.uploaddialog = false;
      })
      .catch(error =>{
        console.log('error saving blob', error);
        this.uploaddialog = false;
      });
    //this.filename = files[0].name;
    //reader.readAsText(files[0]);
    //this.uploaddialog = false;
  }
}
