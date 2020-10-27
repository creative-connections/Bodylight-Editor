export class FileEntries {
  constructor(bs) {
    this.bs = bs;
  }

  /**
   * increment index of fmi entries
   */
  newfileentry() {
    if (! this.fileentries) this.fileentries = [];
    if (! this.fileentriessrc) this.fileentriessrc = [];
    this.currentfileentry = {src: 'FILL src of JS file', fminame: 'FILL fminame from modeldescription.xml', guid: '', valuereferences: '', valuelabels: '', inputs: ''};
    this.currentfileentryindex = this.fileentries.push(this.currentfileentry);
    console.log('editorapi newfileentry() fileentryindex', this.currentfileentryindex);
  }

  deletefileentry(file) {
    let entry = this.fileentries.find(entryitem => file.name === entryitem.src);
    if (entry) {
      let entryindex = this.fileentries.indexOf(entry);
      this.fileentries.splice(entryindex, 1);
      let srcentry = this.fileentriessrc.find(entryitem => entryitem.src === file.name);
      if (srcentry) {
        let srcindex = this.fileentriessrc.indexOf(srcentry);
        this.fileentriessrc.splice(srcindex, 1);
      }
      this.bs.setFmiListEntries(this.fileentries);
      this.bs.setFmiListSrcs(this.fileentriessrc);
    }
  }

  /**
   * sets src of current fileentry and adds the src with index into fileentriessrc array
   * @param src
   */
  setfileentrySrc(src) {
    this.currentfileentry.src = src;
    //if (! this.fileentriessrc) this.fileentriessrc = [];
    this.fileentriessrc.push({index: this.currentfileentryindex, src: src});
    //store in localstorage
    this.bs.setFmiListEntries(this.fileentries);
    this.bs.setFmiListSrcs(this.fileentriessrc);
  }

  getfileentries() {
    let that = this;
    this.bs.getFMIListEntries()
      .then(value=> {
        that.fileentries = value;
        if (that.fileentries && that.fileentries.length > 0) {
          that.currentfileentry = that.fileentries[0];
          that.currentfileentryindex = 1;
        } else {
          that.currentfileentry = {};
          that.currentfileentryindex = 0;
        }
        this.bs.getFMIListSrcs()
          .then(value2=> that.fileentriessrc = value2);
      });
    //set to first entry in list
  }

}
