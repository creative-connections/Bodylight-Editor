import localForage from 'localforage';
import './bodylight-struct';


export const LFKEYS = {
  FILELIST: 'BodylightEditor.Filelist',
  FILECONTENT: 'BodylightEditor.Content',
  FMIENTRIES: 'BodylightEditor.FMIEntries',
  FMISRCS: 'BodylightEditor.FMISrcs'
};

/**
 * Common utils to store large data (JS files, datasets, project files) in local storage of browser
 * `localforage` library is used - it employs indexeddb and fallsback to localstorage in older browsers
 */
export class BodylightStorage {
  getFileList() {
    return localForage.getItem(LFKEYS.FILELIST)
      .then(value=>{
        return value;
      })
      .catch(error=>{
        console.log('BodylightStorage getFileList:', error);
        //set demo files
        return error;
      });
  }

  setFileList(files) {
    localForage.setItem(LFKEYS.FILELIST, files);
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

  clearStorage() {
    return localForage.clear();
  }

  getBlob(filename) {
    return localForage.getI;
  }
  setFmiListEntries(entries) {
    return localForage.setItem(LFKEYS.FMIENTRIES, entries);
  }
  setFmiListSrcs(srcentries) {
    return localForage.setItem(LFKEYS.FMISRCS, srcentries);
  }
  getFMIListEntries() {
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
}
