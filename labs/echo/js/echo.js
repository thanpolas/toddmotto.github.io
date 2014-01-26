/*! Echo v1.4.0 | (c) 2014 @toddmotto | MIT license | github.com/toddmotto/echo */
window.Echo = (function (global, document, undefined) {

  'use strict';

  var store = [], offset, throttle, poll;

  var _inView = function (element) {
    var coords = element.getBoundingClientRect();
    return ((coords.top >= 0 && coords.left >= 0 && coords.top) <= (window.innerHeight || document.documentElement.clientHeight) + parseInt(offset));
  };

  var _pollImages = function () {
    var length = store.length;
    if (length > 0) {
      for (var i = 0, len = length; i < len; i++) {
        var self = store[i];
        if (self && _inView(self)) {
          self.src = self.getAttribute('data-echo');
          store.splice(i, 1);
          len = length;
          i--;
        }
      }
    } else {
      if (document.removeEventListener) {
        global.removeEventListener('scroll', _throttle);
      } else {
        global.detachEvent('onscroll', _throttle);
      }
      clearTimeout(poll);
    }
  };

  var _throttle = function () {
    clearTimeout(poll);
    poll = setTimeout(_pollImages, throttle);
  };

  var init = function (obj) {
    var nodes = document.querySelectorAll('[data-echo]');
    var opts = obj || {};
    offset = opts.offset || 0;
    throttle = opts.throttle || 250;

    for (var i = 0; i < nodes.length; i++) {
      store.push(nodes[i]);
    }

    _pollImages();

    if (document.addEventListener) {
      global.addEventListener('scroll', _throttle, false);
      global.addEventListener('load', _throttle, false);
    } else {
      global.attachEvent('onscroll', _throttle);
      global.attachEvent('onload', _throttle);
    }
  };

  return {
    init: init,
    render: _throttle
  };

})(this, document);
