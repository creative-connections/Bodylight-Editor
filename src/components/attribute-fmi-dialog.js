import {Editorapi} from './editorapi';
import {inject} from 'aurelia-framework';
import {AttributeDialog} from './attribute-dialog';
import {bindable} from 'aurelia-templating';

//import {observable} from 'aurelia-framework';
@inject(Editorapi)
export class AttributeFmiDialog extends AttributeDialog {
  @bindable src;
  showfmiinput=true;
  showfmicontrol=false;

  constructor(api) {
    super(api);
    //this.api=api;
    this.handleInitDialog = e => {
      this.initializeDialog();
    };
  }

  //issue when it is already attached and identify button is pressed.
  attached() {
    this.initializeDialog();
    document.addEventListener('fmidialoginit', this.handleInitDialog);
  }

  detached() {
    document.removeEventListener('fmidialoginit', this.handleInitDialog);
  }

  initializeDialog(){
    //convert askattributes to struct
    this.attrstr = {};//this.api.askAttributesItemsArray
    for (let item of this.api.askAttributesItemsArray) this.attrstr[item.title] = item.value;
    console.log('attributefmidialog attached() attrstr:', this.attrstr);
    this.attr = {
      id: this.attrstr.id ? this.attrstr.id : 'idfmi',
      mode: this.attrstr.mode ? this.attrstr.mode : '',
      src: this.attrstr.src ? this.attrstr.src : this.api.currentfmientry.src,
      fminame: this.attrstr.fminame ? this.attrstr.fminame : this.api.currentfmientry.fminame,
      tolerance: this.attrstr.tolerance ? this.attrstr.tolerance : '0.000001',
      starttime: this.attrstr.starttime ? this.attrstr.starttime : '0',
      fstepsize: this.attrstr.fstepsize ? this.attrstr.fstepsize : '0.01',
      fpslimit: this.attrstr.fpslimit ? this.attrstr.fpslimit : '60',
      guid: this.attrstr.guid ? this.attrstr.guid : this.api.currentfmientry.guid,
      valuereferences: this.attrstr.valuereferences ? this.attrstr.valuereferences : '',
      valuelabels: this.attrstr.valuelabels ? this.attrstr.valuelabels : '',
      inputs: this.attrstr.inputs ? this.attrstr.inputs : '',
      inputlabels: this.attrstr.inputlabels ? this.attrstr.inputlabels : ''
    };
    //console.log('attributefmidialog attached src:', this.src);
    //fill input references
    this.outputreferences = [];
    if (this.attr.valuereferences) {
      let refs = this.attr.valuereferences.split(',');
      let labels = this.attr.valuelabels.split(',');
      for (let i = 0; i < refs.length; i++) {
        this.outputreferences.push({
          reference: refs[i],
          name: labels.length > i ? labels[i] : ''
        });
      }
    }
    //keep link to outputreferences
    this.api.outputreferences = this.outputreferences;
    //fill output references
    this.inputreferences = [];
    if (this.attr.inputs) {
      let refs = this.attr.inputs.split(';');
      let labels = this.attr.inputlabels.split(',');
      for (let i = 0; i < refs.length; i++) {
        let refitem = refs[i].split(',');
        this.inputreferences.push({
          id: refitem[0],
          reference: refitem[1],
          name: labels[i],
          numerator: refitem[2],
          denominator: refitem[3],
          addend: refitem[4] ? refitem[4] : 0,
          fixed: refitem[5] ? refitem[5] : ''
        });
      }
    }
    //if (this.attrstr.src) this.api.update
    if (!this.api.currentfmientry || (! this.api.currentfmientry.modelvariables || (this.api.currentfmientry.modelvariables.length === 0)))  this.api.updateFMIVariableList();
    this.api.updateCurrentFmiEntry(this.attr.src);
  }

  activate() {
  }

  bind() {
    console.log('attributefmidialog bind src:', this.src);
    if (this.attr) this.attr.src = this.src;
  }

