
"use strict";


var VKH_debug = {
	mutationObserver : 0
};

var vkhelper = {};


vkhelper.lang = {

	select  : 'ru',
	
	default : 'ru',
	
	get : function (plugin_name, lang_tag, replace_obj) {
	
		var str = vkhelper.plugins[plugin_name].lang[vkhelper.lang.select] && 
			   	  vkhelper.plugins[plugin_name].lang[vkhelper.lang.select][lang_tag] 
					? vkhelper.plugins[plugin_name].lang[vkhelper.lang.select][lang_tag]  
					: vkhelper.plugins[plugin_name].lang[vkhelper.lang.default][lang_tag]; 
	
		if (!replace_obj) {
			return str;
		}
		
		jQuery.each(replace_obj, function (key, val) {
			str = str.replace(new RegExp('%'+ key +'%', 'g'), val);
		});
		
		return str;
	}
	
};	
		
	
vkhelper.messages = {

	isStart : false, 
	
	list : {},
	
	listener : function() {
	
		if (vkhelper.messages.isStart) {
			return;
		}
		
		vkhelper.messages.isStart = true;
		
		window.addEventListener("message", function(event) {

		  	if (event.data.to != 'vk' || event.data.from != 'bg') {
		  		return;
		  	}
  		
			if (!event.data.type || !vkhelper.messages.list[event.data.type]) {
				return;
			}
			
			vkhelper.messages.list[event.data.type](
				event.data.details
			);
			
		});
			
	}, 
	
	onMessage: function(type_message, func) {
	
		if (vkhelper.messages.list[type_message] == func) {
			return;
		}
	
		vkhelper.messages.list[type_message] = func;
		
		vkhelper.messages.listener();
		
	},
	
	sendToBG : function(data) {
	
		data.from = 'vk';
		data.to   = 'bg';
		
		window.postMessage(data, '*');
		
	},
	
	derec : function (obj) {
		
		if (jQuery.type(obj) == 'object' || jQuery.type(obj) == 'array') {

			if (obj.vkhelper_type_function && obj.func) {
			
				obj = eval('(' + obj.func + ')');
				
			} else {
			
				jQuery.each(obj, function(k,v) {

					obj[k] = vkhelper.messages.derec(obj[k]);
			
				});
			
			}
		
		}
			
		return obj;
			
	}
	
};


