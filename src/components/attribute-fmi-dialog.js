import {Editorapi} from './editorapi';
import {inject} from 'aurelia-framework';
import {AttributeDialog} from './attribute-dialog';
import {bindable} from 'aurelia-templating';
//import {observable} from 'aurelia-framework';
@inject(Editorapi)
export class AttributeFmiDialog extends AttributeDialog {
@bindable src;
constructor(api) {
  super(api);
  //this.api=api;
}

attached() {
  this.attr = {id: 'id' + this.api.idindex, src: this.src,
    fminame: this.api.currentfmientry.fminame,
    tolerance: '0.000001', starttime: '0', guid: this.api.currentfmientry.guid,
    valuereferences: '637534281,637534272,33554436, 33554437, 33554432, 33554436, 33554437, 33554433, 16777313',
    valuelabels: 'Pressure in Aorta,Pressure in Left Ventricle, Intrathoracic Artery Volume, Extrathoracic Arteries Volume, Pulmonary Arteries Volume, Intrathoracic Veins Volume, Extrathoracic Veins volume, Pulmonary Veins Volume,Heart Rate',
    inputs: 'id1,16777313,1,60',
    inputlabels: 'heart rate'};
  console.log('attributefmidialog attached src:', this.src);
  this.inputreferences = [];
  this.outputreferences = [];
}

activate() {
  console.log('attributefmidialog activated src:', this.src);
  this.sources = ['MeursFMI2.js', 'BurkhoffFMI.js', 'IronMetabolism.js'];
}

bind() {
  console.log('attributefmidialog bind src:', this.src);
  if (this.attr) this.attr.src = this.src;
}

srcChanged() {
  console.log('attributefmidialog changed src:', this.src);
  if (this.attr) this.attr.src = this.src;
}

submit() {
  //convert this.api.references to comma separated ref numbers
  //api references were filled by the dialog
  let valuereferences = this.outputreferences.map(ref => ref.reference).join(',');
  let valuelabels = this.outputreferences.map(ref => ref.name).join(','); //name should not contain comma
  let inputs = this.inputreferences.map(ref => ref.id + ',' + ref.reference + ',' + ref.numerator + ',' + ref.denominator).join(';');
  let inputlabels = this.inputreferences.map(ref => ref.name).join(',');
  //console.log('submit() references:', valuereferences);
  this.attr.valuereferences = valuereferences;
  this.attr.valuelabels = valuelabels;
  this.attr.inputs = inputs;
  this.attr.inputlabels = inputlabels;
  //now call inherited method to convert attr to xml
  this.api.submitattr('bdl-fmi', this.attr);
}
}
