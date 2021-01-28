import {FTYPE, FileType2StrategyMap} from './bodylight-struct';

export class BodylightFile {
  name='';
  type=FTYPE.MDFILE;
  active=false;
  bloburl='';

  constructor(name, type, api, blob) {
    this.name = name;
    this.type = type;
    //do not serialize api and strategymap
    //instantiates the class in strategy field
    //this.strategy = window[this.type.strategy](this);
    this.api = api;
    if (api) {
      if (blob) {
      //store blob
      //api.bs.saveBlobContent(name, blob);
        api.bs.saveBlobContent(name, blob)
          .then(result => {
            console.log('result saving blob', result);
            //this.bloburl = this.api.bs.loadDocUrl(name);
            this.api.bs.loadDocUrl(name).then(bloburl => this.bloburl = bloburl);
          //this.uploaddialog = false;
          })
          .catch(error => {
            console.error('error saving blob', error);
          //this.uploaddialog = false;
          });
      } else {
        //no blob - try to retrieve bloburl
        //this.bloburl = this.api.bs.loadDocUrl(name);
        this.api.bs.loadDocUrl(name).then(bloburl => this.bloburl = bloburl);
      }
    }
  }

  changetype(type) {
    this.type = type;
  }

  activate(content) {
    //this.active = true;
    //console.log('bodylight-file activate', this);
    //delegate to file type
    FileType2StrategyMap.get(this.type.name).activate(this, content);
  }

  deactivate() {
    //this.active = false;
    //console.log('bodylight-file deactivate', this);
    //delegate to file type
    FileType2StrategyMap.get(this.type.name).deactivate(this);
  }

  saveChanges() {
    FileType2StrategyMap.get(this.type.name).saveChanges(this);
  }
}
