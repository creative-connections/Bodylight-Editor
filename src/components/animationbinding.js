import {Editorapi} from './editorapi';
import {inject,observable} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {WarnMessage} from './messages';

@inject(Editorapi,EventAggregator)
export class Animationbinding {
  fmin; //min of fmu variable to be animated interpolated to amin
  fmax; //max of fmu variable to be animated interpolated to amax
  amin; //min in animation
  amax; //max of animation
  findex; //index of fmu variable
  backupmd;
  @observable animationvalue;
  referenceadded = false;

  constructor(api,ea) {
    this.api = api;
    this.ea = ea;
    this.handleFmiAddReference = e => {
      //let that = window.animationbinding
      this.referenceadded = true;
      this.currentMapping.findex = e.detail.reference.index ? e.detail.reference.index : (e.detail.reference-1);
    }
  }

  bind() {
    this.mapping = [];//{aname: 'sipka', amin: 0, amax: 99, fmuvarname: 'x', findex: 1, fmin: 0, fmax: 1}, {aname: 'sipka2'}];
    //do identify here?
    document.addEventListener('fmiaddreference',this.handleFmiAddReference.bind(this));
    window.animationbinding = this;
  }

  unbind(){
    document.removeEventListener('fmiaddreference',this.handleFmiAddReference);
  }

  animationvalueChanged(newvalue,oldvalue) {
    //console.log('animationvalueChanged to '+newvalue);
    this.api.startblink();
    this.api.setAnimationValue(this.currentMapping.aname, newvalue, true, true, false);
  }

  identify() {
    //1. identifyfmi
    //get editor content sorounded into a root element
    this.testmode=false;
    this.backupmd = this.api.editor.getValue();
    //encapsulate with roo element
    let md = '<root>' + (this.api.sharedmodel ? this.api.sharedmodelcontent : '') + this.backupmd + '</root>';
    //parse the xml
    let parser = new DOMParser();
    let xmldoc = parser.parseFromString(md, 'text/xml');
    let bdlfmi = xmldoc.getElementsByTagName('bdl-fmi')[0];
    //update fmi internals
    if (!bdlfmi) {
      this.ea.publish(new WarnMessage('bdl-fmi component not detected. Try add fmi component or check "shared model".'))
      return;
    }
    this.api.updateCurrentFmiEntry(bdlfmi.getAttribute('src'));
    //this.api.updateFMIVariableList(); //duplicate??

    //update outputreferences
    this.outputreferences = [];
    let refs = bdlfmi.getAttribute('valuereferences').split(',');
    let labels = bdlfmi.getAttribute('valuelabels').split(',');
    for (let i = 0; i < refs.length; i++) this.outputreferences.push({reference: refs[i], name: labels.length > i ? labels[i] : '',index:i});
    this.api.outputreferences = this.outputreferences;
    //keep link to outputreferences
    //2. animobjs probably identified
    this.mapping = [];
    this.api.discoverAdobeAnimate(); //discovers all objects
    for (let aobj of this.api.animobjs) {
      let ashort = aobj.replaceAll('children.', '');
      this.mapping.push({aname: aobj, ashort: ashort, text: false,range:false});
    }
    for (let aobj of this.api.textobjs) {
      let ashort = aobj.replaceAll('children.', '');
      this.mapping.push({aname: aobj, ashort: ashort, text: true,range:false});
    }
    for (let aobj of this.api.rangeobjs) {
      let ashort = aobj.replaceAll('children.', '');
      this.mapping.push({aname: aobj, ashort: ashort, text: false,range:true});
    }
    let bdlbind2a = xmldoc.getElementsByTagName('bdl-bind2a');
    console.log('found #bdl-bind2a objects:', bdlbind2a.length);
    for (let binding of bdlbind2a) {
      //this.mapping.push({})
      //find mapping, update
      let bobj = this.mapping.find(x => x.aname === binding.getAttribute('aname'));
      if (bobj) {
        bobj.amin = binding.getAttribute('amin');
        bobj.amax = binding.getAttribute('amax');
        bobj.fmin = binding.getAttribute('fmin');
        bobj.fmax = binding.getAttribute('fmax');
        bobj.findex = binding.getAttribute('findex');
        bobj.convertor = binding.getAttribute('convertor');
        //bobj.fmuvarname = this.api.outputreferences[bobj.findex].name;
        bobj.class = 'w3-theme-l3';
      }
    }
    let bdlbind2atext = xmldoc.getElementsByTagName('bdl-bind2a-text');
    console.log('found #bdl-bind2atext objects:', bdlbind2atext.length);
    for (let binding of bdlbind2atext) {
      //this.mapping.push({})
      //find mapping, update
      let bobj = this.mapping.find(x => x.aname === binding.getAttribute('aname'));
      if (bobj) {
        bobj.findex = binding.getAttribute('findex');
        let convertor = binding.getAttribute('convertor');
        if (convertor) bobj.convertor = convertor;
        let prefix = binding.getAttribute('prefix');
        if (prefix) bobj.prefix = prefix;
        let suffix = binding.getAttribute('suffix');
        if (suffix) bobj.suffix = suffix;
        let fixed = binding.getAttribute('fixed');
        if (fixed) bobj.fixed = fixed;
        let precision = binding.getAttribute('precision');
        if (precision) bobj.precision = precision;
        //bobj.fmuvarname = this.api.outputreferences[bobj.findex].name; //not needed anymore
        bobj.class = 'w3-theme-l3';
      }
    }
    let bdlbind2aplay = xmldoc.getElementsByTagName('bdl-bind2a-play');
    console.log('found #bdl-bind2aplay objects:', bdlbind2aplay.length);
    for (let binding of bdlbind2aplay) {
      //this.mapping.push({})
      //find mapping, update
      let bobj = this.mapping.find(x => x.aname === binding.getAttribute('aname'));
      if (bobj) {
        bobj.findex = binding.getAttribute('findex');
        bobj.playonly = true;
        bobj.fmuvarname = this.api.outputreferences[bobj.findex].name;
        bobj.class = 'w3-theme-l3';
      }
    }
    console.log('identify() mapping:', this.mapping);

    //outputreferences
    this.outputreferences = this.api.outputreferences;
  }

