import {inject} from 'aurelia-framework';
import {Editorapi} from './components/editorapi';
import {version} from '../package.json';
import {EventAggregator} from 'aurelia-event-aggregator';

@inject(Editorapi,EventAggregator)
export class Editorappv2 {
  dialogwidth=0;
  editorwidth=0;
  moving=false;
  constructor(api,ea) {
    this.api = api;
    this.api.ea = ea;
    this.version = version;
  }

  attached(){}

  mouseDown(event) {
    this.moving = true;
    this.pageX = event.pageX;
    this.dialogwidth = this.dialogdiv.offsetWidth;
    this.editorwidth = this.editordiv.offsetWidth;
    //console.log('editorapp mousedown pagex:'+this.pageX+' dialogwidth:'+this.dialogwidth+' editorwidth:'+this.editorwidth);
    //console.log('dialogdiv',this.dialogdiv);
    //console.log('dialogdiv',this.editordiv);
    return true;
  }

  mouseMove(event) {
    if (this.moving) {
      let diffX = event.pageX - this.pageX;
      this.dialogdiv.style.width = (this.dialogwidth + diffX) + 'px';
      this.editordiv.style.width = (this.editorwidth - (diffX)-20) + 'px';
      //console.log('editorapp mousemove diffX:'+diffX+' dialogwidth:'+this.dialogdiv.style.width+' editorwidth:'+this.editordiv.style.width);
      return true;
    } else return true;
  }

  mouseUp(event){
    //console.log('editorapp mouseUp')
    this.moving = false;
    return true;
  }
  
  fullmode = true;
  switchmode() {
      this.fullmode = ! this.fullmode;
  }

}
