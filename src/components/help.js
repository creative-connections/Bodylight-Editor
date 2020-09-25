import {Editorapi} from './editorapi';
import {inject} from 'aurelia-framework';

@inject(Editorapi)

export class Help {
  indexhelpsrc = "index.md";

  constructor(api) {
    this.api = api;
    this.api.helpsrc= this.indexhelpsrc;
  }

  showHelp(){
    this.api.helpsrc = this.indexhelpsrc;
  }
}
