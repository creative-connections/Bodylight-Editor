import {Editorapi} from './editorapi';
import {inject} from 'aurelia-framework';
import localForage from 'localforage';
import {BodylightEditorItems} from './bodylightEditorItems';

@inject(Editorapi)
export class Animationbinding {
  fmin,fmax,amin,amax

  constructor(api) {
    this.api = api;
  }

  bind() {
    this.mapping = [{animobj: 'sipka', amin: 0, amax: 99, fmuvarname: 'x', fmin: 0, fmax: 1}];
  }

  identify(){
    //identifyfmi
    //get editor content sorounded into a root element
    let md = '<root>'+this.api.editor.getValue()+"</root>";
    //parse the xml
    let parser = new DOMParser();
    let xmldoc = parser.parseFromString(md,"text/xml");
    let bdlfmi = xmldoc.getElementsByTagName("bdl-fmi")[0];
    //update fmi internals
    this.api.updateCurrentFmiEntry(bdlfmi.getAttribute('src'));
    this.api.updateFMIVariableList();
    //

  }

  submit(){

  }
}
