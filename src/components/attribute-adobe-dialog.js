import {AttributeDialog} from './attribute-dialog';
import {Editorapi} from './editorapi';
import {inject} from 'aurelia-framework';
import {observable} from 'aurelia-framework';

@inject(Editorapi)
export class AttributeAdobeDialog extends AttributeDialog {
  @observable adobesrc;


  constructor(api) {
    super(api);
  }

  attached() {
    //console.log('AttributeAdobeDialog attached()');
    this.adobesrc = this.api.askAttributesItemsArray[0].value;
    //console.log('adobesrc', this.adobesrc);
  }

  activate(model) {
    //console.log('AttributeAdobeDialog activate()');
    this.adobesrc = this.api.askAttributesItemsArray[0].value;
    //console.log('adobesrc',this.adobesrc)
  }

  adobesrcChanged(newvalue) {
    //console.log('adobesrc changed:', newvalue);
    this.api.askAttributesItemsArray[0].value = newvalue;
    //objectname = file name without extension
    let objectname = newvalue.split('.').slice(0, -1).join('.');
    this.api.askAttributesItemsArray[3].value = objectname;
  }


}
