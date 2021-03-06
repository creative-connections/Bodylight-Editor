import {AttributeDialog} from './attribute-dialog';
import {Editorapi} from './editorapi';
import {inject} from 'aurelia-framework';
import {observable} from 'aurelia-framework';

@inject(Editorapi)
export class AttributeBind2aDialog extends AttributeDialog {
  @observable adobeobj;
  @observable animationvalue;
  constructor(api) {
    super(api);
  }

  attached() {
    console.log('AttributeAdobeDialog attached() api.outputreferences', this.api.outputreferences);
    //this.adobesrc = this.api.askAttributesItemsArray[0].value;
    //console.log('adobesrc', this.adobesrc);
  }

  detached() {
    this.api.stopblink();
  }

  activate(model) {
    console.log('AttributeBind2a activate() api.outputreferences', this.api.outputreferences);
    //this.adobesrc = this.api.askAttributesItemsArray[0].value;
    //console.log('adobesrc',this.adobesrc)
    this.api.discoverAdobeAnimate(); //discovers all objects
  }

  adobeobjChanged(newvalue) {
    //console.log('adobesrc changed:', newvalue);
    this.api.askAttributesItemsArray[1].value = newvalue;
    //objectname = file name without extension
    //let objectname = newvalue.split('.').slice(0, -1).join('.');
    //this.api.askAttributesItemsArray[3].value = objectname;
    this.api.blink(newvalue);
  }

  submit() {
    this.api.stopblink();
    super.submit();
  }

  cancel() {
    this.api.stopblink();
    super.cancel();
  }

  animationvalueChanged(newvalue) {
    this.api.startblink();
    this.api.setAnimationValue(this.adobeobj, newvalue, true, true, false);
  }
}
