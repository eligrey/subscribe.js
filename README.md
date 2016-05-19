subscribe.js (work in progress)
============

subscribe.js is a framework that makes it very easy to retrofit push notification subscription functionality onto websites without ever having to touch your backend. subscribe.js automatically integrates with your existing syndication feeds.


Demo
----

Try out the [live demo](https://eligrey.com/demos/subscribe.js/).

Usage
-----

Specify your feeds and Twitter profile in your document as such:

```html
<meta name="twitter:author" name="@sephr"/>
<link rel="alternate" type="application/atom+xml" href="/feed.atom"/>
```

Include subscribe.js after your feed elements. 

```html
<script src="subscribe.js"/>
```

That's it! subscribe.js will automatically locate your feeds and attempt to subscribe your users to them. If you want more control, read below.

### Manual control

Include a `data-mode="API"` attribute on your subscribe.js script to disable auto-run functionality. This lets you to be in control of when the notification subscription dialog will appear to your user. The following are examples of manual control.


```html
<script src="subscribe.js" data-mode="API"/>
<button id="subscribe" onclick="subscribe.toggle(this)">Subscribe</button>
<script>
subscribe.check(document.getElementById("subscribe"));
</script>
```

You can also specify feed information directly on a link, allowing full graceful degradation for users that have scripting completely disabled. This method is just as semantically valid as using a `<link>` element.

```html
<a id="subscribe" rel="alternate" type="application/atom+xml" href="/feed.atom" onclick="subscribe.toggle(this)">Subscribe</a>

<script src="subscribe.js" data-mode="API"/>
<script>
subscribe.check(document.getElementById("subscribe"));
</script>
```

### Customizing the refresh interval

You can configure the refresh interval of a feed by including a `data-interval` attribute on relevant `<link>` and `<meta>` elements. The value of this attribute is the refresh interval, in seconds. If the refresh interval is not specified, subscribe.js defaults to a 3 hour interval for feeds and a 1 hour interval for Twitter profiles.

### Requirements

* This framework can only be used over HTTPS.
    * [Let's Encrypt](https://letsencrypt.org/getting-started/) and [CloudFlare](https://www.cloudflare.com/) both offer free certificates for HTTPS.
* subscribe.js must be hosted on the same domain as the page it is used on.
* Feeds either need to be from the same domain or from a [CORS-enabled](https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS) external domain.


API
---

<dl>
	<dt>Promise(void) <code><strong>subscribe</strong>(optional int <strong>force_interval</strong>)</code></dt>
	<dd>
	Subscribes the user to all feeds and Twitter profiles detected on the page.
	<br/><strong>Note:</strong> This function will automatically run unless you include subscribe.js in <a href="https://purl.eligrey.com/github/subscribe.js/blob/master/README.md#manual-control">manual mode</a>.
	</dd>
	<!--
	<dt><code><strong>subscribe</strong>(Feed {String <strong>uri</strong>, int <strong>interval</strong>} [, Feed feed-n])</code></dt>
	<dd>
	Subscribes the user to all feeds and Twitter profiles specified.
	</dd>
	-->
	<dt>Promise(void) <code>subscribe.<strong>cancel</strong>()</code></dt>
	<dd>
	Unsubscribes the user from all subscribed feeds.
	</dd>
	<dt>Promise(bool) <code>subscribe.<strong>check</strong>(optional Element <strong>element</strong>, optional String <strong>subscribe_message</strong>, optional String <strong>unsubscribe_message</strong>)</code></dt>
	<dd>
	Returns promise that resolves to true if the user is subscribed to all autodetected feeds. Otherwise, the promise resolves to false. If an element is specified, the following changes will happen to the element once the promise resolves.
	<br/><code>element.textContent</code> is set to <code>unsubscribed || "Unsubscribe"</code> if the user is subscribed, and <code>subscribe || "Subscribe"</code> if the user is unsubscribed.
	<br/>Additionally, the CSS class <code>subscribe-js-on</code> is set on the element if the user is subscribed, and vice-versa for <code>subscribe-js-off</code>.
	</dd>
	<dt>Promise(void) <code>subscribe.<strong>toggle</strong>(optional Element <strong>element</strong>)</code></dt>
	<dd>
	Calls <code>subscribe.check(element)</code> and returns a promise that resolves once the subscriptions to all detected feeds have been toggled.
	</dd>
</dl>


Future
------

* (1.0.0) Initial release with Atom feed support.
* (1.0.1) Twitter profile support.
* (1.0.2) RSS feed support.