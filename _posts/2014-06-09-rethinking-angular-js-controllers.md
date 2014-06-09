---
layout: post
permalink: /rethinking-angular-js-controllers
title: Rethinking AngularJS Controllers
path: 2014-06-09-rethinking-angular-js-controllers.md
---

Last month [Jonathan Creamer](https://twitter.com/jcreamer898) wrote an awesome article on Angular and MVC, _[The state of AngularJS Controllers](http://jonathancreamer.com/the-state-of-angularjs-controllers/)_. The article touches on misconceptions of client-side MVC and true Model and Controller separation.

This article is my rethinking of Angular Controllers, and best practices when using them in your team or for yourself.

### Controller as Model

What we're used to seeing in Controllers is most likely this (Angular docs even show us everything using this approach):

{% highlight javascript %}
app.controller('InboxCtrl',
  function InboxCtrl ($scope, $location, NotificationFactory) {

  $scope.messages = [];

  $scope.openMessage = function (message) {
    // myapp.com/message?id=19286396
    $location.search('id', message.id).path('/message');
  };

  $scope.deleteMessage = function (message) {
    $http.post('/message/delete', message)
    .success(function () {
      $scope.messages.splice(index, 1);
      NotificationFactory.showSuccess();
    });
  };

  $http.get('/messages')
  .success(function (data) {
    $scope.messages = data;
    NotificationFactory.showSuccess();
  })
  .error(function (data) {
    NotificationFactory.showError();
  });

});
{% endhighlight %}

Of course this is a more extreme example, there might be some reuse of the `$http`, but here we're totally abusing the Controller and using it to hold, create and maintain the Model state, as well as littering our Factories and other Services. This has massive impact across _many_ things:

* Makes code reuse very difficult
* Is very tightly coupled to a single Controller
* Makes testing very difficult
* Isn't separating the Model and Controller
* Encourages more bad habits

This results in the Controller becoming a bloated playground which can quickly spiral out of control into an intangible mess.

### Abstracting the Model

Jonathan's post made it strictly clear that absolutely _no_ Model data should be created or persisted in the Controller. I totally second that. When I first started writing Angular applications, I began thinking "What is the best way to create reusable functions?". I'm pretty settled on the following...

Reworking our Controller, we could aim to completely kill all Model creations in the Controller:

{% highlight javascript %}
app.controller('InboxCtrl',
  function InboxCtrl ($scope, InboxFactory) {

  $scope.messages = InboxFactory.messages;

  $scope.openMessage = function (message) {
    InboxFactory.openMessage(message);
  };

  $scope.deleteMessage = function (message) {
    InboxFactory.deleteMessage(message);
  };

  InboxFactory.getMessages().then(function (data) {
    InboxFactory.messages = data;
    $scope.messages = InboxFactory;
  });

});
{% endhighlight %}

+1 for readability, +1 for simplicity and +1 for being so easy to reuse. I've included an example of using a promise to resolve asynchronously fetched data as well.

We of course need the Factory to go with it:

{% highlight javascript %}
app.factory('InboxFactory',
  function InboxFactory ($location, NotificationFactory) {

  InboxFactory.messages = [];

  InboxFactory.openMessage = function (message) {
    $location.search('id', message.id).path('/message');
  };

  InboxFactory.deleteMessage = function (message) {
    $http.post('/message/delete', message)
    .success(function (data) {
      InboxFactory.messages.splice(index, 1);
      NotificationFactory.showSuccess();
    })
    .error(function () {
      NotificationFactory.showError();
    });
  };

  InboxFactory.getMessages = function () {
    return $http.get('/messages')
    .success(function (data) {
      return data;
    })
    .error(function () {
      NotificationFactory.showError();
    });
  };

});
{% endhighlight %}

Binding into our Controllers just got a lot simpler, the Model is abstracted, as is the Controller.

### "Controller as" syntax

Last month [I wrote about the `Controller as`](http://toddmotto.com/digging-into-angulars-controller-as-syntax) syntax in Angular, combined with Jonathan's abstracted MVC approach things just hit the next level of awesome inside Controllers

{% highlight javascript %}
// <div ng-controller="InboxCtrl as inbox"></div>
app.controller('InboxCtrl',
  function InboxCtrl (InboxFactory) {

  this.messages = InboxFactory.messages;

  this.openMessage = function (message) {
    InboxFactory.openMessage(message);
  };

  this.deleteMessage = function (message) {
    InboxFactory.deleteMessage(message);
  };

  InboxFactory.getMessages().then(function (data) {
    InboxFactory.messages = data;
    this.messages = InboxFactory;
  }.bind(this)); // use angular.bind for < IE9

});
{% endhighlight %}

### Delegated binding

You might have noticed a little something, which is a way to tie common assets inside the Controller, situated in this little gem:

{% highlight javascript %}
InboxFactory.getMessages().then(function (data) {
  InboxFactory.messages = data;
  this.messages = InboxFactory;
}.bind(this));
{% endhighlight %}

I might not persist the Model _in_ the Controller, but I create a _reference_ to my Model, using the `this.messages = [];` is a perfect example of this as the Model cannot talk to the View directly, use the Controller only as a middleman.

What I do is bind the promise result to `InboxFactory.messages = data;`, which assigns the value to the Model, then I assign my local Controller copy to the Model. This means that when the Factory updates the Model, the Controller updates, and when the Controller updates the Model, the Factory updates. It's a circle of binding love.

### What is the Model?

I've been chatting with [Jonathan](https://twitter.com/jcreamer898) recently on what _"is"_ the Model in client-side MVC. Is it the data? Is it the way to get the data? Is it both? Is it a way to persist the data?

We kind of agreed on a mix of both and that there are many options and opinions. We also agreed that using `Controller as` mixed with the above approach is superb architecture for Angular.

Jasmine/Karma unit testing is made much easier as well, we can test the Factory to ensure it's hitting all it's endpoints, fetching and updating the local data - and when testing the Controller we can go in knowing our Factory is bulletproof which will help us track down errors faster, and make our Controller tests even slimmer.

### When to $scope

If you need to use `$scope`, you'll likely need to listen to an event or emit one, or `$watch` for Model changes. Based on the above, this isn't a good idea to tie Model behaviour into the Controller again. Using `Controller as` allows us to inject the $scope, but think about how you can abstract the same behaviour into a Factory.

### Rules for the Controller going forward:

* Controllers should hold zero logic
* Controllers should bind references to Models only (and call methods returned from promises)
* Controllers only bring logic together
* Controller drives Model _changes_, and View _changes_. Keyword; drives, not creates/persists, it triggers them!
* Delegate shared properties inside the Controller, creating a copy and binding to both Controller and Factory
* Use "Controller as" ([read the article]())
* Keep things simple, I prefer XXXXCtrl and XXXXFactory, I know exactly what the two do, we don't need fancy names for things
* Keep names consistent across shared methods, such as `this.something = MyFactory.something;` otherwise it becomes confusing
* Factories hold the Model, change, get, update, and persist the Model changes
* Talk to other Factories inside your Factory, keep them out the Controller (things like success/error handling)
