# jsdom-configurable-resource-loader

## TL;DR:

If you need to customize which resources [JSDOM](https://github.com/jsdom/jsdom) loads, chances are, a simple list of URL patterns will get the job done. This package makes that easy.

## Usage

```js
const dom = new JSDOM(``, {
  resources: new CustomResourceLoader(
    new ConfigurableResourceLoader({
      blacklist: [/google.com/, 'https://example.com', /gstatic.com/],
    })
  ),
});

// or

const dom = new JSDOM(``, {
  resources: new CustomResourceLoader(
    new ConfigurableResourceLoader({
      whitelist: [/google.com/, 'https://example.com', /gstatic.com/],
    })
  ),
});
```

## Context and Purpose

From the [JSDOM](https://github.com/jsdom/jsdom) README:

> By default, jsdom will not load any subresources such as scripts, stylesheets, images, or iframes. If you'd like jsdom to load such resources, you can pass the `resources: "usable"` option, which will load all usable resources.

This is great, but what if you need something a little more sophisticated? For example, maybe you want to load all relative path images, but skip Google Analytics calls?

[JSDOM](https://github.com/jsdom/jsdom?tab=readme-ov-file#advanced-configuration) provides a way to do that, too:

> To more fully customize jsdom's resource-loading behavior, you can pass an instance of the `ResourceLoader` class as the `resources` option value:

```js
class CustomResourceLoader extends jsdom.ResourceLoader {
  fetch(url, options) {
    // Override the contents of this script to do something unusual.
    if (url === "https://example.com/some-specific-script.js") {
      return Promise.resolve(Buffer.from("window.someGlobal = 5;"));
    }

    return super.fetch(url, options);
  }
}
const dom = new JSDOM(``, { resources: new CustomResourceLoader() });
```

This is also great, but it's a lot of code to write and customize. Chances are, you just want to whitelist and/or blacklist certain URL patterns.

## Documentation

For now, the automated tests are the best way to learn how to use this package. In particular: 

- [How URL matching works](https://github.com/DanKaplanSES/jsdom-configurable-resource-loader/blob/main/src/url-matches.spec.ts)
- [How whitelists/blacklists interact](https://github.com/DanKaplanSES/jsdom-configurable-resource-loader/blob/main/src/configurable-resource-loader.spec.ts)
