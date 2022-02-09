import {inject,bindable} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {InfoMessage,WarnMessage} from './messages';

@inject(EventAggregator)
export class Notifybar {
  @bindable length = 3;
  constructor (ea) {
    this.ea = ea;
  }

  attached(){
    this.ea.subscribe(InfoMessage, msg => this.addmessage(msg.content,'w3-pale-green'));
    this.ea.subscribe(WarnMessage,msg =>this.addmessage(msg.content,'w3-pale-red'));
    this.messages = [];
  }

  detached() {
  }

  addmessage(content,msgclass){
    const d = new Date();
    this.messages.push({text:d.toLocaleTimeString()+' '+content,class:msgclass})
    if (this.messages.length>this.length) this.messages.shift();
  }
}