vkhelper.togglePlugin = function(plugin_name, plugin_status) {

	plugin_status = plugin_status == true ? true : false;
			
	vkhelper.plugins[plugin_name].storage.enabled = plugin_status;
	
	jQuery('html').toggleClass('vkhelper_plugin_'+ plugin_name, plugin_status);
	
	if (plugin_status == true) {
			
		if (vkhelper.plugins[plugin_name].css && !jQuery('style#vkhelper_style_'+ plugin_name).length) {

			var css = '';
			if (typeof vkhelper.plugins[plugin_name].css == "function") {
				css = vkhelper.plugins[plugin_name].css.toString().match(/function[^\(]*\(\s*([^\)]*?)\s*\)[^\{]*\{([\s\S]+)\}/i)[2].trim().substr(2).slice(0, -2);
			} else { 
				css = vkhelper.plugins[plugin_name].css;
			}
		
			jQuery('body').append("<style id='vkhelper_style_"+ plugin_name +"'>"+ css +"</style>");
		
		}
			
		if (vkhelper.plugins[plugin_name].vk_script && vkhelper.plugins[plugin_name].vk_script.on) {
			vkhelper.plugins[plugin_name].vk_script.on();
		}
			
	} 
	else {
		
		if (vkhelper.plugins[plugin_name].vk_script && vkhelper.plugins[plugin_name].vk_script.off) {
			vkhelper.plugins[plugin_name].vk_script.off();
		}
		
	}
	
};


vkhelper.pluginEditParam = function(plugin_name, fields) {
	
	jQuery.each(fields, function(field_name, field_value) {
		vkhelper.plugins[plugin_name].storage[field_name] = field_value;	
	});
	 
	if (vkhelper.plugins[plugin_name].vk_script && vkhelper.plugins[plugin_name].vk_script.editField) {
		vkhelper.plugins[plugin_name].vk_script.editField(fields);
	}
		
};

	
vkhelper.mutationObserver = {

	observer : false,
	
	info : {}, 
	
	add : function(name, func) {
	
		if (VKH_debug.mutationObserver) {
			console.log('mutationObserver.add', name);
		}
		
		if (vkhelper.mutationObserver.info[name] && vkhelper.mutationObserver.info[name] == func) return;
			
		vkhelper.mutationObserver.info[name] = func;
		
		func();
		
		vkhelper.mutationObserver.reload();
		
	},
	
	remove : function(name) {
	
		if (VKH_debug.mutationObserver) {
			console.log('mutationObserver.remove', name);
		}
	
		delete vkhelper.mutationObserver.info[name];
		
		vkhelper.mutationObserver.reload();
		
	},
	
	start : function() {
	
		if (VKH_debug.mutationObserver) {
			console.log('mutationObserver.start');
		}
	
		vkhelper.mutationObserver.observer = new MutationObserver(function(mutations) {
			 
			if (VKH_debug.mutationObserver) {
				console.log('mutationObserver.observer', mutations);
			}
		
			for (name in vkhelper.mutationObserver.info) {
				vkhelper.mutationObserver.info[name]();
			}
		
		});
 
		vkhelper.mutationObserver.observer.observe(
			jQuery('body')[0], 
			{ childList: true, subtree: true }
		);
		
	},
	
	reload : function() {
	
		if (VKH_debug.mutationObserver) {
			console.log('mutationObserver.reload');
		}
	
		if (vkhelper.mutationObserver.observer) {
			vkhelper.mutationObserver.observer.disconnect();
		}
		
		vkhelper.mutationObserver.start();
		
	}

};


vkhelper.messages.onMessage('vkhelper_vk_init_result', function(details) {

	vkhelper.lang.select  = details.lang.select;
	vkhelper.lang.defauls = details.lang.default;
	vkhelper.plugins      = vkhelper.messages.derec(details.plugins);

	jQuery.each(vkhelper.plugins, function (plugin_name, plugin_details) {
			
		if (plugin_details.vk_script && plugin_details.vk_script.messages) {
			
			jQuery.each(plugin_details.vk_script.messages, function (msg_name, msg_func) {
				
				vkhelper.messages.onMessage(msg_name, msg_func);
					
			});
				
		}
			
		vkhelper.togglePlugin(
			plugin_name, 
			plugin_details.storage.enabled || false
		);
			
	});

});

vkhelper.messages.sendToBG({ 
	type : 'vkhelper_vk_init'
});
	

						
jQuery('body').append('\
	<script src="https://use.fontawesome.com/releases/v5.0.6/js/brands.js"></script>\
	<script src="https://use.fontawesome.com/releases/v5.0.6/js/solid.js"></script>\
	<script src="https://use.fontawesome.com/releases/v5.0.6/js/regular.js"></script>\
	<script src="https://use.fontawesome.com/releases/v5.0.6/js/fontawesome.js"></script>');
	







vkhelper.debounce = function (func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};
			
var debounce = function(func, wait) {
 // we need to save these in the closure
 var timeout, args, context, timestamp;

 return function() {

  // save details of latest call
  context = this;
  args = [].slice.call(arguments, 0);
  timestamp = new Date();

  // this is where the magic happens
  var later = function() {

   // how long ago was the last call
   var last = (new Date()) - timestamp;

   // if the latest call was less that the wait period ago
   // then we reset the timeout to wait for the difference
   if (last < wait) {
    timeout = setTimeout(later, wait - last);

   // or if not we can null out the timer and run the latest
   } else {
    timeout = null;
    func.apply(context, args);
   }
  };

  // we only need to set the timer now if one isn't already running
  if (!timeout) {
   timeout = setTimeout(later, wait);
  }
 }
};

var escapeHtml = (function () {
    'use strict';
    var chr = { '"': '&quot;', '&': '&amp;', '<': '&lt;', '>': '&gt;' };
    return function (text) {
        return text.replace(/[\"&<>]/g, function (a) { return chr[a]; });
    };
}());	
