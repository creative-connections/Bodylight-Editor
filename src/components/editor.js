import {EventAggregator} from 'aurelia-event-aggregator';
import {Editorapi} from './editorapi';
import {inject} from 'aurelia-framework';

@inject(EventAggregator, Editorapi)
export class Editor {
  constructor(ea, api) {
    this.ea = ea;
    this.api = api;
  }

  attached() {
    this.api.initAceEditor('editorref');
  }

  preview() {
    this.api.renderchange(this.api);
    this.api.editor.focus();
  }
}
