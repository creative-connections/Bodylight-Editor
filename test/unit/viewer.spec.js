import {bootstrap} from 'aurelia-bootstrapper';
import {StageComponent} from 'aurelia-testing';
import {PLATFORM} from 'aurelia-pal';

describe('Stage Viewer Component', () => {
  let component;

  beforeEach(() => {
    component = StageComponent
      .withResources(PLATFORM.moduleName('../../src/components/viewer'))
      .inView('<viewer></viewer>');
  });

  afterEach(() => component.dispose());

  it('should create editor and viewer divs', done => {
    component.create(bootstrap).then(() => {
      const view = component.element;
      const divs = view.getElementsByTagName('div');
      expect(divs.length).toBeGreaterThanOrEqual(1);
      done();
    }).catch(e => {
      fail(e);
      done();
    });
  });
});
