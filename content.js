
"use strict";


document.addEventListener("DOMContentLoaded", function() {

	if (window.location.pathname == '/widget_auth.php' && /https:\/\/vk\.com\/widget_auth\.php\?app=6433160/.test(window.location.href)) {
		
		var script = document.createElement('style');
			script.innerHTML = ' .wauth_grey_row { display: none } ';	
			document.head.appendChild(script);
	}
	
	if ((window.location.pathname == '/authorize' || window.location.pathname == '/oauth/authorize') && /state=vkhelper/.test(window.location.href)) { 
		var script = document.createElement('style');
			script.innerHTML = 'html:not(.vkhelper_plugin_oauth) body {display:none; color: red}';	
			document.head.appendChild(script);
	}
	
	var script = document.createElement('script');
		script.src = chrome.runtime.getURL('source/lib/jquery.js');
		script.async = false;	
		document.head.appendChild(script);
		
	var script = document.createElement('script');
		script.src = chrome.runtime.getURL('source/vk.js');
		script.async = false;		
		document.head.appendChild(script);
	
	var script = document.createElement('script');
		script.src = chrome.runtime.getURL('source/lib/jszip.min.js');
		document.head.appendChild(script);
	
	var script = document.createElement('script');
		script.src = chrome.runtime.getURL('source/lib/FileSaver.js');
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

