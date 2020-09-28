import {Editorapi} from './editorapi';
import {inject} from 'aurelia-framework';

@inject(Editorapi)
export class AttributeDialog {
  constructor(api) {
    this.api = api;
  }

  submit() {
    this.api.submit();
  }

  cancel() {
    this.api.askAttributes = false;
    this.api.editor.focus();
  }
}
