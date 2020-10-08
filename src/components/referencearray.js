import {Editorapi} from './editorapi';
import {inject} from 'aurelia-framework';
import {bindable} from 'aurelia-templating';

@inject(Editorapi)
export class Referencearray {
  @bindable value;
  @bindable askids;
  numerator = 1;
  denominator = 1;
  inputid='id1'
  constructor(api) {
    this.api = api;
  //  this.references = [];
    //this.value ---
  }

  attached() {
    //this.value = []; set by parent
    //set askids to boolean
    if (this.askids) this.askids = (this.askids === 'true');
  }

  /**
   * generates suggestion based on value - part of name, find all names which includes the value
   * @param value
   * @returns {string[]} in form 'referencenumber-variablename'
   */
  getSuggestions(value) {
    let suggestion;
    if (this.askids) { //will filter all tunable - for inputs
      suggestion = this.api.currentfmientry.modelvariables.filter(variable => (variable.name.includes(value) && variable.tunable)).map(v => {return v.reference + '-' + v.name; });
    } else { //will filter all variable - for outputs
      suggestion = this.api.currentfmientry.modelvariables.filter(variable => variable.name.includes(value)).map(v => {
        return v.reference + '-' + v.name;
      });
    }
    //console.log('this.api.currentfminetry.modelvariables', this.api.currentfmientry.modelvariables);
    //console.log('referencesarray suggestion:', suggestion);
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

  /**
   * Adds reference into this value
   */
  addReference() {
    let newvalue = this.goodautocomplete.getRawValue();
    let reference = newvalue.split('-', 1)[0];
    let name = newvalue.slice(reference.length + 1);
    console.log('referencearray newvalue:', newvalue);
    if (!this.value) this.value = [];
    if (this.askids) this.value.push({reference: reference, name: name, id: this.inputid, numerator: this.numerator, denominator: this.denominator});
    else this.value.push({reference: reference, name: name});
  }
  removeReference(item) {
    let i = this.value.indexOf(item);
    this.value.splice(i, 1);
  }
}
