---
layout: post
permalink: /raw-javascript-jquery-style-fadein-fadeout-functions-hugo-giraudel
title: Raw JavaScript, jQuery-style fadeIn and fadeOut functions from @HugoGiraudel
---

Today's article is from [Hugo Giraudel](http://hugogiraudel.com). For those who don't know Hugo, he describes himself as a CSS goblin and JavaScript dabbler. He's going to take you through some raw JavaScript, jQuery-style fadeIn and fadeOut functions - take it away!

<div class="download-box">
	<a href="//toddmotto.com/labs/javascript-fade" onclick="_gaq.push(['_trackEvent', 'Click', 'Demo JavaScript Fade, 'JavaScript Fade Demo']);">Demo</a>
	<a href="//toddmotto.com/labs/javascript-fade/javascript-fade.zip" onclick="_gaq.push(['_trackEvent', 'Click', 'Download JavaScript Fade, 'JavaScript Fade Download']);">Download</a>
</div>

--

Hi guys! I'm Hugo!

Every front-end developer has to use JavaScript, it's awesome, it's useful, it's unavoidable! Many developers are using jQuery for DOM interactions and manipulations. Ah, jQuery. What an awesome Swiss army knife!

But jQuery is frigging heavy - around 92kb minified. This is huge. Especially when a developer includes it in their page to only write a few lines of code. I believe that's why Todd wrote [this article](http://toddmotto.com/creating-jquery-style-functions-in-javascript-hasclass-addclass-removeclass-toggleclass) a couple of weeks ago on how to create your own _addClass()_, _removeClass()_ and _toggleClass()_ functions.

Well today, let's take this step further and create our very own _fadeIn()_ and _fadeOut()_ functions in order to avoid loading jQuery just for a little smoothy effect. I'm definitely not a JS hacker, so any code improvements are appreciated. If you feel like proposing something better, please do so! :)

Let's start with the basics and understand jQuery's fadeIn() and fadeOut(). Both functions allow us to fade in or out an element's opacity and display method very smoothly, at a set duration (depending how quick you'd like the effect). We want our functions to do the same. When making an element disappear, we want it to be turned to 'display:none;' to remove it from the flow.

### FadeOut()

Let's start with the fadeOut() function. We'll pass in 2 arguments: the duration and the element to be removed, the duration being 'ms' for milliseconds, and 'el' shortened from 'element'.

{% highlight javascript %}
function fadeOut(ms, el) {

}
{% endhighlight %}

To progressively reduce the element opacity, we will need to use a timer. Every 'X' milliseconds, this timer will call a function which reduces the opacity smoothly.

{% highlight javascript %}
function fadeOut(ms, el) {
	var fading = window.setInterval(func, interval);
}
{% endhighlight %}

Beware, 'interval' isn't the duration. The interval is the duration between two calls. It will be an arbitrary defined value, small enough to make the animation as smooth as possible, but not too much to avoid being too heavy. Let's say 50ms.

If you divide the interval by the duration, you get the amount of opacity which is taken off at each function call. So if you want the animation to be 1000ms long, and the interval is 50ms long, you'll have 20 calls (1000/50) each one reducing opacity by 0.05 (50/1000). Let's start by defining our variables;

{% highlight javascript %}
function fadeOut(ms, el) {
	var opacity = 1,
		interval = 50,
		gap = interval / ms;
		
	var fading = window.setInterval(func, interval);
}
{% endhighlight %}

Now, we have to define the function that will actually decrease opacity. Since this won't be called by anything else than our timer, we can define it in our fadeOut() function:

{% highlight javascript %}
function fadeOut(ms, el) {
	var opacity = 1,
		interval = 50,
		gap = interval / ms;
		
		function func() {  }
		
		var fading = window.setInterval(func, interval);
}
{% endhighlight %}

I've introduced a new function called _func()_, which decreases the element opacity by 'gap'. 

{% highlight javascript %}
function fadeOut(ms, el) {
	var opacity = 1,
		interval = 50,
		gap = interval / ms;
		
	function func() { 
		opacity -= gap;
		el.style.opacity = opacity;
	}
	
	var fading = window.setInterval(func, interval);

}
{% endhighlight %}

Almost done! We have to make it stop when it reaches _0_ so that it doesn't keep running, sucking resources and slowing down the whole page. We make a quick _if_ statement to check the opacity level is _less than or equal to zero_, and if so, we clearInterval.

