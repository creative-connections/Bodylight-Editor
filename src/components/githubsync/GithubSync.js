import {request } from '@octokit/request';
import {BodylightFile} from '../project-files/bodylight-file';
import {FTYPE} from '../project-files/bodylight-struct';
import sha1 from 'js-sha1';


/**const makeEnum = (...lst) => Object.freeze(Object.assign({}, ...lst.map(k => ({[k]: Symbol(k)}))));
const STATUS = makeEnum(['notinlocal', 'notinremote', 'synced', 'different']);**/
export const STATUS = {
  notinlocal: Symbol('notinlocal'),
  notinremote: Symbol('notinremote'),
  synced: Symbol('synced'),
  different: Symbol('different')
};

export function stripprefix(name, optdir) {
  if (name.startsWith(optdir)) return name.slice(optdir.length + 1);
  return name;
}

export class GithubSync {
  //STATUS = makeEnum(["notinlocal","notinremote","synced","different"])
  constructor() {}

  async sha256(message, mycrypto) {
    if (! mycrypto) mycrypto = crypto;
    // encode as UTF-8
    const msgBuffer = new TextEncoder().encode(message);
    // hash the message
    const hashBuffer = await mycrypto.subtle.digest('SHA-1', msgBuffer);
    // convert ArrayBuffer to Array
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    // convert bytes to hex string
    const hashHex = hashArray.map(b => ('00' + b.toString(16)).slice(-2)).join('');
    return hashHex;
  }

