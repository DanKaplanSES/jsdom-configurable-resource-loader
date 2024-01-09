export type UrlMatcher = {
  url: string | RegExp;
};
export type Matcher = UrlMatcher;

export function urlMatches(url: string, matcher: Matcher): boolean {
  if ('url' in matcher) {
    switch (typeof matcher.url) {
      case 'string':
        if (matcher.url === '') {
          throw new Error(
            `Invalid matcher: Tried to match '${url}' against a blank string.`
          );
        }
        return matcher.url === url;
      default:
        if (isBlankRegExp(matcher.url)) {
          throw new Error(
            `Invalid matcher: Tried to match '${url}' against a blank RegExp.`
          );
        }
        return matcher.url.test(url);
    }
  } else {
    throw new Error(`Unknown matcher: ${matcher}`);
  }
}

const isBlankRegExp = (re: RegExp): boolean => {
  // Apparently, new RegExp('').source does not return "", it returns "(?:)"
  // I'm not sure if this is subject to change, so this
  // felt like the safest way to check if a regex was built with a blank pattern:
  return re.source === new RegExp('').source;
};
