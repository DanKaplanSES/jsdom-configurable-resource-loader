import { urlMatches } from './url-matches';

describe('urlMatches', () => {
  it('requires an exact match for strings', () => {
    expect(urlMatches(`foo`, { url: `foo` })).toEqual(true);
    expect(urlMatches(`foobar`, { url: `foo` })).toEqual(false);
    expect(urlMatches(`o`, { url: `foo` })).toEqual(false);
  });

  it('requires a match for RegExp', () => {
    expect(urlMatches(`foo`, { url: /foo/ })).toEqual(true);
    expect(urlMatches(`foobar`, { url: /foo/ })).toEqual(true);
    expect(urlMatches(`o`, { url: /foo/ })).toEqual(false);
  });

  it('matches everything with /.*/', () => {
    expect(urlMatches(`foo`, { url: /.*/ })).toEqual(true);
    expect(urlMatches(`foobar`, { url: /.*/ })).toEqual(true);
    expect(urlMatches(`o`, { url: /.*/ })).toEqual(true);
  });

  it('throws an error for blank strings', () => {
    expect(() => {
      urlMatches(`foo`, { url: '' });
    }).toThrowError(/blank/);
  });

  it('throws an error for blank RegExp patterns', () => {
    expect(() => {
      urlMatches(`foo`, { url: new RegExp('') });
    }).toThrowError(/blank/);
  });
});
