"use strict";

var dataPrx = {};
	
browser.runtime.onMessage.addListener(function (message) {

	if (message.dataPrx) {
		dataPrx = message.dataPrx;
	}
	
});

function FindProxyForURL(url, host) {

	if (shExpMatch(host, "imv4.vk.com")) {
		return "auto_detect";
	}
	
	if (dataPrx.api.details.ip) {
		if (shExpMatch(host, "api.vk.com")) {
			return "PROXY "+ dataPrx.api.details.ip +":"+ dataPrx.api.details.port;
		}
	}
		
	if (dataPrx.web.details.ip) {
		if (dnsDomainIs(host, "vk.com") && !shExpMatch(host, "api.vk.com")) {
			return "PROXY "+ dataPrx.web.details.ip +":"+ dataPrx.web.details.port;
		}
	}
		
	return "auto_detect";
	
}

function shExpMatch(a, b) {
	return a == b;
}


function dnsDomainIs(url, host) {

	if (url.substr(-1) != '/') {
		url += '/';
	}
	
	var h = url.match(/(https?:\/\/)?(.+?)\//i);
	
	if (!h) {
		return false;
	}
	
	h = h.pop();
	
	if (h == host) {
		return true;
	}

	var reg = new RegExp('\\.'+ host +'$', 'i');
	
	return reg.test(h);
	
}

