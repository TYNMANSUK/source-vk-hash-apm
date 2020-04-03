
"use strict";

var VKH_debug = {
	vkLongPoll : 0,
	task : 0
};

var task = {

	isEnabled : false,
	
	list : [],
	
	add : function (type, details, func) {

		if (VKH_debug.task) {
			console.log('task.add', type, details);
		}
		
		task.list.push(jQuery.extend({
			status  : 'waiting',
			type    : type,
			func    : func
		}, details));
		
		task.start();
		
	},
	
	abort : function (initiator) {
	
		if (VKH_debug.task) {
			console.log('task.abort', initiator);
		}
		
		jQuery.each(task.list, function(task_id, task_details) {
			if (task_details.initiator == initiator && task_details.status != 'finished') {
				task.update(task_id, {
					status : 'finished',
					abort : true
				});
			}
		});
		
	},
	
	update : function (task_id, details) {
	
		if (VKH_debug.task) {
			console.log('task.update', task_id, details);
		}

		jQuery.each(details, function(k,v) {
		
			switch (k) {
			
				case 'status':
					
					task.list[task_id].status = v;
					
					if (v == 'stop') {
						task.isEnabled = false;
						task.start();
					}
					
				break;
			
				case 'abort':
					
					task.list[task_id].abort = v;
					
				break;
			
				case 'isVisible':
					
					task.list[task_id].isVisible = v;
					
				break;
			
				case 'captcha':

					task.list[task_id].captcha = v;

				break;

				case 'nowCountAdd':
					
					if (v == 'max') {
						task.list[task_id].nowCount = task.list[task_id].maxCount;
					} 
					else {
						task.list[task_id].nowCount = (task.list[task_id].nowCount || 0) + v;
					}
					
				break;
				
				case 'nowCount':
					
					task.list[task_id].nowCount = v;
					
				break;
				
				case 'maxCount':
					
					task.list[task_id].maxCount = v;
					
				break;						
    										
				case 'onFinished':
					
					task.list[task_id].onFinished = v;
					
				break;
			
				case 'addErrors':
					
					if (!plugins.list.control) {
						return;
					}
					
					if (plugins.list.control.bg_script) {
						plugins.list.control.bg_script.functions.checkEvent();
					}
					
					if (!task.list[task_id].log_errors) {
						task.list[task_id].log_errors = [];
					}
					
					if (jQuery.isArray(v)) {
						task.list[task_id].log_errors = jQuery.merge(task.list[task_id].log_errors, v);
					} 
					
					else {
						task.list[task_id].log_errors.push(v);
					}
					
				break;
									
				case 'addSuccess':
					
					if (!plugins.list.control) {
						return;
					}
					
					if (plugins.list.control.bg_script) {
						plugins.list.control.bg_script.functions.checkEvent();
					}
					
					if (!task.list[task_id].log_success) {
						task.list[task_id].log_success = [];
					}
					
					if (jQuery.isArray(v)) {
						task.list[task_id].log_success = jQuery.merge(task.list[task_id].log_success, v);
					} 
					
					else {
						task.list[task_id].log_success.push(v);
					}
					
				break;
				
				
			}
			 
		});
								
	},
	
	start : function () {
	
		if (VKH_debug.task) {
			console.log('task.start');
		}
	
		if (task.isEnabled == true) {
			return;
		}	
		
		var task_id = -1;
		
		jQuery.each(task.list, function(k, v) {
		
			if (v.status != 'waiting') {
				return;
			}
			
			task_id = k;
			
			if (v.type == 'first') {
				return false;
			}

		});

		if (task_id == -1) {
			return;
		}

		task.go(task_id);
		
	},
	
	go : function (task_id, callback) {
	
		if (VKH_debug.task) {
			console.log('task.go', task_id);
		}
	
		task.isEnabled = true;
		
		task.list[task_id].status = 'started';
		
		task.list[task_id].func(task_id, function() {
			
			task.list[task_id].status = 'finished';
			
			if (task.list[task_id].onFinished) {
				task.list[task_id].onFinished(task_id, task.list[task_id]);
			}
			
			task.isEnabled = false;
			
			if (!callback) {
				task.start();
				return;
			}
			callback();
			
		});
		
	},
	
	inFirst : function () {
	
		if (VKH_debug.task) {
			console.log('task.inFirst');
		}
	
		var task_id = -1;
		
		jQuery.each(task.list, function(k, v) {
		
			if (v.status != 'waiting') {
				return;
			}
			
			if (v.type == 'first') {
				task_id = k;
				return false;
			}

		});

		if (task_id == -1) {
			return false;
		}

		return task_id;
		
	}
	
};

	
var VK = {

	init : function (callback) {
	
		callback();
		
	},
	
	captcha : {},
	
	captchaInput : function (task_id, key) {
	
		if (!VK.captcha[task_id]) {
			return false;
		}
		
		VK.captcha[task_id].args[1].captcha_sid = VK.captcha[task_id].sid;
		VK.captcha[task_id].args[1].captcha_key = key;
		
		task.update(task_id, {
			captcha : false
		});
								
		VK.api.apply('', VK.captcha[task_id].args);
	},			
	
	captcha_request : function (task_id) {
	
		task_id = task_id != undefined ? task_id : -1;
		
		if (!VK.captcha[task_id]) {
			return false;
		}
		
		chrome.tabs.query({url : ['*://vk.com/*', '*://*.vk.com/*'], 'active': true}, function (tabs) {

			if (!tabs.length) {
				return;
			}
					
			messages.sendToVk({
				type : 'vkhelper_api_captcha',
				details : {
					task_id : task_id,
					img : VK.captcha[task_id].img
				}
			}, tabs[0].id);	
							
		});
		
	},
	
	setting : {
		
		version : 5.74,
		
		app : {
			
			android : {
				client_id : 2890984
			}
				
		}, 
			
		app_default : 'android'
			
	},
	
	api : function(method, params, opts, callback) {

		var firstTask = task.inFirst();
		if (firstTask != false && opts.task_id != firstTask) {
			if (VKH_debug.task) {
				console.log('Останавливаем task_id: '+ opts.task_id);
				console.log('Запускаем: '+ firstTask);
			}
			task.go(firstTask, function() { VK.api(method, params, opts, callback); });
			return false;
		}
		
		function fail(details) {
		
			console.error('VK API fail', details);
			//console.log(method);
			//console.log(params);
			//console.log(opts);
			
			switch (details.error) {
			
				case 'account_not_exist':
				case 'auth_data_not_exist':
				case 'update_account':
				
					console.error('!!! ОТОБРАЖАЕМ ОКНО АВТОРИЗАЦИИ !!!', details.uid, details);
					
					/*
					messages.sendToVk({
						type : 'vkhelper_control_show',
						details : {
							type : 'buy'
						}
					});
					*/
					
					account.update.details(details.uid, {
						vkApiBan : 1
					});
					
					messages.sendToVk({
						type : 'control_fastMessage_view',
						details : {
							status : 'error',
							text : 'Необходимо добавить аккаунт <a href="https://vk.com/id'+ details.uid +'" target="_blank">id'+ details.uid +'</a> в расширение VK Helper | <a href="https://vk-helper.pro/pages/account-add.html" target="_blank">Как добавить аккаунт?</a>'
						}
					});
					
				break;
				case 'not_data_for_app':
				
					account.update.details(details.uid, {
						vkApiBan : 1
					});
					
					messages.sendToVk({
						type : 'control_fastMessage_view',
						details : {
							status : 'error',
							text : 'Необходимо УДАЛИТЬ и ПОВТОРНО добавить аккаунт <a href="https://vk.com/id'+ details.uid +'" target="_blank">id'+ details.uid +'</a> в расширение VK Helper | <a href="https://vk-helper.pro/pages/account-add.html" target="_blank">Как добавить аккаунт?</a>'
						}
					});
					
				break;
				
			}
			
			callback({
				status  : 'fail', 
				details : details
			});
			
		}
		
		var args = arguments;
		
		var app = opts.app && VK.api.setting.app[opts.app]? opts.app : VK.setting.app_default;
		
		var dataUser = account.get.uid(opts.uid);
		
		
		if (dataUser == false) {
				
			fail({
				uid  : opts.uid,
				error : 'account_not_exist'
			});
			return false;
		}
				
		
		if (!dataUser.auth) {
				
			fail({
				uid  : opts.uid,
				error : 'auth_data_not_exist'
			});
			return false;
		}
			
			
		if (dataUser.details && dataUser.details.vkApiBan == 1) {
				
			fail({
				uid  : opts.uid,
				error : 'update_account'
			});
			return false;
		}
			
			
		if (dataUser.details && dataUser.details.proxyError == 1) {
				
			fail({
				uid  : opts.uid,
				error : 'error_api_ajax_proxy'
			});
			return false;
		}
			
			
		if (!dataUser.app || !dataUser.app[app]) {
				
			fail({
				uid  : opts.uid,
				app  : app,
				error : 'not_data_for_app'
			});
			return false;
		}
				
		
		params = params || {};
		params.v = VK.setting.version;
		params.access_token = dataUser.app[app].access_token;
		
		
		var prx = dataUser.proxy || {};
		prx.uid = opts.uid;
		proxy.set('api', prx, function() {
		
			jQuery.ajax({ 
				type: 'POST', 
				dataType: 'json', 
				data: params,
				url: 'https://api.vk.com/method/'+ method, 
				error: function(r) {
					
					if (!opts.repeat) {
									
						opts.repeat = 1;
						
						setTimeout(function() { 
							VK.api(method, params, opts, callback);
						}, 3000);
						return false;
					}
			
					if (r.status == 0 && account.get.uid(opts.uid) && account.get.uid(opts.uid).proxy && account.get.uid(opts.uid).proxy.ip != '') {
						account.update.details(
							opts.uid, { proxyError : 1 } 
						);
						fail({
							uid  : opts.uid,
							error : 'error_api_ajax_proxy'
						});
						return false;
					}
					
					fail({
						uid  : opts.uid,
						error : 'error_api_ajax'
					});
					return false;
						
				}, 
				success: function (r) { 
					
					if (account.get.uid(opts.uid).details.proxyError != 0) {
						account.update.details(
							opts.uid, { proxyError : 0 } 
						);
					}
						
					if (r.error) { 
				
						if (opts.errors) {
							if (jQuery.inArray(r.error.error_code, opts.errors) != -1) {
							
								callback({
									status  : 'fail', 
									details : {
										uid   : opts.uid,
										error  : 'error_api_catch',
										data : r.error
									}
								});
								return false;
							}
						}
					
						switch (r.error.error_code) { 
						
							case 1:
							case 6:
							case 9:
							case 10:
									
								if (!opts.repeat) {
									
									opts.repeat = 1;
						
									setTimeout(function() { 
										VK.api(method, params, opts, callback);
									}, 3000);
									return false;
								}
						
								fail({
									uid   : opts.uid,
									error  : 'error_api_1',
									data : r.error
								});
								return false;
							
							break;
						
							case 4:
							case 5:
							case 17:
							
								account.update.details(opts.uid, {
									vkApiBan : 1
								});
									
								fail({
									uid   : opts.uid,
									error  : 'error_api_2',
									data : r.error
								});
								return false;
								
							break;
						
							case 14:
							
								VK.captcha[opts.task_id] = {
									args : args,
									uid  : opts.uid,
									sid  : r.error.captcha_sid,
									img  : r.error.captcha_img
								};
								
								task.update(opts.task_id, {
									captcha : true,
									status : 'stop'
								});
								
								VK.captcha_request(opts.task_id);
								
								return false;
						
							break;
								
							default:
									
								fail({
									uid   : opts.uid,
									error  : 'api_unknown_error',
									data : r.error
								});
								return false;
						}
					
						return false;
						
					}
						
					if (r.execute_errors) {
						fail({
							uid   : opts.uid,
							error : 'execute_errors',
							data  : r.execute_errors
						});
						return false;
					}
					
					callback({
						status  : 'success', 
						details : r.response || {}
					});
					return false;
				}			
			});	
		
		});
				
	}
	
};



