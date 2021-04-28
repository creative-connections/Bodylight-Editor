import {Editorapi} from './editorapi';
import {EventAggregator} from 'aurelia-event-aggregator';
import {inject} from 'aurelia-framework';

@inject(Editorapi, EventAggregator)
export class FileDialog {
  constructor(api, ea) {
    this.api = api;
    this.ea = ea;
  }

  update() {
    this.ea.publish('file-dialog', this.api.askFileItems);
    this.api.askFile = false;
  }
  cancel() {
    this.api.askFile = false;
  }
  blink(obj) {
    this.api.blink(obj);
  }

  refresh() {
    this.api.discoverAdobeAnimate();
  }
}
