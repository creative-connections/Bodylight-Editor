//import * as localForage from 'localforage';
import {Editorapi} from './editorapi';
import {EventAggregator} from 'aurelia-event-aggregator';
import {inject} from 'aurelia-framework';
import JSZip from 'jszip';
import './project-files/bodylight-struct';
//import {BodylightFileFactory} from './project-files/bodylight-file-factory';
import {BodylightFile} from './project-files/bodylight-file';
import {FTYPE, DEMOCONTENT, createStrategyMap} from './project-files/bodylight-struct';

@inject(Editorapi, EventAggregator)
export class Project {
  showButtons = false;
  uploaddialog = false;
  currentfile=null;
  askFile=false;
  constructor(api, ea) {
    this.api = api;
    this.ea = ea;
    //this.bs = bs;
  }

  /**
   * Callback when the component is attached,
   * get file list from the local storage
   */
  attached() {
    this.api.bs.getFileList()
      .then(value=>{
        if (value) {
          //convert aray of struct to array of objects
          this.files = [];
          for (let fileitem of value) {
            this.files.push(new BodylightFile(fileitem.name, fileitem.type));
          }
        } else {
          this.files = DEMOFILES;
          this.updatelf();
        }
      })
      .catch(error=>{
        //set demo files
        console.log('error', error);
        this.files = DEMOFILES;
      });
    //if the file dialog change some properties of the file - update it
    this.ea.subscribe('file-dialog', fileitems =>{
      //assign type in fileitems[0].value will be name of the FTYPE in string
      this.currentfile.type = FTYPE[fileitems[0].value];
    });
    //this.api = api;
    this.strategymap = createStrategyMap(this.api);
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
    this.api.bs.setFileList(this.files);
  }

  /**
   * Opens file content in editor,
   * if it is binary file, it opens just property dialog
   * @param file
   */
  open(file) {
    //close file dialog
    this.api.askFile = false;
    //no action needed when opening same MD file
    if (this.currentfile === file && this.currentfile.type.value === FTYPE.MDFILE.value) return;
    //save-content of previous file and open content of selected file
    if (this.currentfile) this.currentfile.deactivate(this.strategymap);
    //switch to file
    this.currentfile = file;
    //activate it
    this.currentfile.activate(this.strategymap);
  }

  /**
   * Delete file and it's content from project
   * @param file
   */
  delete(file) {
    this.api.askFile = false;
    this.api.bs.deleteDoc(file.name)
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
    this.api.askFile = false;
    //get file name - unique
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
      //make some demo content
      let content = DEMOCONTENT;
      //create file object
      /*let blob = new Blob([content], {
        type: 'text/plain'
      });*/
      let newfile = new BodylightFile(filename, FTYPE.MDFILE);
      //BodylightFileFactory.createBodylightFile(filename, blob, this.api);//new BodylightFile(filename, this.api);//{name: filename, type: FTYPE.MDFILE};

      //push to file array - update localstorage
      this.files.push(newfile);
      this.updatelf();

      //if currentfile is some other file - then save content an deactivate
      if (this.currentfile) {
        this.currentfile.deactivate(this.strategymap);
      }
      //activate new file
      this.currentfile = newfile;
      this.currentfile.activate(this.strategymap, content);
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
    //window.editor = this;
    reader.onload = this.handleFileLoad;
    let files = event.target.files || event.dataTransfer.files;
    console.log(files);
    let filename = files[0].name;
    if (filename.endsWith('.zip')) {
      //extract zip and save blob of extracted files
      this.extractZipFile(files);
    } else {// save blob of any other file
      let newfile = new BodylightFile(filename, FTYPE.ADOBEANIMATE, this.api, files[0]);
      //BodylightFileFactory.createBodylightFile(filename, files[0], this.api, true, false);
      this.files.push(newfile);
      this.updatelf();
      this.uploaddialog = false;
    }
  }

  extractZipFile(files) {
    JSZip.loadAsync(files[0])
      .then(zip => {
        zip.forEach((relativePath, zipEntry) => {
          let entryname = zipEntry.name;
          zipEntry.async('blob').then(blob => {
            //let newfile= new BodylightFile()
            let newfile = new BodylightFile(entryname, (entryname.endsWith('.xml')) ? FTYPE.DESCRIPTIONFILE : FTYPE.MODELFILE, this.api, blob);
            //BodylightFileFactory.createBodylightFile(entryname, blob, this.api,false,false);
            this.files.push(newfile);
            this.updatelf();
            this.uploaddialog = false;
          });
        });
      });
  }

  extractProjectZipFile(files) {
    JSZip.loadAsync(files[0])
      .then(zip => {
        zip.forEach((relativePath, zipEntry) => {
          let entryname = zipEntry.name;
          if (entryname === 'bodylight-project.json') {
            zipEntry.async('text').then(value => {
              this.files = [];
              let myfiles = JSON.parse(value);
              for (let fileitem of myfiles) {
                this.files.push(new BodylightFile(fileitem.name, fileitem.type));
              }
            })
          } else
          {
            zipEntry.async('blob').then(blob => {
              //let newfile= new BodylightFile()
              //will store content in blob
              let newfile = new BodylightFile(entryname, (entryname.endsWith('.xml')) ? FTYPE.DESCRIPTIONFILE : FTYPE.MODELFILE, this.api, blob);
              //BodylightFileFactory.createBodylightFile(entryname, blob, this.api,false,false);
              //this.files.push(newfile);
              //this.updatelf();
            });
          }
        });
      });
  }

  /**
   * Creates new empty project
   */
  newProject() {
    this.showButtons = false;
    if (confirm('Create new empty project?')) {
      this.api.bs.clearStorage()
        .then(()=>{
          this.files = [];
          this.updatelf();
        });
    }
  }

  /**
   * Saves project as ZIP file
   */
  save() {
    this.showButtons = false;
    let zip = new JSZip();
    zip.file('bodylight-project.json', JSON.stringify(this.files));
    for (let file of this.files) {
      //'blob' or 'string' content are zipped as entries
      zip.file(file.name, this.api.bs.loadDocContent(file.name));
    }
    zip.generateAsync({type: 'blob'})
      .then(function(blob) {
        saveAs(blob, 'project.zip');
      });
  }

  /**
   * Uploads ZIP as project file
   */
  load(event) {
    this.showButtons = false;
    const reader = new FileReader();
    //sets global variable to this instance
    //window.editor = this;
    reader.onload = this.handleFileLoad;
    let files = event.target.files || event.dataTransfer.files;
    console.log(files);
    let filename = files[0].name;
    if (filename.endsWith('.zip')) {
      //extract zip and save blob of extracted files
      this.extractProjectZipFile(files);
    }
  }
}
