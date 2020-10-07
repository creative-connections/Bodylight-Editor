import {Editorapi} from './editorapi';
import {inject} from 'aurelia-framework';

@inject(Editorapi)
export class Referencearray {
  constructor(api) {
    this.api = api;
    this.references = [];
  }
  getSuggestions(value) {
    let suggestion = this.api.currentfmientry.modelvariables.filter(variable => variable.name.includes(value)).map(v => {return v.reference+'-'+v.name });
    console.log('referencesarray suggestion:', suggestion);
    return suggestion;
    /*
    return this.api.getSuggestions(value)
      .then(data =>{
        return data;
      })
      .catch(error =>{
        return [];
      });

     */
  }
  add() {
    let newvalue = this.goodautocomplete.getRawValue();
    console.log('referencearray newvalue:', newvalue);
    this.references.push({reference: newvalue, name: newvalue});
  }
  remove(item){
    let i = this.references.indexOf(item);
    this.references.splice(i, 1);
  }
}
