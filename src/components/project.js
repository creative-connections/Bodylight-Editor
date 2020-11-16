//import * as localForage from 'localforage';
import {Editorapi} from './editorapi';
import {EventAggregator} from 'aurelia-event-aggregator';
import {inject} from 'aurelia-framework';
import JSZip from 'jszip';
import './project-files/bodylight-struct';
import {BodylightFileFactory} from './project-files/bodylight-file-factory';
import {BodylightFile} from './project-files/bodylight-file';
import {FTYPE, DEMOCONTENT} from './project-files/bodylight-struct';
import {LFKEYS} from './project-files/bodylight-storage';

@inject(Editorapi, EventAggregator)
export class Project {
  showButtons = false;
  uploaddialog = false;
  currentfile=null;
  askFile=false;
  firstmdfile=false;
  constructor(api, ea) {
    this.api = api;
    this.ea = ea;
    this.handleContentUpdate = e => {
      //content update is called by editor - catch this event and save changes
      this.saveChanges();
    };
    //this.bs = bs;
  }

  /**
   * Callback when the component is attached,
   * get file list from the local storage
   */
  attached() {
    //get filelist from storage
    this.api.bs.getFileList()
      .then(value=>{
        //adds every file from storage to the visible list
        console.log('Project attached() filelist:', value);
        if (value) {
          //convert array of struct to array of objects
          this.files = [];
          for (let fileitem of value) {
            let bodylightfile = new BodylightFile(fileitem.name, fileitem.type, this.api);
            this.files.push(bodylightfile);
            //first MD file - read content and put it into editor
            console.log('adding file from local storage', fileitem);
            if (!this.firstmdfile && fileitem.type.value === FTYPE.MDFILE.value) {
              console.log('opening first md file', fileitem);
              this.firstmdfile = true;
              this.open(bodylightfile);
            } else if ( fileitem.type.value === FTYPE.MODELFILE.value || fileitem.type.value === FTYPE.ADOBEANIMATE.value )  {
              console.log('opening model/adobe JS file');
              //this.api.insertScriptFile(bodylightfile); //MOVED to plugin fallback
            }
            this.updateadobeentries();
          }
        } else {
          this.files = [];//DEMOFILES;
          this.updatelf();
        }
      })
      .catch(error=>{
        //set demo files
        console.log('error', error);
        this.files = [];//DEMOFILES;
      });
    //if the file dialog change some properties of the file - update it
    this.ea.subscribe('file-dialog', fileitems =>{
      //assign type in fileitems[0].value will be name of the FTYPE in string
      this.currentfile.type = FTYPE[fileitems[0].value];
    });
    document.getElementById('editorref').addEventListener('contentupdate', this.handleContentUpdate);
    //this.api = api;
    //this.strategymap = createStrategyMap(this.api);
    this.api.getFmiEntries();
  }


  /**
   * Callback when the component is detached, closed e.g. by browser,
   * stores file list and content of the files internally
   */
  detached() {
    const editorel = document.getElementById('editorref');
    if (editorel) editorel.removeEventListener('contentupdate', this.handleContentUpdate);
    //this.ea.unsubscribe
  }

  /**
   * stores files in localforage
   */
  updatelf() {
    this.api.bs.setFileList(this.files);
    //update list of adobe files
    this.updateadobeentries();
  }

