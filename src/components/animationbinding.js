import {Editorapi} from './editorapi';
import {inject} from 'aurelia-framework';
//import localForage from 'localforage';
//import {BodylightEditorItems} from './bodylightEditorItems';

@inject(Editorapi)
export class Animationbinding {
  fmin; //min of fmu variable to be animated interpolated to amin
  fmax; //max of fmu variable to be animated interpolated to amax
  amin; //min in animation
  amax; //max of animation
  findex; //index of fmu variable

  constructor(api) {
    this.api = api;
  }

  bind() {
    this.mapping = [{aname: 'sipka', amin: 0, amax: 99, fmuvarname: 'x', findex:1, fmin: 0, fmax: 1}, {aname:'sipka2'}];
  }

  identify() {
    //1. identifyfmi
    //get editor content sorounded into a root element
    let md = '<root>' + this.api.editor.getValue() + '</root>';
    //parse the xml
    let parser = new DOMParser();
    let xmldoc = parser.parseFromString(md, 'text/xml');
    let bdlfmi = xmldoc.getElementsByTagName('bdl-fmi')[0];
    //update fmi internals
    this.api.updateCurrentFmiEntry(bdlfmi.getAttribute('src'));
    this.api.updateFMIVariableList();
    //2. animobjs probably identified
    this.mapping = [];
    for (let aobj of api.animobj) {
      this.mapping.push({aname:aobj});
    }
    let bdlbind2a = xmldoc.getElementsByTagName('bdl-bind2a');
    for (let binding of bdlbind2a) {
      //this.mapping.push({})
      //find mapping, update
      let bobj = this.mapping.find(x => x.aname === binding.getAttribute('aname'));
      if (bobj) {
        bobj.amin = binding.getAttribute('amin');
        bobj.amax = binding.getAttribute('amax');
        bobj.fmin = binding.getAttribute('fmin');
        bobj.fmax = binding.getAttribute('fmax');
        bobj.findex = binding.getAttribute('findex');
        bobj.fvarname = this.api.outputreferences[bobj.findex];
      }
    }

  }

  submit() {

  }
}
