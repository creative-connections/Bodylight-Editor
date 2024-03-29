//import * as localForage from 'localforage';
import {Editorapi} from './editorapi';
import {EventAggregator} from 'aurelia-event-aggregator';
import {inject} from 'aurelia-framework';
import JSZip from 'jszip';
import './project-files/bodylight-struct';
import {BodylightFileFactory} from './project-files/bodylight-file-factory';
import {BodylightFile} from './project-files/bodylight-file';
import {FTYPE, DEMOCONTENT, utf8Encode} from './project-files/bodylight-struct';
import {GithubSync, STATUS} from './githubsync/GithubSync';
//import {LFKEYS} from './project-files/bodylight-storage';

const swapElements = (array, index1, index2) => {
  myArray[index1] = myArray.splice(index2, 1, myArray[index1])[0];
};

@inject(Editorapi, EventAggregator, GithubSync)
export class Project {
  showButtons = false;
  showgithub = false;
  uploaddialog = false;
  currentfile=null;
  askFile=false;
  firstmdfile=false;
  showdoc=true;
  showmodel=true;
  showadobe=true;
  showimg=true;
  showother=true;
  //githuborg = 'creative-connections';
  //githubrepo = 'Bodylight-Scenarios';
  showpreviewimage = false;
  moving=false;

  constructor(api, ea, gs) {
    this.api = api;
    this.ea = ea;
    this.handleContentUpdate = e => {
      //content update is called by editor - catch this event and save changes
      this.saveChanges();
    };
    this.github = {org:'creative-connections', repo:'Bodylight-Scenarios'};
    this.gs = gs;
    //this.bs = bs;
  }

  /**
   * Callback when the component is attached,
   * get file list from the local storage
   */
  attached() {
    this.STATUS = STATUS;
    //get filelist from storage
    this.api.bs.getFileList()
      .then(value=>{
        //adds every file from storage to the visible list
        console.log('Project attached() filelist:', value);
        if (value) {
          //convert array of struct to array of objects
          this.files = [];

          this.api.setProjectFiles(this.files);
          for (let fileitem of value) {
            let bodylightfile;
            if (!fileitem.name) {
             console.log('project fileitem bug in item:',fileitem);
             bodylightfile = new BodylightFile('bad.name', 0);
            }
            else  
             bodylightfile = new BodylightFile(fileitem.name, fileitem.type);

            this.files.push(bodylightfile);
            //first MD file - read content and put it into editor
            console.log('adding file from local storage', fileitem);
            if (!this.firstmdfile && fileitem.type.value === FTYPE.MDFILE.value) {
              console.log('opening first md file', fileitem);
              this.firstmdfile = true;
              this.open(bodylightfile);
            }
          }
          this.updateadobeentries();
          this.api.getFmiEntries();
          this.updatelf();
        } else {
          this.files = [];//DEMOFILES;
          this.api.setProjectFiles(this.files);
          this.api.getFmiEntries();
          this.updatelf();
        }
      })
      .catch(error=>{
        //set demo files
        console.log('error', error);
        this.files = [];//DEMOFILES;
        this.api.setProjectFiles(this.files);
        this.api.getFmiEntries();
      });
    //if the file dialog change some properties of the file - update it
    this.ea.subscribe('file-dialog', fileitems =>{
      //assign type in fileitems[0].value will be name of the FTYPE in string
      this.currentfile.type = FTYPE[fileitems[0].value];
    });
    //load bj2 project file 
    this.ea.subscribe('file-load-project', fileitem => {
      this.extractProjectZipFile(fileitem);
    })
    document.getElementById('editorref').addEventListener('contentupdate', this.handleContentUpdate);
    //this.api = api;
    //this.strategymap = createStrategyMap(this.api);
    this.api.initProjectName();
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
    this.updatefiletypes();
    //update list of adobe files
    this.updateadobeentries();
  }