  updateadobeentries() {
    //console.log('project update adobe entries:',this.files);
    this.api.adobeentries = this.files.filter(x => x.type.value === FTYPE.ADOBEANIMATE.value);
    console.log('project update adobe entries:', this.api.adobeentries);
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
    this.currentfile.activate();//this.strategymap);
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
        //delete if in fmi entries
        this.api.deleteFmiEntry(file);
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
      let newfile = new BodylightFile(filename, FTYPE.MDFILE, this.api);
      //BodylightFileFactory.createBodylightFile(filename, blob, this.api);//new BodylightFile(filename, this.api);//{name: filename, type: FTYPE.MDFILE};

      //push to file array - update localstorage
      this.files.push(newfile);
      this.updatelf();

      //if currentfile is some other file - then save content an deactivate
      if (this.currentfile) {
        if (!this.currentfile.api) this.currentfile.api = this.api;
        this.currentfile.deactivate();//this.strategymap);
      }
      //activate new file
      this.currentfile = newfile;
      if (!this.currentfile.api) this.currentfile.api = this.api;
      this.currentfile.activate(content);
    }
  }

  saveChanges() {
    if (this.currentfile) this.currentfile.deactivate();//this.strategymap);
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
    //console.log(files);
    let filename = files[0].name;
    if (filename.endsWith('.zip')) {
      //extract zip and save blob of extracted files
      this.extractZipFile(files);
    } else {// add other file type into project - save blob into localstorage, etc.
      let newfile = BodylightFileFactory.createBodylightFile(filename, files[0], this.api, true, false);
      this.files.push(newfile);
      this.updatelf();
      this.uploaddialog = false;
    }
  }

  /**
   * extracts ZIP file produced by FMU compiler - contains JS with webassembly and fmu, and modeldescription.xml
   * @param files array of files - files[0] should contain the zip file
   */
  extractZipFile(files) {
    JSZip.loadAsync(files[0])
      .then(zip => {
        this.api.newFmiEntry();
        zip.forEach((relativePath, zipEntry) => {
          let entryname = zipEntry.name;
          zipEntry.async('blob').then(blob => {
            //let newfile= new BodylightFile()
            let newfile = new BodylightFile(entryname, (entryname.endsWith('.xml')) ? FTYPE.DESCRIPTIONFILE : FTYPE.MODELFILE, this.api, blob);
            if (entryname.endsWith('.xml')) {
              //parse modeldescription.file
              this.api.setFmiEntryDescription(blob);
            } else {
              //fill src of model
              this.api.setFmiEntrySrc(entryname);
              //inserts script into DOM - for previewing
              //this.api.insertScriptFile(newfile, blob); //MOVED to plugin fallback
            }
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
              let myproject = JSON.parse(value);
              //project files needs to be instantiated
              for (let fileitem of myproject.files) {
                this.files.push(new BodylightFile(fileitem.name, fileitem.type, this.api));
              }
              //fmientries stored in project file
              this.api.fmientries = myproject.fmientries;
              this.api.fmientriessrc = myproject.fmientriessrc;
            });
          } else {
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
    let filename = prompt('Enter file name of web simulator project(*.zip):', 'project.zip');
    if (!filename) return;
    if (!filename.endsWith('.zip')) filename = filename.concat('.zip');
    this.showButtons = false;
    let zip = new JSZip();
    const filesclone = this.files.map(({api, ...keepAttrs}) => keepAttrs);
    zip.file('bodylight-project.json', JSON.stringify({files: filesclone, fmientries: this.api.fmientries, fmientriessrc: this.api.fmientriessrc}));
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

  /**
   * exports as HTML and related files, which can be published in web server or served locally
   */
  exportAsHtml() {
    let projectname = prompt('Enter file name for web simulator export to HTML(packed in *.zip):', 'projectexport.zip');
    if (!projectname) return;
    let filename = projectname;
    if (!projectname.endsWith('.zip')) filename = projectname.concat('.zip');
    this.showButtons = false;
    let firstmdfile = this.files.filter(item => item.type.value === FTYPE.MDFILE.value)[0];
    let indexhtmlcontent = `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>${projectname}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <script src="bodylight.bundle.js" data-main="aurelia-bootstrapper"></script>
</head>
<body aurelia-app="webcomponents">
    <bdl-markdown-book2 index="${firstmdfile.name}" summary="summary.md">
<img src="Bodylight_loading2_amber.gif" height="140" width="85" style="display:block;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);"/>
    </bdl-markdown-book2>
</body>
</html>
`;
    //let indexhtml = new BodylightFile('index.html', FTYPE.MDFILE, this.api, indexhtmlblob);
    //htmlfiles.push(indexhtml);
    //TODO push most updated bundle - best local - rather then from CDN in case of offline use
    let bundleurl = 'bodylight.bundle.js';
    fetch(bundleurl)
      .then(res => res.blob())
      .then(bodylightblob => {
        //let bodylightjs = new BodylightFile('bodylight.bundle.js', FTYPE.OTHERJS, this.api, bodylightblob);
        //htmlfiles.push(bodylightjs);

        //now save as zip
        let zip = new JSZip();
        //zip.file('bodylight-project.json', JSON.stringify(this.files));
        //adds index.html with content
        zip.file('index.html', indexhtmlcontent);
        //adds bodylight.bundle.js
        zip.file('bodylight.bundle.js', bodylightblob);
        //adds all project files
        for (let file of this.files) {
          //'blob' or 'string' content are zipped as entries
          zip.file(file.name, this.api.bs.loadDocContent(file.name));
        }
        //create default summary if it is not part of the project already
        if (!this.files.find(file => file.name === 'summary.md')) {
          let summarymdcontent = '';
          //loop over mdfiles only, each mdfile will be an entry
          for (let file of this.files.filter(item => item.type.value === FTYPE.MDFILE.value)) {
            summarymdcontent += '  * [' + file.name + '](#' + file.name + ')\n';
          }
          //create blob from generated content
          let sblob = new Blob([summarymdcontent], {type: 'text/plain;charset=utf-8'});
          //store file and blob in local storage
          let sbodylightfile = new BodylightFile('summary.md', FTYPE.MDFILE, this.api, sblob);
          //and add it into project 'files' structure
          this.files.push(sbodylightfile);
          //zip the summary file
          zip.file('summary.md', summarymdcontent);
          this.updatelf();
        }
        //add loading animated gif
        let loadinggifurl = 'Bodylight_loading2_amber.gif';
        fetch(loadinggifurl)
          .then(res => res.blob())
          .then(loadingblob =>{
            zip.file(loadinggifurl, loadingblob);
            //and generates ZIP and save it
          })
          .catch(error =>{
            console.error('Project exportAsHtml() error:',error);
            //and generates ZIP and save it
          })
          .finally(()=>{
            zip.generateAsync({type: 'blob'})
              .then(function(blob) {
                saveAs(blob, filename);
              });
          });
      });
  }
  rename(file) {
    let oldfilename = file.name;
    let filename = prompt('Rename file name:', file.name);
    //empty filename - no change
    if (!filename) return;
    //add md extension if ommited for mdfile
    if (file.type.value === FTYPE.MDFILE.value) {
      if (!filename.endsWith('.md')) filename = filename.concat('.md');
    }
    //store in local structure
    file.name = filename;
    //update storage
    this.updatelf();
    //rename in storage
    this.api.bs.renameDoc(oldfilename, filename);
  }
}
