import {Editorapi} from './editorapi';
import {inject} from 'aurelia-framework';
import {AttributeDialog} from './attribute-dialog';

@inject(Editorapi)
export class AttributeFmiDialog extends AttributeDialog {
  constructor(api) {
    super(api);
    //this.api=api;
    this.attr = {id: 'id4', src: 'MeursFMI2.js',
      fminame: 'Physiolibrary_Hydraulic_Examples_MeursModel2011_HemodynamicsMeurs_0flatNorm',
      tolerance: '0.000001', starttime: '0', guid: '{b3a357a4-da8c-4f00-b159-28ec2ea45e26}',
      valuereferences: '637534281,637534272,33554436, 33554437, 33554432, 33554436, 33554437, 33554433, 16777313',
      valuelabels: 'Pressure in Aorta,Pressure in Left Ventricle, Intrathoracic Artery Volume, Extrathoracic Arteries Volume, Pulmonary Arteries Volume, Intrathoracic Veins Volume, Extrathoracic Veins volume, Pulmonary Veins Volume,Heart Rate',
      inputs: 'id1,16777313,1,60' };
  }

  submit() {
    this.api.submitattr(this.api.askAttributesItem.name, this.attr);
  }
}