{% highlight javascript %}
function fadeOut(ms, el) {
	var opacity = 1,
		interval = 50,
		gap = interval / ms;
		
	function func() {
		opacity -= gap;
		el.style.opacity = opacity;
		
		if(opacity <= 0) {
			window.clearInterval(fading);
		}
	}
	
	var fading = window.setInterval(func, interval);
	
}
{% endhighlight %}

Last but not least, we have to remove the item from the flow (which is different from removing the item from the DOM) by setting it to 'display:none;'.

{% highlight javascript %}
function fadeOut(ms, el) {
	var opacity = 1,
		interval = 50,
		gap = interval / ms;
		
	function func() { 
		opacity -= gap;
		el.style.opacity = opacity;
		
		if(opacity <= 0) {
			window.clearInterval(fading); 
			el.style.display = 'none';
		}
	}
	
	var fading = window.setInterval(func, interval);

}
{% endhighlight %}

Our function is finished. Here is how we can use it:

{% highlight javascript %}
var el = document.getElementById('myElement');
el.onclick = function(e) {
	fadeOut(750, this);
}
{% endhighlight %}

### FadeIn()

The fadeIn() is pretty much the same thing so I want explain it as I did for the previous one. I'll just drop the code and let you figure out what's going on. ;)

{% highlight javascript %}
function fadeOut(ms, el) {
	var opacity = 0,
		interval = 50,
		gap = interval / ms;
		
	el.style.display = 'block';
	el.style.opacity = opacity;
	
	function func() { 
		opacity += gap;
		el.style.opacity = opacity;
		
		if(opacity >= 1) {
			window.clearInterval(fading);
		}
	}
	
	var fading = window.setInterval(func, interval);
	
}
{% endhighlight %}

Note the major difference: before doing anything, we display the element to block and set its opacity to 0 so that we see the difference when the opacity gets increased.

### Merging both functions

The fact is: both functions look pretty much the same. For the sake of brevity, we could merge both functions into a single one, accepting a new argument; the type of animation, _in_ or _out_. This will make things much more efficient and manageable. Let's start with this:

{% highlight javascript %}
function fade(type, ms, el) {

	function func() {
	
	}
	
	var fading = window.setInterval(func, interval);

}
{% endhighlight %}

Now, a few things depend on if the transition is in or out, like the default opacity, the incrementation/decrementation, the display applied, and so on. Let's start with getting the type. Since there are more things going on when it's a fadeIn, I created a boolean depending on if the type is in or not in.
	
{% highlight javascript %}
function fade(type, ms, el) {
	var isIn = (type == 'in'),
		opacity = isIn ? 0 : 1,
		interval = 50,
		gap = interval / duration;
		
	...
	
}
{% endhighlight %}

The other variables do not change except the opacity which is equals to _0_ if it's a fadeIn() and _1_ if it's a fadeOut(). 'opacity = isIn ? 0 : 1' is the shorthand for:

{% highlight javascript %}
if(isIn === true) {
	opacity = 0;
} else {
	opacity = 1;
}
{% endhighlight %}

Do you remember we have to set the display to 'block' and the opacity to 0 if it's a fadeIn() animation? Let's do it now:

{% highlight javascript %}
function fade(type, ms, el) {
	var isIn = (type == 'in'),
		opacity = isIn ? 0 : 1,
		interval = 50,
		gap = interval / duration;
	
	if(isIn) {
		el.style.display = 'block';
		el.style.opacity = opacity;
	}
	
	...
	
}
{% endhighlight %}

Now the animation internal function. It decrements 'opacity' by 'gap' if it's a fadeOut() ('opacity -= gap') and it increments it if it's a fadeIn() ('opacity += gap').

{% highlight javascript %}
function fade(type, ms, el) {

	...
	
	function func() {
		opacity = isIn ? opacity + gap : opacity - gap;
		el.style.opacity = opacity;
	}
	
	...

}
{% endhighlight %}

We still have two things left: if the opacity is below 0, we set the element to 'display:none;' and if the opacity is below 0 or beyond 1, we clear the timer to stop the animation.

