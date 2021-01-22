# Inline Cacher

Improve performance by caching inline styles. The best of both worlds!

This is an NPM implementation of the [Inline Cache methodology](https://github.com/ChrisBAshton/inline-cache).

## How does it work?

InlineCacher looks for all inline `<style>` tags on the page and stores their contents in localStorage. It then sets a cookie so that the server can detect subsequent page requests and avoid rendering the inline styles again. On subsequent pages, InlineCacher injects the cached styles into the page.

This combines a **fast first page load** and **the power of caching**.

<!-- prettier-ignore -->
| First page load (demo page) | Subsequent page load (demo page) |
| ----------------------------| -------------------------------- |
|![47.4 KB page load, almost entirely the index page with inline styles](https://user-images.githubusercontent.com/5111927/58512058-104aef00-8194-11e9-99eb-a1ba17001eec.png)|![312 B page load](https://user-images.githubusercontent.com/5111927/58512057-0fb25880-8194-11e9-9477-2de06c5fc793.png)|

InlineCacher is just 156 bytes g-zipped, and has the power to shave tens/hundreds of KBs per page.

## Usage

`npm install inline-cacher` or grab the dist/inline-cacher.min.js file directly.

### On the client

InlineCacher is exported as a UMD module, so import it however you want:

- RequireJS: `define(['inline-cacher'], function (InlineCacher) {})`
- CommonJS: `var InlineCacher = require('inline-cacher')`
- Global: `<script src="inline-cacher.min.js"></script>`, then `var InlineCacher = window.InlineCacher`

Then just call `InlineCacher.init()` when you're ready to cache your inline styles.

InlineCacher will set a cookie - `inline-cacher` - which will be sent to your server on subsequent page visits. You can override the name of the cookie (and other options) by passing an options object to the `init` function:

```js
InlineCacher.init({
  cookieName: "inline-cacher",
  localStorageName: "InlineCacher"
});
```

If you need to clear the localStorage cache and the cookie, call `InlineCacher.reset()`.

### On the server

Check for the presence of the `inline-cacher` cookie. If it exists, then assume inline styles have been cached, and avoid sending them in the response to the client.

Example NodeJS (Express):

```js
app.get("/", (req, res) => {
  const styledAlready = req.cookies["inline-cacher"] === "true";
  res.send(`
    <html>
      <head>
        <title>Proof of concept</title>
        ${styledAlready ? "" : `<style>/* lots of inline styles go here */</style>`}
      </head>
      ...etc
  `);
);
```

Example PHP code:

```php
if (!isset($_COOKIE['inline-cacher'])) {
  echo "<style>/* lots of inline styles go here */</style>";
}
```

## Contributing

Clone the repository, `npm install`.

Check out the example page:

```sh
npm start
```

Build the minified JS file:

```sh
npm run build
```

The top priority right now is [deciding on an invalidation strategy](https://github.com/ChrisBAshton/inline-cacher/issues/1). Other things for the roadmap include passing an optional selector (e.g. `style[data-cache-inline]`) so that only specified inline styles are cached.

## License

MIT.
