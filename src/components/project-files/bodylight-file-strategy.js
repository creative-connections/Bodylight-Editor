export class BodylightFileStrategy {
  constructor() {
    //this.api = api;
  }
  /**
   * Loads file and returns it's content
   * @returns {Promise<any | void>}
   */
  loadFile(file) {
    //opening md file
    if (window.editorapi) {
      return window.editorapi.bs.loadDocContent(file.name)
        .then(content =>{
          return content;
        })
        .catch(err=>{console.log('project open file error', err); return err;});
    }
    //TODO fail when window.editorapi is not available
  }

  /**
   * Activates the file by setting it's value to true and set editor content
   */
  activate(file, content) {
    file.active = true;
  }

  deactivate(file) {
    file.active = false;
  }

  renderlink(file) {
    if (window.editorapi) {
      window.editorapi.editor.insert('[' + file.name.split('.').slice(0, -1).join('.') + '](' + file.name + ')\n');
      window.editorapi.editor.focus();
    }
  }

  saveChanges(file) {
  }
}
