import {GithubSync} from '../../src/components/githubsync/GithubSync';

describe('Github Sync Component', () => {
  let component;
  let crypto;

  beforeEach(() => {
    component = new GithubSync();
    try {
      crypto = require('crypto');
    } catch (err) {
      console.log('crypto support is disabled!');
    }
  });

  afterEach(() => component = null);

  it('should compute sha for string', done => {
    component.sha256('test string', crypto)
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

  await it('should compute nodejs crypto', done =>{
    const {
      hkdf,
    } = await import('crypto');

    hkdf('sha512', 'key','salt','info',64, (err,derivedKey) => {
      if (err) throw err;
      console.log(Buffer.from(derivedKey).toString('hex'));
    })
  })
});
