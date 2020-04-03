
"use strict";

document.addEventListener("DOMContentLoaded", function() {

	var script = document.createElement('script');
		script.src = chrome.runtime.getURL('source/vkhelper.js');
		script.async = false;		
		document.head.appendChild(script);
	
});

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){ 

	if (message.to != "vk" || message.from != "bg") {
		return;
	}
	
	window.postMessage(message, '*');
		
});

window.addEventListener("message", function(event) {

  	if (event.source != window || !event.data.type)
  		return;
		
  	if (event.data.from == "vk" && event.data.to == "bg") {

  		chrome.runtime.sendMessage(event.data);	
  		return;
  	}
  		
});



