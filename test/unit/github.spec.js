import {GithubSync} from '../../src/components/githubsync/GithubSync';

describe('Github Sync Component', () => {
  let component;

  beforeEach(() => {
    component = new GithubSync();
  });

  afterEach(() => component = null);

  it('should compute sha for string', done => {
    component.sha256('test string')
      .then(mysha => {
        console.log('sha of test', mysha);
        expect(mysha).toBe('03af');
        done();
      })
      .catch(e =>{
        fail(e);
        done();
      });
  });
});
