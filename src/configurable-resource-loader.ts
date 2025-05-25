import {
  ResourceLoader,
  type ResourceLoaderConstructorOptions,
  type FetchOptions,
  type AbortablePromise,
} from 'jsdom';
import { Matcher, urlMatches } from './url-matches';

type NewOptions =
  | {
      whitelist: Matcher[];
    }
  | {
      blacklist: Matcher[];
    }
  | {
      whitelist: Matcher[];
      blacklist: Matcher[];
    };

export type ConfigurableResourceLoaderOptions =
  ResourceLoaderConstructorOptions & NewOptions;

export class ConfigurableResourceLoader extends ResourceLoader {
  options: ConfigurableResourceLoaderOptions;

  constructor(options?: ConfigurableResourceLoaderOptions) {
    super(
      ConfigurableResourceLoader.strictlyResourceLoaderConstructorOptions(
        options
      )
    );
    this.options = options ?? { whitelist: [] };
  }

  private static strictlyResourceLoaderConstructorOptions(
    options?: ConfigurableResourceLoaderOptions
  ):
    | Omit<
        ConfigurableResourceLoaderOptions,
        keyof NewOptions
      >
    | undefined {
    if (options === undefined) {
      return undefined;
    }

    const { strictSSL, proxy, userAgent } = options;
    return { strictSSL, proxy, userAgent };
  }

  fetch(url: string, options: FetchOptions): AbortablePromise<Buffer> | null {
    if ('blacklist' in this.options) {
      if (
        this.options.blacklist.some((forbidden) => urlMatches(url, forbidden))
      ) {
        return null;
      }
      if (!('whitelist' in this.options)) {
        return super.fetch(url, options);
      }
    }

    if (
      'whitelist' in this.options &&
      (this.options.whitelist.length === 0 ||
        this.options.whitelist.some((allowed) => urlMatches(url, allowed)))
    ) {
      return super.fetch(url, options);
    } else {
      return null;
    }
  }
}
