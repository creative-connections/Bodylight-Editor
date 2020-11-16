import {inject} from "aurelia-framework";
import {Editorapi} from "./components/editorapi";

@inject(Editorapi)
export class Editorapp {

  constructor(api){
    this.api = api;
  }

}
