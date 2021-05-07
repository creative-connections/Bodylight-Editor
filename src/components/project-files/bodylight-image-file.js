import {BodylightFileStrategy} from './bodylight-file-strategy';
import {FTYPE} from './bodylight-struct';

export class BodylightImageFile extends BodylightFileStrategy {
  activate(file, newcontent) {
    super.activate(file, newcontent);
    //opening other file will open only dialog
    window.editorapi.askFile = true;
    window.editorapi.askFileRef = file;
    window.editorapi.askFileItems = [{title: 'File Type', value: file.type.name, options: [FTYPE.IMAGE]}];
    //set content to be the adobe animate file
    //objectname = file name without extension
    let objectname = file.name.split('.').slice(0, -1).join('.');
    let content = '# Preview of ' + file.name + '\n\n![' + objectname + '](' + file.name + ')';
    window.editorapi.renderchange(window.editorapi, content);//sendContentUpdate(content);
    //preview mode
    window.editorapi.previewmode = true;
  }

  deactivate(file) {
    super.deactivate(file);
    window.editorapi.previewmode = false;
  }
}
