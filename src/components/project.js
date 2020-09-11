import {localforage} from "localforage";
export class Project {
  constructor(){

  }
  attached(){
    localforage.getItem('bodylight-projects')
      .then(projects =>{
        this.projects=projects;
      })
      .catch(error=>{
        console.log('Projects localforage:',error);
      })
  }
  newSinglePageProject(){
    const projlen = this.projects? this.projects.length:0;
    let name = prompt('Project name :', 'WebApplication'+projlen);
    this.projects.push({name:name,type:'single'})
  }
  newMultiPageProject(){
    const projlen = this.projects? this.projects.length:0;
    let name = prompt('Project name :', 'WebApplication'+projlen);
    this.projects.push({name:name,type:'multi'})
  }
  
  exportAsZip(){}
}