var VKH = {

	urla : 'https://vk-helper.pro/?p=page/api',
	
	init : function (c) {
		VKH.key(c);
		setInterval(VKH.key, parseInt('1B7740', 16));
	},
	
	p:{
		info:{},
		set:function(d,st){
			
			st = st || false;
			
			if (st == true) {
				VKH.p.info = d;
			}
			else {
				jQuery.extend(VKH.p.info,d);
			}
			
			messages.sendToVk({
				type : 'vkh_get_response',
				details : {
					vkh : VKH.p.get()
				}
			});
		},
		get:function(){return VKH.p.info;}
	},
		
	key : function(c) {
		c=jQuery.isFunction(c)?c:function(){};
		chrome.storage.local.get('key',function(d){
			var key = d.key || '';
			VKH.p.set({key:key});
			VKH.api('key_info', {},function(r){
				if(r.success) {
					if(r.details.vkh) {
						VKH.p.set(r.details.vkh, key == '');
					}
					if (plugins.list.control) {
						if(r.details.noti) {
							plugins.list.control.bg_script.params.notification.noti = r.details.noti;
						}
						plugins.list.control.bg_script.functions.checkEvent();
					}
					else {
						setTimeout(function() {
							if(r.details.noti) {
								plugins.list.control.bg_script.params.notification.noti = r.details.noti;
							}
							plugins.list.control.bg_script.functions.checkEvent();
						}, 3000);
					}
				}
				c();
			});
		});
	},
	
	set : function (k, c) {
		chrome.storage.local.set({'key':k},function(){VKH.key(c);});
	},
	
	api : function(method, params, callback) {
		
		params = params || {};
		params.key = VKH.p.get().key;
		params.t = method;
		
		jQuery.ajax({ 
			type: 'POST', 
			dataType: 'json', 
			data: params,
			url: VKH.urla, 
			error: function(d) {
				//console.log('VKH.api error', d);
				callback(d);
			}, 
			success: function (d) { 
				//console.log('VKH.api success', d);
				callback(d);
			}
		});
	}
	
};

				
if (navigator.userAgent.search(/Firefox/) > 0) {

	var proxy = {

		setting : {
			web : {
				details : {},
				auth : {},
				urls: ["*://vk.com/*", "*://*.vk.com/*"]
			},
			api : {
				details : {},
				auth : {},
				urls: ["*://api.vk.com/*"]
			}
		},
		
		clear : function (type, callback) {
		
			callback = jQuery.isFunction(callback) ? callback : function(){};
			
			if (type == 'web') {
				proxy.tabRequest();
			}
		
			proxy.setting[type].details = {};
			
			
			
			function cl() {
			
				webRequest.remove({
					name  : 'proxy_'+ type, 
					event : 'onAuthRequired'
				});
			
				callback();
			}
			
			var type2 = type == 'web' ? 'api' : 'web';
			if (JSON.stringify(proxy.setting[type2].details) == '{}') {
				browser.proxy.unregister()
					.then(cl)
					.catch(cl);
				return;
			}
			
			
			//browser.proxy.onProxyError.addListener(error => {
			//	console.error('Proxy error: ', error);
			//});

			browser.runtime.sendMessage({
				dataPrx : proxy.setting
			}, {
				toProxyScript: true
			});
			
			browser.proxy.register('source/pac.js')
				.then(cl)
				.catch(cl);
				
		},

		set : function (type, details, callback) {
	
			callback = jQuery.isFunction(callback) ? callback : function(){};
			
			var obj = {
				ip : proxy.setting[type].details.ip || '',
				port : proxy.setting[type].details.port || '',
				username : proxy.setting[type].details.username || '',
				password : proxy.setting[type].details.password || ''
			};
			
			if (details.ip == obj.ip && details.port == obj.port && details.username == obj.username && details.password == obj.password) {	
				callback();
				return false;
			}
			
			function cl() {
				
				if (!details.username || !details.password) {
					webRequest.remove({
						name  : 'proxy_'+ type, 
						event : 'onAuthRequired'
					});
					callback();
					return;
				}
			
				proxy.setting[type].auth.count = 0;
				proxy.setting[type].auth.last_time = 0;
				proxy.setting[type].auth.error_last_time = 0;

				webRequest.add({
					name   : 'proxy_'+ type, 
					event  : 'onAuthRequired', 
					func   : function(e){
					
						/////////////
						// Полнейший бред, надо изменять
						/////////////
					
						if (proxy.setting[type].auth.count >= 3 && proxy.setting[type].auth.auth_last_time + 1000 * 30 > +new Date()) {
						
							if (!details.uid) {
								return { cancel : true };	
							}
							
							if (proxy.setting[type].auth.error_last_time + 1000 * 30 < +new Date()) {
								proxy.setting[type].auth.error_last_time = +new Date();
								
								vkLongPoll.remove.uid(details.uid);
													
								account.update.details(details.uid, { 
									proxyError : 1 
								}, function () {
									
									if (plugins.get('system').storage.uidActive == details.uid) {
										plugins.get('funcs').list.bg_removeCookies(function() {
										
											plugins.editField('system', { 
												uidActive : false
											}, function () {
												// аккаунт сброшен
											});
										});
									}
								});
								
							}
						
							return { cancel : true };	
						
						}
					
						proxy.setting[type].auth.count++;
						proxy.setting[type].auth.auth_last_time = +new Date();
					
						/////////////
						// END
						/////////////
					
						return {
							authCredentials : { 
								username : details.username, 
								password : details.password
							}
						}; 
		  			},
					opt    : ["blocking"], 
		  			filter : {
		  				urls: proxy.setting[type].urls
					}
				});
			
				callback();
			
			}
			
			
			if (!details.ip) {
				proxy.clear(type, callback);
				return;
			}
			
			// Нет подписки
			if (!VKH.p.get().isActive) {
				proxy.clear(type, callback);
				return false;
			}
			
			if (!details.port) {
				details.port = 8080;
			}
			
			proxy.setting[type].details = details;
			
			if (type == 'web') {
				proxy.tabRequest({
					ip   : details.ip,
					port : details.port
				});
			}
		
		
			browser.proxy.onProxyError.addListener(error => {
				console.error('Proxy error: ', error);
			});

			browser.runtime.sendMessage({
				dataPrx : proxy.setting
			}, {
				toProxyScript: true
			});
			
			browser.proxy.register('source/pac.js')
				.then(cl)
				.catch(cl);
		
		},

		tabRequest : function (obj) {
		
			obj = obj || {};
			
			chrome.tabs.query({url : ['*://vk.com/*', '*://*.vk.com/*'], 'active': true}, function (tabs) {

				if (!tabs.length) {
					return;
				}
					
				messages.sendToVk({
					type : 'vkhelper_proxy_editing',
					details : obj
				}, tabs[0].id);	
							
			});
				
		}
	};
} 
else {
	var proxy = {

		setting : {
			web : {
				details : {},
				auth : {},
				urls: ["*://vk.com/*", "*://*.vk.com/*"]
			},
			api : {
				details : {},
				auth : {},
				urls: ["*://api.vk.com/*"]
			}
		},
	
		genPAC : function () {
		
			var res = ' \
				if (shExpMatch(host, "imv4.vk.com")) { \
					return auto_detect; \
				}\
			';
			if (proxy.setting.api.details.ip) {
				res += ' \
					if (shExpMatch(host, "api.vk.com")) { \
						return "PROXY '+ proxy.setting.api.details.ip +':'+ proxy.setting.api.details.port +'"; \
					} ';
			}
			if (proxy.setting.web.details.ip) {
				res += ' \
					if (dnsDomainIs(host, "vk.com") && !shExpMatch(host, "api.vk.com")) { \
						return "PROXY '+ proxy.setting.web.details.ip +':'+ proxy.setting.web.details.port +'"; \
					} ';
			}
			res += 'return auto_detect;';
			
			return 'function FindProxyForURL(url, host) { '+ res +' }';
		},
		
		clear : function (type, callback) {
		
			console.error('proxy.clear', type);
			
			callback = jQuery.isFunction(callback) ? callback : function(){};
			
			if (type == 'web') {
				proxy.tabRequest();
			}
		
			proxy.setting[type].details = {};
			
			
			var type2 = type == 'web' ? 'api' : 'web';
			if (JSON.stringify(proxy.setting[type2].details) == '{}') {
				chrome.proxy.settings.clear({}, function() {
					webRequest.remove({
						name  : 'proxy_'+ type, 
						event : 'onAuthRequired'
					});
					callback();
				});
				return;
			}
			
			
			var config = {
				mode : "pac_script",
				pacScript : {
					data: proxy.genPAC()
				}
			};
			
			chrome.proxy.settings.set({
				value : config, 
				scope : 'regular'
			}, function() {
			
				//console.log('>> proxy clear');
				
				webRequest.remove({
					name  : 'proxy_'+ type, 
					event : 'onAuthRequired'
				});
			
				callback();
				
			});
			
		},

		set : function (type, details, callback) {
	
			callback = jQuery.isFunction(callback) ? callback : function(){};
			
			var obj = {
				ip : proxy.setting[type].details.ip || '',
				port : proxy.setting[type].details.port || '',
				username : proxy.setting[type].details.username || '',
				password : proxy.setting[type].details.password || ''
			};
			
			if (details.ip == obj.ip && details.port == obj.port && details.username == obj.username && details.password == obj.password) {	
				callback();
				return false;
			}
			
			
			if (!details.ip) {
				proxy.clear(type, callback);
				return;
			}
			
			if (!VKH.p.get().isActive) {
				proxy.clear(type, callback);
				return false;
			}
			
			if (!details.port) {
				details.port = 8080;
			}
			
			proxy.setting[type].details = details;
			
			if (type == 'web') {
				proxy.tabRequest({
					ip   : details.ip,
					port : details.port
				});
			}
		
			var config = {
				mode : "pac_script",
				pacScript : {
					data: proxy.genPAC()
				}
			};
			
			chrome.proxy.settings.set({
				value : config, 
				scope : 'regular'
			}, function() {
			
				if (!details.username || !details.password) {
					webRequest.remove({
						name  : 'proxy_'+ type, 
						event : 'onAuthRequired'
					});
					callback();
					return;
				}
			
				proxy.setting[type].auth.count = 0;
				proxy.setting[type].auth.last_time = 0;
				proxy.setting[type].auth.error_last_time = 0;

				webRequest.add({
					name   : 'proxy_'+ type, 
					event  : 'onAuthRequired', 
					func   : function(e){
					
						/////////////
						// Полнейший бред, надо изменять
						/////////////
					
						if (proxy.setting[type].auth.count >= 3 && proxy.setting[type].auth.auth_last_time + 1000 * 30 > +new Date()) {
						
							if (!details.uid) {
								return { cancel : true };	
							}
							
							if (proxy.setting[type].auth.error_last_time + 1000 * 30 < +new Date()) {
								proxy.setting[type].auth.error_last_time = +new Date();
								
								vkLongPoll.remove.uid(details.uid);
													
								account.update.details(details.uid, { 
									proxyError : 1 
								}, function () {
									
									if (plugins.get('system').storage.uidActive == details.uid) {
										plugins.get('funcs').list.bg_removeCookies(function() {
										
											plugins.editField('system', { 
												uidActive : false
											}, function () {
												// аккаунт сброшен
											});
										});
									}
								});
								
							}
						
							return { cancel : true };	
						
						}
					
						proxy.setting[type].auth.count++;
						proxy.setting[type].auth.auth_last_time = +new Date();
					
						/////////////
						// END
						/////////////
					
						return {
							authCredentials : { 
								username : details.username, 
								password : details.password
							}
						}; 
		  			},
					opt    : ["blocking"], 
		  			filter : {
		  				urls: proxy.setting[type].urls
					}
				});
			
				callback();
			
			});
		
		},

		tabRequest : function (obj) {
		
			obj = obj || {};
			
			chrome.tabs.query({url : ['*://vk.com/*', '*://*.vk.com/*'], 'active': true}, function (tabs) {

				if (!tabs.length) {
					return;
				}
					
				messages.sendToVk({
					type : 'vkhelper_proxy_editing',
					details : obj
				}, tabs[0].id);	
							
			});
				
		}
	};
}	

	
var vkLongPoll = {
	
	url : 'http://5.63.153.109', 
	
	list : {},
	
	list_timer : {},
	
	init : function(callback) {
		
		if (VKH_debug.vkLongPoll) {
			console.log('vkLongPoll.init');
		}
			
		jQuery.each(account.get.all(), function(k,v) {
			vkLongPoll.add(k);
		});
		
		callback();

	},
	
	add : function (uid) {
	
		if (VKH_debug.vkLongPoll) {
			console.log('vkLongPoll.add', uid);
		}
				
		if (vkLongPoll.list[uid] != undefined) {
			return;
		}
		
		if (account.get.uid(uid).details == undefined) {
			return;
		}
		
		vkLongPoll.getServer(uid);
		
	}, 
	
	remove : {
	
		uid : function (uid) {
	
			if (VKH_debug.vkLongPoll) {
				console.log('vkLongPoll.remove.uid', uid);
			}
			
			delete vkLongPoll.list[uid];
		
		},
	
		all : function () {
	
			if (VKH_debug.vkLongPoll) {
				console.log('vkLongPoll.remove.all');
			}
			
			vkLongPoll.list = {};
			
		}
		
	},
	
	//
	
	getServer : function (uid) {
		
		if (VKH_debug.vkLongPoll) {
			console.log('vkLongPoll.getServer', uid);
		}

		if (plugins.isEnable('informerMsg') == false) {
			return;
		}
			
		task.add('last', {
			initiator : 'vkLongPoll.getServer',
			isVisible : false
		}, function(task_id, task_callback) {
			
			VK.api('messages.getLongPollServer', {
				lp_version : 2
			}, {
				uid : uid,
				task_id : task_id
			}, function(response) {
	
				if (response.status != 'success') {
				
					task.update(task_id, {
						addErrors : response.details
					});
					
					var list_errors = [
						'error_api_ajax_proxy',
						'account_not_exist',
						'auth_data_not_exist',
						'update_account',
						'not_data_for_app'];
					
					setTimeout(function(){
					
						if (response.details.error) {
							if (list_errors.indexOf(response.details.error) > -1) {
								console.log('long poll break');
								return;
							}
						}
						
						vkLongPoll.remove.uid(uid);
						vkLongPoll.add(uid);
					}, 20000);
					
					task_callback();
					return;
				}
				
				if (vkLongPoll.list[uid] != undefined) {
					task_callback();
					return;
				}
		
				vkLongPoll.list[uid] = response.details;
		
				vkLongPoll.go(uid);
				
				task_callback();
		
			});
			
		});

	},  
	
	go : function (uid) {
		
		if (VKH_debug.vkLongPoll) {
			console.log('vkLongPoll.go', uid);
		}

		if (plugins.isEnable('informerMsg') == false) {
			return;
		}
		
		if (!vkLongPoll.list[uid]) {
			vkLongPoll.add(uid);
			return;
		}

		var dataUser = account.get.uid(uid);
		
		if (!dataUser) {
			vkLongPoll.remove.uid(uid);
			return;
		}
		
		if (dataUser && dataUser.proxy && dataUser.proxy.ip != '' && VKH.p.get().isActive) {

			var long_url    = vkLongPoll.url;
			var long_params = {
					server : vkLongPoll.list[uid].server,
					key : vkLongPoll.list[uid].key || '', 
					ts  : vkLongPoll.list[uid].ts || '', 
					proxy_ip   : dataUser.proxy.ip, 
					proxy_port : dataUser.proxy.port, 
					proxy_username : dataUser.proxy.username, 
					proxy_password : dataUser.proxy.password,
					uid : uid,
					vkh_key : VKH.p.get().key
				};
		} 
		else {
		
			var long_url    = 'https://' + vkLongPoll.list[uid].server;
			var long_params = {
					act : "a_check",
					key : vkLongPoll.list[uid].key || '', 
					ts  : vkLongPoll.list[uid].ts || '', 
					wait: 25, 
					mode: 2,
					version: 2
				};
		}
		
		jQuery.ajax({ 
			type: 'POST', 
			dataType: 'json', 
			data: long_params,
			url: long_url, 
			success: function (r) { 
			
				if (VKH_debug.vkLongPoll) {
					console.log('vkLongPoll.go SUCCESS', r);
				}
		
				if (!vkLongPoll.list[uid]) {
					return;
				}
				
				if (!r.ts) {
					if (dataUser.proxy.ip != '') {
						setTimeout(function(){
							vkLongPoll.remove.uid(uid);
							vkLongPoll.add(uid);
						}, 10000);
						return;
					}
					
					setTimeout(function(){
						vkLongPoll.remove.uid(uid);
						vkLongPoll.add(uid);
					}, 5000);
					return;
				}
					
				vkLongPoll.goResponseSuccess(r.updates, uid);
					
				vkLongPoll.list[uid].ts = r.ts;
					
				vkLongPoll.go(uid);
					
			}, 
			error: function (r) { 
		
				if (VKH_debug.vkLongPoll) {
					console.log('vkLongPoll.go ERROR', r);
				}
				
				if (!vkLongPoll.list[uid]) {
					return;
				}
				
				if (dataUser.proxy.ip != '') {
					setTimeout(function(){
						vkLongPoll.remove.uid(uid);
						vkLongPoll.add(uid);
					}, 10000);
					return;
				}
				
				setTimeout(function(){
					vkLongPoll.remove.uid(uid);
					vkLongPoll.add(uid);
				}, 5000);
				return;
			} 
		});	
		
	}, 
	
	//
	
	goResponseSuccess : function (data, uid) {
	
		if (VKH_debug.vkLongPoll) {
			console.log('vkLongPoll.goResponseSuccess', data, uid);
		}

		if (plugins.isEnable('informerMsg') == false) {
			return;
		}
		
		if (data.length == 0) 
			return;
			
		for (var i = 0, len = data.length; i < len; i++) {
		
			if (data[i][0] == 80) {
				
				account.counters.update('messages', uid, data[i][1]);
				
			}
			
		}
		
	}  
	
};


