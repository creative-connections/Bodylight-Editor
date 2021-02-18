import {AttributeBind2aDialog} from './attribute-bind2a-dialog';
import {Editorapi} from './editorapi';
import {inject} from 'aurelia-framework';
//import {observable} from 'aurelia-framework';

@inject(Editorapi)
export class AttributeBind2aTextDialog extends AttributeBind2aDialog {
  constructor(api) {
    super(api);
  }
}
