//import {BodylightFile} from './bodylight-file';
import {BodylightFileStrategy} from './bodylight-file-strategy';
import './bodylight-struct';

export class BodylightMdFile extends BodylightFileStrategy {
  loadFile(file) {
    return super.loadFile(file)
      .then(content =>{
        if (content) file.api.editor.setValue(content);
        else file.api.editor.setValue('');
        return content;
      });
  }

  activate(file, newcontent) {
    super.activate(file, newcontent);

    if (newcontent) {
      let blob = new Blob([newcontent], {
        type: 'text/plain'
      });
      file.api.bs.saveBlobContent(file.name, blob)
        .then(result => {
          console.log('result saving blob', result);
          //this.uploaddialog = false;
        })
        .catch(error => {
          console.log('error saving blob', error);
          //this.uploaddialog = false;
        });
      file.api.editor.setValue(newcontent, 1);
      file.api.editor.focus();
    } else {
      //opening md file
      file.api.bs.loadDocContent(file.name)
        .then(content =>{
          //if (content)
          //console.log('content of the file ' + file.name, content);
          if (content) {
            //set editor value - 1 cursor at the end
            if (typeof(content) === 'string') file.api.editor.setValue(content, 1);
            if (content instanceof Blob) {
              //read content of blob
              const reader = new FileReader();
              reader.addEventListener('loadend', () => {
                // reader.result contains the contents of blob as a typed array
                //set editor value - 1 cursor at the end
                file.api.editor.setValue(reader.result, 1);
              });
              reader.readAsText(content);
            }
          } else file.api.editor.setValue('');
          file.api.editor.focus();
        })
        .catch(err=>console.log('project open file error', err));
    }
  }

  deactivate(file) {
    super.deactivate(file);
    file.api.bs.saveDocContent(file.name, file.api.editor.getValue());
  }
}
