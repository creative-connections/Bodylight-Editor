import {BodylightMdFile} from './bodylight-md-file';


export class BodylightXmlFile extends BodylightMdFile {
  deactivate(file){
    file.active = false;
  }
}