{% highlight javascript %}
function fade(type, ms, el) {
	var isIn = (type == 'in'),
		opacity = isIn ? 0 : 1,
		interval = 50,
		gap = interval / duration;
		
	if(isIn) {
		el.style.display = 'block';
		el.style.opacity = opacity;
	}
	
	function func() {
		opacity = isIn ? opacity + gap : opacity - gap;
		el.style.opacity = opacity;
		
		if(opacity <= 0) { el.style.display = 'none' }
		if(opacity <= 0 || opacity >= 1) { window.clearInterval(fading); }
	}
	
	var fading = window.setInterval(func, interval);
	
}
{% endhighlight %}

Voila! We have a single function handling both fadeIn() and fadeOut().

{% highlight javascript %}
var el = document.getElementById('my-element');
el.onclick = function(e) {
	fade('out', 500, this);
}
document.onclick = function(e) {
	fade('in', 1000, el);
}
{% endhighlight %}

### What about Internet Explorer 8?

When doing 'el.style.opacity', it changes the value of the 'opacity' property on the element 'el'. Problem is Internet Explorer 8 and below don't understand this property. If we want to enable support for these browsers, we will need to use Microsoft proprietary filters. 

{% highlight javascript %}
/* For Internet Explorer 5, 6 and 7 */
el.style.filter = 'alpha(opacity=' + opacity + ')';

/* For Internet Explorer 8 */
el.style.filter = 'progid:DXImageTransform.Microsoft.Alpha(Opacity=' + opacity + ')';
{% endhighlight %}

So everytime we change opacity, we have to use this. Not great huh? What about passing a flag to the function so that you can force IE support only when you really need it? Let's try it.

{% highlight javascript %}
function fade(type, ms, el, IEsupport) {
	var isIn = (type == 'in'),
		IE = IEsupport ? IEsupport : false,
		opacity = isIn ? 0 : 1,
		interval = 50,
		gap = interval / duration;
		
	...
	
}
{% endhighlight %}

Basically, this tells the function we want 'IE' to be a boolean. If 'IEsupport' has been set to 'true', 'IE' is true as well. Whatever else could it be, it's false. Then, we use the 'IE' boolean to add filters if required. Easy as a pie.

{% highlight javascript %}
function fade(type, el, duration, IEsupport) {
    var isIn     = (type == 'in'),
        IE       = (IEsupport) ? IEsupport : false,
        opacity  = isIn ? 0 : 1,
        interval = 50,
        gap      = interval / duration;
        
    if(isIn) {
         el.style.display = 'block';
         el.style.opacity = opacity;
         if(IE) {
            el.style.filter = 'alpha(opacity=' + opacity + ')';
            el.style.filter = 'progid:DXImageTransform.Microsoft.Alpha(Opacity=' + opacity + ')';
        }
    }
    
    function func() {
        opacity = isIn ? opacity + gap : opacity - gap; 
        el.style.opacity = opacity;
        if(IE) {
            el.style.filter = 'alpha(opacity=' + opacity * 100 + ')';
            el.style.filter = 'progid:DXImageTransform.Microsoft.Alpha(Opacity=' + opacity * 100 + ')';
        }
        
        if(opacity <= 0 || opacity >= 1) { window.clearInterval(fading); }
        if(opacity <= 0) { el.style.display = 'none'; }
    }
    
    var fading = window.setInterval(func, interval);
}
{% endhighlight %}

### Usage
Here is how you can use the function - which is also in the demo:

{% highlight javascript %}
//fadeIn
fade('in', this, 750, true);

//fadeOut
fade('out', this, 750, true);
{% endhighlight %}

### querySelector
It's worth pointing out that you don't need to use an _ID_ attribute to use raw JavaScript, querySelector is almost as great as jQuery's selector. If you're supporting IE8 and above, then it's much better to use it (demo uses getElementById), like so:

{% highlight javascript %}
var classname = document.querySelector('.classname');
{% endhighlight %}

<div class="download-box">
	<a href="//toddmotto.com/labs/javascript-fade" onclick="_gaq.push(['_trackEvent', 'Click', 'Demo JavaScript Fade, 'JavaScript Fade Demo']);">Demo</a>
	<a href="//toddmotto.com/labs/javascript-fade/javascript-fade.zip" onclick="_gaq.push(['_trackEvent', 'Click', 'Download JavaScript Fade, 'JavaScript Fade Download']);">Download</a>
</div>

That's pretty much it guys! Please, be sure to ask any question or even propose something better. ;)