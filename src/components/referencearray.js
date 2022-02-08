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
  addend = 0;
  inputid='id1'
  inputidindex=1;
  @bindable showreferences = true;
  constructor(api) {
    this.api = api;
  //  this.references = [];
    //this.value ---
  }

  attached() {
    //this.value = []; set by parent
    //set askids to boolean
    if (this.askids) this.askids = (this.askids === 'true');
    if (typeof this.showreferences === 'string') this.showreferences = (this.showreferences === 'true');
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
    return suggestion;
  }


  /**
   * Adds reference into this.value
   */
  addSingleReference(newvalue) {
    let signatures = newvalue.split('-', 2);
    let reference = signatures[0];
    let fixed = signatures[1]; //f for fixed, t for tunable, o for output
    let name = newvalue.slice(reference.length + 3); //+1 for '-' +1 for 't' or 'f' and +1 for '-'
    console.log('referencearray newvalue:', newvalue);
    //find existing reference
    if (!this.value) this.value = [];
    let myreference = this.value.find(x=>x.name === name);
    if (myreference) {
      //do not push existing reference, return it
      //console.log('reference exists:',myreference);
      alert('Reference already exists, returning index:'+myreference.index+' '+myreference.name);
    } else {
      if (this.askids) myreference = this.value.push({
        reference: reference,
        name: name,
        id: this.inputid,
        numerator: this.numerator,
        denominator: this.denominator,
        addend: this.addend,
        fixed: fixed
      });
      else {
        //check if reference already in the array
        myreference = this.value.push({reference: reference, name: name});
      }
    }
    //sent event
    let event = new CustomEvent('fmiaddreference', {detail: {id: 'components',reference:myreference}});
    document.dispatchEvent(event);
  }

  /**
   * add either single reference or multiple references if array tag [] is in variable name
   */
  addReference() {
    let newvalue = this.goodautocomplete.getRawValue();
    this.goodautocomplete._value = '';
    //handle if the reference is array
    if (!this.askids && newvalue.endsWith(']') && (newvalue.lastIndexOf('[')>0)) {
      if (confirm('Variable ' + newvalue + ' is array member. Add all members of this array?')) {
        //adding all array members
        //get suggestions begining with the array member
        let suggestions = this.getSuggestions(newvalue.slice(newvalue.indexOf('-') + 3, newvalue.lastIndexOf('[') + 1)); //name[
        for (let variable of suggestions) this.addSingleReference(variable);
        //add reference of all suggestion
      } else {
        this.addSingleReference(newvalue);
      }
    } else {
      this.addSingleReference(newvalue);
    }
    //get the number in id
    if (this.askids) {
      let id = parseInt(this.inputid.slice(2), 10);
      this.inputidindex = isNaN(id) ? 0 : id;
      //next id will be with number +1
      this.inputid = 'id' + (++this.inputidindex);
    }
  }

  removeReference(item) {
    let i = this.value.indexOf(item);
    this.value.splice(i, 1);
  }

  removeReferenceIndex(i) {
    //let i = this.value.indexOf(item);
    this.value.splice(i, 1);
  }
}
