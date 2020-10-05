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
  this.attr = {id: 'id'+this.api.idindex , src: this.src,
    fminame: 'Physiolibrary_Hydraulic_Examples_MeursModel2011_HemodynamicsMeurs_0flatNorm',
    tolerance: '0.000001', starttime: '0', guid: '{b3a357a4-da8c-4f00-b159-28ec2ea45e26}',
    valuereferences: '637534281,637534272,33554436, 33554437, 33554432, 33554436, 33554437, 33554433, 16777313',
    valuelabels: 'Pressure in Aorta,Pressure in Left Ventricle, Intrathoracic Artery Volume, Extrathoracic Arteries Volume, Pulmonary Arteries Volume, Intrathoracic Veins Volume, Extrathoracic Veins volume, Pulmonary Veins Volume,Heart Rate',
    inputs: 'id1,16777313,1,60' };
  console.log('attributefmidialog attached src:', this.src);
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
  this.api.submitattr('bdl-fmi', this.attr);
}
}
