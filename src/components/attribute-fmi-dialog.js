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
    this.attr = {
      id: 'id' + this.api.idindex, src: this.api.currentfmientry.src,
      fminame: this.api.currentfmientry.fminame,
      tolerance: '0.000001', starttime: '0', guid: this.api.currentfmientry.guid,
      valuereferences: '637534281,637534272,33554436, 33554437, 33554432, 33554436, 33554437, 33554433, 16777313',
      valuelabels: 'Pressure in Aorta,Pressure in Left Ventricle, Intrathoracic Artery Volume, Extrathoracic Arteries Volume, Pulmonary Arteries Volume, Intrathoracic Veins Volume, Extrathoracic Veins volume, Pulmonary Veins Volume,Heart Rate',
      inputs: 'id1,16777313,1,60',
      inputlabels: 'heart rate'
    };
    console.log('attributefmidialog attached src:', this.src);
    this.inputreferences = [];
    this.outputreferences = [];
  }

  activate() {
    console.log('attributefmidialog activated src:', this.src);
    this.sources = ['MeursFMI2.js', 'BurkhoffFMI.js', 'IronMetabolism.js'];
  }

  bind() {
    console.log('attributefmidialog bind src:', this.src);
    if (this.attr) this.attr.src = this.src;
  }

  srcChanged() {
    console.log('attributefmidialog changed src:', this.src);
    if (this.attr) this.attr.src = this.src;
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
    this.api.bs.loadDocContent(this.attr.src)
      .then(blob => blob.text())
      .then(txtvalue => {
        //console.log('content of script "' + this.attr.src + '" is:', txtvalue);
        //insert script into current window context - so it can be previewed
        window.apicallback = this.api.submitattr;
        this.insertScript(txtvalue);
        this.api.submitattr('bdl-fmi', this.attr);
      });
    //now call inherited method to convert attr to xml
  }

  //get script element and registers 'onload' callback to be called when the script is loaded
  insertScript(txt, callback) {
    console.log('insertscript');
    let script = document.createElement('script');
    let prior = document.getElementsByTagName('script')[0];
    script.async = 1;
    /*
    script.onload = script.onreadystatechange = function( _, isAbort ) {
      if (isAbort || !script.readyState || /loaded|complete/.test(script.readyState) ) {
        script.onload = script.onreadystatechange = null;
        script = undefined;
        console.log('script inserted, onload ...');

        if (!isAbort && callback) {
          console.log('script inserted, calling callback');
          setTimeout(callback, 0);
        }
      }
    };
*/
    let inlinescript = document.createTextNode(txt);
    script.appendChild(inlinescript);
    prior.parentNode.insertBefore(script, prior);
  }

  showhidefmicontrol() {
    this.showfmicontrol = ! this.showfmicontrol;
  }

  showhidefmiinput() {
    this.showfmiinput = ! this.showfmiinput;
  }
}