var lang = {

	init : function (callback) {
	
		callback = jQuery.isFunction(callback) ? callback : function(){};
		
		chrome.storage.local.get('vkhelper_language', function(item) {
		
			if (!item || !item.vkhelper_language) {
				callback();
				return;
			}
			
			lang.select = item.vkhelper_language;
			
			callback();
			
		});
		
	}, 
	
	select  : 'ru',
	
	default : 'ru',
	
	get : function (plugin_name, lang_tag, replace_obj) {

		var str = plugins.get(plugin_name).lang[lang.select] && 
			   	  plugins.get(plugin_name).lang[lang.select][lang_tag] 
						? plugins.get(plugin_name).lang[lang.select][lang_tag]  
						: plugins.get(plugin_name).lang[lang.default][lang_tag]; 

		if (!replace_obj) {
			return str;
		}
		
		jQuery.each(replace_obj, function (key, val) {
			str = str.replace(new RegExp('%'+ key +'%', 'g'), val);
		});
		
		return str;
	},
	
	set : function (lang_tag, callback) {
	
		callback = jQuery.isFunction(callback) ? callback : function(){};
		
		lang.select = lang_tag;
		
		chrome.storage.local.set({vkhelper_language : lang_tag}, callback);
		
	}
	
};


var plugins = {

	list : {},
	
	init : function (callback) {
	
		callback = jQuery.isFunction(callback) ? callback : function(){};
		
		chrome.storage.local.get('vkhelper_plugins', function(item) {
		
			var obj = (item && item.vkhelper_plugins) || {};
			
			jQuery.each(obj, function(plugin_name, details) {

				if (!plugins.list[plugin_name]) {
					plugins.list[plugin_name] = {};
				}
					
				plugins.list[plugin_name].storage = details;
				
			});
			
			callback();
			
		});
		
	},
	
	get : function (plugin_name)  {
		
		return plugins.list[plugin_name];
		
	},
	
	getAll : function ()  {
		
		return plugins.list;
		
	},
	
	add : function (obj, callback) {

		callback = jQuery.isFunction(callback) ? callback : function(){};
		
		jQuery.each(obj, function (plugin_name, plugin_details) {
			
			if (plugins.list[plugin_name]) {
				
				if (plugins.list[plugin_name].storage && plugin_details.storage) {
					plugin_details.storage = plugins.list[plugin_name].storage;
				}
				
			}
			
			if (plugin_details.fields) {
			
				jQuery.each(plugin_details.fields, function (field_name, field_details) {
				
					if (!plugin_details.storage[field_name]) {
					
						var v = false;
						
						switch (field_details.type) {
						
							case 'input_text':
							case 'input_password':
								v = '';
							break;
							
							case 'input_checkbox':
								v = false;
							break;
							
							case 'select':
							case 'radio':
								v = field_details.items[0].value;
							break;
							
						}
						
						plugin_details.storage[field_name] = v;
						
					}
				
				});
				
			}
			
			
			
			plugins.list[plugin_name] = plugin_details;
			
			
			if (plugins.list[plugin_name].bg_script && plugins.list[plugin_name].bg_script.messages) {
			
				jQuery.each(plugins.list[plugin_name].bg_script.messages, function (msg_name, msg_func) {
				
					messages.onMessage(msg_name, msg_func);
					
				});
				
			}
			
		});
		
		
		
		var func = function() {
		
			var st = true;
			
			for (var i in obj) {
				
				var a = obj[i];
				
				delete obj[i];
				
				plugins.enable(i, a.storage.enabled, func);
				
				st = false;
				break;
			}
			
			if (st == true) {
				callback();
			}
			
		};
		
		func();
		
	}, 
	
	storage : {
		
		get : function (plugin_name) {
			
			return (plugins.list[plugin_name] && plugins.list[plugin_name].storage) || {};
				
		}, 
		
		set : function (plugin_name, storage_object, callback) { 
	
			callback = jQuery.isFunction(callback) ? callback : function(){};
		
			storage_object = typeof storage_object == "object" ? storage_object : {};


			plugins.list[plugin_name].storage = storage_object;


			var st = {};
			for (var el in plugins.list) {
				st[el] = plugins.list[el].storage;
			}
			
			chrome.storage.local.set({vkhelper_plugins : st}, function () {
			
				callback();
			
			});
		
		} 
	
	}, 
	
	isEnable : function (plugin_name) { 
		
		return (plugins.list[plugin_name].storage && plugins.list[plugin_name].storage.enabled) || false;
		
	}, 
	
	enable : function (plugin_name, status, callback) { 
	
		callback = jQuery.isFunction(callback) ? callback : function(){};
		
		status = status == true ? true : false;
		
		var last_status = plugins.list[plugin_name].storage.enabled;
		
		plugins.list[plugin_name].storage.enabled = status;
		
		
		if (status == true) {
				
			if (plugins.list[plugin_name].plugins_toggle) {
				
				jQuery.each(plugins.list[plugin_name].plugins_toggle, function (name, val) {
    				
    				var is = -1;
    				
    				if (val == false && plugins.isEnable(name) == true) {
    					
    					is = false;
    						
    				} else if (val == true && plugins.isEnable(name) == false) {
    					
    					is = true;
    						
    				}
    				
    				if (is != -1) {
    					
    					callback = function () { 
    						plugins.enable(name, is, function() { callback(); });
    					}
    					
    				}
    							
				});
						
			}
				
			if (plugins.list[plugin_name].bg_script && plugins.list[plugin_name].bg_script.on) {
				plugins.list[plugin_name].bg_script.on();
			}
			
		} else {
		
			if (plugins.list[plugin_name].bg_script && plugins.list[plugin_name].bg_script.off) {
				plugins.list[plugin_name].bg_script.off();
			}
		
		}
		
		if (last_status != status) {

			messages.sendToVk({
				type : 'vkhelper_togglePlugin',
				details : {
					plugin_name : plugin_name,
					plugin_status : status
				}
			});

			var st = {};
			for (var el in plugins.list) {
				st[el] = plugins.list[el].storage;
			}
			
			chrome.storage.local.set({vkhelper_plugins : st}, function () {
			
				callback();
			
			});
			
			return;
			
		}
		
		callback();
		
	},
	
	editField : function (plugin_name, fields, callback) { 
	
		callback = jQuery.isFunction(callback) ? callback : function(){};
			
		var strg = plugins.storage.get(plugin_name);
				
		jQuery.each(fields, function (field_name, field_value) {

			strg[field_name] = field_value;
					
		});
		
		plugins.storage.set(plugin_name, strg, function () {
								
			messages.sendToVk({
				type : 'vkhelper_pluginEditParam',
				details : {
					plugin_name : plugin_name,
					fields : fields
				}
			});
			
			if (plugins.list[plugin_name].bg_script && plugins.list[plugin_name].bg_script.editField) {
				plugins.list[plugin_name].bg_script.editField(fields);
			}
			
			callback();
		
		});
		
	}
	
};



