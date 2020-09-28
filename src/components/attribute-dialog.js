import {Editorapi} from './editorapi';
import {inject} from 'aurelia-framework';

@inject(Editorapi)
export class AttributeDialog {
  constructor(api) {
    this.api = api;
  }
  attached() {
    //test1
    this.api.askAttributes = false;
    this.api.attrDialog = this.attrdialog; //reference in view
    this.api.askAttributesItem = {
      name: 'bdl-range',
      doc: 'range.md',
      def: '<bdl-range min="0" max="10" default="5" step="1"></bdl-range>'
    };
    this.api.askAttributesItemsArray = [{title: 'min', value: 10}, {title: 'max', value: 100}, {title: 'default', value: 10}, {title: 'step', value: 1}];
  }

  submit() {
    this.api.submit();
  }
}
