import {FTYPE, createStrategyMap} from './bodylight-struct';

export class BodylightFile {
  name='';
  type=FTYPE.MDFILE;
  active=false;

  constructor(name, type, api, blob) {
    this.name = name;
    this.type = type;
    //do not serialize api and strategymap
    //instantiates the class in strategy field
    //this.strategy = window[this.type.strategy](this);
    if (api && blob) {
      //store blob
      //api.bs.saveBlobContent(name, blob);
      api.bs.saveBlobContent(name, blob)
        .then(result => {
          console.log('result saving blob', result);
          //this.uploaddialog = false;
        })
        .catch(error => {
          console.log('error saving blob', error);
          //this.uploaddialog = false;
        });
    }
  }

  changetype(type) {
    this.type = type;
    //this.strategy = window[this.type.strategy](this);
  }

  activate(strategies, content) {
    //based on type execute strategy
    strategies.get(this.type.name).activate(this, content);
    //this.strategy.activate(content);
  }

  deactivate(strategies) {
    strategies.get(this.type.name).deactivate(this);
    //this.strategy.deactivate();
  }
}
