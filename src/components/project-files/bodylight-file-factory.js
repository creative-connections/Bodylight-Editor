import {BodylightFile} from './bodylight-file';
import {FTYPE} from './bodylight-struct';

export class BodylightFileFactory {
  static createBodylightFile(entryname, blob, api, isanimate, isother) {
    let filetype;
    if (entryname.endsWith('.js')) {
      if (isanimate) filetype = FTYPE.ADOBEANIMATE;
      else if (isother) filetype = FTYPE.OTHERJS;
      else filetype = FTYPE.MODELFILE;
    } else if (entryname.endsWith('.md')) filetype = FTYPE.MDFILE;
    else if (entryname.endsWith('.xml')) filetype = FTYPE.DESCRIPTIONFILE;
    else if (entryname.endsWith('.html')) filetype = FTYPE.DESCRIPTIONFILE;
    else if (entryname.endsWith('.gif')) filetype = FTYPE.ANIMATEDGIF;
    else if (entryname.endsWith('.png')) filetype = FTYPE.IMAGE;
    else if (entryname.endsWith('.jpg')) filetype = FTYPE.IMAGE;
    else filetype = FTYPE.OTHERJS;
    let newfile = new BodylightFile(entryname, filetype, api, blob);
    /*if (blob) {
      api.bs.saveBlobContent(entryname, blob)
        .then(result => {
          console.log('result saving blob', result);
          this.uploaddialog = false;
        })
        .catch(error => {
          console.log('error saving blob', error);
          this.uploaddialog = false;
        });
    }*/

    return newfile;

    //expect that by convention of Bodylight Compiler, ZIP contains JS and modelDescription.xml
    //    this.files.push(newfile);
    //    this.updatelf();
  }
}