  selectMapping(item) {
    if (this.currentMapping) {
      this.currentMapping.selected = false;
      this.currentMapping.class = this.currentMapping.findex ? 'w3-theme-l3':'';
    }
    this.currentMapping = item;
    this.currentMapping.selected = true;
    this.currentMapping.class = 'w3-theme';
    if (!this.currentMapping.playonly) {
      if (!this.currentMapping.amin) this.currentMapping.amin=0;
      if (!this.currentMapping.amax) this.currentMapping.amax=99;
    }
    //blink
    this.api.blink(item.aname);
  }

  submit() {
    //remove all bdl-bind2a-dialog

    //get editor content surounded into a root element
    let md = '<root>' + this.api.editor.getValue() + '</root>';
    //parse the xml
    let parser = new DOMParser();
    let xmldoc = parser.parseFromString(md, 'text/xml');
    let bdlbind2a = xmldoc.getElementsByTagName('bdl-bind2a');
    console.log('found #bdl-bind2a objects:', bdlbind2a);
    //add newline to the list to be removed
    let newlines = [];
    for (let bdl of bdlbind2a) if ((bdl.nextSibling.nodeType === 3) && (bdl.nextSibling.nodeValue === '\n')) newlines.push(bdl.nextSibling);
    //remove bdlbind from dom tree
    let fragment = xmldoc.createDocumentFragment();
    fragment.textContent = ' ';
    fragment.firstChild.replaceWith(...bdlbind2a);
    //let result = parent.removeChild(el);
    //console.log('removed',result);
    //remove bdl-bind2a-text
    let bdlbind2atext = xmldoc.getElementsByTagName('bdl-bind2a-text');
    for (let bdl of bdlbind2atext) if ((bdl.nextSibling.nodeType === 3) && (bdl.nextSibling.nodeValue === '\n')) newlines.push(bdl.nextSibling);
    fragment = xmldoc.createDocumentFragment();
    fragment.textContent = ' ';
    fragment.firstChild.replaceWith(...bdlbind2atext);
    //remove newlines
    fragment = xmldoc.createDocumentFragment();
    fragment.textContent = ' ';
    fragment.firstChild.replaceWith(...newlines);
    //remove bdlbind from dom tree
    //for (let el of bdlbind2atext) {
    //      let parent = el.parentNode;
    //      let result = parent.removeChild(el);
    //      console.log("removed",result)
    //    }

    //add generated bdl-bind2a-dialog
    let bdlanimate = xmldoc.getElementsByTagName('bdl-animate-adobe')[0];
    //let newbdlbindnodes = [];
    for (let item of this.mapping) {
      if (!item.text) {
        if (item.findex) { //insert only those with mapping
          let node = xmldoc.createElement('bdl-bind2a');
          node.setAttribute('findex', item.findex);
          node.setAttribute('aname', item.aname);
          node.setAttribute('amin', item.amin);
          node.setAttribute('amax', item.amax);
          if (item.fmin) node.setAttribute('fmin', item.fmin);
          if (item.fmax) node.setAttribute('fmax', item.fmax);
          if (item.convertor) node.setAttribute('convertor', item.convertor);
          //node.innerText(' ');
          this.insertAfter(node, bdlanimate);
          let newline = xmldoc.createTextNode('\n');
          this.insertAfter(newline, bdlanimate);
        }
        //newbdlbindnodes.push(node);
        //newbdlbindnodes.push(xmldoc.createTextNode('\n'));
      } else {
        if (item.findex) { //insert only those with mapping
          let node = xmldoc.createElement('bdl-bind2a-text');
          node.setAttribute('findex', item.findex);
          node.setAttribute('aname', item.aname);
          if (item.convertor) node.setAttribute('convertor', item.convertor);
          if (item.prefix) node.setAttribute('prefix', item.prefix);
          if (item.suffix) node.setAttribute('suffix', item.suffix);
          if (item.fixed && item.fixed.length>0) node.setAttribute('fixed', item.fixed);
          else if (item.precision && item.precision.length>0) node.setAttribute('precision', item.precision);
          //node.innerText(' ');
          this.insertAfter(node, bdlanimate);
          let newline = xmldoc.createTextNode('\n');
          this.insertAfter(newline, bdlanimate);
        }
        //newbdlbindnodes.push(node);
        //newbdlbindnodes.push(xmldoc.createTextNode('\n'));
      }
    }

    //add fmi if some variable was added
    if (this.referenceadded) {
      //reference was added // modify bdl-fmi
      if (this.api.sharedmodel) {
        let shareddoc = parser.parseFromString('<root>'+this.api.sharedmodelcontent+'</root>', 'text/xml');
        shareddoc = this.replacefmi(shareddoc);
        let s2 = new XMLSerializer();
        let shareddoccontent = s2.serializeToString(shareddoc);
        shareddoccontent = shareddoccontent.substring(6,shareddoccontent.length-7).replaceAll(new RegExp('<(bdl-[A-Za-z0-9\-]+)(.+?)/>', 'g'),'<$1$2></$1>');
        this.api.saveSharedModel(shareddoccontent);
      } else {
        xmldoc = this.replacefmi(xmldoc);
      }
    }

    //serialize to text
    let s = new XMLSerializer();
    md = s.serializeToString(xmldoc);
    //TODO remove root node
    md = md.substring(6, md.length - 7);
    //replace self-closing tags by full tags - bdl-prefix only
    let restr = '<(bdl-[A-Za-z0-9\-]+)(.+?)/>';
    let re = new RegExp(restr, 'g');
    md = md.replaceAll(re, '<$1$2></$1>');
    //replace ascii 127 by empty
    //md = md.replaceAll('⌂', '');
    console.log('md:', md);
    //replace the editor content
    this.api.editor.setValue(md);
  }

