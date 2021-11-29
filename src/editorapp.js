import {inject} from 'aurelia-framework';
import {Editorapi} from './components/editorapi';
import {version} from '../package.json';

@inject(Editorapi)
export class Editorapp {
  dialogwidth=0;
  editorwidth=0;
  moving=false;
  constructor(api) {
    this.api = api;
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
  }

  mouseMove(event) {
    if (this.moving) {
      let diffX = event.pageX - this.pageX;
      this.dialogdiv.style.width = (this.dialogwidth + diffX) + 'px';
      this.editordiv.style.width = (this.editorwidth - (diffX)-20) + 'px';
      //console.log('editorapp mousemove diffX:'+diffX+' dialogwidth:'+this.dialogdiv.style.width+' editorwidth:'+this.editordiv.style.width);
    }
  }

  mouseUp(event){
    //console.log('editorapp mouseUp')
    this.moving = false;
  }
}
