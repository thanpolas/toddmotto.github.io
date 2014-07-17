---
layout: post
permalink: /deprecating-the-switch-statement-for-object-literals
title: Deprecating the switch statement for Object literals
path: 2014-07-17-deprecating-the-switch-statement-for-object-literals.md
---

In many programming languages, the `switch` statement exists - but should it any longer? If you're a JavaScript programmer, you're often jumping in and out of Objects, creating, instantiating and manipulating them. Objects are really flexible, they're at the heart of pretty much everything in JavaScript, and using them instead of the `switch` statement has been something I've been doing lately.

### What is the switch statement?
If you've not used `switch` before or a little unsure what it does, let's walk through it. What `switch` does it take input and provide an output, such as code being run.

Let's look at a usual `switch` statement:

{% highlight javascript %}
var type = 'coke';
var drink;
switch(type) {
case: 'coke':
  drink = 'Coke';
  break;
case: 'pepsi':
  drink = 'Pepsi';
  break;
default:
  drink = 'Unknown drink!';
}
console.log(drink); // 'Coke'
{% endhighlight %}

It's similar to `if` and `else` statements, but it should evaluate a single value - inside the `switch` we use a `case` to evaluate against each value.

When you start seeing lots of `else if` statements, something is likely wrong:

{% highlight javascript %}
function getDrink (type) {
  if (type === 'coke') {
    type = 'Coke';
  } else if (type === 'pepsi') {
    type = 'Pepsi';
  } else if (type === 'mountain dew') {
    type = 'Mountain Dew';
  } else if (type === 'lemonade') {
    type = 'Lemonade';
  } else if (type === 'fanta') {
    type = 'Fanta';
  } else {
    // acts as our "default"
    type = 'Unknown drink!';
  }
  return 'You\'ve picked a ' + type;
}
{% endhighlight %}

This implementation is too loose, there is room for error, plus it's a very verbose syntax to keep repeating yourself. The `switch` was the best tool for the job, albeit you need to keep adding `break;` statements to prevent cases falling through.

### Problems with switch

There are multiple issues with `switch`, even Douglas Crockford recommends not using it. The main one is the fact you need to keep adding the aforementioned `break;` statement. If you forget one of them, the cases will fall through - you'll have likely forgotten to add it because it's not very "JavaScripty", nor is the procedural style `switch` statement.

I find the `switch` statement very odd that it doesn't use the curly braces we're used to using with things like `if` and `else` too, it's syntax is rather... ugly to say the least. Especially when compared to the Object literals that we love...

### Object Literal lookups

We use Object's all the time, either as constructors or literals. Often, we use them for Object lookup purposes, to get values from Object properties.

Let's setup a simple Object literal that we can host some information on:

{% highlight javascript %}
var type = 'coke';

var drinks = {
  'coke': function () {
    return 'Coke';
  },
  'pepsi': function () {
    return 'Pepsi';
  },
  'lemonade': function () {
    return 'Lemonade';
  }
};
{% endhighlight %}

Then we can call the Object literal's function:

{% highlight javascript %}
drinks[type]();
{% endhighlight %}

This is by far better syntax, more maintainable and readable. We also don't have to worry about `break;` statements and cases falling through - it's just a plain Object!

Usually, we would delegate the work that `switch` would have done into a single function, so let's do the same here and turn an Object literal lookup it into a usable function:

{% highlight javascript %}
function getDrink (type) {
  var drinks = {
    'coke': function () {
      return 'Coke';
    },
    'pepsi': function () {
      return 'Pepsi';
    },
    'lemonade': function () {
      return 'Lemonade';
    }
  };
  return drinks[type]();
}

// let's call it
var drink = getDrink('coke');
console.log(drink); // 'Coke'
{% endhighlight %}

Nice and easy, but this doesn't cater for a "default" `case`, so we can create that easily:

{% highlight javascript %}
function getDrink (type) {
  var fn;
  var drinks = {
    'coke': function () {
      return 'Coke';
    },
    'pepsi': function () {
      return 'Pepsi';
    },
    'lemonade': function () {
      return 'Lemonade';
    },
    'default': function () {
      return 'Default item';
    }
  };
  // if the drinks Object contains the type
  // passed in, let's use it
  if (drinks[type]) {
    fn = drinks[type];
  } else {
    // otherwise we'll assign the default
    // also the same as drinks.default
    // it's just a little more consistent using square
    // bracket notation everywhere
    fn = drinks['default'];
  }
  return fn();
}

// called with "dr pepper"
var drink = getDrink('dr pepper');
console.log(drink); // 'Default item'
{% endhighlight %}

We could simplify the above `if` and `else` using the _or_ `||` operator inside an expression:

{% highlight javascript %}
function getDrink (type) {
  var drinks = {
    'coke': function () {
      return 'Coke';
    },
    'pepsi': function () {
      return 'Pepsi';
    },
    'lemonade': function () {
      return 'Lemonade';
    },
    'default': function () {
      return 'Default item';
    }
  };
  return (drinks[type] || drinks['default'])();
}
{% endhighlight %}

This wraps the two Object lookups inside parenthesis `( )`, treating them as an expression. The result of the expression is then invoked. If `drinks[type]` isn't found in the lookup, it'll default to `drinks['default']`, simple!

### Summing up

Object literals are a more natural control of flow in JavaScript, `switch` is a bit old and clunky and prone to difficult debugging errors. Object's are more extensible, maintainable, and we can test them a lot better. They're also part of a design pattern and very commonly used day to day in other programming tasks. Object literals can contain functions as well as any other [Object type](//toddmotto.com/understanding-javascript-types-and-reliable-type-checking), which makes them really flexible! Each function in the literal has function scope too, so we can return the closure from the parent function we invoke (in this case `getDrink` returns the closure);
