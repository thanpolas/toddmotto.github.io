---
layout: post
permalink: /stratos-js-simplifying-object-manipulation
title: Stratos.js, simplifying Object manipulation
---

JavaScript Objects are usually the driving force behind applications I develop, specifically JSON which gets sent back and forth from the server as acts as the main method of comms.

To save time rewriting the same (or similar) logic over and over again when dealing with our data (typically as part of a Model/View) - wouldn't it be great to use _one_ module to encapsulate the trickier object manipulation stuff and make developing the core of the application easier? It would also be great to bulletproof the object manipulation process, reducing object tasks, limit debugging, promote code reuse and even save a tonne of KB! Yes. So I built Stratos.js, a standalone 1KB module! It also comes fully equipped with unit tests for each method.

Stratos acts as a factory and supports AMD (require.js), browser globals and `module.exports` to run on Node/Browserify/CommonJS, so it can be used server-side too.

<div class="download-box">
  <a href="//github.com/toddmotto/stratos/archive/master.zip" onclick="_gaq.push(['_trackEvent', 'Click', 'Download stratos', 'Download stratos']);">Download</a>
  <a href="//github.com/toddmotto/stratos" onclick="_gaq.push(['_trackEvent', 'Click', 'Fork stratos', 'stratos Fork']);">Fork on GitHub</a>
</div>

Stratos has a few helper utilities, as well as powerful and time/byte saving methods. The methods that Stratos currently ships with are:

* has()
* type()
* add()
* remove()
* extend()
* destroy()
* keys()
* vals()
* toJSON()
* fromJSON()



<div class="download-box">
  <a href="//github.com/toddmotto/stratos/archive/master.zip" onclick="_gaq.push(['_trackEvent', 'Click', 'Download stratos', 'Download stratos']);">Download</a>
  <a href="//github.com/toddmotto/stratos" onclick="_gaq.push(['_trackEvent', 'Click', 'Fork stratos', 'stratos Fork']);">Fork on GitHub</a>
</div>
