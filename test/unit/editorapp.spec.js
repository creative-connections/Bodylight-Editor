import {bootstrap} from 'aurelia-bootstrapper';
import {StageComponent} from 'aurelia-testing';
import {PLATFORM} from 'aurelia-pal';

describe('Stage Editorapp Component', () => {
  let component;

  beforeEach(() => {
    component = StageComponent
      .withResources(PLATFORM.moduleName('editorapp'))
      .inView('<editorapp></editorapp>');
  });

  afterEach(() => component.dispose());

  it('should editor and viewer divs', done => {
    component.create(bootstrap).then(() => {
      const view = component.element;
      const divs = view.getElementsByTagName('div');
      expect(divs.length).toBeGreaterThan(1);
      done();
    }).catch(e => {
      fail(e);
      done();
    });
  });
});