  //replaces fmi with updated outputreferences in DOM xmldoc
  replacefmi(xmldoc) {
    let bdlfmi = xmldoc.getElementsByTagName('bdl-fmi');
    if (bdlfmi.length == 0) {
      console.warn('bdl-fmi not found to be replaced in xmldoc');
      return xmldoc;
    }
    let mybdlfmi = bdlfmi[0];
    let valuereferences = this.api.outputreferences.map(ref => ref.reference).join(',');
    let valuelabels = this.api.outputreferences.map(ref => ref.name).join(','); //name should not contain comma
    mybdlfmi.setAttribute('valuereferences',valuereferences);
    mybdlfmi.setAttribute('valuelabels',valuelabels);
    return xmldoc;
  }

  attached() {
    //window.$ = jQuery;
    //window.jQuery = jQuery;
    //this.selectoptions.chosen();
    //jQuery('#selectoptionid').chosen();
    /*jQuery('#selectoptionid').selectize({
      create: true,
      sortField: {
        field: 'text',
        direction: 'asc'
      },
      dropdownParent: 'body'
    });*/
    //console.log('this.selectoptions',this.selectoptions);
    //console.log('jquery this.selectoptions',jQuery('#selectoptionid'));
  }

  insertAfter(newNode, existingNode) {
    existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
  }

  undo() {
    //use backupmd
    this.api.editor.setValue(this.backupmd);
  }

  blink() {
    if (this.currentMapping) this.api.blink(this.currentMapping.aname);
  }

  enableanimation() {
    window.ani.startAllAnimation();
    window.ani.enableanimation();
  }

  testanim() {
    this.testmode=true;
    this.mapping = [];
    this.api.discoverAdobeAnimate(); //discovers all objects
    for (let aobj of this.api.animobjs) {
      let ashort = aobj.replaceAll('children.', '');
      this.mapping.push({aname: aobj, ashort: ashort, text: false});
    }
    for (let aobj of this.api.textobjs) {
      let ashort = aobj.replaceAll('children.', '');
      this.mapping.push({aname: aobj, ashort: ashort, text: true});
    }

  }
}
