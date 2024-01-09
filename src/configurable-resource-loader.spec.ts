import { ResourceLoader } from 'jsdom';
import { ConfigurableResourceLoader } from './configurable-resource-loader';
import * as urlMatchesModule from './url-matches';
import sinon, { SinonSandbox, SinonStub } from 'sinon';
import { Matcher, UrlMatcher } from './url-matches';

describe('Configurable Resource Loader', () => {
  let sandbox: SinonSandbox;
  let parentFetch: SinonStub;
  let urlMatches: SinonStub;

  type TestMatcher = Record<keyof UrlMatcher, string>;
  //   ^?

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    parentFetch = sandbox
      .stub(ResourceLoader.prototype, 'fetch')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .returns({} as any);

    urlMatches = sandbox.stub(urlMatchesModule, 'urlMatches');
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('extends jsdom.ResourceLoader', () => {
    const subject = new ConfigurableResourceLoader();

    expect(subject).toBeInstanceOf(ResourceLoader);
  });

  it('will call super.fetch when there is no configuration', () => {
    urlMatches.returns(false); // this should have no effect
    const subject = new ConfigurableResourceLoader();

    subject.fetch('url', {});

    expect(parentFetch.calledOnce).toEqual(true);
  });

  describe(`whitelist only`, () => {
    it('calls super.fetch for whitelisted urls', () => {
      urlMatches.callsFake((url: string, matcher: TestMatcher) => {
        return matcher.url.startsWith('whitelist');
      });
      const options = { whitelist: [{ url: 'whitelist 1' }] };
      const subject = new ConfigurableResourceLoader(options);

      subject.fetch('url', {});

      expect(parentFetch.calledOnce).toEqual(true);
    });

    it('iterates every whitelist element to look for a match', () => {
      urlMatches.callsFake((url: string, matcher: TestMatcher) => {
        return false;
      });
      const options = {
        whitelist: [{ url: 'whitelist 1' }, { url: 'whitelist 2' }],
      };
      const subject = new ConfigurableResourceLoader(options);

      subject.fetch('url', {});

      expect(urlMatches.calledWith('url', {url: 'whitelist 1'})).toEqual(true);
      expect(urlMatches.calledWith('url', {url: 'whitelist 2'})).toEqual(true);
    });

    it('returns null for urls that are not whitelisted', () => {
      urlMatches.callsFake((url: string, matcher: TestMatcher) => {
        return !matcher.url.startsWith('whitelist');
      });
      const options = { whitelist: [{ url: 'whitelist 1' }] };
      const subject = new ConfigurableResourceLoader(options);

      const actual = subject.fetch('url', {});

      expect(actual).toBeNull();
      expect(parentFetch.notCalled).toEqual(true);
    });
  });

  describe(`whitelist and blacklist`, () => {
    it('returns null when there are no matches', () => {
      urlMatches.callsFake((url: string, matcher: TestMatcher) => {
        return false;
      });
      const options = {
        whitelist: [{ url: 'whitelist 1' }],
        blacklist: [{ url: 'blacklist 1' }],
      };
      const subject = new ConfigurableResourceLoader(options);

      const actual = subject.fetch('url', {});

      expect(actual).toBeNull();
      expect(parentFetch.notCalled).toEqual(true);
    });

    it('returns null for blacklisted urls', () => {
      urlMatches.callsFake((url: string, matcher: TestMatcher) => {
        return matcher.url.startsWith('blacklist');
      });
      const options = {
        whitelist: [{ url: 'whitelist 1' }],
        blacklist: [{ url: 'blacklist 1' }],
      };
      const subject = new ConfigurableResourceLoader(options);

      const actual = subject.fetch('url', {});

      expect(actual).toBeNull();
      expect(parentFetch.notCalled).toEqual(true);
    });

    it('returns null when whitelist AND blacklist match', () => {
      urlMatches.callsFake((url: string, matcher: TestMatcher) => {
        return true;
      });
      const options = {
        whitelist: [{ url: 'whitelist 1' }],
        blacklist: [{ url: 'blacklist 1' }],
      };
      const subject = new ConfigurableResourceLoader(options);

      const actual = subject.fetch('url', {});

      expect(actual).toBeNull();
      expect(parentFetch.notCalled).toEqual(true);
    });
  });

  describe(`blacklist only`, () => {
    it('returns null if a url is in the blacklist', () => {
      urlMatches.callsFake((url: string, matcher: TestMatcher) => {
        return matcher.url.startsWith('blacklist');
      });
      const options = { blacklist: [{ url: 'blacklist 1' }] };
      const subject = new ConfigurableResourceLoader(options);

      const actual = subject.fetch('url', {});

      expect(actual).toBeNull();
      expect(parentFetch.notCalled).toEqual(true);
    });

    it('iterates every blacklist element to look for a match', () => {
      urlMatches.callsFake((url: string, matcher: TestMatcher) => {
        return false;
      });
      const options = {
        blacklist: [{ url: 'blacklist 1' }, { url: 'blacklist 2' }],
      };
      const subject = new ConfigurableResourceLoader(options);

      subject.fetch('url', {});

      expect(urlMatches.calledWith('url', {url: 'blacklist 1'})).toEqual(true);
      expect(urlMatches.calledWith('url', {url: 'blacklist 2'})).toEqual(true);
    });

    it('calls super.fetch if a url is NOT in the blacklist', () => {
      urlMatches.callsFake((url: string, matcher: TestMatcher) => {
        return false;
      });
      const options = { blacklist: [{ url: 'blacklist 1' }] };
      const subject = new ConfigurableResourceLoader(options);

      subject.fetch('url', {});

      expect(parentFetch.calledOnce).toEqual(true);
    });
  });
});