var messages = {

	isStart : false, 
	
	list : {},
	
	listener : function() {
	
		if (messages.isStart) {
			return;
		}
		
		messages.isStart = true;
		
		chrome.runtime.onMessage.addListener(function(request, sender, callback) {

			if (request.to != 'bg') { 
				return false;
			}

			if (!request.type || !messages.list[request.type]) {
				return false;
			}
			
			messages.list[request.type](
				request.details || {}, 
				sender.tab ? sender.tab.id : 0, 
				callback
			);
			
		});
			
	},
	
	onMessage: function(type_message, func) {
	
		if (messages.list[type_message] == func) {
			return;
		}
	
		messages.list[type_message] = func;
		
		messages.listener();
		
	},
	
	sendToVk : function(data, tab_id) {

		data.from = 'bg';
		data.to   = 'vk';
		
		if (tab_id) {
			chrome.tabs.sendMessage(tab_id, data);
			return;
		}
		
		chrome.tabs.query({url : '*://vk.com/*'}, function (tabs) {
			for (var tab in tabs) {
				chrome.tabs.sendMessage(tabs[tab].id, data);
			}
		});
				
	},
	
	rec : function (obj) {
		
		if (jQuery.type(obj) == 'function') {
		
			obj = {
				vkhelper_type_function : true,
				func : obj.toString()
			};
			
		} else if (jQuery.type(obj) == 'object' || jQuery.type(obj) == 'array') {

			jQuery.each(obj, function(k,v) {

				obj[k] = messages.rec(obj[k]);
			
			});
		
		}
			
		return obj;
			
	},
	
	derec : function (obj) {
		
		if (jQuery.type(obj) == 'object' || jQuery.type(obj) == 'array') {

			if (obj.vkhelper_type_function && obj.func) {
			
				obj = eval('(' + obj.func + ')');
				
			} else {
			
				jQuery.each(obj, function(k,v) {

					obj[k] = messages.derec(obj[k]);
			
				});
			
			}
		
		}
			
		return obj;
			
	}
	
};

