import {Editorapi} from './editorapi';
import {inject} from 'aurelia-framework';

@inject(Editorapi)
export class AttributeDialog {
  constructor(api) {
    this.api = api;
  }

  attached(){
    //console.log('attributedialog attached() api, api.outputreferences', this.api, this.api.outputreferences);
  }

  activate(){
    //console.log('attributedialog activated() api, api.outputreferences', this.api, this.api.outputreferences);
  }

  submit() {
    this.api.submit();
  }

  cancel() {
    this.api.askAttributes = false;
    this.api.editor.focus();
  }
}
