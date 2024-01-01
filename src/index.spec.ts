import { ResourceLoader } from 'jsdom';

describe('Configurable Resource Loader', () => {
  it('extends jsdom.ResourceLoader', () => {
    const subject = new ConfigurableResourceLoader();

    expect(subject).toBeInstanceOf(ResourceLoader);
  });
});
