import {Editorapi} from './editorapi';
import {inject} from 'aurelia-framework';

@inject(Editorapi)
export class FileDialog {
  constructor(api) {
    this.api = api;
  }

  submit() {

  }
  cancel() {

  }
}
