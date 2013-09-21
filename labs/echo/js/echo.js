window.Echo = (function (window, document, undefined) {

  'use strict';

  var self = {

    config: {
      store: [],
      selector: '[data-echo]',
      offset: 0
    },

    init: function (selector, offset) {
      self.off = offset || self.config.offset;
      self.selector = selector || self.config.selector;
      self.store = self.config.store;

      var echo = document.querySelectorAll(self.selector);

      for (var i = 0; i < echo.length; i++) {
          self.store.push(echo[i]);
      }
      self.echoImages();
      window.onscroll = self.echoImages;
    },

    echoImages: function () {
      for (var i = 0; i < self.store.length; i++) {
        var elem = self.store[i];
        if (self.scrolledIntoView(elem)) {
          console.log('Logging: ' + self.scrolledIntoView(elem));
          self.echoSrc(elem, self.removeEcho(elem, i));
        }
      }
    },

    scrolledIntoView: function (element) {
      var coords = element.getBoundingClientRect();
      return ((coords.top >= 0 && coords.left >= 0 && coords.top) <= (window.innerHeight || document.documentElement.clientHeight) + self.off);
    },

    echoSrc: function (imgz, callback) {
      imgz.src = imgz.getAttribute('data-echo');
      if (callback) {
        callback();
      }
    },

    removeEcho: function (element, index) {
      if (self.store.indexOf(element) !== -1) {
        self.store.splice(index, 1);
      }
    }

  };

  return {
    init: self.init
  };

})(window, document);