//import {BodylightFile} from './bodylight-file';
import {BodylightFileStrategy} from './bodylight-file-strategy';
import {FTYPE} from './bodylight-struct';

export class BodylightModelFile extends BodylightFileStrategy {
  activate(file, newcontent) {
    super.activate(file, newcontent);
    //opening other file will open only dialog
    this.api.askFile = true;
    this.api.askFileRef = this;
    this.api.askFileItems = [{title: 'File Type', value: file.type.name, options: [FTYPE.MODELFILE, FTYPE.ADOBEANIMATE, FTYPE.OTHERJS]}];
  }

  deactivate(file) {
    super.deactivate(file);
  }
}
