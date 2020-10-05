import {FTYPE} from './bodylight-struct';
import {BodylightFileFactory} from "./bodylight-file-factory";

export class BodylightFile {
  /*export const DEMOFILES = [
    {name: 'index.md', type: FTYPE.MDFILE, active: false},
    {name: 'BurkhoffFMI.js', type: FTYPE.MODELFILE, active: false},
    {name: 'SrdceCelek.js', type: FTYPE.ADOBEANIMATE, active: false},
    {name: 'heart.gif', type: FTYPE.ANIMATEDGIF, active: false}
  ];*/

  name='';
  type=FTYPE.MDFILE;
  active=false;

  constructor(name, type, api) {
    this.name = name;
    this.type = type;
    this.api = api;
    this.type.strategy.setApi(this.api);
    //instantiates the class in strategy field
    //this.strategy = window[this.type.strategy](this);
  }

  changetype(type) {
    this.type = type;
    this.type.strategy.setApi(this.api);
    //this.strategy = window[this.type.strategy](this);
  }

  activate(content) {
    //based on type execute strategy
    this.type.strategy.activate(this, content);
    //this.strategy.activate(content);
  }

  deactivate() {
    this.type.strategy.deactivate(this);
    //this.strategy.deactivate();
  }

}
