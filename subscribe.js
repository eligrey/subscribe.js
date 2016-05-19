/* subscribe.js
 * 
 * 0.0.0 (incomplete)
 * 2016-03-29
 *
 * By Eli Grey, https://eligrey.com
 * License: MIT
 *   See https://github.com/eligrey/subscribe.js/blob/master/LICENSE.md
 */

/*global self */
/*jslint bitwise: true, indent: 4, laxbreak: true, laxcomma: true, smarttabs: true, plusplus: true */

/*! @source https://purl.eligrey.com/github/subscribe.js/blob/master/subscribe.js */

// TODO: use async/await
// TODO: finish everything

"use strict";

var subscribe;

let ( // data used in both contexts (service worker & <script>)
	  view = self
	, dependencies = ["https://cdnjs.cloudflare.com/ajax/libs/localforage/1.4.0/localforage.min.js"]
	, twitter = /^\s*https?:\/{2,}(?:[\w-]+\.)*twitter\.com(?::[0-9]*)?(?:\/|\s*$)/i
	// use /^\s*(?:(?:text|application)\/xml|\S*\/(?:atom|rss)\+xml)\s*(?:$|;)/i once we support RSS
	, supported_feed_types = /^\s*(?:application\/atom\+xml)\s*(?:$|;)/i
	// enable passive localization with https://purl.eligrey.com/github/l10n.js
	, l = str => str.toLocaleString()
	, call = func => func()
) {

// inject a stylesheet & use classes for the subscribe bar

if ("document" in view) page: {
	if (subscribe) break page;

	let
	  // intentionally not limiting the default query to <link> elements—<a> can have rel and type
	  feed_query = "[rel~='alternate' i], meta[name='twitter:site' i], meta[name='twitter:creator' i]"
	, detected_feeds = new Map(Array.from(document.querySelectorAll(feed_query))
		.filter(link =>
			   link.localName.toLowerCase() === "meta"
			|| supported_feed_types.test(link.type)
		)
		.map(link => [resolve_url(
			link.href || "content" in link && link.content.trim().replace(/^@/, "https://twitter.com/")
		), link.dataset.interval])
	);

	if (!detected_feeds.size) {
		console.warn(l("Unable to locate any feeds"));
	}

	if (!("serviceWorker" in navigator)) { // 🚫 service workers are unsupported
		subscribe = function() {
			let first_feed = detected_feeds.keys().next();
			if (!first_feed.done) {
				location.href = first_feed.value;
			}
			return new Promise(call);
		};
		subscribe.onready = call;
		subscribe.cancel = () => {};
		subscribe.check =
		subscribe.toggle =
			() => new Promise(resolve => resolve(true));
		break page;
	}

	let
	  document = view.document
	, console = view.console
	, here = document.currentScript || document.scripts[document.scripts.length-1]
	, mode = (here.dataset.mode || "auto").toLowerCase()
	, API_mode = mode === "api"
	, auto_mode = mode === "auto"
	, HTML = "http://www.w3.org/1999/xhtml"
	, load_scripts = function(uris) {
		return new Promise(function(resolve, reject) {
			let remaining = uris.length;
			for (let uri of urls) {
				let script = document.documentElement.appendChild(document.createElementNS(HTML, "script"));
				script.onload = function() {
					if (!--remaining) {
						resolve();
					}
				};
				script.onerror = reject.bind(this, uri);
				script.src = url;
			}
		});
	}
	, ready = false
	, ready_queue = []
	, dispatch_ready_queue = function() {
		ready = true;
		let callback;
		while (callback = ready_queue.pop()) {
			try {
				callback();
			} catch (ex) {
				console.error(l("subscribe.onready() callback error: ") + ex);
			}
	}
	, default_interval = 10800 // 3 hours in seconds
	, default_twitter_interval = 10800 // 1 hour in seconds
	, resolve_url = function() {
		let link = document.createElementNS(HTML, "a");
		link.href = url;
		return link.href;
	}
	, add_feed = function(uri, interval) {
		if (twitter.test(uri)) {
			return console.warn(l("Twitter feeds are not yet supported by subscribe.js"));
		}
		if (rss.test(uri)) {
			;
		}
		if (!interval) {
			if (twitter.test(uri)) {
				interval = default_twitter_interval;
			} else {
				interval = default_interval;
			}
		}
		subscribed_feeds.set(uri, interval || default_interval);
	}
	, onready = function(callback) {
		if (ready) {
			callback();
		} else {
			ready_queue.push(callback);
		};
		return new Promise(function(resolve) {
			ready_queue.push(resolve);
		});
	}
	, check = function (uris) { 
		for (let uri of uris) {
			if (!subscribed_feeds.has(uri)) {
				return false;
			}
		}
		return true;
	}
	, init = function() {
		if (not already registered) {
			navigator.serviceWorker.register(script_location, {scope: "./"}).then(function(registration) {
				var serviceWorker;
				if (registration.installing) {
					serviceWorker = registration.installing;
				} else if (registration.waiting) {
					serviceWorker = registration.waiting;
				} else if (registration.active) {
					serviceWorker = registration.active;
				}
				if (serviceWorker) {
					console.log(serviceWorker.state);
					serviceWorker.addEventListener("statechange", function(evt) {
						console.log(evt.target.state);
					});
				}
			}).catch(function(error) {
				console.log(error);
			});

			// https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration/showNotification
			/* // request notification permission (will go somewhere else)
			Notification.requestPermission(function(result) {
				if (result === "granted") {
					navigator.serviceWorker.ready.then(function(registration) {

					});
				}
			});
			*/

			navigator.serviceWorker.ready.then(function() {
				console.log("serviceworker ready");
			});
		}

		dispatch_ready_queue();
	}
	, subscribed_feeds = subscribe.feeds = new Map
	;

	console.info(l("Feed notifications powered by subscribe.js <https://purl.eligrey.com/subscribe.js>"));

	if (!API_mode && !auto_mode) {
		throw new Error(l("Unknown subscribe.js mode specified: ") + mode);
	}

	// maybe TODO? make this an automatic script with a default position:sticky subscribe bar UI
	
	subscribe = function(...feeds) {
		let
		  args = feeds.length
		, force_interval = feeds[0]
		;

		if (args <= 1 && !isNaN(force_interval)) {
			for (let [uri, interval] of detected_feeds) {
				add_feed(uri, force_interval || interval);
			}
		} else {
			for (let {uri, interval} of detected_feeds) {
				add_feed(uri, interval);
			}
		}
		return new Promise(call);
	};

	subscribe.onready = onready;

	subscribe.cancel = onready.bind(subscribe, function(...uris) {
		if (uris.length === 0) { // cancel all
			subscribed_feeds.clear();
		} else {
			for (let uri of uris) {
				subscribed_feeds.delete(uri);
			}
		}
	};

	subscribe.check = onready.bind(subscribe, function(element, sub_msg, unsub_msg) {
		if (check(Array.from(detected_feeds.keys()))) {
			element.textContent = unsub_msg || l("Unsubscribe");
		} else {
			element.textContent = sub_msg || l("Subscribe");
		}
	});

	load_scripts(dependencies).then(function() {
		// get and populate subscribed_feeds
		localforage.getItem("subscribed_feeds").then(function(feeds) {
			if (feeds === null) {
				localforage.setItem("subscribed_feeds", subscribed_feeds).then(init);
			} else {
				init();
			}
		});
	}, function(uri) {
		throw new Error(l("Problem loading ") + uri);
	});
} else worker: { // service worker stuff
	// latest is at https://github.com/isaacs/sax-js
	dependencies.push("https://cdn.rawgit.com/isaacs/sax-js/f1e66d77f1df029eefa0f2e5d871f0c44a205217/lib/sax.js");
	importScripts.apply(view, dependencies);

	view.addEventListener("install", function(evt) {
		;
	});

	view.addEventListener("message", function(evt) {
		if (evt.source) {
			// use event.source.postMessage
		}
		else if (view.clients) {
			clients.matchAll().then(function(clients) {
				for (var client of clients) {
					// use client.postMessage
				}
			});
		}
		else if (evt.data.port) {
			// use evt.data.port.postMessage
		}
	});

	if (Notification.permission === "default") {

	}

	// https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration/showNotification
	/* // some notification stuff
	registration.showNotification("title", {
		body: "body",
		icon: "/favicon.ico",
		requireInteraction: true,
		data: "url here"
	});
	*/

	// request feeds and parse xml
	// if a new post is detected, notify

	// https://developer.mozilla.org/en-US/docs/Web/API/Clients/openWindow
	view.addEventListener("notificationclick", function(evt) {
		clients.openWindow(evt.notification.data);
	});
}