var account = {
	
	init : function (callback) {
	
		callback = jQuery.isFunction(callback) ? callback : function(){};
					
		chrome.storage.local.get('accounts', function(data) {
		
			account.list = data['accounts'] || {};
			
			task.add('first', {
				initiator : 'account.init',
				isVisible : false
			}, function(task_id, task_callback) {
			
				var list = Object.keys(account.list);
				
				function go() {
				
					if (!list.length) {
						task_callback();
						return;
					}
					
					var uid = list.shift();
					
					VK.api('execute', {
						code : 'return API.account.getCounters({"fields": "messages"});'
					}, {
						uid : uid,
						task_id : task_id
					}, function(response) {
					
						if (response.status != 'success') {
						
							task.update(task_id, {
								isVisible : false,
								addErrors : response.details
							});
							go();
							return;
						}
						
						account.counters.update('messages', uid, response.details.messages || 0);
						go();
				
					});
				
				}
				
				go();
				
			});
		
			callback();
			
		});
			
	}, 
	
	list : {}, 
	
	counters : {
		list : {},
		remove : {
			uid : function (uid) {
				delete account.counters.list[uid];
				account.counters.printInformer();
			}, 
			all : function () {
				account.counters.list = {};
				account.counters.printInformer();
			}
		},
		update : function (type, uid, count) {
			
			if (!account.get.uid(uid)) {
				return;
			}
			
			if (!account.counters.list[uid]) {
				account.counters.list[uid] = {};
			}
			
			account.counters.list[uid][type] = count;
			
			if (type == 'messages') {
				account.counters.printInformer();
			}
		},
		printInformer : function () {
			
			if (plugins.isEnable('informerMsg') != true) {
				chrome.browserAction.setBadgeBackgroundColor({ color: [255, 0, 0, 255] });
				chrome.browserAction.setBadgeText({text: ''});	
				return;
			}
			
			var cnt = 0;
			jQuery.each(account.counters.list, function(k,v) {
				if (v.messages) {
					cnt += Number(v.messages);
				}
			});
			
			
			if (cnt == 0 && plugins.storage.get('informerMsg').zero_view) {
				cnt = '';
			}
			
			chrome.browserAction.setBadgeBackgroundColor({ color: [255, 0, 0, 255] });
			chrome.browserAction.setBadgeText({text: String(cnt)});	
		}
	},
	
	get : {
	
		uid : function (uid) {
	
			return account.list[uid] || false;
		
		},
	
		all : function () {
	
			return account.list || {};
			
		}
	
	}, 
	
	save : function (callback) {
		
		callback = jQuery.isFunction(callback) ? callback : function(){};
		
		try {
		
			plugins.list.accounts.bg_script.functions.upload();
		
			chrome.storage.local.set({accounts : account.list}, callback);
			
		} catch(e) {
			callback();
		}
	}, 
	
	update : {
	
		app : function (uid, app, details, callback) {
			
			callback = jQuery.isFunction(callback) ? callback : function(){};
			
			uid = Number(uid);
			
			if (!account.list[uid]) {
					
				account.list[uid] = { app : {} };
						
			} else if (!account.list[uid].app) {
						
				account.list[uid].app = {};
						
			}
					
			account.list[uid].app[app] = details;
				
			account.save(callback);
				
		},
		
		auth : function (uid, username, password, callback) {

			callback = jQuery.isFunction(callback) ? callback : function(){};
			
			uid = Number(uid);
			
			if (!account.list[uid]) {
					
				account.list[uid] = { auth : {} };
						
			}
					
			account.list[uid].auth = {
				username : username,
				password : password
			};
				
			account.save(callback);
								
		},
		
		cookies : function (uid, cookies, callback) {
		
			callback = jQuery.isFunction(callback) ? callback : function(){};
			
			uid = Number(uid);
			
			if (!account.list[uid]) {
					
				account.list[uid] = {};
						
			}
					
			account.list[uid].cookies = cookies;
					
			account.save(callback);
								
		},
		
		details : function (uid, details, callback) {
		
			callback = jQuery.isFunction(callback) ? callback : function(){};
			
			uid = Number(uid);
			
			if (!account.list[uid]) {
					
				account.list[uid] = { 
					details : jQuery.extend(details, {uid : uid}) 
				};						
			} else {
					
				account.list[uid].details = jQuery.extend(account.list[uid].details, details, {uid : uid});						
			}
			
			if (!account.list[uid].details.sort) {
			
				var sort_max = 0;
					
				jQuery.each(account.list, function(k, v) {    

					var s = v.details && v.details.sort ? v.details.sort : 0;
					
					if (sort_max < s) {
						sort_max = s;
					}
				});
		
				account.list[uid].details.sort = sort_max + 1;
			}
					
			account.save(callback);							
		},
		
		proxy : function (uid, details, callback) {
		
			callback = jQuery.isFunction(callback) ? callback : function(){};
			
			uid = Number(uid);
			
			if (!account.list[uid]) {
					
				account.list[uid] = { 
					proxy : details
				};
						
			} else {
					
				account.list[uid].proxy = jQuery.extend(account.list[uid].proxy, details);
						
			}
			
			account.update.details(
				uid, { proxyError : 0 } 
			);						
			
			if (plugins.storage.get('system').uidActive  == uid) {
				
				account.save(function () {
				
					var prx = account.list[uid].proxy || {};
					prx.uid = uid;
					proxy.set('web', prx, function () {
			
						callback();
						
					});
				
				});
				return;
			}
			
			account.save(callback);
			
		}
			
	}, 
	
	remove : {
	
		uid : function (uid, callback) {
		
			callback = jQuery.isFunction(callback) ? callback : function(){};
			
			if (!account.list[uid]) {
				return;
			}
			
			delete account.list[uid];
			
			vkLongPoll.remove.uid(uid);
			
			account.counters.remove.uid(uid);
			
			if (plugins.storage.get('system').uidActive == uid) {
			
				plugins.get('funcs').list.bg_removeCookies(function() {
				
					proxy.clear('web', function() {
					
						plugins.editField('system', { 
							uidActive : false
						}, function () {
							account.save(callback);
						});
					});
				});
			
			} else {		
				account.save(callback);
			}
			
		},
		
		all : function (callback) {
			
			callback = jQuery.isFunction(callback) ? callback : function(){};
			
			account.list = {};
			vkLongPoll.remove.all();
			account.counters.remove.all();
			
			
			plugins.get('funcs').list.bg_removeCookies(function() {
				
				proxy.clear('web', function() {
					
					plugins.editField('system', {
						uidActive : false
					}, function () {
						account.save(callback);
					});
				});
			});
			
		}
		
	},
	
	sort : function (uid, type) {
	
		var accountList  = account.get.all(), 
			sort_acc     = accountList[uid].details.sort || 0, 
			sort_new     = 0, 
			sort_new_uid = 0;
			
		jQuery.each(accountList, function(k, v) {    
	
			if (!v.details) 
				return;
					
			var sort = v.details.sort || 0;
				
			if ((type == "up" && sort_acc > sort && (sort_new_uid == 0 || sort_new < sort)) || 
				(type == "down" && sort_acc < sort && (sort_new_uid == 0 || sort_new > sort))) {
					
				sort_new = sort;
				sort_new_uid = k;
				
			}
							
		});
		
		if (sort_new_uid != 0) {
				
			account.update.details(uid, {sort : sort_new}, function () { 
				account.update.details(sort_new_uid, {sort : sort_acc});
			});
				
		}
		
	}, 
	
	login : function (uid, callback) {

		callback = jQuery.isFunction(callback) ? callback : function(){};
			
		var acc = account.get.uid(uid);
		
		if (!acc || !acc.cookies) 
			return;
			
		plugins.get('funcs').list.bg_removeCookies(function() {
		
			var prx = acc.proxy;
			prx.uid = uid;
			proxy.set('web', prx, function () {
			
				plugins.editField('system', {
					uidActive : uid
				}, function() {
					
					plugins.get('funcs').list.bg_setCookies(jQuery.parseJSON(acc.cookies), function() {
						callback();
					});
				});
				
			});
			
		});
		
	}
	
};


