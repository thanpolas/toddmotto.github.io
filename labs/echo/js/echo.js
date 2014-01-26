/*! Echo v1.4.0 | (c) 2014 @toddmotto | MIT license | github.com/toddmotto/echo */
window.Echo = (function (global, document, undefined) {

  'use strict';

  var store = [], offset, throttle, poll, element;

  var _inView = function (el) {
    var coords = el.getBoundingClientRect();
    return ((coords.top >= 0 && coords.left >= 0 && coords.top) <= (global.innerHeight || document.documentElement.clientHeight) + parseInt(offset));
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
        element.removeEventListener('scroll', _throttle);
      } else {
        element.detachEvent('onscroll', _throttle);
      }
      clearTimeout(poll);
    }
  };

  var _throttle = function () {
    clearTimeout(poll);
    poll = setTimeout(_pollImages, throttle);
  };

  var init = function (obj) {
    var opts = obj || {};
    offset = opts.offset || 0;
    throttle = opts.throttle || 250;
    element = opts.element ? document.querySelector(opts.element) : window;

    var nodes = document.querySelectorAll((opts.element || '') + ' [data-echo]');
    for (var i = 0; i < nodes.length; i++) {
      store.push(nodes[i]);
    }

    _throttle();

    if (document.addEventListener) {
      element.addEventListener('scroll', _throttle, false);
    } else {
      element.attachEvent('onscroll', _throttle);
    }
  };

  return {
    init: init,
    render: _throttle
  };

})(this, document);
