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
      let blob = new Blob([newcontent], {
        type: 'text/plain'
      });
      this.api.bs.saveBlobContent(file.name, blob)
        .then(result => {
          console.log('result saving blob', result);
          //this.uploaddialog = false;
        })
        .catch(error => {
          console.log('error saving blob', error);
          //this.uploaddialog = false;
        });
      this.api.editor.setValue(newcontent);
      this.api.editor.focus();
    } else {
      //opening md file
      this.api.bs.loadDocContent(file.name)
        .then(content =>{
          //if (content)
          console.log('content of the file ' + file.name, content);
          if (content)
          {
            if (typeof(content) === 'string') this.api.editor.setValue(content);
            if (content instanceof Blob){
              //read content of blob
              const reader = new FileReader();
              reader.addEventListener('loadend', () => {
                // reader.result contains the contents of blob as a typed array
                this.api.editor.setValue(reader.result);
              });
              reader.readAsText(content);
            }
          }
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
