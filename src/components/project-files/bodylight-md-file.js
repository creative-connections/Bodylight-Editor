//import {BodylightFile} from './bodylight-file';
import {BodylightFileStrategy} from './bodylight-file-strategy';
import './bodylight-struct';

export class BodylightMdFile extends BodylightFileStrategy {
  loadFile(file) {
    return super.loadFile(file)
      .then(content =>{
        if (content) window.editorapi.editor.setValue(content);
        else window.editorapi.editor.setValue('');
        return content;
      });
  }

  activate(file, newcontent) {
    super.activate(file, newcontent);

    if (newcontent) {
      let blob = new Blob([newcontent], {
        type: 'text/plain'
      });
      window.editorapi.bs.saveBlobContent(file.name, blob)
        .then(result => {
          console.log('result saving blob', result);
          //this.uploaddialog = false;
        })
        .catch(error => {
          console.log('error saving blob', error);
          //this.uploaddialog = false;
        });
      window.editorapi.editor.setValue(newcontent, 1);
      window.editorapi.editor.focus();
    } else {
      //opening md file
      window.editorapi.bs.loadDocContent(file.name)
        .then(content =>{
          //if (content)
          //console.log('content of the file ' + file.name, content);
          if (content) {
            //set editor value - 1 cursor at the end
            if (typeof(content) === 'string') window.editorapi.editor.setValue(content, 1);
            if (content instanceof Blob) {
              //read content of blob
              const reader = new FileReader();
              reader.addEventListener('loadend', () => {
                // reader.result contains the contents of blob as a typed array
                //set editor value - 1 cursor at the end
                window.editorapi.editor.setValue(reader.result, 1);
              });
              reader.readAsText(content);
            }
          } else window.editorapi.editor.setValue('');
          window.editorapi.editor.focus();
        })
        .catch(err=>console.log('project open file error', err));
    }
  }

  deactivate(file) {
    super.deactivate(file);
    this.saveChanges(file);
  }

  saveChanges(file) {
    window.editorapi.bs.saveDocContent(file.name, window.editorapi.editor.getValue());
  }
}
