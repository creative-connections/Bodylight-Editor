import {AttributeDialog} from './attribute-dialog';
import {Editorapi} from './editorapi';
import {inject} from 'aurelia-framework';
import {observable} from 'aurelia-framework';

@inject(Editorapi)
export class AttributeBind2aDialog extends AttributeDialog {
  @observable adobeobj;

  constructor(api) {
    super(api);
  }

  attached() {
    //console.log('AttributeAdobeDialog attached()');
    //this.adobesrc = this.api.askAttributesItemsArray[0].value;
    //console.log('adobesrc', this.adobesrc);
  }

  detached() {
    this.api.stopblink();
  }

  activate(model) {
    console.log('AttributeBind2a activate()');
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
}
