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
  }

  attached() {
    //convert askattributes to struct
    this.attrstr = {};//this.api.askAttributesItemsArray
    for (let item of this.api.askAttributesItemsArray) this.attrstr[item.title] = item.value;
    this.attr = {
      id: this.attrstr.id ? this.attrstr.id : 'idfmi',
      src: this.attrstr.src ? this.attrstr.src : this.api.currentfmientry.src,
      fminame: this.attrstr.fminame ? this.attrstr.fminame : this.api.currentfmientry.fminame,
      tolerance: this.attrstr.tolerance ? this.attrstr.tolerance : '0.000001',
      starttime: this.attrstr.starttime ? this.attrstr.starttime : '0',
      fstepsize: this.attrstr.fstepsize ? this.attrstr.fstepsize : '0.01',
      guid: this.attrstr.guid ? this.attrstr.guid : this.api.currentfmientry.guid,
      valuereferences: this.attrstr.valuereferences ? this.attrstr.valuereferences : '',
      valuelabels: this.attrstr.valuelabels ? this.attrstr.valuelabels : '',
      inputs: this.attrstr.inputs ? this.attrstr.inputs : '',
      inputlabels: this.attrstr.inputlabels ? this.attrstr.inputlabels : ''
    };
    console.log('attributefmidialog attached src:', this.src);
    //fill input references
    this.inputreferences = [];
    let refs = this.attr.valuereferences.split(',');
    let labels = this.attr.valuelabels.split(',');
    for (let i = 0; i < refs.length; i++) this.inputreferences.push({reference: refs[i], name: labels.length > i ? labels[i] : ''});
    //fill output references
    this.outputreferences = [];
    refs = this.attr.inputs.split(';');
    labels = this.attr.inputlabels.split(',');
    for (let i = 0; i < refs.length; i++) {
      let refitem = refs[i].split(',');
      this.outputreferences.push({id: refitem[0], reference: refitem[1], name: labels[i], numerator: refitem[2], denominator: refitem[3]});
    }
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
  }

  refreshsrc() {
    console.log('refreshsrc', this.attr.src);
    this.api.updateCurrentFmiEntry(this.attr.src);
    //this.attr.src: this.attrstr.src ? this.attrstr.src : this.api.currentfmientry.src,
    this.attr.fminame = this.api.currentfmientry.fminame;
    this.attr.tolerance = '0.000001';
    this.attr.starttime = '0';
    this.attr.fstepsize =  '0.01';
    this.attr.guid = this.api.currentfmientry.guid;
    this.attr.valuereferences = '';
    this.attr.valuelabels = '';
    this.attr.inputs = '';
    this.attr.inputlabels = '';
    this.inputreferences = [];
    this.outputreferences = [];
  }

  submit() {
    //convert this.api.references to comma separated ref numbers
    //api references were filled by the dialog
    let valuereferences = this.outputreferences.map(ref => ref.reference).join(',');
    let valuelabels = this.outputreferences.map(ref => ref.name).join(','); //name should not contain comma
    let inputs = this.inputreferences.map(ref => ref.id + ',' + ref.reference + ',' + ref.numerator + ',' + ref.denominator).join(';');
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
  }


  showhidefmicontrol() {
    this.showfmicontrol = ! this.showfmicontrol;
  }

  showhidefmiinput() {
    this.showfmiinput = ! this.showfmiinput;
  }
}
