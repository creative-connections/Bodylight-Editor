export class BodylightFileStrategy {

  constructor(api){
    this.api = api;
  }
  /**
   * Loads file and returns it's content
   * @returns {Promise<any | void>}
   */
  loadFile(file) {
    //opening md file
    return this.api.bs.loadDocContent(file.name)
      .then(content =>{
        return content;
      })
      .catch(err=>{console.log('project open file error', err); return err;});
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
}
