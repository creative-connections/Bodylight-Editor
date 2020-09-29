import * as localForage from 'localforage';
const FTYPE = {
  MDFILE: {value: 0, title: 'Web simulator document file in Markdown syntax using Bodylight components', faclass: 'fa fa-file-text'},
  MODELFILE: {value: 1, title: 'Model exported from Modelica to FMU and JS', faclass: 'fa fa-file-code-o'},
  ADOBEANIMATE: {value: 2, title: 'Interactive animation from Adobe Animate exported with CreateJS API', faclass: 'fa fa-file-image-o'},
  ANIMATEDGIF: {value: 3, title: 'Animated GIF', faclass: 'fa fa-file-movie-o'},
  IMAGE: {value: 4, title: 'Common image', faclass: 'fa fa-file-image-o'}
};
export class Project {
  constructor() {

  }

  attached() {
    this.files = [
      {name: 'index.md', type: FTYPE.MDFILE},
      {name: 'BurkhoffFMI.js', type: FTYPE.MODELFILE},
      {name: 'SrdceCelek.js', type: FTYPE.ADOBEANIMATE},
      {name: 'heart.gif', type: FTYPE.ANIMATEDGIF}
    ];
  }

  open(file){

  }

  delete(file){
    let i = this.files.indexOf(file);
    this.files.splice(i,1);
  }
}
