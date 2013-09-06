window.suave = (function (window, document, undefined) {

  'use strict';

  /**
   * Constructor function
   */
  var Suave = function (elem) {
    this.elem = elem;
  };
  
  var supportsVideoType = function (type) {
    var video = document.createElement('video');
    return !!video.canPlayType('video/' + type);
  };

  /**
   * Prototypal setup
   */
  Suave.prototype = {

    init : function () {

      var dataAttr = this.elem.getAttribute('data-src');
      var videoSource = dataAttr.match(/^([^]+)\{/)[1];
      var fileExts = dataAttr.match(/\{([^]+)\}$/)[1].toString().replace(/\s/g, '').split(',');

      alert(dataAttr);
      
      for (var i = 0; i < fileExts.length; i++) {
        var extension = fileExts[i];
        alert(extension);
        if (supportsVideoType(extension)) {
          alert(supportsVideoType(extension));
          var video = document.createElement('video');
          video.src = videoSource + extension;
          video.type = 'video/' + extension;
          video.setAttribute('autoplay', true);
          video.className = 'suave';
          this.elem.parentNode.replaceChild(video, this.elem);
          break;
        }
      }

    }

  };

  /**
   * Initiate the plugin
   */
  [].forEach.call(document.querySelectorAll('video[data-src]'), function (suave) {
    alert(suave);
    //new Suave(suave).init();
  });

})(window, document);