import {BodylightFileStrategy} from './bodylight-file-strategy';
import './bodylight-struct';
import {FTYPE} from './bodylight-struct';

export class BodylightJsFile extends BodylightFileStrategy {


  activate(file, content) {
    super.activate(file, content);
  }
  deactivate(file) {
    file.active = false;
  }
}