  srcChanged() {
    console.log('attributefmidialog changed src:', this.src);
    if (this.attr) this.attr.src = this.src;
    this.refreshsrc();
  }

  //check inputs and outputs by name and ref, if referenece number is changed then update, if reference number is missing, then report
  updatevariables(){
    console.log('updatevariables() outputs', this.outputreferences);
    let updated = "";
    for (let myoutput of this.outputreferences) {
      let fmivariable = this.api.currentfmientry.modelvariables.find(x => x.name === myoutput.name);
      if (fmivariable) {
        if (fmivariable.reference != myoutput.reference) {
          updated+= "update from "+myoutput.reference+" to "+fmivariable.reference+"\n";
          myoutput.reference = fmivariable.reference;

        }
      } else {
        //not found, probably deleted
        updated+= " variable not found, probably deleted. "+myoutput.name+"\n";
      }
    }
    //this.api.currentfmientry.modelvariables.
    console.log('updatevariables() inputs', this.inputreferences);
    for (let myoutput of this.inputreferences) {
      let fmivariable = this.api.currentfmientry.modelvariables.find(x => x.name === myoutput.name);
      if (fmivariable) {
        if (fmivariable.reference != myoutput.reference) {
          updated+= "update from "+myoutput.reference+" to "+fmivariable.reference+"\n";
          myoutput.reference = fmivariable.reference;

        }
      } else {
        //not found, probably deleted
        updated+= " variable not found, probably deleted. "+myoutput.name+"\n";
      }
    }
    alert('FMU variables updated:\n'+updated);
  }

  refreshsrc() {
    console.log('refreshsrc', this.attr.src);
    //updates fmi entry based on selected src
    this.api.updateCurrentFmiEntry(this.attr.src);
    //this.api.updateFMIVariableList();
    //this.attr.src: this.attrstr.src ? this.attrstr.src : this.api.currentfmientry.src,
    //this is async so set timeout of it
    setTimeout(() => {
      this.attr.fminame = this.api.currentfmientry.fminame;
      this.attr.tolerance = '0.000001';
      this.attr.starttime = '0';
      this.attr.fstepsize =  '0.01';
      this.attr.guid = this.api.currentfmientry.guid;
    },2000)

    //TODO do not delete reference list?
    /*this.attr.valuereferences = '';
    this.attr.valuelabels = '';
    this.attr.inputs = '';
    this.attr.inputlabels = '';
    this.inputreferences = [];
    this.outputreferences = [];*/
  }

  submit() {
    //convert this.api.references to comma separated ref numbers
    //api references were filled by the dialog
    let valuereferences = this.outputreferences.map(ref => ref.reference).join(',');
    let valuelabels = this.outputreferences.map(ref => ref.name).join(','); //name should not contain comma
    let inputs = this.inputreferences.map(ref => {
      const addend = ref.addend ? (',' + ref.addend) : '';
      const fixed = ref.fixed ? (',' + ref.fixed) : '';
      return ref.id + ',' + ref.reference + ',' + ref.numerator + ',' + ref.denominator + addend + fixed;
    }
    ).join(';');
    let inputlabels = this.inputreferences.map(ref => ref.name).join(',');
    //console.log('submit() references:', valuereferences);
    this.attr.valuereferences = valuereferences;
    this.attr.valuelabels = valuelabels;
    this.attr.inputs = inputs;
    this.attr.inputlabels = inputlabels;
    //insert script of the fmi model into DOM, so editor preview can simulate it
    this.api.submitattr1 = 'bdl-fmi';
    this.api.submitattr2 = this.attr;
    //load script content and insert it into current DOM so it can be interpretted and previewed
    //REFACTORED - loaddoccontent moved to PROJECT - calling only submitattr
    this.api.submitattr('bdl-fmi', this.attr);
    //keep link to outputreferences in singleton api
    this.api.outputreferences = this.outputreferences;
  }


  showhidefmicontrol() {
    this.showfmicontrol = ! this.showfmicontrol;
  }

  showhidefmiinput() {
    this.showfmiinput = ! this.showfmiinput;
  }
}
