import {Editorapi} from './editorapi';
import {inject} from 'aurelia-framework';
import {bindable} from 'aurelia-templating';

@inject(Editorapi)
export class Referencearray {
  @bindable value;
  @bindable askids;
  @bindable title;
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
    if (this.askids) { //will filter all tunable - for inputs, (added) OR fixed - for tunning fixed parameters by stop/reinit/start
      suggestion = this.api.currentfmientry.modelvariables.filter(variable => (variable.name.includes(value) && (variable.tunable || variable.fixed)))
        .map(v => {return v.reference + '-' + (v.tunable ? 't' : 'f') + '-' + v.name; });
    } else { //will filter all variable - for outputs
      suggestion = this.api.currentfmientry.modelvariables.filter(variable => variable.name.includes(value)).map(v => {
        return v.reference + '-o-' + v.name; //add -o- signature compatible with askids === input references
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
    let signatures = newvalue.split('-', 2);
    let reference = signatures[0];
    let fixed = signatures[1]; //f for fixed, t for tunable, o for output
    let name = newvalue.slice(reference.length + 3); //+1 for '-' +1 for 't' or 'f' and +1 for '-'
    console.log('referencearray newvalue:', newvalue);
    if (!this.value) this.value = [];
    if (this.askids) this.value.push({reference: reference, name: name, id: this.inputid, numerator: this.numerator, denominator: this.denominator, addend: this.addend, fixed: fixed});
    else this.value.push({reference: reference, name: name});
    this.goodautocomplete._value = '';
  }

  removeReference(item) {
    let i = this.value.indexOf(item);
    this.value.splice(i, 1);
  }
}
