import {inject} from 'aurelia-framework';
import {Editorapi} from './components/editorapi';
import {version} from '../package.json';

@inject(Editorapi)
export class Editorapp {
  constructor(api) {
    this.api = api;
    this.version = version;
  }
}
