import {request } from '@octokit/request';
import {BodylightFile} from '../project-files/bodylight-file';
import {FTYPE} from '../project-files/bodylight-struct';
import sha1 from 'js-sha1';


/**const makeEnum = (...lst) => Object.freeze(Object.assign({}, ...lst.map(k => ({[k]: Symbol(k)}))));
const STATUS = makeEnum(['notinlocal', 'notinremote', 'synced', 'different']);**/
export const STATUS = Object.freeze({
  notinlocal: Symbol('notinlocal'),
  notinremote: Symbol('notinremote'),
  synced: Symbol('synced'),
  different: Symbol('different')
});

export class GithubSync {
  //STATUS = makeEnum(["notinlocal","notinremote","synced","different"])
  constructor() {}

  async sha256(message) {
    // encode as UTF-8
    const msgBuffer = new TextEncoder().encode(message);
    // hash the message
    const hashBuffer = await crypto.subtle.digest('SHA-1', msgBuffer);
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
    console.log('sha1', sha1);
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
   */
  async compareDir(files, org, repo, path, storageapi) {
    //const githubcontentreq = `GET /repos/${org}/${repo}/contents/${path}`;
    //1. get content of github repo path - list of files
    const result = await request('GET /repos/{org}/{repo}/contents/{path}', {
      /*      headers: {
        authorization: `token ${token}`
      },*/
      org: org,
      repo: repo,
      path: path
    });
    console.log('result:', result.data);
    //2. compare with list in $files
    let notinlocals = result.data.filter(x => (x.type !== 'dir') && !files.find(y => y.name === x.name));
    //let notinremote = [];
    for (let file of files) {
      const myfile = result.data.find(x => x.name === file.name);
      if (myfile) {
        //compare
        file.syncstatus = STATUS.different; //by default different
        //count sha for file
        let content = (file.type.value === FTYPE.MDFILE.value)
          ? await storageapi.loadDocContentStr(file.name)
          : await storageapi.loadDocContent(file.name);

        let filesha = '';
        if (typeof(content) === 'string') {
          console.log('string sha for', file.name);
          //filesha = this.sha1lib(content);
          filesha = this.size(content);
        }
        if (content instanceof Blob) {
          console.log('blob sha for', file.name);
          //filesha = await this.sha1libblob(content);
          filesha = this.sizeblob(content);
        }
        console.log('sha local x sha remote', filesha, myfile.size); //myfile.sha
        if (filesha === myfile.size) file.syncstatus = STATUS.synced;
        file.sha = myfile.sha;
        //file.syncstatus = STATUS.synced; //if sha are same
      } else {
        //exist in local not in repo
        file.syncstatus = STATUS.notinremote;
      }
    }
    //
    for (let notinlocal of notinlocals) {
      let myfile = new BodylightFile(notinlocal.name);
      myfile.syncstatus = STATUS.notinlocal;
      files.push(myfile);
    }
  }

  async uploadFile(file, org, repo, path, token, storageapi, message) {
    let filename = file.name;
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
    console.log('github uploadFile result:', result);
    if (result.status >= 200 && result.status < 300) {
      file.syncstatus = STATUS.synced;
    }
    return result;
  }

  async downloadFile(file, org, repo, path, storageapi) {
    alert('not implemented');
  }
}
