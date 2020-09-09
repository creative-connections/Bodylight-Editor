import 'ace-builds';
import 'ace-builds/webpack-resolver';
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/snippets/text.js';
import jQuery from 'jquery';

import {EventAggregator} from 'aurelia-event-aggregator';
import {ContentUpdated} from './messages';
import {inject} from 'aurelia-framework';

@inject(EventAggregator)
export class Editor {
  constructor(ea) {
    this.ea = ea;
  }
  attached() {
    window.$ = window.jQuery = jQuery;
    ace.require('ace/ext/language_tools');
    this.editor = ace.edit('editorref', {
      mode: 'ace/mode/markdown',
      theme: 'ace/theme/chrome',
      enableBasicAutocompletion: true,
      enableSnippets: false,
      enableLiveAutocompletion: true,
      wrap: true,
      maxLines: 30,
      minLines: 30,
      fontSize: 16
    });
    let that = this;

    this.editor.on('change', function(delta){
      //that.generatepreview();
      console.log('editor delta:',delta)
      if (delta.start.row<delta.end.row){

        let content = that.editor.getValue();
        //hack - transform content so bdl-components will be interpreted by aurelia plugin - it needs components without
        //bdl prefix
        //all <bdl- will be repaced to < and </bdl- to </
        const startprefix = /<bdl-/gi;
        const stopprefix = /<\/bdl-/gi;
        const transformedContent = content.replace(startprefix,'<').replace(stopprefix,'</');
        //create customevent - which component is listening to
        let event = new CustomEvent('contentupdate', {detail: {content: transformedContent}});
        //console.log('sending content update')
        document.getElementById('editorref').dispatchEvent(event)
        //that.ea.publish(new ContentUpdated(content));
      }
      /*if (delta.contains('\n')) {
        let content = that.editor.getValue();
        that.ea.publish(new ContentUpdated(content));
      }*/
    })
  }
}
