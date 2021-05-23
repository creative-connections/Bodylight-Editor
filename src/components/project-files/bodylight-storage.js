import localForage from 'localforage';
import './bodylight-struct';
import {utf8Encode} from './bodylight-struct';
//import sha1 from 'js-sha1';


export const LFKEYS = {
  FILELIST: 'BodylightEditor.Filelist',
  FILECONTENT: 'BodylightEditor.Content',
  FMIENTRIES: 'BodylightEditor.FMIEntries',
  FMISRCS: 'BodylightEditor.FMISrcs',
  NAME: 'BodylightEditor.Name',
  EXPORTNAME: 'BodylightEditor.ExportName',
  GH: 'Bodylight.GithubSync'
};

/**
 * Common utils to store large data (JS files, datasets, project files) in local storage of browser
 * `localforage` library is used - it employs indexeddb and fallsback to localstorage in older browsers
 */
export class BodylightStorage {
  getFileList() {
    return localForage.getItem(LFKEYS.FILELIST)
      .then(value=>{
        //add api to the structure retrieved from storage
        //for (let item of value) item.api = api;
        return value;
      })
      .catch(error=>{
        console.error('BodylightStorage getFileList:', error);
        //set demo files
        return error;
      });
  }

  setFileList(files) {
    /*let filesclone = files.slice(0);
    //remove api property from files structure to be stored
    for (let fitem of filesclone) {
      console.log('removing api property', fitem.api);
      fitem.api = undefined;
      console.log('removing api property', fitem.api);
    }*/
    const filesclone = files.map(({api, ...keepAttrs}) => keepAttrs);
    console.log('BodylightStorage setfilelist() files:', filesclone);
    localForage.setItem(LFKEYS.FILELIST, filesclone);
  }

  saveDocContent(filename, content) {
    return localForage.setItem(LFKEYS.FILECONTENT + '.' + filename, content);
  }

  loadDocContent(filename) {
    return localForage.getItem(LFKEYS.FILECONTENT + '.' + filename);
  }

  async loadDocContentStr(filename) {
    let str = await localForage.getItem(LFKEYS.FILECONTENT + '.' + filename);
    //console.log('doc content str for ', filename, ':', str);
    if (typeof str === 'string') return utf8Encode(str);
    return str;
  }

  async loadBlobContent(filename) {
    let str = await localForage.getItem(LFKEYS.FILECONTENT + '.' + filename);
    //console.log('doc content str for ', filename, ':', str);
    return new Promise((resolve, reject)=> {
      if (typeof str === 'blob') {
        let a = new FileReader();
        a.onloadend = () => {
          resolve(a.result);// it outputs a promise
        };
        a.readAsArrayBuffer(blob);
      } else reject();
    });
  }

  readBlobAsync(blob) {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();
      reader.onload = () =>{
        resolve(reader.result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  async loadBlobContentBase64(filename) {
    let str = await localForage.getItem(LFKEYS.FILECONTENT + '.' + filename);
    //console.log('doc content str for ', filename, ':', str);
    if ((str instanceof Blob) || (str instanceof File)) {
      let base64data = await this.readBlobAsync(str);
      let content64 = base64data.substr(base64data.indexOf(',') + 1);
      //console.log('content64', content64);
      return content64;
    }
  }

  async loadDocUrl(filename) {
    let blob = await localForage.getItem(LFKEYS.FILECONTENT + '.' + filename);
    //console.log('loaddocurl() for ', filename, ':', blob);
    //if (typeof str === 'string') return utf8Encode(str);
    if (blob instanceof Blob) return await URL.createObjectURL(blob);
    return '';
  }

  renameDoc(oldfilename, newfilename) {
    localForage.getItem(LFKEYS.FILECONTENT + '.' + oldfilename)
      .then(value => {
        //save value under new key
        this.saveDocContent(newfilename, value)
          .then(result => {
            //remove oldfilename key
            localForage.removeItem(LFKEYS.FILECONTENT + '.' + oldfilename);
          });
      });
  }

  saveBlobContent(filename, blob) {
    return localForage.setItem(LFKEYS.FILECONTENT + '.' + filename, blob);
  }

  deleteDoc(filename) {
    return localForage.removeItem(LFKEYS.FILECONTENT + '.' + filename);
  }

  async clearStorage() {
    let keys = await localForage.keys();
    for (let key of keys) {
      if (key.startsWith('BodylightEditor')) await localForage.removeItem(key);
    }
    return Promise.resolve(1);
  }

  getBlob(filename) {
    return localForage.getItem(LFKEYS.FILECONTENT + '.' + filename);
  }

  setFmiListEntries(entries) {
    return localForage.setItem(LFKEYS.FMIENTRIES, entries);
  }
  setFmiListSrcs(srcentries) {
    return localForage.setItem(LFKEYS.FMISRCS, srcentries);
  }

  getProjectName() {
    return localForage.getItem(LFKEYS.NAME)
      .then(value => {return value;})
      .catch(error=>{
        console.log('BodylightStorage getEntries error:', error);
        return 'project.zip';
      });
  }

  getExportProjectName() {
    return localForage.getItem(LFKEYS.EXPORTNAME)
      .then(value => {return value;})
      .catch(error=>{
        console.log('BodylightStorage getEntries error:', error);
        return 'projectexport.zip';
      });
  }

  setProjectName(name) {
    return localForage.setItem(LFKEYS.NAME, name);
  }

  setExportProjectName(name) {
    return localForage.setItem(LFKEYS.EXPORTNAME, name);
  }
  //OBSOLETE introduce bug if more project are edited
  /*  getFMIListEntries() {
    return localForage.getItem(LFKEYS.FMIENTRIES)
      .then(value=> {
        return value;
      })
      .catch(error=>{
        console.log('BodylightStorage getEntries error:', error);
        return error;
      });
  }
  getFMIListSrcs() {
    return localForage.getItem(LFKEYS.FMISRCS)
      .then(value=> {
        return value;
      })
      .catch(error=>{
        console.log('BodylightStorage getSrcs error:', error);
        return error;
      });
  }
 */

  storeghparams(ghstruct) {
    //let ghstruct = {org: org, repo: repo, dir: dir};
    const ghstructstr = JSON.stringify(ghstruct);
    return localForage.setItem(LFKEYS.GH, ghstructstr);
  }

  restoreghparams() {
    return localForage.getItem(LFKEYS.GH)
      .then(value => {
        return JSON.parse(value);
      });
  }
}
