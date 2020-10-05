import {FTYPE, createStrategyMap} from './bodylight-struct';

export class BodylightFile {
  name='';
  type=FTYPE.MDFILE;
  active=false;

  constructor(name, type, api) {
    this.name = name;
    this.type = type;
    //do not serialize api and strategymap
    //instantiates the class in strategy field
    //this.strategy = window[this.type.strategy](this);
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
