/*! subscribe.js demo script
 *  2016-03-26
 *
 *  By Eli Grey, http://eligrey.com
 *  License: X11/MIT
 *    See LICENSE.md
 */

/*! @source http://purl.eligrey.com/github/subscribe.js/blob/master/demo/demo.js */

/*jshint laxbreak: true, laxcomma: true, smarttabs: true*/
/*global subscribe, self*/

(function(view) {
"use strict";
var
  document = view.document
, $ = function(id) {
	return document.getElementById(id);
}
, load_feed = function(uri) {
	//load xml from uri to feed
	//on request success: subscribe.feeds = [{uri: newfeed, interval: 100000}];
}
, feed = xml object
, session = view.sessionStorage
, force_notification
, blob
, push_notification = function() {
	//modify 'last modified' or 'last published' or something in the atom xml
	
	subscribe.feeds = [{uri: "demo"}];
}
;
}(self));
