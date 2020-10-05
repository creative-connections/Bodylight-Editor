//import {BodylightFile} from './bodylight-file';
import {BodylightFileStrategy} from './bodylight-file-strategy';
import './bodylight-struct';

export class BodylightMdFile extends BodylightFileStrategy {

  loadFile(file) {
    return super.loadFile(file)
      .then(content =>{
        if (content) this.api.editor.setValue(content);
        else this.api.editor.setValue('');
        return content;
      });
  }

  activate(file, newcontent) {
    super.activate(file, newcontent);

    if (newcontent) {
      this.api.editor.setValue(newcontent);
      this.api.editor.focus();
    } else {
      //opening md file
      this.api.bs.loadDocContent(file.name)
        .then(content =>{
          //if (content)
          //console.log('content of the file ' + this.currentfile.name, content);
          if (content) this.api.editor.setValue(content);
          else this.api.editor.setValue('');
          this.api.editor.focus();
        })
        .catch(err=>console.log('project open file error', err));
    }
  }

  deactivate(file) {
    super.deactivate(file);
    this.api.bs.saveDocContent(file.name, this.api.editor.getValue());
  }
}