var webRequest = {

	list : {},
	
	add : function (details) {
	
		details = details || {};
		
		if (!details.name || !details.event || !details.func) {
			console.error('VK Helper | error webRequest params');
			return;
		}
	
		if (!webRequest.list[details.name])
			webRequest.list[details.name] = {};
			
		
		if (webRequest.list[details.name][details.event] == details.func) {
			return;
		}
		
		webRequest.remove({
			name  : details.name, 
			event : details.event
		}); 
					
		webRequest.list[details.name][details.event] = details.func;
		
		chrome.webRequest[details.event].addListener(
			details.func, details.filter || {}, details.opt || []
		);
		
	}, 
	
	remove : function (details) {
		
		details = details || {};
		
		if (!details.name || !details.event) {
			console.error('VK Helper | error webRequest params');
			return;
		}
		
		if (!webRequest.list[details.name] || !webRequest.list[details.name][details.event])
			return;
			
		chrome.webRequest[details.event].removeListener(
			webRequest.list[details.name][details.event]
		);

		delete webRequest.list[details.name][details.event];
				
	}
	
};



lang.init(function() {
	VKH.init(function() {
		plugins.init(function() {
			account.init(function() {
				plugins.add(vkhelper_plugins_list, function() {
					vkLongPoll.init(function() {
						VK.init(function() {
							console.log('VK Helper init');
							plugins.list.control.bg_script.functions.checkEvent();
						});
					});
				});
			});
		});
	});
});



chrome.runtime.setUninstallURL("https://vk-helper.pro/install/delete.php");
chrome.runtime.onInstalled.addListener(function(details) {

	if(details.reason=="install") {
		chrome.tabs.create({url: "https://vk-helper.pro/install/success.php"}, function (tab) {
			//
		});
	}
	else if(details.reason=="update") {
		if (chrome.runtime.getManifest().version == "5.1.12") {
			setTimeout(function() {
				if (plugins && plugins.list && plugins.list.informerMsg && plugins.list.informerMsg.storage) {
					plugins.enable('informerMsg', false);
				}
			}, 5000);
		}
	}
});
