(function(root, factory) {
  if (typeof define === "function" && define.amd) {
    define([], factory); // AMD. Register as an anonymous module.
  } else if (typeof module === "object" && module.exports) {
    module.exports = factory(); // Node.
  } else {
    root.InlineCacher = factory(); // Browser globals (root is window)
  }
})(typeof self !== "undefined" ? self : this, function() {
  function InlineCacher() {
    this.cookieName = "inline-cacher";
    this.localStorageName = "InlineCacher";
  }

  var privateMethods = {
    applyCachedStyles: function(_cookieName, localStorageName) {
      var s = document.createElement("style");
      s.setAttribute("type", "text/css");
      s.appendChild(document.createTextNode(localStorage[localStorageName]));
      document.getElementsByTagName("head")[0].appendChild(s);
    },
    cacheInlineStyles: function(cookieName, localStorageName) {
      var styles = document.getElementsByTagName("style");
      var stylesString = "";
      for (var i = 0; i < styles.length; i++) {
        var style = styles[i];
        stylesString += style.textContent;
      }
      localStorage.setItem(localStorageName, stylesString);
      // subsequent requests to the server tell it not to send inline styles
      document.cookie = cookieName + "=true";
    }
  };

  InlineCacher.prototype.init = function(opts) {
    this._overrideDefaults(opts);
    if (localStorage[this.localStorageName]) {
      privateMethods.applyCachedStyles(this.cookieName, this.localStorageName);
    } else {
      privateMethods.cacheInlineStyles(this.cookieName, this.localStorageName);
    }
  };

  InlineCacher.prototype.reset = function() {
    // delete the cookie
    document.cookie =
      this.cookieName + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    // clear the locally cached styles
    localStorage.removeItem(this.localStorageName);
  };

  /**
   * This would ideally be private, but we need to be able to override
   * the value of `this`.
   */
  InlineCacher.prototype._overrideDefaults = function(opts) {
    opts = opts || {};
    this.cookieName = opts.cookieName || this.cookieName;
    this.localStorageName = opts.localStorageName || this.localStorageName;
  };

  return new InlineCacher();
});
