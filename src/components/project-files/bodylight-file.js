import {FTYPE, FileType2StrategyMap} from './bodylight-struct';

export class BodylightFile {
  name='';
  type=FTYPE.MDFILE;
  active=false;
  bloburl='';

  constructor(name, type, blob) {
    this.name = name;
    if (type) {
      this.type = type;
    } else {
      //determine type from name
      let name2 = name.toLowerCase();
      if (name2.endsWith('.md')) this.type = FTYPE.MDFILE;
      else if (name2.endsWith('.png') || name2.endsWith('.jpg') || name2.endsWith('.gif')) this.type = FTYPE.IMAGE;
      else if (name2.endsWith('.xml') || name2.endsWith('.html')) this.type = FTYPE.DESCRIPTIONFILE;
      else if (name2.endsWith('.js') && name2.includes('_')) this.type = FTYPE.MODELFILE;
      else if (name2.endsWith('.js') && name2.endsWith('.bundle.js')) this.type = FTYPE.OTHERJS;
      else if (name2.endsWith('.js')) this.type = FTYPE.ADOBEANIMATE;
      else this.type = FTYPE.OTHERJS;
    }
    //do not serialize api and strategymap
    //instantiates the class in strategy field
    //this.strategy = window[this.type.strategy](this);
    //this.api = api;
    //if (api) {
    if (blob) {
      //store blob
      //api.bs.saveBlobContent(name, blob);
      window.editorapi.bs.saveBlobContent(name, blob)
        .then(result => {
          console.log('result saving blob', result);
          //this.bloburl = this.api.bs.loadDocUrl(name);
          window.editorapi.bs.loadDocUrl(name).then(bloburl => this.bloburl = bloburl);
          //this.uploaddialog = false;
        })
        .catch(error => {
          console.error('error saving blob', error);
          //this.uploaddialog = false;
        });
    } else {
      //no blob - try to retrieve bloburl
      //this.bloburl = this.api.bs.loadDocUrl(name);
      window.editorapi.bs.loadDocUrl(name).then(bloburl => this.bloburl = bloburl);
    }
    //}
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