  async sha256blob(blob) {
    return new Promise((resolve, reject)=> {
      let a = new FileReader();
      a.onloadend = async() => {
        const hashBuffer = await crypto.subtle.digest('SHA-1', a.result);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => ('00' + b.toString(16)).slice(-2)).join('');
        resolve(hashHex);// it outputs a promise
      };
      a.readAsArrayBuffer(blob);
    });
  }

  sha1lib(message) {
    //console.log('sha1', sha1);
    return sha1(message);
  }

  sha1libblob(blob) {
    return new Promise((resolve, reject)=> {
      let a = new FileReader();
      a.onloadend = () => {
        const hashHex = sha1(a.result);
        resolve(hashHex);// it outputs a promise
      };
      a.readAsArrayBuffer(blob);
    });
  }

  size(message) {
    return message.length;
  }
  sizeblob(blob) {
    return blob.size;
  }

  /**compares directory in github repo $org/$repo/contents/$path/ with files
   * and sets syncstatus into files array, adds files not in local array
   * @param files array of files structure - {name:'',...}
   * @param org
   * @param repo
   * @param path
   * @param optdir - used for recursive call only - start with empty string
   */
  async compareDir(files, org, repo, path, token,storageapi, optdir = '') {
    //const githubcontentreq = `GET /repos/${org}/${repo}/contents/${path}`;
    //1. get content of github repo path - list of files
    const result = await request('GET /repos/{org}/{repo}/contents/{path}/{optdir}', {
            headers: {
        authorization: `token ${token}`
      },
      org: org,
      repo: repo,
      path: path + (optdir ? '/' + optdir : '')
    });
    //console.log('result:', result.data);
    //2. compare with list in $files
    //files not in locals - do not include directories and include those with different names
    let notinlocals = result.data.filter(x => ((x.type !== 'dir') && !files.find(y => (optdir ? stripprefix(y.name, optdir) : y.name) === x.name)));
    //let notinlocals = result.data.filter(x => !(files.find(y => y.name === x.name)));
    //console.log('comparedir() notinlocals:',notinlocals);
    //let notinremote = [];
    // storage for dirs and associated filenames to be checked after
    let dirs = {};
    //3. compare list of files that are local not in remote
    for (let file of files) {
      let filename = (optdir ? stripprefix(file.name, optdir) : file.name);
      const myfile = result.data.find(x => x.name === filename);
      if (myfile) {
        //compare
        if ((!file.syncstatus) || (file.syncstatus !== STATUS.notinlocal)) {
          file.syncstatus = STATUS.different; //by default different
          //count sha for file
          let content = (file.type.value === FTYPE.MDFILE.value)
            ? await storageapi.loadDocContentStr(file.name)
            : await storageapi.loadDocContent(file.name);

          let filesha = '';
          if (typeof (content) === 'string') {
            //console.log('string sha for', file.name);
            //filesha = this.sha1lib(content);
            filesha = this.size(content);
          }
          if (content instanceof Blob) {
            //console.log('blob sha for', file.name);
            //filesha = await this.sha1libblob(content);
            filesha = this.sizeblob(content);
          }
          //console.log('sha local x sha remote', filesha, myfile.size); //myfile.sha
          if (filesha === myfile.size) file.syncstatus = STATUS.synced;
          file.sha = myfile.sha;
        }
        //file.syncstatus = STATUS.synced; //if sha are same
      } else {
        //exist in local but not in repo
        file.syncstatus = STATUS.notinremote;
        //check if directory - includes /, only if optdir is not defined
        if (!optdir && file.name.includes('/')) {
          //add directory to queue
          let dirandname = file.name.split('/', 2);
          //if associated dirs with dirname is not yet array.
          if (!dirs[dirandname[0]]) dirs[dirandname[0]] = [];
          //push filename into array associated to the dir
          dirs[dirandname[0]].push(file);
          //add filename to the directory to be checked
        }
      }
    }
    //indicate files that are not among local files
    for (let notinlocal of notinlocals) {
      let myfile = new BodylightFile(notinlocal.name);
      myfile.syncstatus = STATUS.notinlocal;
      myfile.sha = notinlocal.sha;
      files.push(myfile);
    }
    //check directories - breath first
    for (let key of Object.keys(dirs)) {
      // key - directory name
      //dirs[key] - array with filenames
      //do comparedir recursively
      await this.compareDir(dirs[key], org, repo, path, storageapi, key);
    }
  }

  async uploadFile(file, org, repo, path, token, storageapi, message) {
    let filename = file.name;
    //console.log('githubsync uploadfile() storagepi',storageapi);
    let content = (file.type.value === FTYPE.MDFILE.value)
      ? btoa(await storageapi.loadDocContentStr(file.name))
      : await storageapi.loadBlobContentBase64(file.name);

    const result = await request('PUT /repos/{org}/{repo}/contents/{path}/{filename}', {
      headers: {
        authorization: `token ${token}`
      },
      org: org,
      repo: repo,
      path: path,
      sha: file.sha,
      filename: filename,
      content: content,
      message: message
    });
    //console.log('github uploadFile result:', result);
    if (result.status >= 200 && result.status < 300) {
      file.syncstatus = STATUS.synced;
    }
    return result;
  }

  async downloadFile(file, org, repo, path, token, storageapi) {
    const result = await request('GET /repos/{org}/{repo}/contents/{path}/{filename}', {
      headers: {
        authorization: `token ${token}`
      },
      org: org,
      repo: repo,
      path: path,
      filename: file.name
    });
    const b64toBlob = (base64, type = 'application/octet-stream') =>
      fetch(`data:${type};base64,${base64}`).then(res => res.blob());
    //console.log('github2 download file result:', result);
    let blob = await b64toBlob(result.data.content);
    let result2 = await storageapi.saveBlobContent(file.name, blob);
    //console.log('result saving blob', result2);
    //this.bloburl = this.api.bs.loadDocUrl(name);
    storageapi.loadDocUrl(file.name).then(bloburl => file.bloburl = bloburl);
    //this.uploaddialog = false;
    if (result.status >= 200 && result.status < 300) {
      file.syncstatus = STATUS.synced;
    }
  }

  async downloadBigFile(file, org, repo, path, token, storageapi) {
    const result = await request('GET /repos/{org}/{repo}/git/blobs/{filesha}', {
      headers: {
        authorization: `token ${token}`
      },
      org: org,
      repo: repo,
      filesha: file.sha
    });
    const b64toBlob = (base64, type = 'application/octet-stream') =>
      fetch(`data:${type};base64,${base64}`).then(res => res.blob());
    //console.log('github2 download file result:', result);
    let blob = await b64toBlob(result.data.content);
    let result2 = await storageapi.saveBlobContent(file.name, blob);
    //console.log('result saving blob', result2);
    //this.bloburl = this.api.bs.loadDocUrl(name);
    storageapi.loadDocUrl(file.name).then(bloburl => file.bloburl = bloburl);
    //this.uploaddialog = false;
    if (result.status >= 200 && result.status < 300) {
      file.syncstatus = STATUS.synced;
    }
  }
}
