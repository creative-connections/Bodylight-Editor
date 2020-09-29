import * as localForage from 'localforage';
import {Editorapi} from './editorapi';
import {inject} from 'aurelia-framework';

const FTYPE = {
  MDFILE: {value: 0, title: 'Web simulator document file in Markdown syntax using Bodylight components', faclass: 'fa fa-file-text'},
  MODELFILE: {value: 1, title: 'Model exported from Modelica to FMU and JS', faclass: 'fa fa-file-code-o'},
  ADOBEANIMATE: {value: 2, title: 'Interactive animation from Adobe Animate exported with CreateJS API', faclass: 'fa fa-file-image-o'},
  ANIMATEDGIF: {value: 3, title: 'Animated GIF', faclass: 'fa fa-file-movie-o'},
  IMAGE: {value: 4, title: 'Common image', faclass: 'fa fa-file-image-o'}
};
const LFKEYS = {
  FILELIST: 'BodylightEditor.Filelist',
  FILECONTENT: 'BodylightEditor.Content'
};
const DEMOFILES = [
  {name: 'index.md', type: FTYPE.MDFILE},
  {name: 'BurkhoffFMI.js', type: FTYPE.MODELFILE},
  {name: 'SrdceCelek.js', type: FTYPE.ADOBEANIMATE},
  {name: 'heart.gif', type: FTYPE.ANIMATEDGIF}
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

@inject(Editorapi)
export class Project {
  showButtons = false;
  currentfile=null;
  constructor(api) {
    this.api = api;
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
    //save-content of previous file and open content of selected file
    if (this.currentfile) {
      if (this.currentfile.type.value === FTYPE.MDFILE.value) {this.saveDocContent(this.currentfile.name, this.api.editor.getValue());}
    }
    this.currentfile = file;
    if (this.currentfile.type.value === FTYPE.MDFILE.value) {
      this.loadDocContent(this.currentfile.name)
        .then(content =>{
          //if (content)
          console.log('content of the file ' + this.currentfile.name, content);
          if (content) this.api.editor.setValue(content);
          else this.api.editor.setValue('');
        })
        .catch(err=>console.log('project open file error', err));
    }
  }

  /**
   * Delete file and it's content from project
   * @param file
   */
  delete(file) {
    let i = this.files.indexOf(file);
    this.files.splice(i, 1);
    this.updatelf();
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
        nameclash = this.files.find(element => element.name === filename);
      }

      this.files.push({name: filename, type: FTYPE.MDFILE});
      this.updatelf();
      let content = DEMOCONTENT;
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
    localForage.setItem(LFKEYS.FILECONTENT + '.' + filename, blob);
  }

  toggleMenu() {
    this.showButtons = ! this.showButtons;
  }
}