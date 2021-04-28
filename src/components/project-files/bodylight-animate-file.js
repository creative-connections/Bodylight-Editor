import {BodylightFileStrategy} from './bodylight-file-strategy';
import {FTYPE} from './bodylight-struct';

export class BodylightAnimateFile extends BodylightFileStrategy {
  activate(file, newcontent) {
    super.activate(file, newcontent);
    //opening other file will open only dialog
    window.editorapi.askFile = true;
    window.editorapi.askFileRef = file;
    window.editorapi.askFileItems = [{title: 'File Type', value: file.type.name, options: [FTYPE.MODELFILE, FTYPE.ADOBEANIMATE, FTYPE.OTHERJS]}];
    //set content to be the adobe animate file
    //objectname = file name without extension
    let objectname = file.name.split('.').slice(0, -1).join('.');
    let content = '<animate-adobe src="' + file.name + '" width="800" height="600" name="' + objectname + '" fromid="idfmi"></animate-adobe>';
    window.editorapi.sendContentUpdate(content);
    //preview mode
    window.editorapi.previewmode = true;
    //call resize on Adobe Animate - after 0.5s
    if (window.ani) {
      setTimeout(function() {window.ani.handleResize();  }, 500);
    }
  }

  deactivate(file) {
    super.deactivate(file);
    window.editorapi.previewmode = false;
    //call resize on Adobe Animate - after 0.5s
    if (window.ani) {
      setTimeout(function() {window.ani.handleResize();}, 500);
    }
  }
}
