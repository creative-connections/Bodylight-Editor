import {Editorapi} from './editorapi';
import {inject} from 'aurelia-framework';

@inject(Editorapi)
export class AttributeDialog {
  constructor(api) {
    this.api = api;
  }

  attached(){
    console.log('attributedialog attached() api item [0]', this.api.askAttributesItemsArray[0].title,this.api.askAttributesItemsArray[0].value);
    
  }

  activate(){
    //console.log('attributedialog activated() api items', this.api.askAttributesItemsArray);
  }

  submit() {
    this.api.submit();
  }

  cancel() {
    this.api.askAttributes = false;
    this.api.editor.focus();
  }
}