  updatefiletypes() {
    this.mdfiles = this.files.filter(x => x.type.value === FTYPE.MDFILE.value);
    this.modelfiles = this.files.filter(x => x.type.value === FTYPE.MODELFILE.value || x.type.value === FTYPE.DESCRIPTIONFILE.value);
    this.adobefiles = this.files.filter(x => x.type.value === FTYPE.ADOBEANIMATE.value);
    this.imgfiles = this.files.filter(x => x.type.value === FTYPE.IMAGE.value || x.type.value === FTYPE.ANIMATEDGIF.value);
    this.otherfiles = this.files.filter(x => x.type.value === FTYPE.OTHERJS.value);
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


  addlink(file) {
    this.api.askFile = false;
    file.renderlink();
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

  swapfiles(index,index2) {
    swapElements(this.files,index,index2);//
    //[this.files[index],this.files[index2]] = [this.files[index2],this.files[index]];    
  }

  move(file) {
    if (!this.moving) {
      //select from
      this.movefrom = this.files.indexOf(file);
      this.moving = true;
    } else {
      this.moveto = this.files.indexOf(file);
      this.moving = false;
      if (this.movefrom == this.moveto) return;
      //1.remove
      let item = this.files.splice(this.movefrom,1)
      //2.splice
      this.files.splice(this.moveto,0,item[0]);
      this.updatelf();
    }
  }

  async duplicate(file) {
    let index = this.files.indexOf(file);
//    let dupfile = { ...file};
//duplicate file name and struct
    //let content = DEMOCONTENT;
    let name = file.name.slice(0,-3).concat('-',(+new Date).toString(36),'.md'); //remove md, add date suffix, add md
    let dupfile = new BodylightFile(name, FTYPE.MDFILE);    
    
    this.files.splice(index+1,0,dupfile); //insert after
    this.updatelf();
    //duplicate content
          //if currentfile is some other file - then save content an deactivate
          if (this.currentfile) {
            if (!this.currentfile.api) this.currentfile.api = this.api;
            this.currentfile.deactivate();//this.strategymap);
          }
          //activate new file
          this.currentfile = dupfile;
          if (!this.currentfile.api) this.currentfile.api = this.api;
          let content = await this.api.bs.loadDocContent(file.name);
          this.currentfile.activate(content);    
  }
  
  movedown(file) {
    const index = this.files.indexOf(file);    
    const index2 = index+1;
    if (index2>=this.files.length) return;
    this.swapfiles(index,index2);
    this.updatelf();
  }

  expandcolapse(file){}

  /**
   * Creates new empty document file
   */
  create() {
    this.api.askFile = false;
    //get file name - unique
    let filename = prompt('Web simulator document file name (*.md):', 'index.md');
    if (filename) {
      if (!filename.endsWith('.md') && !filename.endsWith('.json')) filename = filename.concat('.md');
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
    if (this.currentfile) this.currentfile.saveChanges();//this.strategymap);
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
    //let data = event.target.result;
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
            let newfile = new BodylightFile(entryname, (entryname.endsWith('.xml')) ? FTYPE.DESCRIPTIONFILE : FTYPE.MODELFILE, blob);
            if (entryname.endsWith('.xml')) {
              //parse modeldescription.file
              this.api.readFmiEntryDescription(blob);
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
                this.files.push(new BodylightFile(fileitem.name, fileitem.type));
              }
              //update api.projectfiles
              this.api.projectfiles = this.files;
              this.updatelf();
              //fmientries stored in project file
              this.api.fmientries = myproject.fmientries;
              this.api.fmientriessrc = myproject.fmientriessrc;
              this.api.filename = myproject.projectname;
              this.api.exportfilename = myproject.exportprojectname;
            });
          } else {
            zipEntry.async('blob').then(blob => {
              //let newfile= new BodylightFile()
              //will store content in blob
              let newfile = new BodylightFile(entryname, (entryname.endsWith('.xml')) ? FTYPE.DESCRIPTIONFILE : FTYPE.MODELFILE, blob);
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
      this.emptyProject();
    }
  }

  emptyProject() {
    return this.api.bs.clearStorage()
      .then(()=>{
        this.files = [];
        this.updatelf();
      })
      .catch( err =>{
        console.warn('newProject() localstorage clear error:', err);
      });

  }

  /**
   * Saves project as ZIP file
   */
  async save() {
    let filename = prompt('Enter file name of web simulator project(*.bj2):', this.api.filename);
    this.showButtons = false;
    if (!filename) return;
    if (!filename.endsWith('.bj2')) filename = filename.concat('.bj2');
    this.api.setProjectName(filename);
    let zip = new JSZip();
    const filesclone = this.files.map(({api, bloburl, ...keepAttrs}) => keepAttrs);
    zip.file('bodylight-project.json', JSON.stringify({
      files: filesclone,
      fmientries: this.api.fmientries,
      fmientriessrc: this.api.fmientriessrc,
      projectname: this.api.filename,
      exportprojectname: this.api.exportfilename
    }));
    for (let file of this.files) {
      //'blob' or 'string' content are zipped as entries
      if (!(file.syncstatus) || (file.syncstatus !== STATUS.notinlocal)) {
        try {
          let content = await this.api.bs.loadDocContent(file.name);
          if ( content !== null) {
            //check if something is stored
            zip.file(
              file.name,
              (file.type.value === FTYPE.MDFILE.value && (typeof content === 'string'))
                ? utf8Encode(content)
                : content,
              {binary: true}
            );
          } else {
            console.warn('file "' + file.name + '" was not zipped as it is not stored locally');
          }
        } catch (error) {
          console.warn('file was not zipped due to error', error);
        }
      }
      //zip.file(file.name, this.api.bs.loadDocContent(file.name), {binary: true});
    }

    /*for (let file of this.files) {
      //'blob' or 'string' content are zipped as entries
      if (!file.syncstatus || (file.syncstatus !== STATUS.notinlocal)) {
        let data = (file.type.value === FTYPE.MDFILE.value)
          ? this.api.bs.loadDocContentStr(file.name)
          : this.api.bs.loadDocContent(file.name);
        if (data) {
          if (data instanceof Promise) //zip blob from promise
          {
            data.then(obj => {
              if (obj) zip.file(file.name, obj, {binary: true});
              else console.warn('file not saved', file.name);
            }, reason => {console.warn('file not saves',reason)});
          } else { //zip content - string etc.
            zip.file(file.name, data, {binary: true});
          }
        } else {console.warn('blob for file is not stored,', file.name);}
        //zip.file(file.name, this.api.bs.loadDocContent(file.name), {binary: true});
      }
    }*/
    zip.generateAsync({type: 'blob'})
      .then(function(blob) {
        saveAs(blob, filename);
      });
  }

  /**
   * Uploads ZIP as project file
   */
  async load(event) {
    await this.emptyProject();
    this.showButtons = false;
    const reader = new FileReader();
    //sets global variable to this instance
    //window.editor = this;
    reader.onload = this.handleFileLoad;
    let files = event.target.files || event.dataTransfer.files;
    console.log('project load:', files);
    let filename = files[0].name;
    if (filename.endsWith('.bj2')) {
      //extract zip and save blob of extracted files
      this.extractProjectZipFile(files);
    }
  }

  /**
   * exports as HTML and related files, which can be published in web server or served locally
   */
  exportAsHtml() {
    let projectname = prompt('Enter file name for web simulator export to HTML(packed in *.zip):', this.api.exportfilename);
    this.showButtons = false;
    if (!projectname) return;
    let filename = projectname;
    if (!projectname.endsWith('.zip')) filename = projectname.concat('.zip');
    this.api.setExportProjectName(filename);
    //if shared model - markdown with attribute with link to model.md
    let sharedmodelattribute = '';
    if (this.api.sharedmodel) sharedmodelattribute=' model="model.md"';
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
    <bdl-markdown-book2 index="${firstmdfile.name}" summary="summary.md"${sharedmodelattribute}>
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
        //adds index.html with generated content, if do not exist in project
        if (! this.files.find(file => file.name === ' index.html')) zip.file('index.html', indexhtmlcontent);

        //adds bodylight.bundle.js
        zip.file('bodylight.bundle.js', bodylightblob);
        //adds all project files
        for (let file of this.files) {
          //'blob' or 'string' content are zipped as entries
          if (!(file.syncstatus) || (file.syncstatus !== STATUS.notinlocal)) {
            zip.file(
              file.name,
              (file.type.value === FTYPE.MDFILE.value)
                ? this.api.bs.loadDocContentStr(file.name)
                : this.api.bs.loadDocContent(file.name), {binary: true}
            );
          }
          //zip.file(file.name, this.api.bs.loadDocContent(file.name), {binary: true});
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
          let sbodylightfile = new BodylightFile('summary.md', FTYPE.MDFILE, sblob);
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
            console.error('Project exportAsHtml() error:', error);
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
      if (!filename.endsWith('.md') && !filename.endsWith('.json')) filename = filename.concat('.md');
    }
    //store in local structure
    file.name = filename;
    //update storage
    this.updatelf();
    //rename in storage
    this.api.bs.renameDoc(oldfilename, filename);
  }

  syncGithub1() {
    this.showgithub = ! this.showgithub;
    this.showButtons = false;
    //let githuburl = prompt('')
    //TODO restore from bs
    this.api.bs.restoreghparams()
      .then(ghparams =>{
        this.github = ghparams;
        /*this.githuborg = ghparams.org;
        this.githubrepo = ghparams.repo;
        this.githubpath = ghparams.path;
        this.githubtoken = ghparams.token;*/
      });
  }

  compareGithub() {
    this.gs.compareDir(this.files, this.github, this.api.bs).then(()=>{
      this.updatefiletypes();
      this.api.bs.storeghparams(this.github);
    });
  }

  async downloadGithub() {
    //alert('not yet implemented');
    let a= confirm('all files will be downloaded and replaced from GITHUB.')
    if (!a) return;
    for (let file of this.files) {
      try {
        if (file.syncstatus !== STATUS.synced)
          await this.gs.downloadFile(file, this.github,this.api.bs);
      } catch (e){
        console.log('error while downloading file' + file.name+'. Trying to get using GIT Data API ...');
        try {
          await this.gs.downloadBigFile(file, this.github,this.api.bs);
        } catch (e2) {
          console.warn('error while downloading file' + file.name, e2);
        }
      }
    }
    this.updatelf();

  }
  async uploadGithub() {
    //alert('not yet implemented');
    let a = prompt('All files will be uploaded to GITHUB. Confirm commit message or cancel.', 'UPDATE' );
    if (!a) return;
    for (let file of this.files) {
      //await this.gs.downloadFile(file,this.githuborg,this.githubrepo,this.githubpath,this.api.bs);
      try {
        if (file.syncstatus === STATUS.different || file.syncstatus === STATUS.notinremote)
        await this.gs.uploadFile(file, this.github, this.api.bs, a);
      } catch(e) {
        console.warn('error while uploading file'+file.name,e);
      }
    }
    this.updatelf();
  }

  syncUploadGithub(file) {
    let a = prompt('The file will be uploaded to GITHUB and replaced. Confirm commit message or cancel.', 'UPDATE ' + file.name);
    if (!a) return;
    this.gs.uploadFile(file, this.github, this.api.bs, a);
  }

  async syncDownloadGithub(file) {
    let a = confirm('The file will be replaced by downloaded copy from GITHUB.');
    if (!a) return;
    await this.gs.downloadFile(file, this.github, this.api.bs);
    //update file list - if the file is new
    this.updatelf(); //update lf
    if (file.type.value === FTYPE.MDFILE.value) this.open(file);
  }

  showGithubHelp() {this.api.helpsrc = 'github.md';}
  toggledoc() {this.showdoc = !this.showdoc;}
  togglemodel() {this.showmodel = !this.showmodel;}
  toggleadobe() {this.showadobe = !this.showadobe;}
  toggleimg() {this.showimg = !this.showimg;}
  toggleother() {this.showother = !this.showother;}

  update() {
    this.ea.publish('file-dialog', this.api.askFileItems);
    this.api.askFile = false;
    this.updatefiletypes();
  }
  cancel() {
    this.api.askFile = false;
  }
  blink(obj) {
    this.api.blink(obj);
  }

  refresh() {
    this.api.discoverAdobeAnimate();
  }

  show(file) {
    //show image in separated dialog
    this.showpreviewimage= true;
    if (this.previewimage) this.previewimage.src = file.bloburl;
  }

  hidePreviewImage() {
    this.showpreviewimage= false;
  }
}
