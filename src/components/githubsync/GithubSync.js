import {request } from '@octokit/request';
import {BodylightFile} from '../project-files/bodylight-file';

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
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);

    // convert ArrayBuffer to Array
    const hashArray = Array.from(new Uint8Array(hashBuffer));

    // convert bytes to hex string
    const hashHex = hashArray.map(b => ('00' + b.toString(16)).slice(-2)).join('');
    return hashHex;
  }

  /**compares directory in github repo $org/$repo/contents/$path/ with files
   *
   * @param files array of files structure - {name:'',...}
   * @param org
   * @param repo
   * @param path
   */
  async compareDir(files, org, repo, path) {
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
}
