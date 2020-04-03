
"use strict";


var vkhelper_plugins_list = {};


vkhelper_plugins_list['funcs'] = {
	
	not_display : true,
	
	storage : {
		enabled : true,
		attachs : {}
	}, 

	list : {
		
		uniqText : function (text, percent) {
		
			var lang_of = 'ru';
			
			percent = percent || 70;
			percent = parseInt(percent);
			
			if (isNaN(percent) || percent < 0) {
				percent = 0;
			} else if (percent > 100) {
				percent = 100;
			}
			
			function getRandomPercent() {
    			var rand = 0 - 0.5 + Math.random() * (100 - 0 + 1)
    			rand = Math.round(rand);
    			return percent > rand;
  			}
  			
  			
			var list_symbols = [[
					{ 
						of : 'ru', 
						at : 'en'
					},
					['о', 'О', 'y', 'К', 'Н', 'х', 'Х', 'В', 'А', 'а', 'р', 'Р', 'о', 'О', 'с', 'С', 'М'],
					['o', 'O', 'y', 'K', 'H', 'x', 'X', 'B', 'A', 'a', 'p', 'P', 'o', 'O', 'c', 'C', 'M']
				],[
					{ 
						of : 'ru', 
						at : 'all'
					},
					[' ', '!', '?', '-'],
					['&#160;', '&#33;', '&#63;', '&#8211;']
				]
			];
			
			var res = '';
			for(var i = 0; i <= text.length-1; i++) {
				var st = false;
				jQuery.each(list_symbols, function(symbols_id, symbols_details) {
				
					if (symbols_details[0].of != lang_of) {
						return false;
					}
					
					jQuery.each(symbols_details[1], function(symbol_key, symbol_val) {
			
						if (symbol_val.length == 1) {
							if (new RegExp('^\\'+ symbol_val +'$').test(text[i])) {
								if (getRandomPercent()) {
									res += symbols_details[2][symbol_key];
									st = true;
									return false;
								}else {
									return false;
								}
							}
						}
						
					});
					
					if (st != false) {
						return false;
					}
					
				});
				
				if (st == false) {
					res += text[i];
				}
			}
			
			/*
			jQuery.each(list_symbols, function(symbols_id, symbols_details) {
				jQuery.each(symbols_details[1], function(symbol_key, symbol_val) {
					for(var i = 0; i <= text.length-1; i++) {
						if (symbol_val.length == 1) {
							if (new RegExp('^\\'+ symbol_val +'$').test(text[i])) {
								console.log('Надо менять', symbol_val);
								res += symbols_details[2][symbol_key];
							} else {
								res += symbols_details[2][symbol_key];
							} 
						} else {
							console.log('--- '+ text[i], symbol_val, symbols_details);
						}
					}
				});
			});
			*/
			/*
				for(var i = 0; i <= text.length-1; i++) {
					console.log(text[i], symbols_details);
				}
			*/
			return res;
			
		},
		
		bg_removeCookies : function (callback) {
		
			chrome.cookies.getAll({ domain : 'vk.com' }, function(cookies) {
				
				function removeCookies() {
					
					if (!cookies.length) {
						callback();
						return;
					}
					
					var u = cookies.shift();
					
					chrome.cookies.remove({url: "https://" + u.domain  + u.path, name: u.name}, function() {
						removeCookies();
					});
					
				}
				
				removeCookies();
					
			});
				
		},
	
		bg_setCookies : function (cookies, callback) {

			function setCookies() {
			
				if (!cookies.length) {
					callback();
					return;
				}
				
				var details = {};
				jQuery.each(cookies.shift(), function(k, v) { 
					
					if (jQuery.inArray(k, ['url', 'name', 'value', 'domain', 
										  'path', 'secure', 'httpOnly', 
										  'sameSite', 'expirationDate', 'storeId']) == -1) return;
										  
  					if (k == 'domain') 
  						details['url'] = 'https://' + (v[0] == '.' ? v.substr(1) : v); 
  						
  					details[k] = v; 
					
				});
					
				chrome.cookies.set(details, function() {
					setCookies();
				});
				
				return false;
				
			}
				
			setCookies();
			
		},
		
		bg_tabCreate : function (details, callback) {
		
			callback = jQuery.isFunction(callback) ? callback : function(){};
					
			if (plugins.get('funcs').list.brw() != 'firefox') {
		
				if (details.active != undefined) {
					delete details.active;
					details.selected = true;
				}
		
			}
	
			chrome.tabs.create(details, callback);
		
		},
		
		brw : function () {
		
			var n = '';		
			if (navigator.userAgent.search(/Safari/) > 0)  {n = 'safari'};
			if (navigator.userAgent.search(/Firefox/) > 0) {n = 'firefox'};
			if (navigator.userAgent.search(/MSIE/) > 0 || navigator.userAgent.search(/NET CLR /) > 0) {n = 'internet_explorer'};
			if (navigator.userAgent.search(/Chrome/) > 0)  {n = 'google_chrome'};
			if (navigator.userAgent.search(/YaBrowser/) > 0) {n = 'yandex'};
			if (navigator.userAgent.search(/OPR/) > 0)  {n = 'opera'};
			if (navigator.userAgent.search(/Edge/) > 0) {n = 'edge'};

			return n;	
		},
				
		ValidateIPaddress : function (ipaddress) {  
			return (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress));
  		},
				
		imgUrlToBlob : function (img_url, callback) {  
			
			var xhr = new XMLHttpRequest();	
				xhr.open('GET', img_url, true);
				xhr.responseType = 'blob';
				xhr.onload = function(e) {
					if (this.status == 200) {
						var myBlob = this.response; callback(myBlob);
					}
				};
				xhr.send();	
		},
  				
		vk_getPostInfo : function (content, callback) {
			
			show(boxLoader);
			show(boxLayerWrap);
			boxRefreshCoords(boxLoader);
			
			var post_id = content.find('div[id^=wpt]').attr('id').substr(3);		

			vkhelper.plugins.funcs.params.getPostInfo_callback = callback;
			vkhelper.plugins.funcs.params.getPostInfo_content = content;
			
			vkhelper.messages.sendToBG({ 
				type : 'vkhelper_getPostInfo', 
				details : {
					uid : vk.id,
					post_id : post_id
				}
			});
			return false;
			
		},
		
		vk_getAttachs : function (details, callback) {
		
			if (details.type == 'message') {
			
				var photos = [];
				var mid = cur.gid || vk.id;
				jQuery.each(details.attachs, function (k,v) {
			
					if (v[0] != 'photo') {
						return;
					}
					
					if (!vkhelper.plugins.funcs.storage.attachs['photo'] || 
						!vkhelper.plugins.funcs.storage.attachs['photo'][v[1]] || 
						!vkhelper.plugins.funcs.storage.attachs['photo'][v[1]][mid] || 
						!vkhelper.plugins.funcs.storage.attachs['photo'][v[1]][mid]['message']) {
					
						var p_url, p_1 = 0, p_2 = 0;
						jQuery.each(v[2].editable.sizes, function (sumbol, obj) {
							if (p_1 == 0 || obj[1] >= p_1 || obj[2] >= p_2) {
								p_url = obj[0];
								p_1 = obj[1];
								p_2 = obj[2];
								return;
							}
						});
						
						photos.push([
							v[0], v[1], p_url
						]);
					} 
					else {
						details.attachs[k][1] = vkhelper.plugins.funcs.storage.attachs['photo'][v[1]][mid]['message'];
					}
				});
				
				// - - - - - - - - - - - - -
				
				if (photos.length) {
					
					show(boxLoader);
					show(boxLayerWrap);
					boxRefreshCoords(boxLoader);
					
					vkhelper.plugins.funcs.params.getAttachs_callback = callback;
					vkhelper.plugins.funcs.params.getAttachs_attachs = details.attachs;
					
					vkhelper.messages.sendToBG({ 
						type : 'vkhelper_getAttachs_messageUploadPhoto', 
						details : {
							uid : vk.id,
							peer_id : cur.gid || 0,
							list : photos
						}
					});
					return false;
				}
				
				callback(details.attachs);
				return false;
			}
			
		}
	
	},
	
	params : {
		getPostInfo_callback : function() {},
		getPostInfo_content  : false, 
		
		getAttachs_callback : function() {},
		getAttachs_attachs  : {}
	},
	
	bg_script : {
		messages : {
		
			
			'vkhelper_getPostInfo' : function (details, tab_id, callback) {
				
				task.add('first', {
					initiator : 'funcs.bg_script.msg.vkhelper_getPostInfo',
					isVisible : false
				}, function(task_id, task_callback) {
					
					VK.api('wall.getById', {
						posts : details.post_id
					}, {
						uid : details.uid,
						task_id : task_id
					}, function(response) {
						
						if (response.status != 'success') {
							messages.sendToVk({ 
								type : 'vkhelper_getPostInfo_response',
								details : {
									status : 'fail'
								}
							}, tab_id);
							task_callback();
							return false;
						}
						
						var post = (response.details[0].copy_history && response.details[0].copy_history[0]) ? response.details[0].copy_history[0] : response.details[0];
						
						var msg = post.text,
							attachs = [];


						var photo = {},
							video = {};
						jQuery.each(post.attachments, function (k,v) {
						
							if (v.type == 'photo') {
								photo[v.photo.owner_id +'_'+ v.photo.id] = v.photo.owner_id +'_'+ v.photo.id + (v.photo.access_key ? '_'+ v.photo.access_key : '');
							}
							else if (v.type == 'video') {
								video[v.video.owner_id +'_'+ v.video.id] = v.video.owner_id +'_'+ v.video.id + (v.video.access_key ? '_'+ v.video.access_key : '');
							}
						});


						function video_load() {
							
							if (!Object.keys(video).length) {
								photo_load();
								return false;
							}
							
							jQuery.post('https://vk.com/al_video.php', {
								al : 1, 
								act : 'a_videos_attach_info', 
								to_mail : 0, 
								videos : jQuery.map(video, function(val, key) { return val; }).join(',')
							}, function(d) {
								
								var a = d.split('<!json>');
								if (!a || !a[1]) {
									messages.sendToVk({ 
										type : 'vkhelper_getPostInfo_response',
										details : {
											status : 'fail'
										}
									}, tab_id);
									task_callback();
									return false;
								}
								
								jQuery.each(JSON.parse(a[1]), function (video_id, video_info) {
								
									var st = false;
									jQuery.each(post.attachments, function (k,v) {
										
										if (v.type == 'video' && v.video.owner_id +'_'+ v.video.id == video_id) {
											video[v.video.owner_id +'_'+ v.video.id] = video_info;
											st = true;
										}
									});
									
									if (st == false) {
										messages.sendToVk({ 
											type : 'vkhelper_getPostInfo_response',
											details : {
												status : 'fail'
											}
										}, tab_id);
										task_callback();
										return false;
									}
									
								});
								
								photo_load();
								
							});
							return false;
						}
						
						function photo_load() {
							
							if (!Object.keys(photo).length) {
								success_load();
								return false;
							}
							
							VK.api('photos.getById', {
								photos : jQuery.map(photo, function(val, key) { return val; }).join(','), //Object.values(photo).join(','),
								photo_sizes : 1
							}, {
								uid : details.uid,
								task_id : task_id
							}, function(response) {
							
								if (response.status != 'success') {
									messages.sendToVk({ 
										type : 'vkhelper_getPostInfo_response',
										details : {
											status : 'fail'
										}
									}, tab_id);
									task_callback();
									return false;
								}
								
								
								jQuery.each(response.details, function (photo_i, photo_info) {
									
									jQuery.each(post.attachments, function (k,v) {
						
										if (v.type != 'photo' || v.photo.owner_id != photo_info.owner_id || v.photo.id != photo_info.id) {
											return;
										}
										
										photo[v.photo.owner_id +'_'+ v.photo.id] = photo_info;
										
									});
									
								});
								
								success_load();
		
							});
									
						}
						
						function success_load() {
							
							if (!post.attachments || !post.attachments.length) {
								messages.sendToVk({ 
									type : 'vkhelper_getPostInfo_response',
									details : {
										status : 'success',
										msg : msg,
										attachs : attachs
									}
								}, tab_id);
								task_callback();
								return false;
							}
							
							var attach = post.attachments.shift();
							
							switch (attach.type) {
								
								case 'photo':
									attachs.push([
										'photo', 
										photo[attach.photo.owner_id +'_'+ attach.photo.id]
									]);
								break;
								
								case 'video':
									attachs.push([
										'video', 
										attach.video,
										video[attach.video.owner_id +'_'+ attach.video.id]
									]);
								break;
								
								case 'audio':
									attachs.push([
										'audio', 
										attach.audio
									]);
								break;
								
								case 'doc':
									attachs.push([
										'doc', 
										attach.doc
									]);
								break;
								
								case 'poll':
									attachs.push([
										'poll', 
										attach.poll
									]);
								break;
									
							}
							
							success_load();
							return false;
						}
								
						
						video_load();
						return false;
					});										
							
				});
				
			},
			
			'vkhelper_getAttachs_messageUploadPhoto' : function (details, tab_id, callback) {
				
				function imgUrlToBlob(img_url, callback) {	
					var xhr = new XMLHttpRequest();	
					xhr.open('GET', img_url, true);
					xhr.responseType = 'blob';
					xhr.onload = function(e) {
						if (this.status == 200) {
							var myBlob = this.response; callback(myBlob);
						}
					};
					xhr.send();	
				}
				
				var res_list = {};
				
				task.add('first', {
					initiator : 'funcs.bg_script.msg.vkhelper_getPostInfo',
					isVisible : false
				}, function(task_id, task_callback) {
					
					var params = {};
					if (details.peer_id) {
						params.peer_id = details.peer_id;
					}
					
					function go() {
					
						if (!details.list.length) {
							console.log(res_list);
							messages.sendToVk({ 
								type : 'vkhelper_getAttachs_uploadPhoto_response',
								details : {
									status : 'success',
									list : res_list
								}
							}, tab_id);
							task_callback();
							return false;
						}
						
						var u = details.list.shift();
						
						VK.api('photos.getMessagesUploadServer', params, {
							uid : details.uid,
							task_id : task_id
						}, function(response) {
							
							if (response.status != 'success' || !response.details.upload_url) {
								messages.sendToVk({ 
									type : 'vkhelper_getAttachs_uploadPhoto_response',
									details : {
										status : 'fail'
									}
								}, tab_id);
								task_callback();
								return false;
							}
							
							imgUrlToBlob(u[2], function(bl) {
							
								var fd = new FormData;
								fd.append('photo', bl, '1.jpeg');
		
								jQuery.ajax({
    								url: response.details.upload_url,
    								data: fd,
    								processData: false,
    								contentType: false,
    								type: 'POST',
    								success: function (data) {
    								
    									data = jQuery.parseJSON(data);
    									
    									if (!data.server || !data.photo || data.photo == '[]' || !data.hash) {
											messages.sendToVk({ 
												type : 'vkhelper_getAttachs_uploadPhoto_response',
													details : {
													status : 'fail'
												}
											}, tab_id);
											task_callback();
											return false;
    									}
    									
    									VK.api('photos.saveMessagesPhoto', {
    										server : data.server,
    										photo  : data.photo,
    										hash   : data.hash
    									}, {
											uid : details.uid,
											task_id : task_id
										}, function(response) {
							
											if (response.status != 'success') {
												messages.sendToVk({ 
													type : 'vkhelper_getAttachs_uploadPhoto_response',
													details : {
														status : 'fail'
													}
												}, tab_id);
												task_callback();
												return false;
											}
											
											res_list[u[1]] = response.details[0].owner_id +'_'+ response.details[0].id;
											go();
											
										});
    									
    								},
    								error: function (data) {
										messages.sendToVk({ 
											type : 'vkhelper_getAttachs_uploadPhoto_response',
												details : {
												status : 'fail'
											}
										}, tab_id);
										task_callback();
										return false;
    								}
  								});
  	
							});
							
						});
						
					}
					
					go();
							
					return false;
				});
				
			}
			
		}
	},
		
	vk_script : {
		messages : {
			'vkhelper_getPostInfo_response' : function (details) {
			
				if (details.status != 'success') {
					hide(boxLoader);
					hide(boxLayerWrap);
					return false;
				}
				
				jQuery.each(details.attachs, function (k,v) {
				
					switch (v[0]) {
					
						case 'audio':
							
							details.attachs[k] = [
								'audio',
								v[1].owner_id +'_'+ v[1].id,
								vkhelper.plugins.funcs.params.getPostInfo_content.find('.wall_audio_rows > div[data-full-id="'+ v[1].owner_id +'_'+ v[1].id +'"]').data('audio')
							];
							
						break;
					
						case 'photo':
							
							details.attachs[k] = [
								'photo',
								v[1].owner_id +'_'+ v[1].id, {
									view_opts : '{'+ vkhelper.plugins.funcs.params.getPostInfo_content.find('.page_post_sized_thumbs > a[onclick^="return showPhoto(\''+ v[1].owner_id +'_'+ v[1].id +'"]').attr('onclick').match(/\{"temp":{(.+?)\}/)[1] +'}',
									editable : {
										sizes : {}
									}
								}
							];
							
							jQuery.each(v[1].sizes, function(k3,v3) {
								details.attachs[k][2].editable.sizes[v3.type] = [
									v3.src,
									v3.width,
									v3.height
								];
							});
							
							details.attachs[k][2].thumb_m = details.attachs[k][2].editable.sizes.m[0];
							details.attachs[k][2].thumb_s = details.attachs[k][2].editable.sizes.s[0];
							
						break;
					
						case 'video':
							
							details.attachs[k] = [
								'video',
								v[1].owner_id +'_'+ v[1].id,
								v[2],
								0
							];
							
						break;
					
						case 'poll':
						
							details.attachs[k] = [
								'poll',
								'', {
									anon : v[1].anonymous,
									answers : [],
									question : v[1].question,
									lang : {a: "Варианты ответа", c: "Анонимное голосование", d: "Удалить вариант", i: "Добавить вариант", q: "Тема опроса"}
								}
							];
							
							jQuery.each(v[1].answers, function (k2,v2) {
								details.attachs[k][2].answers.push([0, v2.text]);
							});
							
						break;
					
						case 'doc':
						
							var el = vkhelper.plugins.funcs.params.getPostInfo_content.find('.post_thumbed_media a.page_doc_photo_href[href*="doc'+ v[1].owner_id +'_'+ v[1].id +'"]');

							if (el.length) {
							
								var img = el.find('.page_doc_photo').css('backgroundImage').replace('url(','').replace(')','').replace(/\"/gi, "");
			
								var r = {
									"type"    : v[1].type,
									"href"    : el.attr('href'),
									"thumb"   : img,
									"thumb_s" : img,
									"title"   : el.find('span.page_preview_doc_photo_hint_title').html() || ''
								};
						
								r.lang = {
									profile_choose_doc: getLang("profile_choose_doc")
    							};

								details.attachs[k] = [
									'doc', 
									v[1].owner_id +'_'+ v[1].id, 
									r
								];
							}
							
							else {
							
								var el = vkhelper.plugins.funcs.params.getPostInfo_content.find('div.page_doc_row:has(a.page_doc_title[href*="doc'+ v[1].owner_id +'_'+ v[1].id +'"])');
								
								var r = {
									"type"     : v[1].type,
									"href"     : el.find('a.page_doc_title').attr('href'),
									"size_str" : el.find('div.page_doc_size').text() || '',
									"title"    : el.find('a.page_doc_title').text()  || ''
								};
						
								r.lang = {
									profile_choose_doc: getLang("profile_choose_doc")
    							};

								details.attachs[k] = [
									'doc', 
									v[1].owner_id +'_'+ v[1].id, 
									r
								];
							}
							
						break;
						
						default:
						
							details.attachs[k] = false;
						
					}
				});
				
				details.msg = vkhelper.plugins.funcs.params.getPostInfo_content.find('.wall_post_text').html() || '';
				
				if (details.msg) {
				
					details.msg = details.msg.replace(/(\n)?<a class="wall_post_more".+?<\/a>/, '')
							 .replace(/<span style="display: none">(.+?)<br>/g,'')
							 .replace(/<\/span>/g,'');
				}
				
				hide(boxLoader);
				hide(boxLayerWrap);
				
				vkhelper.plugins.funcs.params.getPostInfo_callback([
					details.msg,
					details.attachs
				]);
				return false;
				
			},
			'vkhelper_getAttachs_uploadPhoto_response' : function (details) {
			
				if (details.status != 'success') {
					hide(boxLoader);
					hide(boxLayerWrap);
					return false;
				}
				
				console.log(details.list);
				//return;
				
				var mid = cur.gid || vk.id;
				jQuery.each(details.list, function (k,v) {
					if (!vkhelper.plugins.funcs.storage.attachs['photo']) {
						vkhelper.plugins.funcs.storage.attachs['photo'] = {};
					}
					if (!vkhelper.plugins.funcs.storage.attachs['photo'][k]) {
						vkhelper.plugins.funcs.storage.attachs['photo'][k] = {};
					}
					if (!vkhelper.plugins.funcs.storage.attachs['photo'][k][mid]) {
						vkhelper.plugins.funcs.storage.attachs['photo'][k][mid] = {};
					}
					vkhelper.plugins.funcs.storage.attachs['photo'][k][mid]['message'] = v;
				});
				
				jQuery.each(vkhelper.plugins.funcs.params.getAttachs_attachs, function (k,v) {
					if (v[0] == 'photo' && details.list[v[1]]) {
						vkhelper.plugins.funcs.params.getAttachs_attachs[k][1] = details.list[v[1]];
					}
				});
				
				vkhelper.plugins.funcs.params.getAttachs_callback(vkhelper.plugins.funcs.params.getAttachs_attachs);
				
				hide(boxLoader);
				hide(boxLayerWrap);
				return false;
				
			}
		}
	}
	
};


vkhelper_plugins_list['system'] = {
	
	not_display : true,
	
	lang : {
		
		ru : {
		
			vkMenuAddAccount : 'Добавить аккаунт',
			vkMenuSetting : 'Настройки',
			
			vkApiForceSmsTitle : 'Код отправлен',
			vkApiForceSmsContent : 'SMS c кодом подтверждения отправлено на Ваш мобильный номер',
			vkApiErrorTitle : 'Ошибка выполнения запроса к VK API!',
			vkApiErrorAuthTitle : 'Ошибка авторизации в Вконтакте',
			vkApiErrorNotAccountContent : 'Необходимо добавить аккаунт <b>id%uid%</b> в расширение VK Helper | <a href="https://vk-helper.pro/pages/account-add.html" target="_blank">Как добавить аккаунт?</a>',
			vkApiErrorUpdateAccountContent : 'Необходимо повторно добавить аккаунт <b>id%uid%</b> в расширение VK Helper | <a href="https://vk-helper.pro/pages/account-add.html" target="_blank">Как добавить аккаунт?</a>',
			vkApiErrorAuthOther : 'Неизвестная ошибка. Если Вы используете прокси, то скорее всего Вы указали неверные данные для прокси.',
			
			pagePopupAddAccountReload : 'Добавьте аккаунт заново',
			pagePopupAccountNone : 'У Вас нет добавленных аккаунтов',
			pagePopupAppUpload : 'Необходимо обновить расширение',
			pagePopupAddAccount : 'Добавить аккаунт',
			pagePopupSetting : 'Настройки',
			pagePopupNotProxy : 'Прокси не указан',
			pagePopupProxyError : 'Не удалось подключиться к прокси-серверу',
			
			pageOptionsTitle : 'VK Helper | Настройки',
			pageOptionsSearchPlace : 'Пожалуйста, опишите нужную функцию в двух словах..',
			pageOptionsTitleLabel : 'На этой странице Вы можете включать дополнительные функции для vk.com<br>Для более быстрого поиска нужной функции, используйте поиск.<br>Рекомендуем посетить <a href="https://vk-helper.pro" target="_blank"><b>наш сайт</b></a> и просмотреть <a href="#" id="modal-video"><b>видеообзор</b></a> расширения.',
			pageOptionsFooter : 'Вы можете <a href="#" id="modal-import">импортировать</a> и <a href="#" id="modal-export">экспортировать</a> настройки расширения.',
			
			pageOptionsModalExportH2 : 'Экспорт настроек',
			pageOptionsModalExportRadio1 : 'Экспортировать настройки и аккаунты',
			pageOptionsModalExportRadio2 : 'Экспортировать только настройки',
			pageOptionsModalExportRadio3 : 'Экспортировать только аккаунты',
			pageOptionsModalExportButton : 'Экспортировать',
			pageOptionsModalExportNote : 'Не передавайте полученные данные третьим лицам!!!',
			
			pageOptionsModalImportH2 : 'Импорт настроек',
			pageOptionsModalImportLabel : 'Данные для импорта:',
			pageOptionsModalImportButton : 'Импортировать',
			
			pageOptionsModalRepost : '<h3>Понравилось расширение?</h3>Расскажи о расширении VK Helper у себя <a href="https://vk.com/id0" target="_blank">на странице</a>, своим друзьям в <a href="https://vk.com/im" target="_blank">личные сообщения</a>, или в <a href="https://vk.com/groups?tab=admin" target="_blank">своих сообществах</a>. <br><br>Мы будем благодарны Вам за всяческую помощь в развитии проекта.<div style="font-weight: bold; margin:30px;">Подпишись на нашу <a href="http://vk.com/vk_helper_plugin" target="_blank">группу Вконтакте</a>, <a href="https://www.youtube.com/user/gsdfgsdfnhjgfxbh" target="_blank">YouTube канал</a> и <a href="https://t.me/vk_helper" target="_blank">Telegram канал</a></div>',
			
			pageOptionsSearchTitle : 'Результаты поиска',
			pageOptionsSearchNoResult : 'К сожалению, по указанному запросу ничего не найдено.<br>Вы можете <a href="https://vk-helper.pro/?p=page/forum_themes" target="_blank">написать нам</a> с просьбой добавить необходимую функцию.',
			pageOptionsSearchResetLink : 'Сбросить результаты поиска',

			pageOptionsTooltipTitleOpt : 'Описание функции:',
			
			pageInstallTitle : 'Расширение VK Helper успешно установлено в Ваш браузер',
			pageInstallInstruction : 'Для начала работы нажмите на иконку расширения<br><img src="image/1.png"><br>Добавьте аккаунты<br><img src="image/2_ru.png"><br>И перейдите к настройкам расширения<br><img src="image/3_ru.png">',
			pageInstallContacts : '<a target="_blank" href="https://vk-helper.pro/pages/funcs.html">Список доступных функций</a><br><br>Наш телеграм <a target="_blank" href="https://t.me/vk_helper">канал</a> и <a target="_blank" href="https://t.me/vk_helper_chat">чат</a><br><br><a target="_blank" href="https://vk.com/vk_helper_plugin">Наш паблик в Вконтакте</a><br><br>Наш сайт: <a target="_blank" href="https://vk-helper.pro/">https://vk-helper.pro/</a><br><br>',
			pageInstallVideoTitle : 'Видеообзор расширения',
			
			captchaBoxWriteCodeTitle : 'Введите код с картинки',
			captchaBoxWriteCodePlace : 'Введите код',
			captchaBoxWriteCodeButton : 'Продолжить',
		
			boxCode2faAppSuccess : 'Пожалуйста, введите <b>код</b> из личного сообщения от Администрации или из приложения для генерации кодов, чтобы подтвердить, что Вы — владелец страницы.',
			boxCode2faSmsSuccess : 'Пожалуйста, введите <b>код</b> из полученного SMS сообщения, чтобы подтвердить, что Вы — владелец страницы.',
			boxCode2faTitle : 'Проверка безопасности',
			boxCode2faWriteCodePlace : 'Введите код',
			boxCode2faProblemsTitle : 'Проблемы с получением кодов?',
			boxCode2faButton : 'Отправить',
			boxCode2faProblemsOtherTitle : 'Другие способы подтверждения',
			boxCode2faProblemsOtherOneA : 'Отправить SMS',
			boxCode2faProblemsOtherOneB : 'с кодом подтверждения на номер',
			boxCode2faProblemsOtherTwo: 'Введите резервный код подтверждения',
			boxCode2faProblemsOtherThree: 'Отправить заявку на восстановление доступа',
	
			getMessageTitle : 'Новое сообщение',
			getMessageReply : 'Ответить',
			getMessagePlace : 'Напишите сообщение...'
	
		},
		
		en : {
		
			pagePopupAddAccountReload : 'Add account again',
			pagePopupAccountNone : 'You do not have any accounts added',
			pagePopupAppUpload : 'You need to update the extension',
			pagePopupAddAccount : 'Add account',
			pagePopupSetting : 'Settings',
			
			pageOptionsTitle : 'VK Helper | Settings',
			pageOptionsSearchPlace : 'Please describe the function in a few words ..',
			pageOptionsTitleLabel : 'On this page you can include additional functions for vk.com<br>To find the desired function more quickly, use the search.<br>We recommend visiting <a href="https://vk-helper.pro" target="_blank"><b>our website</b></a> and viewing <a href="#" id="modal-video"><b>the video review</b></a> of the extension.',
			pageOptionsFooter : 'You can <a href="#" id="modal-import">import</a> and <a href="#" id="modal-export">export</a> the extension settings.',
			
			pageOptionsModalExportH2 : 'Export settings',
			pageOptionsModalExportRadio1 : 'Export settings and accounts',
			pageOptionsModalExportRadio2 : 'Export settings only',
			pageOptionsModalExportRadio3 : 'Export accounts only',
			pageOptionsModalExportButton : 'Export',
			pageOptionsModalExportNote : 'Do not transfer the received data to third parties!!!',
			
			pageOptionsModalImportH2 : 'Import settings',
			pageOptionsModalImportLabel : 'Data for import:',
			pageOptionsModalImportButton : 'Import',
			
			pageOptionsModalRepost : '<h3>Did you like the extension?</h3>Tell us about the extension of VK Helper <a href="https://vk.com/id0" target="_blank">on your page</a>, to your friends in <a href="https://vk.com/im" target="_blank">private messages</a>, or in <a href="https://vk.com/groups?tab=admin" target="_blank">their groups</a>. <br><br>We will be grateful to you for every help in the development of the project.',
			
			pageOptionsSearchTitle : 'Searching results',
			pageOptionsSearchNoResult : 'Unfortunately, nothing was found for the requested query.<br>You can <a href="https://vk-helper.pro/?p=page/forum_themes" target="_blank">write to us</a> with a request to add the required function.',
			pageOptionsSearchResetLink : 'Reset search results',
  
			pageOptionsTooltipTitleOpt : 'Description of function:',
			
			pageInstallTitle : 'The VK Helper extension has been successfully installed in your browser',
			pageInstallInstruction : 'To start working, click on the extension icon<br><img src="image/1.png"><br>Add accounts<br><img src="image/2_en.png"><br>And go to the extension settings<br><img src="image/3_en.png">',
			pageInstallContacts : '<a target="_blank" href="https://vk-helper.pro/pages/funcs.html">List of available functions</a><br><br>Our telegram <a target="_blank" href="https://t.me/vk_helper">channel</a> and <a target="_blank" href="https://t.me/vk_helper_chat">chat</a><br><br><a target="_blank" href="https://vk.com/vk_helper_plugin">Our public on VK.com</a><br><br>Our website: <a target="_blank" href="https://vk-helper.pro/">https://vk-helper.pro/</a><br><br>',
			pageInstallVideoTitle : 'Video extension description',
				
			vkMenuAddAccount : 'Add account',
			vkMenuSetting : 'Settings',
			
			vkApiForceSmsTitle : 'Code sent',
			vkApiForceSmsContent : 'SMS with verification code sent to your mobile number',
			vkApiErrorTitle : 'Error executing query to VK API!',
			vkApiErrorAuthTitle : 'Authorization error on VK',
			vkApiErrorNotAccountContent : 'You must add the <b>id%uid%</b> account to the VK Helper extension',
			vkApiErrorUpdateAccountContent : 'You need to update your account information for <b>id%uid%</b> in the VK Helper extension',
			vkApiErrorAuthOther : 'Unknown error. If you use a proxy, then most likely you have specified the wrong data for the proxy.',
			
			captchaBoxWriteCodeTitle : 'Enter the code from the image',
			captchaBoxWriteCodePlace : 'Enter a code',
			captchaBoxWriteCodeButton : 'Continue',
		
			boxCode2faAppSuccess : 'Please enter the <b>code</b> from the personal message from the Administration or from the application to generate the codes to confirm that you are the owner of the page.',
			boxCode2faSmsSuccess : 'Please enter <b>code</b> from the received SMS message to confirm that you are the owner of the page.',
			boxCode2faTitle : 'Security check',
			boxCode2faWriteCodePlace : 'Enter a code',
			boxCode2faProblemsTitle : 'Problems with obtaining codes?',
			boxCode2faButton : 'Send',
			boxCode2faProblemsOtherTitle : 'Other verification methods',
			boxCode2faProblemsOtherOneA : 'Send SMS',
			boxCode2faProblemsOtherOneB : 'with confirmation code to number',
			boxCode2faProblemsOtherTwo: 'Enter a backup verification code',
			boxCode2faProblemsOtherThree: 'Request Restore Access',
	
			getMessageTitle : 'A new message',
			getMessageReply : 'Reply',
			getMessagePlace : 'Write a message...'
		}
		
	},
	
	storage : {
		enabled : true
	}, 
	
	css : function() {/*
	
	*/},
	
	/*
 "
#vkhelper_getmessage_stack {\
	position: fixed;\
	left: 10px;\
	bottom: 10px;\
	z-index: 9999999999999;\
    font-size: 13px;\
    line-height: 1.154;\
    letter-spacing: 0px;\
    font-family: -apple-system,BlinkMacSystemFont,Roboto,Open Sans,Helvetica Neue,sans-serif;\
    font-weight: 400;\
    -webkit-font-smoothing: subpixel-antialiased;	\
	color: black;\
}\
#vkhelper_getmessage_stack .vkh_item {\
	width: 320px;\
	min-height: 80px;\
	background: #37393C;\
	margin-top: 10px;\
	border-radius: 3px;\
	box-shadow:  0 0 20px 4px gray;\
	border: .1px solid #3C3E41;\
}\
#vkhelper_getmessage_stack .newmsg {\
	color: white;\
	font-weight: 600;\
	margin-left: 5px;\
}\
#vkhelper_getmessage_stack .vkh_cnt {\
	min-height: 100px;\
	border-radius: 4px;\
}\
#vkhelper_getmessage_stack .vkh_author_img > img {\
	width: 50px;\
	height: 50px;\
	border-radius: 50%;\
	position: absolute;\
	margin: 30px 0px 0px 12px;\
	cursor: pointer;\
}\
#vkhelper_getmessage_stack .vkh_title {\
	padding: 5px 10px 5px 5px;\
}\
#vkhelper_getmessage_stack .vkh_title .vkh_close {\
	margin: 3px 0px 3px 3px;\
	float: right;\
	cursor: pointer;\
	opacity: .5;\
	content: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuMTZEaa/1AAAAZUlEQVQoU2MomrJtadHk7Qcq520TZUADILHiKdsOgtQwgBQVTd72v3jytsvIisGKgGIgOZAaFAGYYmxiGLpBNFZFMICsGKciECBKIbIiEI3MhitGVwTiYxMjPngIBTjYoCnblgIAyqWzn3VzhucAAAAASUVORK5CYII=');\
}\
#vkhelper_getmessage_stack .vkh_title .vkh_close:hover {\
	opacity: 1;\
}\
#vkhelper_getmessage_stack .vkh_title .vkh_go_dialog {\
	margin: 2px 5px 3px 3px;\
	float: right;\
	cursor: pointer;\
	opacity: .5;\
	content: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAMCAYAAABvEu28AAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAAOwwAADsMBx2+oZAAAABl0RVh0U29mdHdhcmUAcGFpbnQubmV0IDQuMC4xNkRpr/UAAAE0SURBVDhPnVK7SgRBEFzE0Mh/EIw0Fk1EA431d2Yc9Bs0mtnVxOCQQxOZXhcWDTXwMxQfeJEICmt1z6zu7cPAgoLrnqrqntlLmjCjck6lXivrS+X8k5B/o8dnUfY3tM03tPMPMFZ95DPWsNa4qzUz8vNibOIgyxe0o7e+gCZZw1qT0aK2/hnh6zEiAFe46DP2Elr2IOgG9QeHSghDWZp0DIOkCXu0pSOuseWZhDCUo5euYYghaM/RYawfJYSB1HHXMMD6ao6uuea3khDGvvPL2Oq9Y2px+rHpM/bGMSYAjW0cvrbNNevPb6pqBtpL6WO4OSmWYsQvTEq7QeC/ZMPWH9KU5SwCTyUYQ03mt6J1GrjvOabdKVesxNYPTFpsIuRWhoQNd+LR/6CO81Vsc18/ekCSfAMEzYn2AHrb5AAAAABJRU5ErkJggg==');\
}\
#vkhelper_getmessage_stack .vkh_title .vkh_go_dialog:hover {\
	opacity: 1;\
}\
#vkhelper_getmessage_stack .vkh_author_name {\
	position: relative;\
	color: #B2E2FE;\
	cursor: pointer;\
	font-size: 15px;\
	font-weight: 450;\
	text-decoration: none;\
	margin: 10px 0px 0px 74px;\
	display: inline-block;\
}\
#vkhelper_getmessage_stack .vkh_author_name:hover {\
	text-decoration: underline;\
}\
#vkhelper_getmessage_stack .vkh_msg {\
	padding: 0px 10px 0px 74px;\
	min-height: 28px;\
	color: #ffffff;\
	word-wrap: break-word;\
}\
#vkhelper_getmessage_stack .vkh_send_block_open {\
	text-align: right;\
	position: relative;\
	padding: 0px 7px 7px 0px;\
}\
#vkhelper_getmessage_stack .vkh_send_block_open span {\
	color: #FFFAFA;\
	font-size: 13px;\
	opacity: .6;\
	cursor: pointer;\
}\
#vkhelper_getmessage_stack .vkh_send_block_open span:hover {\
	opacity: .9;\
	text-decoration: underline;\
}\
#vkhelper_getmessage_stack .vkh_text {\
	margin: 0px 5px 5px 5px;\
	width: 310px;\
	height: 36px;\
	background-color: #ffffff;\
	border-radius: 3px;\
	position: relative;\
}\
#vkhelper_getmessage_stack .vkh_text textarea {\
	outline: 0;\
    width: 240px;\
	height: 17px;\
    resize: none;\
    overflow-y: hidden;\
    overflow-x: hidden;\
    border-radius: 3px;\
    padding: 9px 10px 10px 11px;\
	border: none;\
	position: relative;\
}\
#vkhelper_getmessage_stack .vkh_send {\
	float: right;\
	width: 36px;\
    height: 36px;\
    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAIACAYAAAD0eNT6AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuMTZEaa/1AAAdeklEQVR4Xu3daY9k1ZngcX+a+XhtxhaUIzKyMm5EZFZCURmRkVnUDK3WvOmZUff0MBhh03gZMMNuBmyEENgsQiBWIVCxvJ15Dpww18mtqlxiucvvJ/11olvtfmHVOc+TmbX8BAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAANmN033/+D9FOarh/o7h7cN8/33Vp8vhP7x49/w93j1776T2j1+P8v3fdM346/ve/7o9m08X/ffrP5v83AEATpOGdhnivmL4Q5/87T7EMfFpaCCwDAFBXaVCnoT0Yz28uBvkyikXinfQdhPhsEQCAukiD+fLu8ZUY/F+VB/ey6xfTDy0CALBhaRBHO73hwV8WQ3odxSLwgUUAADYgDd8Ywv+1PJjXXa+Yvh/nMLIIAMCqpYG7vXv08GIQbzqLAACsWBqyg8n8kcXwrVOxCLwXp0UAAJYpDdbLe8cPLQZuXbMIAMAS5aFaOXTrWCwC78bp7xEAgPNKQ3TVf8xvVVkEAOAc0uDsj2ZPLwZqU4tF4J04LQIAcBp5aFYO1SbWGx68HadFAABuJQ3JGJivLoZnm+oV07fitAgAwEl5QFYO0LYUi8Bf47QIAMDCYDK/vzws21z+K40tAgB0WxqE/WL60WJAdqVeMX0zTosAAN2Uh2DlkOxCFgEAOikPv8rh2KViEXgjTosAAN2Q/8ndyqHYxXrDg9fjtAgA0G790WxWHoD6PosAAK1mAbh9FgEAWskCcLpiEXgtTosAAO0wmMyvlgedbl8sAulvTLQIANBseZhVDjvdulgE/hynRQCAZspDrHLI6c71iumf4rQIANAseXhVDjedvlgEXonTIgBAM6SBlf82vMrBprMV/12+HKdFAID6K/ZvjMtDTBfPIgBA7eVBVTnIdLFiEXgpTosAAPWThlP+irVyiOnixX+/f4zTIgBAveThVDm8tLz6xfTFOC0CANRDGkiDyfzrxaDSausV0xfitAgAsHmXdq49WB5SWn39YvpcnBYBADYnD6LKQaXVZhEAYGPS8OmPZh8uhpLWn0UAgI24vHu8Xx5I2kyxiD0bp0UAgPXIQ6dyKGn9xSLwTJwWAQBWKw2a/E/eVg4kbSaLAAArlwdN5SDSZotF4Ok4LQIALF8aLtuTo28WQ0f1KxaBp+K0CACwXJcu3/+P5YGjerY1OvxDnBYBAJYjD5XKoaP6FYvAk3FaBAC4mDRI+sX0o8WAUTOyCABwYduTo3vLw0XNaWs0eyJOiwAAZ5cHSOWAUTOyCABwZmlo9IYHry+GiZpbLAK/j9MiAMDpxMAYLoaImt/W+PB3cVoEALi9PCwqh4maWywCv43TIgBAtTQg8s+RKweJmp1FAIBbygOicoCoHcUi8Js4LQIA/CANhf5o9sliWKi9DSbzx+O0CADwvRgMV8uDQu1uMJ4/FqdFAKDr8jCoHBZqbxYBgI5LA6BXTN9YDAZ1q1gEfh2nRQCgi+Lx93cCdDyLAEAH5Ye/cjCoWw0mR7+K0yIA0AXpsc///nzlUFD3ikXg0TgtAgBtlx/7ymGg7mYRAGi59MD3R7PPFg+/VG4wmT8Sp0UAoI22xocH5UdfOtn27tEv47QIALRJftgrH36pnEUAoEXSY94rpm8uHnnpTsUi8HCcFgGAphvu3yjKD7x0miwCAA2XH/HKR166U5f3jh+K0yIA0DTp4e6PZk8vHnTpPFkEABooP9yVD7t0lvIiYAkAaIL0YG+NDz8vP+TSedvePf42fj1di88WAYC6649ms5MPuXSRtidH3wwm8/vjs0UAoK7ikfZjAK0kiwBAjaXHuVdM3yo/3NIyi0Xg61gErsZniwBAnRT7N8YnH21p2cUSYBEAqJN4kP0YQGtrMJ5/tb17dF98tggAbFJ6iPvF9LnyIy2tuu8WgcnRvfHZIgCwKfEI+y6ANtJgMr9pEQDYkPT4bo0Pvyw/zNI6G4znNy/vHu/HZ4sAwDr1iunhyUdZWncWAYA1iwfXjwFUmwbjwy9jEbgSny0CAKuUHtpeMX2n/AhLmy79aMoiALBiwysPTE4+wFIdikXgi52963vx2SIAsGzxuPoxgGqdRQBgBdKj2iumL5QfXKmOxSLweSwCu/HZIgCwDPGg+i6AGlN/NLMIACxDekjTH8UqP7JS3UuLQP49LBYBgPPqDQ+un3xgpSYUi8BnFgGAc4rH048B1OhiEfjUIgBwRunR7BXT98oPqtTEYhH4xCIAcAb5N1ZVPqpS07IIAJxSPJR+DKDWFYvAx8X+jXF8tggAVEkPZK+YvlR+PKW21C+mH1kEAG4hHkffBVCrswgAVEiP4mDi7wRQ+0uLwHD/RhGfLQIAyS92rj1w8rGU2lp/NPvQIgAQ4iH0YwB1rn4x/cAiAHRaegB7xfT98uModaW0CMQ5jCwCQPfkf3618oGUulBegi0CQLfEo+fHAFKU/4ZMiwDQDemxi4fvlcUjKHU9iwDQGfHQ+S6AdCKLANB66YEbTOZfLx4+ST8Ui8C7caYl2SIAtM+lnWsPlh89SX9fLALvxGkRANolP2yVD5+kH7IIAK2SHrP0N6UtHjlJt683PHg7TosA0HyXd4/3yw+cpDvXK6ZvxWkRAJorP2KVj5yk2xeLwF/jtAgAzZMert7w4NXFgybp7MUi8GacFgGgWfLDVfmwSTp9FgGgUdJjtT05+mbxiEm6WLEIvBGnRQCov0uX7//H8gMm6eJZBIDay49U5SMm6WL1hgevx2kRAOonPUz9YvrR4sGStPwsAkAtbe8e3Vd+rCStplgEXovTIgDUQ36QKh8sScvPIgDUQnqE8rcoKx8rSasp7l36uzgsAsDmxAOU/i30ykdK0mqLReDPcVoEgPXLj0/l4yRpPfWK6StxWgSA9UkPztZo9sTiIZK0uSwCwFrlB6fyQZK0/mIReDlOiwCwWumR6Y9mnyweH0n1yCIArNxgMr9afngk1adYBF6K0yIALF9+XCofH0n1KBaBP8ZpEQCWJz0o8bikf8ik8uGRVJ/6xfTFOC0CwHLEY+LvBJAaVCwCz8dpEQAuJj8klQ+NpPoWi8BzcVoEgPNJj8fW6PAPi0dFUrOyCADnlh+PysdFUjOyCABnlh6M/mj22eIhkdTc4i4/G6dFADidrfHhQfkRkdTsYhF4Jk6LAHB7+aGofEgkNbdYBJ6O0yIAVEuPQ6+Yvrl4NCS1K4sAcEvD/RtF+cGQ1L5iEXgqTosA8IP8KFQ+GpLaVf7jvxYB4G9/GiB9m7DywZDUvmIReDJOiwB0XX4IKh8KSe3NIgAdly7/1vjw88WjIKlbbY1mT8RpEYAu6o9ms/KDIKl7WQSgg/Klr3wUJHWrrfHh7+K0CEAXpIveK6ZvLR4ASbIIQEcU+zfG5csvSalYBH4bp0UA2ipf8MoHQJIsAtBS6VLnf1608vJLUioWgd/EaRGANsmXuvLSS1K5wWT+eJwWAWiDdJFju/9yccEl6U4NxvPH4rQIQNP1iulh+XJL0mmyCEDD5QtcecEl6U7FIvDrOC0C0DTp0vaK6TuLyyxJ52kwOfpVnBYBaJLhlQcm5YssSectFoFH47QIQBPky1p5mSXpPFkEoAHSBe0V0xcWF1eSlpVFAGouX9DKCyxJF20wmT8Sp0UA6iZdysF4fnNxWSVpFW3vHv0yTosA1ElveHC9fFElaVXFIvBwnBYBqIN8GSsvqyStIosA1EC6gL1i+t7iYkrSurIIwIbt7F3fLV9KSVpnl/eOH4rTIgDrli9e5cWUpHWVFwFLAKxLunC9YvpS+SJK0iba3j3+dmt8eC0+WwRgHeKy+S6ApNpkEYA1SZdsMJ5/Vb6AkrTptidH3wwm8/vjs0UAVuUXO9ceOHn5JKkOWQRgheJi+TGApFoXi8DXsQhcjc8WAViWdKF6xfT98mWTpDoWS8DX27tH98VniwAsw87e9b2TF02S6lr6vUsWAViCuER+DCCpcQ0m85vbk6N747NFAM4jXZ5eMX2lfLEkqSlZBOAC4uL4LoCkRpf+qfPLu8f78dkiAKeVLkz6DTblyyRJTWwwPvwyFoEr8dkiAKdxaefagycvkiQ1NYsAnFJcEj8GkNS6tmIRyH/aySIAVdLl6I9mH5YvjiS1pVgEvrAIwC3k30BTeXkkqQ3lRWA3PlsEYCEuhB8DSOpEsQh8bhGALF2E3vDg1fIlkaQ21x/NLAKQpEuQ/l3u8gWRpLYXi8BnwysPTOKzRYDuShcgSj8O2Em/aebn/Sv/0i+mfoOgpNZnEYAT0mWIvlsKUhYDSW0uFoFPLQJwG+lyRBYDSa0sFoFPLAJwBumyRBYDSa0o3q5Piv0b4/hsEYDzSJcnshhIamT90exjiwAsUbpMkcVAUiOKt+kjiwCsULpc0cnF4F8tBpLqkEUA1ixdtshiIKkWpUVguH+jiM8WAdiEdPkii4GkjZTeGosA1Ei6jJHFQNJairflA4sA1Fi6nNHfFoPLu8dXvlsM/NPIkpZQr5i+H+cwsghAE6TLGlkMJC0liwA0XLq8kcVA0rmKReC9OC0C0BbpMkcWA0mnyiIALZcud2QxkFSZRQA6Jl32yGIg6btiEXg3zvQeWASgi9Llz4+AxUDqYLEIvBOnRQD4XnoM8qNgMZA6UG948HacFgGgWnoc8iPxt8XgZ70r/8NiILWjXjF9K06LAHA66bHIj4bFQGpBFgHgQtLjkR8Ri4HUwGIReDNOiwCwHOkxyY+KxUBqQIPx/LE4LQHAaqQHJvrxYlBMP4r/ufJhkrSe8o8FLAHA+qRHJ7IYSBtuMJ7fjDPdQ4sAsDnpEcqPkcVAWm87+RoC1Ec8ThYDaYUNxodfxum7AEAzpAcrshhISyj/CQFLANBc6RGLLAbSGRtMjh6N0xIAtEt62CKLgXT7/H4AoBviwbMYSLne8ODVOH0XAOiu9AhG5cVgPxaDf7MYqAP5LgDASfE4WgzU6nrF9IU4fRcA4DTSgxlZDNSWfBcA4CLiIbUYqIkN8y9hAJYpHliLgWpb+rWYf6kCsA7x+FoMtPG2xodfxOn3AQBsWnqMI4uB1pnfBwBQV/FIWwy0qiwAAE0Tj7fFQBfNAgDQFvGoWwx02iwAAG0Rj7oFQKfNAgDQNPF4G/S6aBYAgLqKR9qg16qyAABsWjzGBr3W1vbu8bdx+nsAANYlPbqRQa+Ndtelye/yL0kAlikeWYNetW17cnRv/qUKwHnEY2rQq4n5+T/AacSDadCrFfWK6Ztx+vk/QFl6GCODXm3OV/9Ad8UjaNCrc/nqH+iM9NhFBr30fb76B9olHjaDXrpNl/eOH4rTV/9AM6UHLDLopTPUH82ejtPwB+ovPVaRQS9dsLgzz8dp+AP1kh6myKCXVtDWaPZEnIY/sDnpEYoMemlNDfdv/Lc4DX9gPdKDExn00obKP+9P98/wB5YvPS75kTHopRpk8ANLlR6T/KgY9FINM/iBC0mPR35EDHqpAcXgfyZOgx84nfRY5Efju9I/C/qz/pX/adBLzcjgB24rPQ75kTDopRYUg//ZOA1+4HvpMciPgkEvtbC4y8/FafBDV6XLnx8Bg17qQAY/dEy67PnSG/RSB4u7nv7qXoMf2ipd7nzJDXpJ6d/qfyFOgx/aIl3mfKkNekk/Kt6CF+M0+KGp0uXNl9igl3TH4iv+P8Zp8ENTpMuaL61BL+nMxeB/KU6DH+oqXc58SQ16SRcuBv/LcRr8UBfpMuZLadBLWnoGP2xYunz5Ehr0klZeDP5X4jT4YV3SZcuXzqCXtPZi8P8pToMfViVdrnzJDHpJG683PPhznAY/LEu6TPlSGfSSalcM/lfjNPjhvNLlyZfIoJdU+2LwvxanwQ+nlS5LvjQGvaTGFYP/9TgNfriVdDnyJTHoJTU+gx9OSJchXwqDXlLrMvjpvPSLP18Cg15S6+sV0zfiNPghX4TKiyJJbcngh5J0EfLveK28MJLU9GLwvxmnwQ9l+VJUXhpJanIGP9xG+nl/+cJIUtOLwf/XOA1+uJV0OfxGP0ltKQb/W3Ea/HAn+aJUXiRJakoGP5zRpZ1rD5YvkSQ1qRj878Rp8MNZpAuzPTn6ZnGRJKkpGfxwAfnyVF4uSapjMfjfjXMYGfxwHunyxEX60+JSSVKdi/fqvTgNfriouES++pdU+wx+WLLLu8dXypdMkuqUwQ8rkC5Uv5h+sLhoklSXYvC/H6fBD6sQF8u3/yXVqvRFyXD/RhGfDX5YlUs79/+nk5dPkjaRwQ9rki7ZYDz/qnwBJWnd9UezDw1+WKO4bL79L2ljpX97xOCHNUsXrldMXy5fRklaR2nwF/s3xvHZ4Id1i4vnq39Ja83ghxrY2bu+e/JyStIq6o9mHxv8UAPpEua/WKPyskrSMorB/8nwygOT+GzwQx3EZfTtf0kry+CHmuoND66fvLCSdNFi8H9q8ENNpYs5GM9vli+tJF2kGPyfGfxQc3FBfftf0lIy+KEh0iXtF9MXyxdYks5aDP7P858kMvihCeKy+upf0rnbGh8a/NBE+Vt1lRdbkm5VDP4vYvDvxWeDH5omXdxeMX23fKkl6XYZ/NACcYF9+1/SqYrB/+Xl3eMr8dngh6aLr/4PT15ySSo3MPihXdJlTht9+aJL0qI8+Pfjs8EPbRKX2rf/Jf2o9JeCGfzQUuli94vpc+VLL6nbDSbzm9uTo3vjs8EPbRUX3Ff/kr4rvuL/yuCHjvBn/yV9N/h3j+6LzwY/dEG67L3hwdvlh0BSdxpM5l9HV+OzwQ9dEpfet/+lDrY9OTL4ocv6o9ns5MMgqb3F4P8mBv/98dngh65KD0D6azzLj4OkdpYGf9z3a/HZ4Ieui4fAt/+llre9e/ytwQ/8TXoM+qPZM+WHQlK7urx3/FCcBj/wg3gUfPUvtbQ8+NMdN/yBv1fs3xiXHwxJzW979+jhOA1+oFp6HHrDg78sHg1Jzc7gB04lPxSVD4mk5mTwA2fSH82m5UdEUrOKwf/LOA1+4PTSgxELwOeLh0RSczL4gXPLj0fl4yKpng0m80fiNPiB80mPR3z1/9TiUZFU7waTo0fjNPiBi8kPSeVDI6k+GfzAUg33bxTlR0ZSvYrB/6s4DX5gedKD0iumbyweGkn1yeAHViY/LpWPj6TNNBjPH4vT4AdWJ//735WPkKT1ZvADa5Eemf5o9uni8ZG0mQx+YK3yg1P5IElafYPJ/PE4DX5gfdKDszU6fHLxEElaX1vjw9/EafAD65cfn8rHSdJqisH/2zgNfmBz4gEaLh4lSavN4AdqIT1CveHB64vHSdJqisH/uzgNfqAe8oNU+WBJunhbo9nv4zT4gXoZTOZXy4+VpOUUg/+JOA1+oH7Sw9QfzT5ePFiSLl7+EzUGP1Bf+ZGqfMQknS2DH2iMe7av/lP5AZN09gx+oFHSY7W9e/zt4hGTdLb6o9lTcRr8QLPkh6vyYZN062LwPx2nwQ80T3q4esOD1xYPmqQ7Z/ADjZcfscpHTtLfF4P/mTgNfqD5tidH95YfOEk/zuAHWiU9Zv1i+tHikZP098XgfzZOgx9ol/ywVT58UpeLxfi5OA1+oJ0u7Vx7sPzoSV3P4AdaLz1w25OjbxYPn9TlYvA/H6fBD7RffuwqH0OpK/WK6QtxGvxAN6THLh6+Py0eQalrxVf8L8Zp8APdkh++yodRanOx+L4Up8EPdNPl3eMr5UdRansGP9B56QHsF9MPFg+j1OZi8L8cp8EPkB/DysdSaksx+F+J0+AHWPjFzrUb5YdSalMGP0CF9CgOxvOvFo+l1JZi8Kc/1WLwA1TJD2TlAyo1sd7w4NU4DX6AW0kPZP4NUZUPqdSkDH6AU8qPZeVjKjWlGPyvxWnwA5zWzt713fJDKjWpGPyvx2nwA5xFejR7xfS9xWMqNSWDH+AC8gNa+cBKdczgB1iCeEyvlx9Xqa71iukbcRr8ABeVHtLBeH5z8cBKdSwG/5txGvwAy5If1cpHV9p0Bj/ACqRHNf+755WPr7SpesODv8Rp8AOsQn5gKx9gaRPFV/x/jdPgB1il4ZUHJuXHV9pUMfjfitPgB1i19NDGo/vu4gGWNlFvePB2nAY/wLrkR7fyUZZWXSyf78Rp8AOsWzzAh+UHWVpH+btOBj/AJqTHd2t8+OXiUZZWXR78w8jgB9iUeIR9+19rKQZ/+jcmDH6ATUsPcb+YPrd4oKVVZPAD1Ew8yL7618oy+AFqyp/91yqKwf9+nAY/QB2lxzn/uevKR1w6a/1i+sFw/0YRnw1+gLqKR9q3/7WUYvB/aPADNER/NJudfMilsxS/hgx+gCZJD/bW+PCL8mMunbb4iv+jYv/GOD4b/ABNEg+3b//rzBn8AA2WHu/+aPZM+WGXbpfBD9AC8Yj76l+nKgb/J/mPihr8AE2Xv5KrfPClVH80M/gB2iQ96L3hwV/Kj720KAb/pwY/QAvFw+7b//pRBj9Ay8VDPz35+Ku7xa+Hzwx+gJZLj3w8+J+XB4C6Wfp1YPADdEQ89r793/HS4N/Zu74bnw1+gC5ID348/k+Vh4G6U/pbHw1+gA6Kh99X/x0sD/69+GzwA3RR/gdbKoeE2lcM/i8NfoCOS0OgV0zfKA8ItbM0+C/vHl+JzwY/QNfFMPDt/5Y3MPgBOGkwmd9/cmCoHQ3G85sx+Pfjs8EPwA/SYOiPZp+Wh4aan8EPwG3FgPDt/xY1mMxvbk+O7o3PBj8A1dKQ2BodPlkeIGpm8RX/V9u7R/fFZ4MfgNuLYeGr/4YXX/F/bfADcCYxNIblYaLmlAZ/dDU+G/wAnF4aHL3hwevloaL6tz05MvgBOL8YIL7936Bi8H8Tgz/9cU2DH4Dzyz83rhw2qk9p8G+ND6/FZ4MfgItJw6Q/mn1cHjSqV9u7x9/G4D+IzwY/AMsRQ8W3/2vc5b3jh+I0+AFYrnu2r/7TyaGjzZcHf1rODH8AlisNl/Tt5cXQ0ebb3j16OE6DH4DVyYOmchBpvRn8AKxFGjS94cFriwGkzWTwA7BWeehUDiWtvhj8v4zT4AdgvfK/Elc5nLS6BpP5I3Ea/ACsXxo+/WL60WIoafUZ/ABsXB5ElYNKy20wOXo0ToMfgM27tHPtwfKQ0vIz+AGolTSQ0t8pvxhUWm4x+H8Vp8EPQL3k4VQ5vHT+BuP5r+M0+AGonzScesX05cXQ0sWLwf9YnAY/APWVB1XlINPZMvgBaIw8sCoHmk7XYDJ/PE6DH4Dm2Nm7vlceZjp9W+PD38Rp8APQPD/vX/mX8lDTnYvB/9s4DX4Amuuue8ZPl4ebbp3BD0Br/MPdo1fLQ04/zuAHoHViAXizPOz0Q1uj2e/jNPgBaB8LwI+Lwf9EnAY/AO3lRwA/ZPAD0Bk/vWf8f8pDsIttjQ6fjNPgB6A7fr61/9/Lw7BLGfwAdNbwygOT8lDsQjH4/xCnwQ9Ad+VBWDko21Z/NHsqToMfANIwHIznXy2GZBuLwZ/+siODHwDK7tm++l/KA7MtGfwAcBt5SFYO0SYWg/+ZOA1+ALidNCh7xfSNxQBtajH4n43T4AeA08qDs3Kw1j2DHwDOKQ3PPEgrh2wd6xfT5+I0+AHgItIgHUzmXy8GbF0z+AFgyYb7N4rysK1TMfifj9PgB4BlS8P18t71f1sM3ToUg//FOA1+AFilNGi3d48eXgzgTdUrpn+M0+AHgHVJQ/fy3vV/XQzjdRaD/6U4DX4A2IQ0gKPhYDy/mQbzqjP4AaBG0kDO/4Je5eC+aDH4X47T4AeAuknDOQ3pGNavpKG9jPyufgBoiDSs09DuDQ+u90ezz9IgP0uxQLyzs3d9Lz4b/ADQRGmA50H+3ULws97e/7rr0uR///Se8TPRU//xF7v/fvfgvn+Ogb+7+L9L/5n8HwcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFien/zk/wMZx7FyGlRLaAAAAABJRU5ErkJggg==');\
	background-repeat: no-repeat;\
	background-size: 22px 22px;\
	background-color: transparent;\
	background-position: center;\
	border: none;\
	outline: none;\
	opacity: 0.7;\
    cursor: pointer;\
}\
#vkhelper_getmessage_stack .vkh_send:hover {\
	opacity: 1;\
}\
html.vkhelper_opt_notiMessage #notifiers_wrap {\
	display: none;\
}\
\
\",
*/

	bg_script : {
	
		messages : {
		
			// возвращаем список всех плагинов для страницы настроек
			'page_options_init' : function (details, tab_id, callback) {
				
				callback({
					lang : {
						select  : lang.select,
						default : lang.default
					},
					plugins : plugins.getAll()
				});
				
			},
			
			// возвращаем список всех плагинов и аккаунтов для popup
			'page_popup_init' : function (details, tab_id, callback) {
			
				callback({
					lang : {
						select  : lang.select,
						default : lang.default
					},
					plugins  : plugins.getAll(),
					accounts : account.get.all(),
					counters : account.counters.list,
					vkh : VKH.p.get()
				});
				
			},
			
			
			// возвращаем счетчики аккаунта для popup
			'vkhelper_pagePopup_vkApi_getCounters' : function (details, tab_id, callback) {
				
				task.add('first', {
					initiator : 'system.bg.msg.vkhelper_pagePopup_vkApi_getCounters',
					isVisible : false
				}, function(task_id, task_callback) {
	
					if (!chrome.extension.getViews({ type: "popup" }).length) {
						task.abort('system.bg.msg.vkhelper_pagePopup_vkApi_getCounters');
						task_callback();
						return;
					}
					
					VK.api('execute', {
						code : 'return API.account.getCounters({"fields": "messages,friends,notifications"});'
					}, {
						uid : details.uid,
						task_id : task_id
					}, function(response) {
						
						if (response.status != 'success') {
							task_callback();
							return;
						}
						
						account.counters.update('messages', details.uid, response.details.messages || 0);
						
						chrome.runtime.sendMessage({ 
							type : 'vkhelper_pagePopup_vkApi_getCounters', 
							from : 'bg',
							to   : 'page_popup',
							details : {
								uid : details.uid,
								counters : response.details
							}
						});
						
						task_callback();
		
					});

				});
				
			},
						
			// запрос со вкладки с вк. страница только открылась, надо отправить данные
			'vkhelper_vk_init' : function (details, tab_id, callback) {

				var pl = jQuery.extend(true, {}, plugins.getAll());
				
				messages.sendToVk({ 
					type : 'vkhelper_vk_init_result',
					details : {
						lang : {
							select  : lang.select,
							default : lang.default
						},
						plugins : messages.rec(pl)
					}
				}, tab_id);

			},
			
			// страница после установки
			'page_install_init' : function (details, tab_id, callback) {
				
				callback({
					lang : {
						select  : lang.select,
						default : lang.default
					},
					plugins : plugins.getAll()
				});
				
			},
			
			
			// - - - - - - - - - - - -
			
			// открываем страницу с добавлением аккаунта
			'vkhelper_addAccount' : function (details, tab_id, callback) {
				
				plugins.list.accounts.bg_script.functions.openPage(details.uid || false);
				
			},
				
			// удаляем аккаунт из расширения
			'vkhelper_deleteAccount' : function (details, tab_id, callback) {

				account.remove.uid(details.uid, function() { 	
					//				
				});
				
			},
			
			// сортируем аккаунт
			'vkhelper_account_sort' : function (details, tab_id, callback) {

				account.sort(details.uid, details.type);
				
			},
			
			// обновляем инфу о аккаунте через popup
			'vkhelper_account_update' : function (details, tab_id, callback) {

				account.update.details(
					details.uid, 
					details.params.details, 
					function () {
					
						account.update.proxy(
							details.uid, 
							details.params.proxy, 
							function () {
								
								//
							
							}
						);
				
					}
				);
				
			},
			
			
			// - - - - - - - - - - - -
			
			// авторизовываем аккаунт в браузере
			'vkhelper_loginVk' : function (details, tab_id, callback) {

				console.time('login time');
				
				account.login(details.uid, function () {
					
					if (plugins.isEnable('newAccountToTab') != true) {
								
						chrome.tabs.query({active: true}, function (tabs) {
					
							if (tabs.length > 0 && tabs[0].url.indexOf('://vk.com') > 0 && tabs[0].url.indexOf('://vk.com') < 6) {
						
								console.timeEnd('login time');
								
								chrome.tabs.update(
									tabs[0].id, {
										url: 'https://vk.com' + details.path
									}
								);
							}
							else {
							
								console.timeEnd('login time');
								
   								plugins.get('funcs').list.bg_tabCreate({
									url : 'https://vk.com' + details.path, 
									active : true
								}, function (tab) {
   									plugins.get('accounts').bg_script.tabs[tab.id] = details.uid;
								});
							}
							
						});
					
					} else {
					
						console.timeEnd('login time');
				
						plugins.get('funcs').list.bg_tabCreate({
							url : 'https://vk.com' + details.path, 
							active : true
						}, function (tab) {
   							plugins.get('accounts').bg_script.tabs[tab.id] = details.uid;
						});
					
					}
					
				});
				
			},
			
			// открываем страницу
			'vkhelper_openPage' : function (details, tab_id, callback) {

				plugins.get('funcs').list.bg_tabCreate({
					url : chrome.runtime.getURL(details.page), 
					active : true
				}, function (tab) {
   					//			
				});

			},
				
			// меняем язык расширения	
			'changeLanguage' : function (details, tab_id, callback) {

				lang.set(details.lang);
				
				callback(true);
			
			},		
			
			// пользователь изменил настройки функций
			'vkhelper_editUserSetting' : function (details, tab_id, callback) {
				
				// если включение или выключение плагина
				if (details.field_name == 'enabled') {
				
					plugins.enable(
						details.plugin_name, 
						details.field_value, 
						function() {}
					);
					
				} else {
					
					var fields = {};
					
					fields[details.field_name] = details.field_value;
						
					plugins.editField(
						details.plugin_name, 
						fields, 
						function() {}
					);
					
				}
				
			},
			
			'vkhelper_api_captcha_response' : function (details, tab_id, callback) {
				
				VK.captchaInput(details.task_id, details.key);
				
			},
			
			
			// - - - - - - - - - - - -
			
			/*
			'vkhelper_plugins_system_getPostInfo_load' : function (details, tab_id, callback) {

				
				task.add('first', function(task_id, callback_task) {
	
					VK.api('photos.getById', {
						photos : details.photos,
						photo_sizes : 1
					}, {uid : details.uid}, function(response) {
						
						if (response.status != 'success') {
							callback_task();
							return;
						}
		
						messages.sendToVk({ 
							type : 'vkhelper_plugins_system_getPostInfo_load_response',
							details : {
								list : response.data
							}
						}, tab_id);
						
						callback_task();
		
					});

				});
				
			}
			*/
			
		},
	
		on : function () {
		
			if (plugins.get('system').storage.uidActive) {
				
				var dataUser = account.get.uid(plugins.get('system').storage.uidActive);
				
				if (!dataUser) {
				
					plugins.editField('system', { 
						uidActive : false
					}, function () {
						//
					});
					return;
				}
				
				var prx = dataUser.proxy;
				prx.uid = plugins.get('system').storage.uidActive;
				proxy.set('web', prx);
				
			}
			
		},
	
		off : function () {
		},
		
		editField : function (fields) {
		}
		
	},
	
	vk_script : {
		
		messages : {
		
				
			'system_doneBox' : function (details) {

				showDoneBox(details.text);
				
			},
		
			'vkhelper_togglePlugin' : function (details) {
			
				vkhelper.togglePlugin(
					details.plugin_name, 
					details.plugin_status
				);
		
			},
		
			'vkhelper_pluginEditParam' : function (details) {
			
				vkhelper.pluginEditParam(
					details.plugin_name, 
					details.fields
				);
		
			},
		
			'vk_auth_error' : function (details) {
			
				//alert(details.error);
				
			},
		
			'vk_auth_success' : function (details) {
			
				Login.init();
  				setTimeout(document.getElementById('login_form').onsubmit, 100);
		
			},
		
			'vkhelper_api_captcha' : function (details) {
			
				var s = showCaptchaBox(
					details.task_id,0,0,{
						imgSrc:details.img, 
						onSubmit : function(task_id,key){
							vkhelper.messages.sendToBG({ 
								type : 'vkhelper_api_captcha_response', 
								details : {
									task_id : task_id,
									key : key
								}
							});
							s.hide(); 
						}
					});	
				
			},
		
		
		
		
			'vkhelper_plugins_system_getPostInfo_load_response' : function (details) {
			
				if (!details.list.length) {
					hide(boxLoader);
					hide(boxLayerWrap);
					return;
				}
				
				var obj = vkhelper.plugins.system.vk_script.params.getPostInfo_data;
				
				jQuery.each(details.list, function(k,v) {
				
					jQuery.each(obj, function(k2,v2) {
					
						if (v2[0] == 'photo' && v.owner_id +'_'+ v.id == v2[1]) { 
							
							v2[2].editable = {
								sizes : {}
							};
							
							jQuery.each(v.sizes, function(k3,v3) {
								v2[2].editable.sizes[v3.type] = [
									v3.src,
									v3.width,
									v3.height
								];
							});
							
							v2[2].thumb_m = v2[2].editable.sizes.m[0];
							v2[2].thumb_s = v2[2].editable.sizes.s[0];
							
							return false;
						}
						
					});
					
				});
				
				hide(boxLoader);
				hide(boxLayerWrap);
					
				vkhelper.plugins.system.vk_script.params.getPostInfo_function(obj);
						
			}
			
		},
			
		on : function () {
	
			if (window.stManager) {
				stManager.add([
					'wide_dd.js', 
					'wide_dd.css', 
					'page.js', 
					'page.css', 
					'writebox.css', 
					'writebox.js', 
					'emoji.js', 
					'notifier.css',
					'ui_media_selector.css',
					'ui_media_selector.js',
					'ui_common.css',
					'ui_common.js',
					'ui_controls.css',
					'ui_controls.js',
					'settings.css',
					'settings.js',
					'boxes.css',
					'box.js',
					'sorter.js',
					'groups_edit.css',
					'groups_edit.js',
					'stats.js',
					'tooltips.js',
					'tooltips.css'
				]);
			}
			
			jQuery('#top_support_link')
				.after('<div class="top_profile_sep"></div>\
							<span class="top_profile_mrow" style="font-weight: bold; background-color: #EFF3F5">VK Helper</span>\
							<a class="top_profile_mrow" id="vkhelper_top_menu_account_add" href="#" onclick="return false;"> &#9658; '+ vkhelper.lang.get('system', 'vkMenuAddAccount') +'</a>\
							<a class="top_profile_mrow" id="vkhelper_top_menu_setting" href="#" onclick="return false;"> &#9658; '+ vkhelper.lang.get('system', 'vkMenuSetting') +'</a>');
		
			jQuery('#top_profile_menu').on('click', '#vkhelper_top_menu_account_add', function () {
	
				TopMenu.toggle(false);
		
				vkhelper.messages.sendToBG({ 
					type : 'vkhelper_addAccount', 
					details : {}
				});
	
			});
	
			jQuery('#top_profile_menu').on('click', '#vkhelper_top_menu_setting', function () {
	
				TopMenu.toggle(false);
		
				vkhelper.messages.sendToBG({ 
					type : 'vkhelper_openPage', 
					details : {
						page : 'pages/options/index.html'
					}
				});
		
			});
				
		},
	
		off : function () {
		}
		
	}
	
};


vkhelper_plugins_list['control'] = {
	
	not_display : true,
	
	lang : {
		ru : { }	
	},
	
	storage : {
		enabled : true
	}, 
	
	css : function() {/*

#vkhelper_control_msg_content_tasks_noti {
    max-height: 525px;
    height: auto;
    overflow: auto;
}

#vkhelper_control_msg_content_tasks .summary_tabs > .fl_l.noti nobr{
    color: red;
    font-weight: 600;
}

.control_log_error_item {
	padding: 3px 0;
}
.info_error {
    display: none;
	border: 1px solid red;
    padding: 5px;
    overflow: auto;
}

.vkh_control_task_item {
	height: 51px;
    width: 100%;
    border-bottom: 1px solid #e7e8ec;
}

.vkh_control_task_item.noti_no_read .title {
	color: red;
}

.vkh_control_task_item:nth-last-of-type(1) {
    border-bottom: none;
}
.vkh_control_task_item > .icon {
	float: left;
}
.vkh_control_task_item > .icon * {
    margin: 10px 10px 10px 0;
	height: 30px;
    width: 30px;
}
.vkh_control_task_item > .block {
    padding: 11px 10px 11px 40px
}
.vkh_control_task_item > .block > .title {
}
.vkh_control_task_item > .block > .info {
}
.vkh_control_task_item > .block > .progress_box {
	float: right;
	margin-top: 2px;
    font-size: 20px;
    color: gray;
}

#vkhelper_control_msg_content_tasks_local {
	max-height: 600px;
    overflow: auto;
}
    


#vkhelper_control_fast_list {
	position: absolute;
    top: 34px;
}  	
#vkhelper_control_fast_list > div {
	margin-bottom: 10px;
    font-size: 15px;
    display:none;
    padding: 10px;
    border-radius: 6px;
    max-width: 470px;
    width: auto;
	left: 425px;
    background: #fff;
    z-index: 801;
    border: 1px solid #c5d0db;
    border-top: none;
    box-shadow: 0 0px 10px 0 rgba(0,0,0,.3);
    opacity: 1;
    cursor: default;
    pointer-events: auto;
}	
#vkhelper_control_fast_list > div > span.icon {
}
#vkhelper_control_fast_list > div > span.text {
	margin-left: 7px;
}

#vkhelper_control_msg_noti {
	display: none;
	position: absolute;
    width: 8px;
    height: 8px;
    background: red;
    border-radius: 50%;
    border: 1px solid rgb(146, 158, 176);
    top: 21px;
    left: 28px;
    color: white;
}
#vkhelper_control_msg_noti.show {
	display: block;
}

#vkhelper_control_msg_content {
    position: absolute;
    visibility: hidden;
    width: 470px;
    top: 52px;
    left: -1px;
    background: #fff;
    z-index: 800;
    border: 1px solid #c5d0db;
    border-top: none;
    border-radius: 0 0 4px 4px;
    box-shadow: 0 20px 40px 0 rgba(0,0,0,.3);
    opacity: 0;
    filter: alpha(opacity=0);
    -o-transition: opacity 100ms linear, top 100ms linear, visibility 100ms linear;
    transition: opacity 100ms linear, top 100ms linear, visibility 100ms linear;
    cursor: default;
    pointer-events: none
}

#vkhelper_control_msg_content:after,#vkhelper_control_msg_content:before {
    position: absolute;
    pointer-events: none;
    border: solid transparent;
    content: '';
    height: 0;
    width: 0;
    bottom: 100%;
    left: 23px
}

#vkhelper_control_msg_content:before {
    border-width: 6px;
    margin: 0 -6px;
    border-bottom-color: #fafbfc
}

#vkhelper_control_msg_content:after {
    border-width: 5px;
    margin: 0 -5px;
    border-bottom-color: #fafbfc
}

#vkhelper_control_msg_content {
	visibility: visible;
    opacity: 1;
    -webkit-filter: none;
    filter: none;
    top: 42px;
    pointer-events: auto;
	left: 425px;
	display:none;
}

#vkhelper_control_msg_content > div {
    padding: 10px 20px;
}

	*/},
	
	bg_script : {
	
		params : {
			notification : {}
		},
		
		functions : {
		
			checkEvent : function () {
				
				chrome.tabs.query({active: true}, function (tabs) {
				
					if (tabs.length < 1) {
						return;
					}
					
					if (tabs[0].url.substr(0,14) != 'https://vk.com') {
   						return;
   					}	
   					
   					messages.sendToVk({
						type : 'vkhelper_control_notiToggle',
						details : plugins.list.control.bg_script.params.notification
					}, tabs[0].id);
   							
   				});
   				
			}
			
		},
		
		on : function () {
		
			chrome.tabs.onActivated.addListener(function (tab) {
					
				plugins.list.control.bg_script.functions.checkEvent();
	
			});
				
			chrome.tabs.onUpdated.addListener(function (tabId, changeInfo) {
		
				if (changeInfo.status == 'complete') {
					plugins.list.control.bg_script.functions.checkEvent();
				}
	
			});

		},
		
		messages : {
			
			'control_get_tab' : function (details, tab_id, callback) {
				
				plugins.list.control.bg_script.params.notification[details.type] = false;
				plugins.list.control.bg_script.functions.checkEvent();
				
				switch (details.type) {
				
					case 'local':
					
						messages.sendToVk({
							type : 'control_get_tab_response',
							details : {
								list : JSON.parse(JSON.stringify(task.list)),
								type : 'local'
							}
						}, tab_id);
					
					break;
				
					case 'noti':
					
						VKH.api('get_noti', {}, function (response) {
					
							var list = (response.details && response.details.list) || [];
							var noti_read_id = parseInt(response.details.noti_read || 0);
							var max_id_list = noti_read_id;
							
							jQuery.each(list, function(k,v) {
								if (parseInt(v.id) > max_id_list) {
									max_id_list = parseInt(v.id);
								}
							});
							
							messages.sendToVk({
								type : 'control_get_tab_response',
								details : {
									list : list,
									type : 'noti',
									read : noti_read_id < max_id_list ? max_id_list : 0
								}
							}, tab_id);
						
						});
					
					break;
				
					case 'buy':
					
						messages.sendToVk({
							type : 'control_get_tab_response',
							details : {
								vkh  : VKH.p.get(),
								type : 'buy'
							}
						}, tab_id);
					
					break;
				
					case 'contact':
					
						messages.sendToVk({
							type : 'control_get_tab_response',
							details : {
								type : 'contact'
							}
						}, tab_id);
					
					break;
					
				}
				
			},
			
			'control_noti_read' : function (details, tab_id, callback) {
				
				VKH.api('noti_read', {
					max_id : details.noti_id
				}, function (response) {
					//
				});
				
			},
			
			'accounts_control_log_open' : function (details, tab_id, callback) {

				messages.sendToVk({
					type : 'accounts_control_log_open_response',
					details : {
						task_id : details.task_id,
						details : JSON.parse(JSON.stringify(task.list[details.task_id])) || {}
					}
				}, tab_id);
					
			},
			
			'accounts_control_captcha_for_task' : function (details, tab_id, callback) {
				
				VK.captcha_request(details.task_id);
					
			}
			
		}
		
	},
	
	vk_script : {
	
		params : {
			last_tab : false, 
			notification : {}, 
			noti_list : {} 
		},
		
		functions : {
		
			hide : function() {
			
				jQuery('#vkhelper_control_msg > a').removeClass('active');
				jQuery('#vkhelper_control_msg > a > svg').css('color', '#1f3c5e');
			
				jQuery('#vkhelper_control_msg_content').hide();
								
			},
		
			show : function(type) {
				
				var type = type || vkhelper.plugins.control.vk_script.params.last_tab || -1;
				
				if (type == -1) {
				
					type = vkhelper.plugins.vkh.vk_script.vkh.isActive == false 
							? 'buy' 
							: (
								vkhelper.plugins.control.vk_script.params.notification.noti
								? 'noti' 
								: 'local'
							);
				}
				
				if (!vkhelper.plugins.vkh.vk_script.vkh.uid || !vkhelper.plugins.vkh.vk_script.vkh.name) {
					type = 'buy';
				}
				
				jQuery('#vkhelper_control_msg_content .summary_tabs > div[data-type="buy"] nobr > span.no_buy').toggle(!vkhelper.plugins.vkh.vk_script.vkh.isActive);

				jQuery('#vkhelper_control_fast_list > div').hide();
				jQuery('#vkhelper_control_msg > a').addClass('active');
				jQuery('#vkhelper_control_msg > a > svg').css('color', 'white');
					
				jQuery('#vkhelper_control_msg_content').show();
				
				//vkhelper.plugins.control.vk_script.functions.noti(false);
				
				jQuery('#vkhelper_control_msg .control_msg_block').hide();
				
				jQuery('#vkhelper_control_msg_content .summary_tabs > div').removeClass('noti');
				jQuery.each(vkhelper.plugins.control.vk_script.params.notification, function (k,v) {
					if (!v) {
						return;
					}
					if (k == type) {
						return;
					}
					
					jQuery('#vkhelper_control_msg_content .summary_tabs > div[data-type="'+ k +'"]').addClass('noti');
					
					console.log('tab '+k, v);
					
				});
				
				vkhelper.plugins.control.vk_script.functions.showTypeTast(type);
				
			},
			
			showTypeTast : function (type) {
			
				vkhelper.plugins.control.vk_script.params.last_tab = type;
				
				jQuery('#vkhelper_control_msg_content .summary_tabs > div[data-type="'+ type +'"]').removeClass('noti');
				
				
				jQuery('#vkhelper_control_msg_content_tasks .summary_tabs > div.fl_l')
					.removeClass('summary_tab_sel')
					.addClass('summary_tab');
				
				jQuery('#vkhelper_control_msg_content_tasks .summary_tabs > div.fl_l[data-type='+ type +']')
					.removeClass('summary_tab')
					.addClass('summary_tab_sel');
					
				jQuery('#vkhelper_control_msg .control_msg_block').hide();
				jQuery('#vkhelper_control_msg_content_tasks_'+ type).html('<div style="text-align: center; padding: 20px 20px 15px;"><div class="progress" style="display:block;margin:auto;"></div></div>').show();
					
					
				vkhelper.messages.sendToBG({ 
					type : 'control_get_tab', 
					details : {
						type : type
					}
				});
				
			},
			
			noti : function () {
			
				var cnt = 0;
				jQuery.each(vkhelper.plugins.control.vk_script.params.notification, function(k,v) {
					if (v) {
						cnt += Number(v);
					}
				});
				
				jQuery('#vkhelper_control_msg_noti').toggleClass('show', cnt > 0);
				
				//console.error('Количество новых событий', cnt);
				
			},
			
			log : {
			
				view : function (task_id) {
				
					vkhelper.messages.sendToBG({ 
						type : 'accounts_control_log_open', 
						details : {
							task_id : task_id
						}
					});
				
				},
				
				openBox : function (task_id, details) {
				
					var log_errors = '';
					if (details.log_errors) {
						log_errors = '<b>Ошибки ('+ Object.keys(details.log_errors).length +'):</b><br>';
						jQuery.each(details.log_errors, function(k,v) {
						 	if (v.text) {
								log_errors += '<div class="control_log_error_item">'+ v.text +' | <a href="#" onclick="jQuery(this).next(\'.info_error\').toggle(); return false;">Подробнее</a><div class="info_error">'+ JSON.stringify(v) +'</div></div>';
								return;
							}
							else if (v.uid && v.gid && v.error == 'no_access') {
								log_errors += '<div class="control_log_error_item"><a href="https://vk.com/id'+ v.uid +'" target="_blank">id'+ v.uid +'</a> - нет доступа для выполнения действия в сообществе <a href="https://vk.com/club'+ v.gid +'" target="_blank">club'+ v.gid +'</a> | <a href="#" onclick="jQuery(this).next(\'.info_error\').toggle(); return false;">Подробнее</a><div class="info_error">'+ JSON.stringify(v) +'</div></div>';
								return;
							}
							else if (v.uid && v.gid && v.error == 'api_error_214') {
								log_errors += '<div class="control_log_error_item"><a href="https://vk.com/id'+ v.uid +'" target="_blank">id'+ v.uid +'</a> - сообщество <a href="https://vk.com/club'+ v.gid +'" target="_blank">club'+ v.gid +'</a> - Публикация запрещена. Превышен лимит на число публикаций в сутки, либо на указанное время уже запланирована другая запись, либо для текущего пользователя недоступно размещение записи на этой стене. | <a href="#" onclick="jQuery(this).next(\'.info_error\').toggle(); return false;">Подробнее</a><div class="info_error">'+ JSON.stringify(v) +'</div></div>';
								return;
							}
							else if (v.uid && v.gid && v.error == 'api_error_219') {
								log_errors += '<div class="control_log_error_item"><a href="https://vk.com/id'+ v.uid +'" target="_blank">id'+ v.uid +'</a> - сообщество <a href="https://vk.com/club'+ v.gid +'" target="_blank">club'+ v.gid +'</a> - Рекламный пост уже недавно публиковался. | <a href="#" onclick="jQuery(this).next(\'.info_error\').toggle(); return false;">Подробнее</a><div class="info_error">'+ JSON.stringify(v) +'</div></div>';
								return;
							}
							else if (v.uid && v.gid && v.error == 'api_error_220') {
								log_errors += '<div class="control_log_error_item"><a href="https://vk.com/id'+ v.uid +'" target="_blank">id'+ v.uid +'</a> - сообщество <a href="https://vk.com/club'+ v.gid +'" target="_blank">club'+ v.gid +'</a> - Слишком много получателей. | <a href="#" onclick="jQuery(this).next(\'.info_error\').toggle(); return false;">Подробнее</a><div class="info_error">'+ JSON.stringify(v) +'</div></div>';
								return;
							}
							else if (v.uid && v.gid && v.error == 'api_error_222') {
								log_errors += '<div class="control_log_error_item"><a href="https://vk.com/id'+ v.uid +'" target="_blank">id'+ v.uid +'</a> - сообщество <a href="https://vk.com/club'+ v.gid +'" target="_blank">club'+ v.gid +'</a> - Запрещено размещать ссылки.  | <a href="#" onclick="jQuery(this).next(\'.info_error\').toggle(); return false;">Подробнее</a><div class="info_error">'+ JSON.stringify(v) +'</div></div>';
								return;
							}
							else if (v.uid && v.gid && v.error == 'api_error_224') {
								log_errors += '<div class="control_log_error_item"><a href="https://vk.com/id'+ v.uid +'" target="_blank">id'+ v.uid +'</a> - сообщество <a href="https://vk.com/club'+ v.gid +'" target="_blank">club'+ v.gid +'</a> - Превышен лимит рекламных записей.  | <a href="#" onclick="jQuery(this).next(\'.info_error\').toggle(); return false;">Подробнее</a><div class="info_error">'+ JSON.stringify(v) +'</div></div>';
								return;
							}
							else if (v.uid && v.error == 'no_access') {
								log_errors += '<div class="control_log_error_item"><a href="https://vk.com/id'+ v.uid +'" target="_blank">id'+ v.uid +'</a> - Пользовать не имеет доступа | <a href="#" onclick="jQuery(this).next(\'.info_error\').toggle(); return false;">Подробнее</a><div class="info_error">'+ JSON.stringify(v) +'</div></div>';
								return;
							}
							else if (v.error && v.error == 'unkniwn_error') {
								log_errors += '<div class="control_log_error_item">Неизвестная ошибка | <a href="#" onclick="jQuery(this).next(\'.info_error\').toggle(); return false;">Подробнее</a><div class="info_error">'+ JSON.stringify(v) +'</div></div>';
								return;
							}
							log_errors += '<div class="control_log_error_item">'+ JSON.stringify(v) +'</div>';
						});
					}
					
					var log_success = '';
					if (details.log_success) {
						log_success = '<b>Успешно ('+ Object.keys(details.log_success).length +'):</b><br>';
						jQuery.each(details.log_success, function(k,v) {
							if (v.story_upload && v.id && v.owner_id) {
								log_success += '<div class="control_log_error_item"><a href="https://vk.com/feed?w=story'+ v.owner_id +'_'+ v.id +'" target="_blank">Смотреть историю</a> | <a href="#" onclick="jQuery(this).next(\'.info_error\').toggle(); return false;">Подробнее</a><div class="info_error">'+ JSON.stringify(v) +'</div></div>';
								return;
							}
							if (v.uid && v.gid && v.post_id) {
								log_success += '<div class="control_log_error_item"><a href="https://vk.com/wall-'+ v.gid +'_'+ v.post_id +'" target="_blank">club'+ v.gid +'</a> | <a href="#" onclick="jQuery(this).next(\'.info_error\').toggle(); return false;">Подробнее</a><div class="info_error">'+ JSON.stringify(v) +'</div></div>';
								return;
							}
							else if (v.uid && v.post_id) {
								log_success += '<div class="control_log_error_item"><a href="https://vk.com/wall'+ v.uid +'_'+ v.post_id +'" target="_blank">id'+ v.uid +'</a> | <a href="#" onclick="jQuery(this).next(\'.info_error\').toggle(); return false;">Подробнее</a><div class="info_error">'+ JSON.stringify(v) +'</div></div>';
								return;
							}
							else if (v.uid) {
								log_success += '<div class="control_log_error_item"><a href="https://vk.com/id'+ v.uid +'" target="_blank">id'+ v.uid +'</a> | <a href="#" onclick="jQuery(this).next(\'.info_error\').toggle(); return false;">Подробнее</a><div class="info_error">'+ JSON.stringify(v) +'</div></div>';
								return;
							}
							else if (v.text) {
								log_success += '<div class="control_log_error_item">'+ v.text +' | <a href="#" onclick="jQuery(this).next(\'.info_error\').toggle(); return false;">Подробнее</a><div class="info_error">'+ JSON.stringify(v) +'</div></div>';
								return;
							}
							else {
								log_success += '<div class="control_log_error_item">'+ JSON.stringify(v) +' | <a href="#" onclick="jQuery(this).next(\'.info_error\').toggle(); return false;">Подробнее</a><div class="info_error">'+ JSON.stringify(v) +'</div></div>';
							}
							
							if (v.vkh_error == true && v.text) {
								log_success += '<div class="control_log_error_item"><span style="color:red">'+ v.text +'</span> | <a href="#" onclick="jQuery(this).next(\'.info_error\').toggle(); return false;">Подробнее</a><div class="info_error">'+ JSON.stringify(v) +'</div></div>';
							}
							
						});
					}
					
					new MessageBox({
						title : 'Отчет по выполнению задания', 
						width : 700, 
						grey : 1, 
						hideButtons : 1
					})
					.content(details.title +'<br><br>'+ log_errors + log_success)
					.show();
					
				}
				
			},
			
			fastMessage : function (stat, text, timeout) {
			
				//console.log(stat, text, timeout);
				
				var icon = '';
				if (stat == 'success') {
					icon = '<i class="far fa-check-circle" style="color: green;"></i>';
				}
				else if (stat == 'error') {
					icon = '<i class="fas fa-exclamation" style="color: red;"></i>';
				}
				else if (stat == 'waiting') {
					icon = '<i class="far fa-clock" style="color: gray;"></i>';
				}
				
				var r = Math.random();
				
				if (jQuery('#vkhelper_control_fast_list > div:gt(1)').length) {
					jQuery('#vkhelper_control_fast_list > div:gt(1)').fadeOut(100, function() { jQuery(this).remove(); } );
				}
				
				jQuery('<div/>', {
					'data-r'  : r,
    				'onclick' : "jQuery(this).fadeOut(100);",
    				'style'   : 'display: block;',
    				'html'    : '<span class="icon">'+ icon +'</span><span class="text">'+ text +'</span>'
				}).prependTo('#vkhelper_control_fast_list');
	
				setTimeout(function() {
					var el = jQuery('#vkhelper_control_fast_list > div[data-r="'+ r +'"]');
					if (!el.length) {
						return;
					}
					el.fadeOut(100, function() { jQuery(this).remove(); } );
				}, timeout || 4000);
				
			},
			
			captchaWrite : function (task_id) {
			
				vkhelper.messages.sendToBG({ 
					type : 'accounts_control_captcha_for_task', 
					details : {
						task_id : task_id
					}
				});
			
			},
			
			notiInfoBox : function (noti_id) {
				
				var box = new MessageBox({
						title : vkhelper.plugins.control.vk_script.params.noti_list[noti_id].title_box,
						width: 550,
						bodyStyle : vkhelper.plugins.control.vk_script.params.noti_list[noti_id].bodyStyle || ''
					})
					.content(
						vkhelper.plugins.control.vk_script.params.noti_list[noti_id].html
					)
					.setButtons(
						'Закрыть', function() {
							box.hide();
						}
					).show();
						
			},
			
			genHtmlTask : function (task_id, details) {
			
				var icon = '';
				if (details.status == 'finished') {
					icon = '<i class="far fa-check-circle" style="color: green;"></i>';
				}
				else if (details.status == 'started') {
					icon = '<i class="far fa-play-circle" style="color: gray;"></i>';
				}
				else if (details.status == 'waiting') {
					icon = '<i class="far fa-clock" style="color: gray;"></i>';
				}
				else if (details.status == 'stop') {
					icon = '<i class="far fa-pause-circle" style="color: red;"></i>';
				}				
								
				var progress_box = '';
				var log_box = '';
				var captcha_box = '';
				
				if (details.captcha == true) {
					captcha_box = 'Для продолжения необходимо <a href="#" onclick="vkhelper.plugins.control.vk_script.functions.captchaWrite('+ task_id +'); vkhelper.plugins.control.vk_script.functions.hide(); return false;">ввести каптчу</a>';
				} 
				else {
					if (details.log_errors) {
						log_box = 'Ошибок: '+ details.log_errors.length +' | ';
					}
					log_box += '<a href="#" onclick="vkhelper.plugins.control.vk_script.functions.log.view('+ task_id +'); vkhelper.plugins.control.vk_script.functions.hide();  return false;">Отчет по выполнению задания</a>';
				}
				
				if (details.maxCount && details.maxCount != details.nowCount) {
					
					details.nowCount = details.nowCount || 0;
					
					if (details.status == 'finished') {
						details.nowCount = details.maxCount;
					}
					
					var proc = parseInt(details.nowCount * 100 / details.maxCount);
						proc = Math.max(0, proc);
						proc = Math.min(100, proc);
						
					progress_box = '<div class="progress_box">'+ proc +' %</div>';
					
				} 
				
				return '\
					<div class="vkh_control_task_item">\
						<div class="icon">'+ icon +'</div>\
						<div class="block">\
							'+ progress_box +'\
							<div class="title">\
								'+ details.title +'\
							</div>\
							<div class="info">\
								'+ log_box +'\
								'+ captcha_box +'\
							</div>\
						</div>\
					</div>';
				
			},
			
			genHtmlNoti : function (noti_id, details) {
				
				var icon = '<i class="'+ details.icon +'" style="color: '+ details.icon_color +';"></i>',
					time = details.time ? details.time +' | ' : '';
					
				if (time == '' && details.date && details.date != '0000-00-00 00:00:00') {

					var list_mon = {
						1 : 'января',
						2 : 'февраля',
						3 : 'марта',
						4 : 'апреля',
						5 : 'мая',
						6 : 'июня',
						7 : 'июля',
						8 : 'августа',
						9 : 'сентября',
						10 : 'октября',
						11 : 'ноября',
						12 : 'декабря'
					};
					
					var a = details.date.split(' '),
						b = a[0].split('-'),
						c = a[0].split('-');
						
					time = parseInt(b[2]) +' '+ list_mon[parseInt(b[1])] +' в '+ parseInt(c[1]) +':'+ c[2] +' | ';
					
				}
				
				var link_text = time +'<a href="#" onclick="vkhelper.plugins.control.vk_script.functions.notiInfoBox('+ noti_id +'); vkhelper.plugins.control.vk_script.functions.hide(); return false;">'+ details.link_text +'</a>';
				
				return '\
					<div class="vkh_control_task_item '+ (details.read != 1 ? 'noti_no_read' : '') +'">\
						<div class="icon">'+ icon +'</div>\
						<div class="block">\
							<div class="title">\
								'+ details.title +'\
							</div>\
							<div class="info">\
								'+ link_text +'\
							</div>\
						</div>\
					</div>';
				
			},
			
			clickTab : function (el, type) {
				
				var tab = jQuery(el).closest('.fl_l');
				
				if (tab.hasClass('summary_tab_sel')) {
					return false;
				}
				
				tab.closest('summary_tabs')
					.addClass('summary_tab')
					.removeClass('summary_tab_sel');
					
				tab.addClass('summary_tab_sel');
				
				vkhelper.plugins.control.vk_script.functions.showTypeTast(type); 
				return false;
			},
			
			logout : function () {
				
				if (!confirm('Отключить аккаунт от расширения VK Helper?')) {
					return;
				}
				
				vkhelper.plugins.control.vk_script.functions.hide();
				
				var data = {}; 
        		data.type = 'vkh_set_key';
        		data.from = 'vk';
        		data.to   = 'bg';
        		data.details = {
        		    key : ''
        		};
        		window.postMessage(data, '*');
				
			}
			
		},
		
		on : function () {

			vkhelper.mutationObserver.add('vkhelper_control', function() {
	
				if (VKH_debug.mutationObserver) {
					console.log('mutationObserver FUNC vkhelper_control');
				}
			
				jQuery('#top_nav > .head_nav_item:has(#ts_wrap):not([vkhelper_control])').each(function () {
		
					jQuery(this)
						.attr('vkhelper_control', '1')
						.after('\
							<div class="head_nav_item fl_l head_nav_btns" id="vkhelper_control_msg">\
								<a class="top_nav_btn" style="text-align: center;" >\
									<span id="vkhelper_control_msg_noti"></span>\
									<i class="fas fa-tasks" style="color: #1f3c5e; margin: 10px auto; background: 50% / contain no-repeat; height: 21px; width: 21px;"></i>\
								</a>\
								<div id="vkhelper_control_fast_list"></div>\
								<div id="vkhelper_control_msg_content">\
									<div id="vkhelper_control_msg_content_tasks">\
\
<div class="tabbed_box olist_inner_tabs">\
  <div class="summary_tabs clear_fix" style="margin: 0px;">\
  	<div class="fl_l summary_tab_sel" data-type="local">  \
  		<a class="summary_tab2" onclick="vkhelper.plugins.control.vk_script.functions.clickTab(this, \'local\'); return false;">\
  			<div class="summary_tab3"><nobr>Задания</nobr></div> <!--Локальные задания-->\
  		</a>\
  	</div>\
  	<div class="fl_l summary_tab" data-type="noti">\
  		<a class="summary_tab2" onclick="vkhelper.plugins.control.vk_script.functions.clickTab(this, \'noti\'); return false;">\
  			<div class="summary_tab3"><nobr>Уведомления</nobr></div>\
  		</a>\
  	</div>\
  	<div class="fl_l summary_tab" data-type="buy">\
  		<a class="summary_tab2" onclick="vkhelper.plugins.control.vk_script.functions.clickTab(this, \'buy\'); return false;">\
  			<div class="summary_tab3"><nobr><span class="no_buy"><i class="fas fa-exclamation" style="color: red;"></i> </span>Авторизация</nobr></div>\
  		</a>\
  	</div>\
  	<div class="fl_l summary_tab" data-type="contact">\
  		<a class="summary_tab2" onclick="vkhelper.plugins.control.vk_script.functions.clickTab(this, \'contact\'); return false;">\
  			<div class="summary_tab3"><nobr>Контакты</nobr></div>\
  		</a>\
  	</div>\
  	<!--\
  	<div class="fl_l summary_tab" data-type="cloud">\
  		<a class="summary_tab2" onclick="vkhelper.plugins.control.vk_script.functions.clickTab(this, \'cloud\'); return false;">\
  			<div class="summary_tab3"><nobr>Облачные задания</nobr></div>\
  		</a>\
  	</div>\
  	-->\
  </div>\
</div>\
\
										<div class="control_msg_block" id="vkhelper_control_msg_content_tasks_local"   style="display:none"></div>\
										<div class="control_msg_block" id="vkhelper_control_msg_content_tasks_noti"    style="display:none"></div>\
										<div class="control_msg_block" id="vkhelper_control_msg_content_tasks_buy"     style="display:none"></div>\
										<div class="control_msg_block" id="vkhelper_control_msg_content_tasks_contact" style="display:none"></div>\
										<div class="control_msg_block" id="vkhelper_control_msg_content_tasks_cloud"   style="display:none"></div>\
									</div>\
								</div>\
							</div>');
						
						jQuery('#vkhelper_control_msg + .head_nav_btns').removeClass('head_nav_btns');
						
						jQuery('#vkhelper_control_msg > a').click(function(event){
						
							if (jQuery(this).hasClass('active')) {
								vkhelper.plugins.control.vk_script.functions.hide();
							}
							else {
								vkhelper.plugins.control.vk_script.functions.show();
							}
							
							event.stopPropagation();
							return false;
									
						});
						
				});
				
			});
				
			jQuery(document).mouseup(function (e) {
    			var container = $("#vkhelper_control_msg");
    			if (container.has(e.target).length === 0){
    			    vkhelper.plugins.control.vk_script.functions.hide();
    			}
			});
			
		},
		
		messages : {
		
			'vkhelper_control_notiToggle' : function (details) {
			
				jQuery.extend(vkhelper.plugins.control.vk_script.params.notification, details)
				
				vkhelper.plugins.control.vk_script.functions.noti();
				
			},
		
			'vkhelper_control_show' : function (details) {
			
				vkhelper.plugins.control.vk_script.functions.show(details.type);
				
			},
		
		
			'control_get_tab_response' : function (details) {

				var html = '';
				switch (details.type) {
				
					case 'local':
					
						jQuery.each(details.list, function(k,v) {
	
							if (v == false) {
								return;
							}
						
							if (!v.isVisible) {
								return;
							}
		
							html = vkhelper.plugins.control.vk_script.functions.genHtmlTask(k, v) + html;
						
						});
						
						if (html == '') {
							html = '<div style="text-align: center; color: #656565; padding: 20px 20px 17px;">В данном разделе нет заданий</div>';
						}
				
					break;
				
					case 'noti':
						
						vkhelper.plugins.control.vk_script.params.noti_list = details.list;
						
						jQuery.each(details.list, function(k,v) {
	
							if (v == false) {
								return;
							}
		
							html = vkhelper.plugins.control.vk_script.functions.genHtmlNoti(k, v) + html;
							
						});
						
						if (html == '') {
							html = '<div style="text-align: center; color: #656565; padding: 20px 20px 17px;">Для Вас нет уведомлений</div>';
						}
						
						if (details.read > 0) {
						
							if (!jQuery('#vkhelper_control_msg_content').is(':visible') || !jQuery('#vkhelper_control_msg_content_tasks .summary_tabs > div.fl_l[data-type="noti"].summary_tab_sel').length) {
								return;
							}
							
							vkhelper.messages.sendToBG({ 
								type : 'control_noti_read', 
								details : {
									noti_id : details.read
								}
							});
				
						}
				
					break;
				
					case 'buy':
						
						var html = '';
						
						if (!vkhelper.plugins.vkh.vk_script.vkh.uid || !vkhelper.plugins.vkh.vk_script.vkh.name) {
						
							html += '\
								<div style="text-align: center; color: #656565; padding: 20px 20px 17px;">\
									<div style="font-size: 30px;color: red;">\
										Вы не авторизованы в расширении!\
									</div>\
									<div style="padding-top: 15px;font-size: 15px;">\
										Для использования расширения, необходимо привязать Ваш аккаунт VK к расширению!<br><br>\
										Для этого перейдите по ссылке ниже и авторизуйтесь.\
									</div>\
									<div style="padding-top: 15px;font-size: 15px;">\
										<a href="https://vk-helper.pro/account" target="_blank">Авторизоваться в расширении VK Helper</a>\
									</div>\
								</div>';
						
						}
						else if (vkhelper.plugins.vkh.vk_script.vkh.uid && vkhelper.plugins.vkh.vk_script.vkh.name) {
						
							html += '\
								<div style="text-align: center;color: #656565;padding: 20px 20px 0px;margin-bottom: -10px; font-size: 20px;">\
									Вы авторизовались в расширении как:<br>\
									<a href="https://vk.com/id'+ vkhelper.plugins.vkh.vk_script.vkh.uid +'" target="_blank">'+ vkhelper.plugins.vkh.vk_script.vkh.name +'</a>\
									<span onclick="vkhelper.plugins.control.vk_script.functions.logout()">\
										<i class="fas fa-times" style="font-size: 10px; margin: 0 0 6px; color: 929eb0; cursor: pointer"></i>\
									</span>\
								</div>';
									
							if (!details.vkh || !details.vkh.isActive) {
								
								html += '\
									<div style="text-align: center; color: #656565; padding: 20px 20px 17px;">\
										<div style="font-size: 20px;color: red;">\
											Вы используете бесплатную версию расширения!\
										</div>\
										<div style="padding-top: 15px;font-size: 15px;">\
											В <b>бесплатной</b> версии расширения доступны <a href="https://vk-helper.pro/buy" target="_blank">не все функции</a>. Если Вы используете расширение для автоматизации своей работы в Вконтакте, то рекомендуем Вам приобрести платную версию расширения со всеми доступными функциями.<br><br>\
											Если же вы обычный пользователь ВК, и используетесь соц. сеть только для общения, то Вам не стоит покупать платную версию. \
										</div>\
										<div style="padding-top: 15px;font-size: 15px;">\
											<a href="https://vk-helper.pro/buy" target="_blank">Купить платную версию</a>\
										</div>\
										<div style="padding-top: 15px;font-size: 15px;">\
											<a href="https://vk-helper.pro/account" target="_blank">Авторизоваться под аккаунтом с платной версией</a>\
										</div>\
									</div>';
							}
							else {
								html += '\
									<div style="text-align: center; color: #656565; padding: 20px 20px 17px;">\
										<div style="font-size: 20px;color: green;">\
											Вы используете платную версию расширения!\
										</div>\
										<div style="padding-top: 15px;font-size: 15px;">\
											Платная версия оплачена до '+ details.vkh.date_end +'\
										</div>\
										<div style="padding-top: 15px;font-size: 15px;">\
											<a href="https://vk-helper.pro/buy" target="_blank">Продлить платную версию</a>\
										</div>\
									</div>';
							}
						
						}
						
					break;
				
					case 'contact':
						
						var html = '\
							<div style="text-align: center; color: #656565; padding: 20px 20px 17px;">\
								<div style="font-size: 15px;">\
									<a href="https://vk-helper.pro/" target="_blank">Наш сайт</a>\
								</div>\
								<div style="padding-top: 15px; font-size: 15px;">\
									<a href="https://vk.com/vk_helper_plugin" target="_blank">Сообщество Вконтакте</a>\
								</div>\
								<div style="padding-top: 15px; font-size: 15px;">\
									<a href="https://www.youtube.com/user/gsdfgsdfnhjgfxbh" target="_blank">YouTube канал</a>\
								</div>\
								<div style="padding-top: 15px; font-size: 15px;">\
									<a href="https://t.me/vk_helper" target="_blank">Telegram канал</a>\
								</div>\
							</div>';
						
					break;
					
				}
				
				jQuery('#vkhelper_control_msg .control_msg_block').hide();
				jQuery('#vkhelper_control_msg_content_tasks_'+ details.type).html(html).show();
				
			},
		
			'control_fastMessage_view' : function (details) {

				vkhelper.plugins.control.vk_script.functions.fastMessage(details.status, details.text);
				
			},
		
			'accounts_control_log_open_response' : function (details) {

				vkhelper.plugins.control.vk_script.functions.log.openBox(details.task_id, details.details);
				
			}	
					
		}
		
	}
	
};


vkhelper_plugins_list['postMenu'] = {
	
	not_display : true,
	
	lang : {
		ru : { }	
	},
	
	storage : {
		enabled : true
	}, 
	
	css : function() {
		/*
	
html.vkhelper_postMenuItems_show .vkhelper_postMenu {
	display: block;
}
.vkhelper_postMenu {
	display: none;
	margin-left: 21px;
    cursor: pointer;
    text-decoration: none!important;
    padding: 0 3px;
    box-sizing: border-box;
    white-space: nowrap;
    font-size: 20px;
    color: rgba(0,0,0,.4);
}
.vkhelper_postMenu > * {
	opacity: .45;
}
.vkhelper_postMenu:hover > * {
	opacity: .9;
}
#vkhelper_postMenu_wrape {
	position: absolute; 
	top: 0; left:0; 
	width:200px;
}
	*/
	},
	
	vk_script : {
	
		params : {
			postMenuItems : {} 
		},
		
		functions : {
			
			postMenuClick : function(el) {
			
				if (jQuery('#vkhelper_postMenu_wrape:visible').length && jQuery(el).hasClass('this_show_postmenu')) {
					jQuery(el).removeClass('this_show_postmenu');
					vkhelper.plugins.postMenu.vk_script.functions.postMenuHide();
				} else {
					jQuery('.vkhelper_postMenu').removeClass('this_show_postmenu');
					jQuery(el).addClass('this_show_postmenu');
					vkhelper.plugins.postMenu.vk_script.functions.postMenuShow(el);
				}
			},
			
			postMenuShow : function(el) {
			
				var pos = jQuery(el).offset();
			
				var box = jQuery('#vkhelper_postMenu_wrape');
				
				if (!box.length) {
					
					jQuery('body').append('\
						<div id="vkhelper_postMenu_wrape" class="tt_w tt_default tt_down">\
						</div>');
					
					box = jQuery('#vkhelper_postMenu_wrape');
				}
			
				
				var wrapped = document.createElement('div');
					wrapped.classList.add('wrapped');
					
    			jQuery.each(vkhelper.plugins.postMenu.vk_script.params.postMenuItems, function (k, item) {
                	var node = document.createElement('a');
                		node.classList.add('ui_actions_menu_item');
                		node.classList.add('_im_settings_action');
                		node.onclick = function () {
                			
                			vkhelper.plugins.postMenu.vk_script.functions.postMenuHide();
                			
                			if (item.onChange) {
                    			item.onChange(el);
                    		}
                		};
                		node.innerHTML = item.html;
                		wrapped.appendChild(node)
            	});

				
					
    			box.html(wrapped).show().offset({
    				top : pos.top - 8 - Object.keys(vkhelper.plugins.postMenu.vk_script.params.postMenuItems).length * 31,
    				left : pos.left - 19
    			});
    			
			},
			
			postMenuHide : function() {
			
				var wrape = jQuery('#vkhelper_postMenu_wrape');
				
				if (!wrape.length) {
					return;
				}
				
				wrape.hide();
			
			},
		
		
			postMenuItemsAdd : function(key, details) {
			
				vkhelper.plugins.postMenu.vk_script.params.postMenuItems[key] = details;
			
				jQuery('html').addClass('vkhelper_postMenuItems_show');
				
			},
			
			postMenuItemsRemove : function(key) {
			
				delete vkhelper.plugins.postMenu.vk_script.params.postMenuItems[key];
			
				if (!Object.keys(vkhelper.plugins.postMenu.vk_script.params.postMenuItems).length) {
				
					jQuery('html').removeClass('vkhelper_postMenuItems_show');
				
				}
				
			}
			
		},
		
		on : function () {
		
			vkhelper.mutationObserver.add('vkhelper_postMenu', function() {
	
				if (VKH_debug.mutationObserver) {
					console.log('mutationObserver FUNC vkhelper_postMenu');
				}
			
				jQuery('#content .post .wall_text+.like_wrap div.like_btns:not([vkhelper_postMenu])').each(function () {
					
					jQuery(this)
						.attr('vkhelper_postMenu', '1')
						.append('<span class="post_like vkhelper_postMenu"><i class="fas fa-bars"></i></span>')
						.find('span:last-child')
						.click(function(event){
						
							vkhelper.plugins.postMenu.vk_script.functions.postMenuClick(this);
							
							event.stopPropagation();
							return false;
									
						});
				});
			
				jQuery('#wl_post_actions_wrap .like_btns:not([vkhelper_postMenu])').each(function () {
					
					jQuery(this)
						.attr('vkhelper_postMenu', '1')
						.find('.ui_actions_menu_wrap._ui_menu_wrap')
						.before('<a href="#" class="post_share _share_wrap vkhelper_postMenu"><i class="fas fa-bars"></i></a>')
						.prev('a.vkhelper_postMenu')
						.click(function(event){
						
							vkhelper.plugins.postMenu.vk_script.functions.postMenuClick(this);
							
							event.stopPropagation();
							return false;
							
						});
						
				});	
				
			});
			
			
			jQuery(document).mouseup(function (e) {
    			var container = $("#vkhelper_postMenu_wrape, .vkhelper_postMenu");
    			if (container.has(e.target).length === 0){
    			    vkhelper.plugins.postMenu.vk_script.functions.postMenuHide();
    			}
			});
			
		}
		
	}
	
};


vkhelper_plugins_list['vkh'] = {
	
	not_display : true,
	
	storage : {
		enabled : true
	}, 
	
	vk_script : {
	
		vkh : {},
		
		on : function () {
		
			vkhelper.plugins.vkh.vk_script.functions.get();
			
		},
		
		functions : {
		
			get : function () {
			
				vkhelper.messages.sendToBG({ 
					type : 'vkh_get', 
					details : {}
				});
			
			}
		},
		
		messages : {
		
			'vkh_get_response' : function (details) {
			
				vkhelper.plugins.vkh.vk_script.vkh = details.vkh;
				
			}
		}
		
	},
	
	bg_script : {
	
		on : function () {
		
			chrome.tabs.onActivated.addListener(function (tab) {
					
				messages.sendToVk({
					type : 'vkh_get_response',
					details : {
						vkh : VKH.p.get()
					}
				}, tab.tabId);
				
			});
			
			chrome.tabs.onUpdated.addListener(function (tabId, changeInfo) {
		
				if (changeInfo.status != 'complete') {
					return;
				}
				
				messages.sendToVk({
					type : 'vkh_get_response',
					details : {
						vkh : VKH.p.get()
					}
				}, tabId);
				
			});

		},
		
		messages : {
			'vkh_get' : function (details, tab_id, callback) {
			
				messages.sendToVk({
					type : 'vkh_get_response',
					details : {
						vkh : VKH.p.get()
					}
				}, tab_id);
							
			},	
			'vkh_get_account' : function (details, tab_id, callback) {
			
				messages.sendToVk({
					type : 'vkh_get_account_response',
					details : {
						list : account.get.all(),
						vkh : VKH.p.get()
					}
				}, tab_id);
							
			},			
			'vkh_logout' : function (details, tab_id, callback) {
			
				plugins.get('funcs').list.bg_removeCookies(function() {
				
					proxy.clear('web', function() {
					
						plugins.editField('system', { 
							uidActive : false
						}, function () {
						
							messages.sendToVk({
								type : 'vkh_logout_response',
								details : {}
							}, tab_id);
					
						});
					});
				});
					
			},			
			'vkh_account_login' : function (details, tab_id, callback) {
			
				account.login(details.uid, function () {
				
					messages.sendToVk({
						type : 'vkh_account_login_response',
						details : {}
					}, tab_id);
				
				});			
			},	
					
			'vkh_check_install' : function (details, tab_id, callback) {
			
				messages.sendToVk({
					type : 'vkh_check_install_response',
					details : {
						vkh : VKH.p.get()
					}
				}, tab_id);
							
			},	
			
			'vkh_set_key' : function (details, tab_id, callback) {
				
				VKH.set(details.key, function(){
					/*
					messages.sendToVk({
						type : 'vkh_set_key_response',
						details : {}
					}, tab_id);
					*/
				});			
			},				
			
			'vkh_update_info_key' : function (details, tab_id, callback) {
				
				VKH.key();
				
			}
			
		}
	}
	
};
	
		
vkhelper_plugins_list['accounts'] = {
	
	not_display : true,
	
	storage : {
		enabled : true
	}, 
	
	css : function () {/*
	#proxy_details > summary {
		font-weight: 500; 
		-webkit-font-smoothing: subpixel-antialiased; 
		color: #2a5885; 
		text-decoration: none; 
		cursor: pointer; 
		margin-bottom: 13px;
	}
	
	html:not(.vkhelper_plugin_accounts) #vkhelper_vk_proxy { 
		display: none;
	}   
	html.vkhelper_plugin_accounts #vkhelper_vk_proxy {
		display: block;
		position: fixed;
		bottom: 20px;
		left: 20px;
		color: red;
	}
	*/},
	
	bg_script : {
	
		tabs : {}, 
		
		functions : {
		
			openPage : function(uid) {
				
				plugins.get('funcs').list.bg_removeCookies(function() {
				
					proxy.clear('web', function() {
					
						plugins.editField('system', { 
							uidActive : false
						}, function () {
						
							var prns = {
								state         : 'vkhelper'+ (uid ? ';'+ uid : ''),
								redirect_uri  : 'https://oauth.vk.com/blank.html',
								response_type : 'token',
								display       : 'page',
								revoke        : 1,
								client_id     : 2890984,
								scope         : 'email,notify,friends,photos,audio,video,docs,notes,pages,status,offers,questions,wall,groups,messages,notifications,stats,ads,offline,stories,market',
								v             : 5.74
							};
						
							plugins.get('funcs').list.bg_tabCreate({
								url    : 'https://oauth.vk.com/authorize?'+ jQuery.param(prns), 
								active : true
							});
						
						});
					
					});
				});

			},
			
			// отправляем обновление на вк
			upload : function(list) {
			
				messages.sendToVk({
					type : 'accounts_upload_list',
					details : {
						list : account.list
					}
				});
				
			}
			
		},
		
		on : function () {
		
			plugins.list.accounts.bg_script.functions.upload();
			
			webRequest.add({
				name : 'accounts_saver', 
				event : 'onBeforeRequest', 
				func : function(e){  
					
					console.log('22222222');
					
                	if (!e.requestBody.formData) {
                		return;
                	}
                	
                	var d = e.requestBody.formData;
                	
                	if (d.proxy_ip === undefined || d.proxy_password === undefined || d.proxy_port === undefined || d.proxy_username === undefined) {
                		return; 
                	}
                	
                	var obj =  {
                		email : d.email[0],
                		pass : d.pass[0],
                		proxy_ip : d.proxy_ip[0],
                		proxy_port : d.proxy_port[0],
                		proxy_username : d.proxy_username[0],
                		proxy_password : d.proxy_password[0]
                	};
                	
                	localStorage.setItem('vkhelper_auth_params', JSON.stringify(obj));
                	localStorage.setItem('vkhelper_auth_time', +new Date);
                	                	
  				}, 
  				filter : {
    				urls: ["https://login.vk.com/?act=login&soft=1"]
    				, types: ["main_frame"]
  				},
  				opt : ["requestBody"] //
			});

			webRequest.add({
				name  : 'account_logout', 
				event : 'onHeadersReceived', 
				func  : function(details){  

					console.log('logout', details);
					
					// куки уже и так удалены, но на всякий случай удалим еще разок
					plugins.get('funcs').list.bg_removeCookies(function() {
					
						plugins.editField('system', { 
							uidActive : false
						}, function() {
								
							delete plugins.get('accounts').bg_script.tabs[details.tabId];
						
							proxy.clear('web');
							
						});
					});
					
  				}, 
  				filter : {
    				urls  : ["https://oauth.vk.com/logout*", "https://login.vk.com/?act=logout*"], 
    				types : ["main_frame"]
  				}
			});

			webRequest.add({
				name  : 'accounts', 
				event : 'onBeforeRequest', 
				func  : function(details){  

					console.log('3');
					
					if (!/state=vkhelper/.test(details.url)) {
						return;
					}
					
					var token = (details.url.match(/access_token=([0-9A-z]*)&/) || ['',''])[1] || '';
					var uid   = (details.url.match(/user_id=([0-9]*)&/) || [0,0])[1] || 0;
					
					if (uid == 0 || token == '') {
						return {redirectUrl: "https://vk.com/id"+ uid};
					}
					
					
					var p = localStorage.getItem('vkhelper_auth_params');
					p = p ? JSON.parse(p) : {};
					
					// сохраняем информацию для входа в аккаунт
					account.update.auth(
						uid,
						p.email,
						p.pass, 
						function() {
					
							plugins.editField('system', { 
								uidActive : uid
							}, function() {
												
							// сохраняем информацию о прокси
							account.update.proxy(
								uid, {
									ip : p.proxy_ip,
									port : p.proxy_port,
									username : p.proxy_username,
									password : p.proxy_password
								},
								function() {
								
									// сохраняем токен
									account.update.app(
										uid, 'android', { access_token : token }, 
										function() {
									
											// указываем, что пользователь не заблокирован, и можно работать с аккаунтом
											account.update.details(
												uid, { 
													vkApiBan : 0,
													proxyError : 0 
												},
												function () {
										
													// Создаем Task
													task.add('first', {
														initiator : 'accounts.bg.on.add_success',
														isVisible : false
													}, function(task_id, task_callback) {
											
														// выполняет API запрос для получения имени, фамилии и аватара
														VK.api('execute', {
															code : 'return [API.users.get({"fields" : "photo_50"})[0], API.account.getCounters({"fields": "messages"})];'
														}, {
															uid : uid,
															task_id : task_id
														}, function(response) {
			
															if (response.status != 'success') {
																console.log('Не удалось добавить аккаунт, т.к. не получили ответ от VK API');
																return;
															}
															
															account.update.details(
																response.details[0].id, {
																	firstname : response.details[0].first_name,
																	lastname  : response.details[0].last_name,
																	photo_50  : response.details[0].photo_50
																}, function () {
												
																	chrome.cookies.getAll({domain : 'vk.com'}, function (cookies) { 
																		
																		account.update.cookies(response.details[0].id, JSON.stringify(cookies), function() {
																			
																			// изменяем информер сообщений
																			account.counters.update('messages', response.details[0].id, response.details[1].messages || 0);
																		
																			vkLongPoll.add(response.details[0].id);
																			
																			console.log('Аккаунт успешно добавлен');
																			//callback();
																				
																		});
																			
																	});
																	
																}
															);
															
															task_callback();
															
														});
													});
							
												}
											);
													
										}
									);
									
								}
							);
							
							
							});
					
						}
					);
					
					return {redirectUrl: "https://vk.com/id"+ uid};
					
  				}, 
  				filter : {
    				urls  : ["https://oauth.vk.com/blank.html*"], 
    				types : ["main_frame"]
  				},
  				opt : ["blocking"]
			});
			
			chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
				
				console.log('1');
				
				if (!/^https:\/\/(.+?\.)?vk\.com?/.test(tab.url)) { 
					return;
				}
				
				if (plugins.isEnable('newAccountToTab') != true) {
				
					var uid = plugins.get('system').storage.uidActive;
					
					if (!uid) {
						return;
					} 
					
					plugins.get('accounts').bg_script.tabs[tabId] = plugins.get('system').storage.uidActive;
					
					return;
				}
				
				var uid = plugins.get('accounts').bg_script.tabs[tabId];
				
				if (!uid) {
				
					var uid = plugins.get('system').storage.uidActive;
					
					if (!uid) {
						return;
					} 
					
					plugins.get('accounts').bg_script.tabs[tabId] = plugins.get('system').storage.uidActive;
					
				}
				
				var tabName = plugins.storage.get('newAccountToTab').tabName;
				
				if (tabName == 'none') {
					return;
				}
				
				var name = '';
				switch (tabName) {
					case 'full':
						name = account.get.uid(uid).details.nick || account.get.uid(uid).details.firstname +' '+ account.get.uid(uid).details.lastname;
					break;
					case 'initials':
						name = account.get.uid(uid).details.nick || account.get.uid(uid).details.firstname +' '+ account.get.uid(uid).details.lastname;
						name = name.split(' ').map(function(item){return item[0]}).join('');
					break;
					case 'number':
						name = account.get.uid(uid).details.sort;
					break;
					case 'id':
						name = uid;
					break;
				}
				
				if (tab.title.indexOf(name) != 0) {
				
					var new_title = name +' | '+ tab.title;
				
					chrome.tabs.executeScript(tabId, { 
						code : " if (encodeURI(document.title) != '"+ encodeURI(new_title) +"') { document.title = decodeURI('"+ encodeURI(new_title) +"'); }"
					});
				
				}
				
			});
			
		},
			
		messages : {		
		
			'accounts_get_proxy_info' : function (details, tab_id, callback) {
				
				if (!plugins.get('system').storage.uidActive || !account.get.uid(plugins.get('system').storage.uidActive)) {
					proxy.tabRequest();
					return;
				}
				
				if (!VKH.p.get().isActive) {
					proxy.tabRequest();
					return;
				}
				
				var prx = account.get.uid(plugins.get('system').storage.uidActive).proxy;
				
				proxy.tabRequest({
					ip   : prx.ip,
					port : prx.port
				});
				
			},
			
			'accounts_get_key' : function (details, tab_id, callback) {
				
				messages.sendToVk({
					type : 'accounts_get_key_response',
					details : VKH.p.get()
				}, tab_id);
				
			},
			
			'accounts_check_proxy' : function (details, tab_id, callback) {
				
				proxy.set('web', {
					ip : details.ip,
					port : details.port,
					username : details.username,
					password : details.password
				}, function () {
				
					jQuery.ajax({
						method : "GET",
						url : 'https://vk.com/', 
						timeout : 7000,
						success : function (data) {
							
							messages.sendToVk({
								type : 'accounts_check_proxy_success',
								details : {}
							}, tab_id);
					
						},
						error : function (data) {
							
							proxy.clear('web', function() {
							
								messages.sendToVk({
									type : 'accounts_check_proxy_error',
									details : {}
								}, tab_id);
							
							});
					
						}
					});
					
				});
				
			},
		
			'accounts_data_login' : function (details, tab_id, callback) {
			
				if (details.uid && details.uid > 0) {
				
					if (localStorage.getItem('vkhelper_auth_time') && localStorage.getItem('vkhelper_auth_params') && Number(localStorage.getItem('vkhelper_auth_time')) + 5 * 1000 >= +new Date) {
					
						messages.sendToVk({
							type : 'accounts_data_login_response',
							details : localStorage.getItem('vkhelper_auth_params')
						}, tab_id);
						return;
					}
					
					var dataUser = account.get.uid(details.uid);
					
					if (dataUser && dataUser.auth && dataUser.proxy) {
					
						var prms = {
							email : dataUser.auth.username,
							pass  : dataUser.auth.password,
							proxy_ip : dataUser.proxy.ip,
							proxy_port : dataUser.proxy.port,
							proxy_username : dataUser.proxy.username,
							proxy_password : dataUser.proxy.password
						};
						
						messages.sendToVk({
							type : 'accounts_data_login_response',
							details : JSON.stringify(prms)
						}, tab_id);
				
						return;
					}
					
				}
				
				if (!localStorage.getItem('vkhelper_auth_time') || !localStorage.getItem('vkhelper_auth_params')) {
					return;
				}
				
				if (Number(localStorage.getItem('vkhelper_auth_time')) + 5 * 1000 < +new Date) {
					return;
				}
				
				messages.sendToVk({
					type : 'accounts_data_login_response',
					details : localStorage.getItem('vkhelper_auth_params')
				}, tab_id);
				
			},
			
			'accounts_check_upload' : function (details, tab_id, callback) {
				
				plugins.list.accounts.bg_script.functions.upload();
				
			}
			
		}
		
	},
	
	vk_script : {
		
		list : {},
		
		on : function () {

			vkhelper.messages.sendToBG({ 
				type : 'accounts_check_upload', 
				details : {}
			});
			
			
			jQuery('body').after('<div id="vkhelper_vk_proxy"></div>');
			
			vkhelper.messages.sendToBG({ 
				type : 'accounts_get_proxy_info', 
				details : {}
			});
			
			
			if ((window.location.pathname != '/authorize' && window.location.pathname != '/oauth/authorize') || !/state=vkhelper/.test(window.location.href)) {
				return false;
			}
			
			vkhelper.messages.sendToBG({ 
				type : 'accounts_get_key', 
				details : {}
			});
			
			if (jQuery('#install_allow').length) {
				
				jQuery('#install_allow').before('\
					<details id="proxy_details">\
						<summary>Использовать прокси</summary>\
						<span name="none" style="display:block;text-align:center;margin-bottom:15px;">\
							Настройки Proxy будут доступны после покупки  <a href="https://vk-helper.pro/buy" target="_blank">платной версии расширения VK Helper</a>\
						</span>\
						<span name="block" style="display:none">\
							<input type="text" class="oauth_form_input dark" name="proxy_ip" id="proxy_ip" value="" placeholder="IP" />\
				    		<input type="text" class="oauth_form_input dark" name="proxy_port" id="proxy_port" value="" placeholder="PORT" />\
				    		<input type="text" class="oauth_form_input dark" name="proxy_username" id="proxy_username" value="" placeholder="Username" />\
				    		<input type="password" class="oauth_form_input dark" name="proxy_password" id="proxy_password" value="" placeholder="Password" />\
				    	</span>\
					</details>');
					
				var prms = decodeURIComponent(window.location.href).match(/state=(.+?)&/)[1].split(';');
				
				vkhelper.messages.sendToBG({ 
					type : 'accounts_data_login', 
					details : {
						uid : prms[1] || 0
					}
				});
				
				
				window.login = function (button) {
				
					if (isButtonLocked(button)) return false;
					
        			lockButton(button);
        			
        			if (!jQuery('#login_submit details').attr('open') || jQuery('#proxy_ip').val().trim() == '') {
        				ge('login_submit').submit();
        				return false;
        			}
        			
        			if (!vkhelper.plugins.funcs.list.ValidateIPaddress(jQuery('#proxy_ip').val().trim())) {
        				jQuery('#proxy_ip').css('background', '#FAEAEA');
						setTimeout(function() { jQuery('#proxy_ip').css('background', 'none'); }, 300);
						unlockButton(button);
        				return false;
        			}
        			
        			var prx = {
        				ip   : jQuery('#proxy_ip').val().trim(),
						port : jQuery('#proxy_port').val().trim(),
						username : jQuery('#proxy_username').val().trim(),
						password : jQuery('#proxy_password').val().trim()
        			};
        			
					vkhelper.messages.sendToBG({ 
						type : 'accounts_check_proxy', 
						details : prx
					});
					
					return false;
				}
					
			}
			
			else { 
			
				jQuery('.apps_access_item').hide();
				jQuery('.apps_access_item:has(div.apps_access_email)').show();
				
			}
			
			jQuery('html').addClass('vkhelper_plugin_oauth');
			
		},
		
		messages : {
		
			'accounts_get_key_response' : function (details) {
			
				if (!jQuery('#proxy_details').length || !details.isActive) {
					return;
				}
				
				jQuery('#proxy_details span[name="none"]').hide();
				jQuery('#proxy_details span[name="block"]').show();
			},
			
			'accounts_check_proxy_error' : function (details) {
			
				var box = jQuery('div.box_error');
				
				if (!box.length) {
					jQuery('#login_submit').prepend('<div class="box_error">Проверьте настройки прокси</div>');
					unlockButton(ge('install_allow'));
					return;
				}
				
				box.text('Проверьте настройки прокси');
				unlockButton(ge('install_allow'));
				
			},
		
			'accounts_check_proxy_success' : function (details) {
				
				ge('login_submit').submit();
				
			},
		
			'accounts_data_login_response' : function (details) {
				
				var prms = JSON.parse(details);
				
				jQuery('#login_submit input[name="email"]').val(prms.email || '');
				jQuery('#login_submit input[name="pass"]').val(prms.pass || '');
				
				jQuery('#proxy_ip').val(prms.proxy_ip || '');
				jQuery('#proxy_port').val(prms.proxy_port || '');
				jQuery('#proxy_username').val(prms.proxy_username || '');
				jQuery('#proxy_password').val(prms.proxy_password || '');
				
				if (prms.proxy_ip) {
					jQuery('#proxy_details').attr('open', '1');
				}
				
			},
		
			'vkhelper_proxy_editing' : function (details) {
			
				if (details.ip && details.port) {
					var text = details.ip +':'+ details.port;
				} else {
					var text = '';
				}
				
				jQuery('#vkhelper_vk_proxy').text(text);
				
			},
		
			'accounts_upload_list' : function (details) {
			
				vkhelper.plugins.accounts.vk_script.list = details.list;
				
			}
			
		}
		
	}
	
};	


vkhelper_plugins_list['listSelectedItem'] = {
	
	not_display : true,
	
	lang : {
		ru : { }	
	},
	
	storage : {
		enabled : true,
		list : {
			accounts : {},
			groups : {}
		}
	}, 
	
	css : function() {/*
	
	*/},
	
	vk_script : {
	
		params : {
			accounts : {
				type     : '',
				options  : {},
				callback : function () {}
			},
			groups : {
				type     : '',
				options  : {},
				callback : function () {}
			}
		},
		
		functions : {

			setListAccounts : function (type, options, callback) {
			
				vkhelper.plugins.listSelectedItem.vk_script.params.accounts.type     = type;
				vkhelper.plugins.listSelectedItem.vk_script.params.accounts.options  = options;
				vkhelper.plugins.listSelectedItem.vk_script.params.accounts.callback = callback;
						
				vkhelper.messages.sendToBG({ 
					type : 'vkhelper_plugins_listSelectedItem_setListAccounts_load', 
					details : {}
				});
				
			},
			
			setListGroups : function (type, options, callback) {
			
				show(boxLoader);
				boxRefreshCoords(boxLoader);
					
				vkhelper.plugins.listSelectedItem.vk_script.params.groups.type     = type;
				vkhelper.plugins.listSelectedItem.vk_script.params.groups.options  = options;
				vkhelper.plugins.listSelectedItem.vk_script.params.groups.callback = callback;
						
				vkhelper.messages.sendToBG({ 
					type : 'vkhelper_plugins_listSelectedItem_setListGroups_load', 
					details : {
						uid : vk.id
					}
				});
				
			},
			
			getAccounts : function (type) {
			
				var res = vkhelper.plugins.listSelectedItem.storage.list.accounts[type];
				
				jQuery.each(res, function(k,v) {
					if (!vkhelper.plugins.accounts.vk_script.list[v]) {
						res.splice(k,1);
					}
				});
				
				return res;
				
			}
			
			
		},
		
		messages : {
		
			'vkhelper_plugins_listSelectedItem_setListAccounts_response' : function (details) {

				if (!details.list) {
					return;
				}
				
				var selected_items = vkhelper.plugins.listSelectedItem.storage.list.accounts[vkhelper.plugins.listSelectedItem.vk_script.params.accounts.type] || [];
				
				var t = '';
				jQuery.each(details.list, function(k,v) {
				
					if (!v || (vk.id == v.uid && vkhelper.plugins.listSelectedItem.vk_script.params.accounts.options.noHide != true)) {
						return;
					}
					
					var name = v.nick || v.firstname +' '+ v.lastname;

					var on = jQuery.inArray(v.uid.toString(), selected_items) != -1 ? 'olist_item_wrap_on' : '';
					
					t += '<a class="olist_item_wrap '+ on +'" data-uid="'+ v.uid +'" onclick="return toggleClass(this, \'olist_item_wrap_on\', !hasClass(this, \'olist_item_wrap_on\'));"> '+
  							'<div class="olist_item clear_fix"> '+
    							'<span class="olist_checkbox fl_r"></span> '+
    							'<span class="olist_item_photo fl_l" style="background: url('+ v.photo_50 +') no-repeat 50%"></span> '+
   								'<span class="olist_item_name fl_l">'+ name +'</span> '+
  							'</div> '+
						 '</a> ';
					
				});
						
				if (t == '') {
					t = '<div style="margin:20px;text-align:center;">Вы еще не добавили аккаунты в расширение VK Helper</div>';
				}
				
				
				var box = new MessageBox({title : 'Выберите аккаунты', bodyStyle : 'display: block; padding: 4px 0px 0px;'})
					.content('\
						<div id="vkhelper_setListAccounts_select_box">\
							<div class="tabbed_box olist_inner_tabs">\
								<div class="tabbed_container clear_fix " style="height:auto;">\
									<div class="olist">\
										<div class="olist_section ">\
										'+ t +'\
										</div>\
									</div>\
								</div>\
							</div>\
						</div>')
					.setButtons('Продолжить', function() {
					
						var uids = [];
						jQuery('#vkhelper_setListAccounts_select_box div.olist_section a.olist_item_wrap.olist_item_wrap_on[data-uid]').each(function() {
							uids.push(jQuery(this).attr('data-uid'));
						});
						
						vkhelper.plugins.listSelectedItem.storage.list.accounts[vkhelper.plugins.listSelectedItem.vk_script.params.accounts.type] = uids;
					
						box.hide();
						
						
						vkhelper.plugins.listSelectedItem.vk_script.params.accounts.callback({
							list : uids
						});
						
						
						var obj = {};
						obj[vkhelper.plugins.listSelectedItem.vk_script.params.accounts.type] = uids;
						
						vkhelper.messages.sendToBG({ 
							type : 'vkhelper_plugins_listSelectedItem_storage_save', 
							details : {
								type : 'accounts',
								obj  : obj
							}
						});

					}, 'Отмена')
					.show();
					
				box.setControlsText('<a href="#" onclick="jQuery(\'#vkhelper_setListAccounts_select_box .olist_item_wrap\').addClass(\'olist_item_wrap_on\'); return false">Выбрать все</a> &#160;&#183;&#160; <a href="#" onclick="jQuery(\'#vkhelper_setListAccounts_select_box .olist_item_wrap\').removeClass(\'olist_item_wrap_on\'); return false">Снять все</a>');
					
			},
		
			'vkhelper_plugins_listSelectedItem_setListGroups_response' : function (details) {

				if (!details.list) {
					hide(boxLoader);
					return;
				}
				
				var selected_items = vkhelper.plugins.listSelectedItem.storage.list.groups[vkhelper.plugins.listSelectedItem.vk_script.params.groups.type +'_'+ vk.id] || [];
				
				if (vkhelper.plugins.listSelectedItem.vk_script.params.groups.options.oneItem != true) {
					var titleBox = 'Выберите сообщества';
					var clickOne = '';
				} else {
					var titleBox = 'Выберите сообщество';
					var clickOne = 'jQuery(\'#vkhelper_setListGroups_select_box .olist_item_wrap\').removeClass(\'olist_item_wrap_on\');';
				}
				
				var t = '';
				jQuery.each(details.list, function(k,v) {
				
					if (!v || (-cur.oid == v.id && vkhelper.plugins.listSelectedItem.vk_script.params.groups.options.noHide != true)) {
						return;
					}
					
					var on = jQuery.inArray(v.id.toString(), selected_items) != -1 ? 'olist_item_wrap_on' : '';
					
					
					t += '<a class="olist_item_wrap '+ on +'" data-gid="'+ v.id +'" onclick="'+ clickOne +' return toggleClass(this, \'olist_item_wrap_on\', !hasClass(this, \'olist_item_wrap_on\'));"> '+
  							'<div class="olist_item clear_fix"> '+
    							'<span class="olist_checkbox fl_r"></span> '+
    							'<span class="olist_item_photo fl_l" style="background: url('+ v.photo_50 +') no-repeat 50%"></span> '+
   								'<span class="olist_item_name fl_l">'+ v.name +'</span> '+
  							'</div> '+
						 '</a> ';
					
				});
				
				if (t == '') {
					t = '<div style="margin:20px;text-align:center;">У вас нет администрируемых сообществ</div>';
				}
				
				var box = new MessageBox({title : 'Выберите сообщества', bodyStyle : 'display: block; padding: 4px 0px 0px;'})
					.content('\
						<div id="vkhelper_setListGroups_select_box">\
							<div class="tabbed_box olist_inner_tabs">\
								<div class="tabbed_container clear_fix " style="height:auto;">\
									<div class="olist">\
										<div class="olist_section ">\
										'+ t +'\
										</div>\
									</div>\
								</div>\
							</div>\
						</div>')
					.setButtons('Продолжить', function() {
					
						var items = {};
						
						var gids = [];
						jQuery('#vkhelper_setListGroups_select_box div.olist_section a.olist_item_wrap.olist_item_wrap_on[data-gid]').each(function() {
							
							var id = jQuery(this).attr('data-gid');
							
							gids.push(id);
							
							items[id] = {
								id : id,
								title : jQuery(this).find('.olist_item_name').text()
							};
							
						});
						
						vkhelper.plugins.listSelectedItem.storage.list.groups[vkhelper.plugins.listSelectedItem.vk_script.params.groups.type +'_'+ vk.id] = gids;
					
						box.hide();
						
					
						vkhelper.plugins.listSelectedItem.vk_script.params.groups.callback({
							list  : gids,
							items : items
						});
						
						var obj = {};
						obj[vkhelper.plugins.listSelectedItem.vk_script.params.groups.type +'_'+ vk.id] = gids;
						
						vkhelper.messages.sendToBG({ 
							type : 'vkhelper_plugins_listSelectedItem_storage_save', 
							details : {
								type : 'groups',
								obj  : obj
							}
						});

					}, 'Отмена')
					.show();
					
				if (vkhelper.plugins.listSelectedItem.vk_script.params.groups.options.oneItem != true) {
					box.setControlsText('<a href="#" onclick="jQuery(\'#vkhelper_setListGroups_select_box .olist_item_wrap\').addClass(\'olist_item_wrap_on\'); return false">Выбрать все</a> &#160;&#183;&#160; <a href="#" onclick="jQuery(\'#vkhelper_setListGroups_select_box .olist_item_wrap\').removeClass(\'olist_item_wrap_on\'); return false">Снять все</a>');
				}
				
				hide(boxLoader);
				
			}
			
		},
	
		on : function () {
		
		}
		
	},
	
	bg_script : {
	
		messages : {
		
			'vkhelper_plugins_listSelectedItem_storage_save' : function (details, tab_id, callback) {

				var strg = plugins.storage.get('listSelectedItem');
				if (!strg.list) {
					strg.list = {};
				}
				if (!strg.list[details.type]) {
					strg.list[details.type] = {};
				}
				jQuery.extend(strg.list[details.type], details.obj);
				console.log(strg);
				plugins.storage.set('listSelectedItem', strg);
				
			},
			
			'vkhelper_plugins_listSelectedItem_setListAccounts_load' : function (details, tab_id, callback) {

				var users = [];
		
				// сортируем
				jQuery.each(account.get.all(), function(k, v) {    
					
					// проверяем существование одного основного поля, если его нет, то и других не будет
					if (!v.details || !v.details.firstname || v.details.vkApiBan == 1)
						return;
			
					if (v.details.sort && !users[v.details.sort]) {
		
						users[v.details.sort] = v.details;
			
					} else {
		
						users.push(v.details);
			
					}
		
				});
	
				messages.sendToVk({
					type : 'vkhelper_plugins_listSelectedItem_setListAccounts_response', 
					details : {
						list : users
					}
				}, tab_id);
			
			},			
			
			'vkhelper_plugins_listSelectedItem_setListGroups_load' : function (details, tab_id, callback) {

				task.add('first', {
					initiator : 'listSelectedItem.bg.msg.vkhelper_plugins_listSelectedItem_setListGroups_load',
					isVisible : false
				}, function(task_id, task_callback) {
			
					VK.api('groups.get', {
						extended : 1,
						filter : 'editor'
					}, {uid : details.uid}, function(response) {

						if (response.status != 'success') {
							messages.sendToVk({
								type : 'vkhelper_plugins_listSelectedItem_setListGroups_response', 
								details : { }
							}, tab_id);
							task_callback();
							return;
						}
						
						messages.sendToVk({
							type : 'vkhelper_plugins_listSelectedItem_setListGroups_response', 
							details : {
								list : response.details.items
							}
						}, tab_id);
							
						task_callback();
						
					});

				});
				
			}
			
		}
		
	}
	
};





vkhelper_plugins_list['newAccountToTab'] = {

	lang : {
		ru : {
			cat : 'Для быстрой работы',
			title : 'Привязывать аккаунт к вкладке',
			aboutLink : 'http://vk-helper.pro/?p=page/instruction&type=',
			description : 'При переключении аккаунтов, аккаунты будут привязываться к вкладке. Т.е. при переключении вкладки будет меняться авторизованный аккаунт.',	
			
			fields : {
				tabName : {
					name  : 'Наименование вкладок',
					items : [
						'Инициалы аккаунта',
						'Фамилия Имя аккаунта',
						'Номер аккаунта',
						'ID аккаунта',
						'Не изменять'
					]
				}
			}
		}
	},
	
	fields : {
		tabName : {
			type  : 'radio',
			items : [
				{
					value : 'initials'
				},{
					value : 'full'
				},{
					value : 'number'
				},{
					value : 'id'
				},{
					value : 'none'
				}
			]
		}
	},
	
	storage : {	
		enabled : false,
		tabName : 'initials'
	},
	
	bg_script : {
	
		onActivated_func : function (activeInfo) {
				
			console.log('555555');
					
			if (plugins.isEnable('newAccountToTab') != true) {
				return;
			}
				
			var uid = plugins.get('accounts').bg_script.tabs[activeInfo.tabId];
				
			if (!uid) {
				
				var uid = plugins.get('system').storage.uidActive;
					
				if (!uid) {
					return;
				}
					
				plugins.get('accounts').bg_script.tabs[activeInfo.tabId] = plugins.get('system').storage.uidActive;
					
				uid = plugins.get('accounts').bg_script.tabs[activeInfo.tabId];
					
			}
			else if (plugins.get('accounts').bg_script.tabs[activeInfo.tabId] == plugins.get('system').storage.uidActive) {
				return;
			}
				
			chrome.tabs.query({active: true}, function (tabs) {
				
				if (tabs.length < 1 || tabs[0].id != activeInfo.tabId) {
					return;
				}
					
				if (!/^https:\/\/(.+?\.)?vk\.com?/.test(tabs[0].url)) {
   					delete plugins.list.accounts.bg_script.tabs[tabs[0].id];
   					return;
   				}	
   					
				if (!account.get.uid(uid)) {
   					delete plugins.list.accounts.bg_script.tabs[tabs[0].id];
   					return;
   				}	
   					
   				account.login(uid);	
   							
   			});
   				
		},
			
		on : function () {
		
			webRequest.add({
				name : 'accounts_no_uid_tab', 
				event : 'onBeforeRequest', 
				func : function(e){  
	
					console.log('44444');
					
					if (plugins.isEnable('newAccountToTab') != true) {
						return;
					}
				
					if (e.tabId < 1) {
						return;
					}
					
					if (!plugins.get('accounts').bg_script.tabs[e.tabId] && plugins.get('system').storage.uidActive == false) {
						return;
					}
					
					if (!plugins.get('accounts').bg_script.tabs[e.tabId]) {
						return;
					}

					if (plugins.get('accounts').bg_script.tabs[e.tabId] == plugins.get('system').storage.uidActive) {
						return;
					}
				
                	return {cancel: true};
                	
  				}, 
  				filter : {
    				urls: ["*://vk.com/*", "*://*.vk.com/*"] 
    				, types: ["main_frame", "sub_frame", "xmlhttprequest"] // "media", "websocket", "ping", "image", "font", "stylesheet", "object", "other", "csp_report", "script"
  				},
  				opt : ["blocking"]
			});
			
			chrome.tabs.onActivated.addListener(plugins.get('newAccountToTab').bg_script.onActivated_func);
			
		},
	
		off : function () {
		
			webRequest.remove({
				name : 'accounts_no_uid_tab', 
				event : 'onBeforeRequest'
			});
			
			chrome.tabs.onActivated.removeListener(plugins.get('newAccountToTab').bg_script.onActivated_func);
			
		}
	}
	
};

vkhelper_plugins_list['informerMsg'] = {

	lang : {
		ru : {
			cat : 'Для быстрой работы',
			title : 'Отображать информер сообщений',
			aboutLink : 'http://vk-helper.pro/?p=page/instruction&type=',
			description : 'Отображать информер сообщений возле иконки расширения',
			
			fields : {
				zero_view : {
					name  : 'Прятать информер, если нет сообщений'
				}
			}
		}
	},
	
	
	fields : {
	
		zero_view : {
			type : 'input_checkbox'
		}
		
	},

	storage : {	
		enabled : false
	},
	
	bg_script : {
	
		on : function () {
		
			jQuery.each(account.list, function(id, d) {
				if (d.app && d.app.android && d.app.android.access_token && d.details) {
					vkLongPoll.go(id);
				}
			});
			
			account.counters.printInformer();

		},
	
		off : function () {
		
			vkLongPoll.remove.all();
			
			account.counters.printInformer();
			
		},
		
		editField : function (fields) {
		
			account.counters.printInformer();
			
		}
	
	}
	
};



vkhelper_plugins_list['multiLike'] = {

	lang : {
		ru : {
			cat : 'Для быстрой работы',
			title : 'Лайк записи с нескольких страниц',
			description : 'Вы сможете поставить лайк записи сразу с нескольких аккаунтов<br><br><img src="https://vk-helper.pro/image/options/multiLike_1.jpg" width="396" height="181">',
			
			aboutLink : 'http://vk-helper.pro/?p=page/instruction&type=54',
			
			keys : 'мультилайк мульти-лайк лайк лайки'
			
		}
	},
		
	storage : {	
		enabled : true
	},
	
	vk_script : {
		
		params : {
			func_likeUpdate : false
		},
		
		on : function () {
			
			vkhelper.plugins.postMenu.vk_script.functions.postMenuItemsAdd(
				'multiLike', {
					html : 'Мульти-лайк',
					onChange : function(el) {
						vkhelper.plugins.multiLike.vk_script.functions.click(el);
					}
				}
			);
			
		},
		
		off : function () {
		
			vkhelper.plugins.postMenu.vk_script.functions.postMenuItemsRemove('multiLike');
			
		},
		
		functions : {
		
			click : function (el) {
			
				var $this = jQuery(el);
				
				var content = jQuery("#wl_post_body_wrap");
					
				if (!content.length) {
					content = $this.closest(".post_info").find('.wall_text');
				}
				
				if (!content) 
					return;
						
				
				var post_id = content.find('div.wall_post_cont').attr('id').substr(3);
				
				vkhelper.plugins.multiLike.vk_script.functions.box.open(post_id);
				
			},
			
			box : {
			
				open : function (post_id) {
				
					var list_user = vkhelper.plugins.listSelectedItem.vk_script.functions.getAccounts('multiLike') || [];
					
					var box = new MessageBox({
						title : 'Мульти-лайк',
						dark : 1
					})
					.content('\
<div id="multiLike_box">\
	<a href="#" id="multiLike_box_accounts">Выбрано аккаунтов: <span style="font-weight:600">'+ list_user.length +'</span></a>\
</div>'
					)
					.setButtons(
						'Поставить лайк', function() {
						
							var obj = {
								users   : vkhelper.plugins.listSelectedItem.vk_script.functions.getAccounts('multiLike') || [],
								post_id : post_id,
								uid     : vk.id
							};
							
							if (!obj.users.length) {
								showDoneBox('Вы не указали аккаунты с которых необходимо поставить лайк');
								return;
							}
							
							if (!vkhelper.plugins.vkh.vk_script.vkh.isActive && obj.users.length > 3) {
								showDoneBox('В бесплатной версии VK Helper вы можете делать Мульти-Лайк только с <b>трех</b> страниц. Для снятия этого ограничения, необходимо <a href="https://vk-helper.pro/buy" target="_blank">оформить платную подписку</a>.');
								return;
							}
							
							vkhelper.plugins.control.vk_script.functions.fastMessage('waiting', 'Начинаем ставить лайки', 1000);
							
							vkhelper.messages.sendToBG({ 
								type : 'vkhelper_multiLike_task', 
								details : obj
							});
					
							box.hide();
							
						}, 
						'Отмена', function() {
							box.hide();
						}
					)
					.show();
					
					
                	jQuery('#multiLike_box_accounts').click(function(event) {
                	
                		vkhelper.plugins.listSelectedItem.vk_script.functions.setListAccounts('multiLike', {noHide : true}, function(details) {
					
							jQuery('#multiLike_box_accounts > span').text(details.list.length);
					
						});
					
                		event.stopPropagation();
						return false;
                	});
                	
				}
			
			}
		
		},
		
		messages : {
		
			'multiLike_likeUpdate' : function (details) {
	
				if (!vkhelper.plugins.multiLike.vk_script.params.func_likeUpdate) {
					vkhelper.plugins.multiLike.vk_script.params.func_likeUpdate = debounce(function(details) { Wall.likeUpdate('', details.post_id, details.hasUid, details.count); }, 300);
				}
				
				vkhelper.plugins.multiLike.vk_script.params.func_likeUpdate(details);
				
			}
		}
							
	},
	
	bg_script : {
	
		messages : {
							
			'vkhelper_multiLike_task' : function (details, tab_id, callback) {

				var owner_id = details.post_id.split('_')[0],
					item_id  = details.post_id.split('_')[1];
					
				details.hasUid = details.users.indexOf(String(details.uid)) != -1;
				
				task.add('last', {
					initiator : 'multiLike.bg.msg.vkhelper_multiLike_task',
					isVisible : true,
					title : '<b>Мульти-лайк</b> записи <a href="https://vk.com/wall'+details.post_id +'" target="_blank">wall'+details.post_id +'</a>',
					maxCount  : details.users.length,
					onFinished : function (task_id, details) {
					
						messages.sendToVk({
							type : 'control_fastMessage_view',
							details : {
								status : 'success',
								text : 'Поставлено лайков: '+ (details.log_success || []).length +' из '+ details.maxCount
							}
						});
							
					}
				}, function(task_id, task_callback) {
			
					var hasUid  = 0;
						 
					function go() {
						
						if (!details.users.length) {
							task_callback();
							return;
						}
						
						var u = details.users.shift();
						
						VK.api('likes.add', {
							type : 'post',
							owner_id : owner_id,
							item_id : item_id
						}, {
							uid : u,
							task_id : task_id,
							errors : [15]
						}, function(response) {
		
							if (response.status != 'success') {
								
								if (response.details.error) {
								
									if (response.details.error == "error_api_catch") {
									
										if (response.details.data.error_code == 15) {
											task.update(task_id, {
												nowCountAdd : 1,
												addErrors : {
													uid : u,
													error : 'no_access',
													data : response.details.data
												}
											});
											go();
											return false;
										}
									
									}
								
									task.update(task_id, {
										nowCountAdd : 1,
										addErrors : {
											uid : u,
											error : response.details.error,
											data : response.details
										}
									});
									go();
									return false;
								}
								
								task.update(task_id, {
									nowCountAdd : 1,
									addErrors : {
										uid : u,
										error : 'unkniwn_error',
										data : response.details
									}
								});
								go();
								return false;
							}
							
							
							if (!response.details.likes) {
								task.update(task_id, {
									nowCountAdd : 1,
									addErrors : {
										uid : u,
										error : 'unkniwn_error',
										data : response.details
									}
								});
								go();
								return false;
							}
							
		
							task.update(task_id, {
								nowCountAdd : 1,
								addSuccess : {
									uid : u
								}
							});
							
							if (u == details.uid) {
								hasUid = 1;
							}
							
							messages.sendToVk({
								type : 'multiLike_likeUpdate',
								details : {
									post_id : 'post'+details.post_id,
									count : response.details.likes,
									hasUid : details.hasUid == 1 && hasUid == 1
								}
							}, tab_id);
					
							go();
							return false;
			
						});
						
					}
				
					go();

				});
				
			}
		
		}
		
	}

};

vkhelper_plugins_list['multiRepost'] = {

	lang : {
		ru : {
			cat : 'Для быстрой работы',
			title : 'Репост записи на несколько страниц',
			description : 'Вы сможете сделать репост записи сразу на несколько страниц пользователей или сообществ<br><br><img src="https://vk-helper.pro/image/options/multiRepost_1.jpg" width="389" height="177">',
			
			aboutLink : 'http://vk-helper.pro/?p=page/instruction&type=53',
			
			keys : 'мультирепост мульти-репост репост репосты'
			
		}
	},
		
	storage : {	
		enabled : true
	},
	
	vk_script : {
		
		functions : {
		
			click : function (el) {
			
				var $this = jQuery(el);
				
				var content = jQuery("#wl_post_body_wrap");
					
				if (!content.length) {
					content = $this.closest(".post_info").find('.wall_text');
				}
				
				if (!content) 
					return;
						
				
				var post_id = content.find('div.wall_post_cont').attr('id').substr(3);
				
				vkhelper.plugins.multiRepost.vk_script.functions.box.open(post_id);
				
			},
			
			box : {
			
				open : function (post_id) {
				
					var details = {
						users  : (vkhelper.plugins.listSelectedItem.vk_script.functions.getAccounts('multiRepost') || []).filter(function(d){ return d != cur.oid; }), 
						groups : (vkhelper.plugins.listSelectedItem.storage.list.groups['multiRepost_'+vk.id] || []).filter(function(d){ return d != -cur.oid; })
					};
					
					var box = new MessageBox({
						title : 'Мульти-репост',
						dark : 1
					})
					.content('\
<div id="multiRepost_box">\
	\
	<a href="#" id="multiRepost_box_accounts">Выбрано аккаунтов: <span style="font-weight:600">'+ details.users.length +'</span></a><br><br>\
	\
	<a href="#" id="multiRepost_box_groups">Выбрано сообществ: <span style="font-weight:600">'+ details.groups.length +'</span></a>\
	\
	<h4 class="subheader" style="border-top: solid 1px #e4e6e9; padding-top: 10px;">Ваш комментарий:</h4>\
	<div class="mail_box_text_wrap _emoji_field_wrap" style="position: relative; margin-top: 0px;">\
    	<div id="multiRepost_box_smile" class="emoji_smile_wrap  _emoji_wrap">\
    		<div class="emoji_smile _emoji_btn" onmouseover="return Emoji.show(this, event);" onmouseout="return Emoji.hide(this, event);" onclick="return cancelEvent(event);">\
    			<div class="emoji_smile_icon"></div>\
    		</div>\
    	</div>\
    	<div tabindex="1" contenteditable="true" id="multiRepost_box_editable" style="min-height: 60px;"></div>\
    </div>\
    \
    <div class="checkbox" id="multiRepost_box_check_timer" onclick="if(jQuery(this).hasClass(\'disabled\'))return;checkbox(this); jQuery(this).next(\'div\').toggle()" style="-moz-user-select: none;-khtml-user-select: none;user-select: none; display:none;">Отложить публикацию</div>\
    <div class="medadd_c medadd_c_timer clear_fix" style="overflow: hidden; display: none;">\
    	<div class="clear_fix">\
    		<div class="fl_l">\
    			<div id="multiRepost_box_wrap_timer" class="datepicker_container"></div>\
    		</div>\
    		<div class="fl_l medadd_c_timerat">в</div>\
    		<div class="fl_l">\
    			<div id="multiRepost_box_wrap_timer_time" class="timepicker_container"></div>\
    		</div>\
    	</div>\
    </div>\
    \
    <div class="checkbox" id="multiRepost_box_del_check_timer" onclick="if(jQuery(this).hasClass(\'disabled\'))return;checkbox(this); jQuery(this).next(\'div\').toggle()" style="margin: 18px 0 0; -moz-user-select: none;-khtml-user-select: none;user-select: none; display:none;">Автоудаление</div>\
    <div class="medadd_c medadd_c_timer clear_fix" style="overflow: hidden; display: none;">\
    	<div class="clear_fix">\
    		<div class="fl_l">\
    			<div id="multiRepost_box_del_wrap_timer" class="datepicker_container"></div>\
    		</div>\
    		<div class="fl_l medadd_c_timerat">в</div>\
    		<div class="fl_l">\
    			<div id="multiRepost_box_del_wrap_timer_time" class="timepicker_container"></div>\
    		</div>\
    	</div>\
    </div>\
    \
    <div id="multiRepost_box_groups_checkbox" class="checkbox" onclick="checkbox(this);" style="margin: 18px 0 0; -moz-user-select: none;-khtml-user-select: none;user-select: none;">\
        Это реклама (для сообществ)\
    </div>\
    \
</div>'
					)
					.setButtons(
						'Поделиться записью', function() {
						
							var obj = {
								uid      : vk.id, 
								users    : (vkhelper.plugins.listSelectedItem.vk_script.functions.getAccounts('multiRepost') || []).filter(function(d){ return d != cur.oid; }),
								groups   : (vkhelper.plugins.listSelectedItem.storage.list.groups['multiRepost_'+vk.id] || []).filter(function(d){ return d != -cur.oid; }),
								text     : Emoji.editableVal(ge('multiRepost_box_editable')).trim(),
								post_id  : post_id,
								ads      : jQuery('#multiRepost_box_groups_checkbox').hasClass('on'),
								postpone : jQuery('#multiRepost_box_check_timer').hasClass('on') ? val('multiRepost_box_wrap_timer') : false,
								del      : jQuery('#multiRepost_box_del_check_timer').hasClass('on') ? val('multiRepost_box_del_wrap_timer') : false
							};
							
							if (!obj.users.length && !obj.groups.length) {
								showDoneBox('Вы не указали, куда делать репост');
								return;
							}
							
							if (!vkhelper.plugins.vkh.vk_script.vkh.isActive && obj.users.length + obj.groups.length > 3) {
								showDoneBox('В бесплатной версии VK Helper вы можете делать Мульти-Репост только на 3 страницы. Для снятия этого ограничения, необходимо <a href="https://vk-helper.pro/buy" target="_blank">оформить платную подписку</a>.');
								return;
							}
							
							if (obj.postpone && Number(obj.postpone) - 60 * 5 <= parseInt(Number(new Date())/1000)) {
								showDoneBox('Невозможно отложить публикацию на указанную дату');
								return;
							}
							
							if (obj.del != false && (Number(obj.postpone) || parseInt(Number(new Date())/1000)) > ( Number(obj.del) - (60 * 20))) {
								showDoneBox('Удалять запись можно не раньше чем через 20 минут после публикации');
								return;
							}
							
							if (obj.del && obj.postpone) {
								vkhelper.plugins.control.vk_script.functions.fastMessage('waiting', 'Создаем облачное задание', 1000);
							}
							else {
								vkhelper.plugins.control.vk_script.functions.fastMessage('waiting', 'Начинаем делать репосты', 1000);
							}
							
							vkhelper.messages.sendToBG({ 
								type : 'vkhelper_multiRepost_task', 
								details : obj
							});
							
							box.hide();
							
						}, 
						'Отмена', function() {
							box.hide();
						}
					).show();
					
					if (!vkhelper.plugins.vkh.vk_script.vkh.isActive) {
					
						jQuery('#multiRepost_box_check_timer, #multiRepost_box_del_check_timer')
							.addClass('disabled')
							.on('mouseover', function() {
								showTooltip(this, {text: 'Доступно в платной версии<br>расширения VK Helper', dir: 'auto', shift: [22, 10], slide: 15, className: 'settings_tt'});
							});
					}
						
					if (window.stManager) {
						stManager.add(["ui_controls.css", "ui_controls.js", "datepicker.css", "datepicker.js"], function() {
					
    						new Datepicker("multiRepost_box_wrap_timer", {
    						    time: "multiRepost_box_wrap_timer_time",
    						    width: 155,
    						    noPast: !0,
    						    minStep: 1,
    						    onUpdate: function () { }
    						});
    						
    						new Datepicker("multiRepost_box_del_wrap_timer", {
    						    time: "multiRepost_box_del_wrap_timer_time",
    						    width: 155,
    						    noPast: !0,
    						    minStep: 1,
    						    onUpdate: function () { }
    						});
    						
						});
					}
	
					var emj = Emoji.init(ge('multiRepost_box_editable'), {
                    	controlsCont: ge("multiRepost_box_smile"),
                    	noEnterSend: 1,
                    	noStickers: 1
                	});
                	Emoji.emojiLoadMore(emj);
                	
                	Emoji.editableFocus('multiRepost_box_editable');
                	
                	
                	jQuery('#multiRepost_box_accounts').click(function(event) {
                	
                		vkhelper.plugins.listSelectedItem.vk_script.functions.setListAccounts('multiRepost', {noHide : vk.id != cur.oid}, function(details) {
					
							jQuery('#multiRepost_box_accounts > span').text(details.list.filter(function(d){ return d != cur.oid; }).length);
					
						});
					
                		event.stopPropagation();
						return false;
                	});
                	   	
                	jQuery('#multiRepost_box_groups').click(function(event) {
                	
                		vkhelper.plugins.listSelectedItem.vk_script.functions.setListGroups('multiRepost', {noHide : false}, function(details) {
					
							jQuery('#multiRepost_box_groups > span').text(details.list.filter(function(d){ return d != -cur.oid; }).length);
					
						});
					
                		event.stopPropagation();
						return false;
                	});
                	
				}
			
			}
		
		},
		
		on : function () {
			
			vkhelper.plugins.postMenu.vk_script.functions.postMenuItemsAdd(
				'multiRepost', {
					html : 'Мульти-репост',
					onChange : function(el) {
						vkhelper.plugins.multiRepost.vk_script.functions.click(el);
					}
				}
			);
			
		},
		
		off : function () {
		
			vkhelper.plugins.postMenu.vk_script.functions.postMenuItemsRemove('multiRepost');
		}
	
	},
	
	bg_script : {
	
		messages : {
		
			'vkhelper_multiRepost_task' : function (details, tab_id, callback) {

				if (details.del && details.postpone) {
				
					VKH.api('multiRepost.create', details, function (response) {
						
						if (response.status != 'success') {
							messages.sendToVk({
								type : 'control_fastMessage_view',
								details : {
									status : 'error',
									text : 'Не удалось создать облачное задание для Мульти-Репоста'
								}
							});
							return;
						}
						
						messages.sendToVk({
							type : 'control_fastMessage_view',
							details : {
								status : 'success',
								text : 'Облачное задание для Мульти-Репоста успешно создано'
							}
						});
							
					});
					return;
				}
				
				task.add('last', {
					initiator : 'multiRepost.bg.msg.vkhelper_multiRepost_task',
					title : '<b>Мульти-репост</b> записи <a href="https://vk.com/wall'+details.post_id +'" target="_blank">wall'+details.post_id +'</a>',
					isVisible : true,
					maxCount  : details.users.length + details.groups.length,
					onFinished : function (task_id, details) {
						messages.sendToVk({
							type : 'control_fastMessage_view',
							details : {
								status : 'success',
								text : 'Совершенно репостов: '+ (details.log_success || []).length +' из '+ details.maxCount
							}
						});
					}
				}, function(task_id, task_callback) {
				
					var VKH_autodel_taskId = -1;
					
					function go() {
						
						if (details.users.length) {
						
							var uid = details.users.shift();
							
							VK.api('wall.repost', {
								object  : 'wall'+ details.post_id,
								message : details.text || ''
							}, {
								uid : uid,
								task_id : task_id,
								errors : [15]
							}, function(response) {
								
								if (response.status != 'success') {
								
									if (response.details.error) {
								
										if (response.details.error == "error_api_catch") {
									
											if (response.details.data.error_code == 15) {
												task.update(task_id, {
													nowCountAdd : 1,
													addErrors : {
														uid : uid,
														error : 'no_access',
														data : response.details.data
													}
												});
												go();
												return false;
											}
										
										}
										
										task.update(task_id, {
											nowCountAdd : 1,
											addErrors : {
												uid : uid,
												error : response.details.error,
												data : response.details
											}
										});
										go();
										return false;
									
									}
									
									
									task.update(task_id, {
										nowCountAdd : 1,
										addErrors : {
											uid : uid,
											error : 'unkniwn_error',
											data : response.details
										}
									});
									go();
									return false;
								}
								
								
								if (!response.details.success) {
									task.update(task_id, {
										nowCountAdd : 1,
										addErrors : {
											uid : uid,
											error : 'unkniwn_error',
											data : response.details
										}
									});
									go();
									return false;
								}
								
								
								if (VKH_autodel_taskId != -1) {
								
									VKH.api('multiRepost.autodel', {
										task_id : VKH_autodel_taskId,
										uid : uid,
										post_id : response.details.post_id
									}, function (response) {
									
										if (response.status != 'success') {
											task.update(task_id, {
												nowCountAdd : 1,
												addSuccess : {
													uid : uid,
													post_id : response.details.post_id,
													text : 'Репост совершен, но из-за проблем с сервером VK Helper, автоудаление не будет выполнено.',
													vkh_error : true
												}
											});
											go();
											return false;	
										}
										
										task.update(task_id, {
											nowCountAdd : 1,
											addSuccess : {
												uid : uid,
												post_id : response.details.post_id
											}
										});
										go();
										
									});
									
								} 
								else {
									task.update(task_id, {
										nowCountAdd : 1,
										addSuccess : {
											uid : uid,
											post_id : response.details.post_id
										}
									});
									go();
								}
								return false;
							});
							
							return false;
						
						}
						else if (details.groups.length) {
							
							var u = details.groups.shift();
							
							VK.api('wall.repost', {
								group_id : u,
								object   : 'wall'+ details.post_id,
								message  : details.text || '',
								mark_as_ads : details.ads ? 1 : 0
							}, {
								uid : details.uid,
								task_id : task_id,
								errors : [15]
							}, function(response) {
						
								if (response.status != 'success') {
								
									if (response.details.error) {
								
										if (response.details.error == "error_api_catch") {
									
											if (response.details.data.error_code == 15) {
												task.update(task_id, {
													nowCountAdd : 1,
													addErrors : {
														uid : details.uid,
														gid : u,
														error : 'no_access',
														data : response.details.data
													}
												});
												go();
												return false;
											}
										
										}
									
										task.update(task_id, {
											nowCountAdd : 1,
											addErrors : {
												uid : details.uid,
												gid : u,
												error : response.details.error,
												data : response.details
											}
										});
										go();
										return false;
									}
								
									task.update(task_id, {
										nowCountAdd : 1,
										addErrors : {
											uid : details.uid,
											gid : u,
											error : 'unkniwn_error',
											data : response.details
										}
									});
									go();
									return false;
								}
							
								if (!response.details.success) {
									task.update(task_id, {
										nowCountAdd : 1,
										addErrors : {
											uid : details.uid,
											gid : u,
											error : 'unkniwn_error',
											data : response.details
										}
									});
									go();
									return false;
								}
								
								task.update(task_id, {
									nowCountAdd : 1,
									addSuccess : {
										uid : details.uid,
										gid : u,
										post_id : response.details.post_id
									}
								});
								
								go();
								return false;
								
							});
							
							return false;
							
						}
						else {
							task_callback();
							return false;
						}
						
					}
				
				
					if (details.del) {
					
						VKH.api('multiRepost.autodel.create', details, function (response) {
							
							if (response.status != 'success') {
								task.update(task_id, {
									nowCountAdd : 'max',
									addErrors : {text:'Параметр <b>Автоудаление</b> временно недоступен, попробуйте выполнить действие немного позже, или отключите этот параметр.'}
								});
								task_callback();
								return false;
							}
							
							VKH_autodel_taskId = response.task_id;
							
							go();
						
						});
						
					}
					else {
						go();
					}

				});
				
			}
		
		}
	}

};	

vkhelper_plugins_list['messageTemplates'] = {
	
	lang : {
		ru : {
			cat : 'Для быстрой работы',
			title : 'Шаблоны сообщений',
			description : 'Функция позволяет создать шаблоны сообщений, записей и комментариев. Вы сможете отправлять шаблон в 1 клик.<br><br><img src="https://vk-helper.pro/image/options/messageTemplates_1.jpg" width="313" height="94">',
		
			aboutLink : 'http://vk-helper.pro/?p=page/instruction&type=52',
			
			keys : 'шаблоны сообщений шаблон'
		}
	},
	
	storage : {	
		enabled : true,
		tpls : [
			JSON.parse('{"type":"message","demo":"true","title":"Демо-шаблон","keys":[],"icon_check":true,"icon":"moon","color":"red","text":"{date}","attachs":[["video","-57876954_456245001",{"thumb":"https://pp.userapi.com/c626521/v626521954/1bb86/gBmYqvRbBGw.jpg","list_id":"979d3a20dc256d34b1","editable":{"sizes":{"s":["https://pp.userapi.com/c626521/v626521954/1bb86/gBmYqvRbBGw.jpg",130,98],"m":["https://pp.userapi.com/c626521/v626521954/1bb85/7sC7NCikH-k.jpg",160,120],"l":["https://pp.userapi.com/c626521/v626521954/1bb84/YKwgkqamiFU.jpg",320,240],"y":["https://pp.userapi.com/c626521/v626521954/1bb83/pYbqsKD5OtA.jpg",640,480],"x":["https://pp.userapi.com/c626521/v626521954/1bb83/pYbqsKD5OtA.jpg",800,450]},"duration":"0:18","platform":"","play_icon":1,"active_live":0,"ratio":1.777778,"name":"Женская логика"},"from_ext_page":0},0],["audio","376233539_456239042",[456239042,376233539,"","Ты Амфетамин (2016) -------------------------------------&gt;Fraktal, Песня про любовь красивая музыка грустная мама оскар фатталов девочка лирика лучшее топ хит новинка 2016 реп рэп сердце сопли алкоголь никотин амфетамин секс наркотики поет читает мальч","AkinAi ft. Оскар Фатталов",238,0,0,"",65465480,83,"attach_preview","[]","27b7ba4fd8ce1c18be/ac883de536b49ff1bd/f274fd420f5da0e70a/7472bd434c202d3866/","https://sun9-3.userapi.com/c840722/v840722912/4ba2f/ndcQmjyx3Nk.jpg,https://sun9-3.userapi.com/c840722/v840722912/4ba2d/94LCGyJcwWg.jpg",11],null],["map","14.527852637007152_20.039062499999996_4",[14.527852637007152,20.039062499999996,"ru",4],null]],"attachs_count":{"video":1,"audio":1,"map":1}}'),
			JSON.parse('{"type":"comment","demo":"true","title":"Пример шаблона комментариев","text":"Это Демо-шаблон комментария без вложений, созданный через расширение VK Helper&nbsp;<br><br>Вы можете создавать свои шаблоны комментариев и отвечать на однотипные вопросы станет намного проще!","icon_check":true,"uniq_text":false,"color":"gray","icon":"location-arrow","keys":[],"attachs":[],"attachs_count":{}}'),
			JSON.parse('{"type":"post","demo":"true","title":"Тестовое название шаблона","text":"Это Демо-шаблон записи на стену без вложений, созданный через расширение VK Helper <br><br>Вы можете создавать свои шаблоны записей и публиковать однотипные записи станет намного проще!","icon_check":true,"uniq_text":true,"color":"green","icon":"bomb","keys":[],"attachs":[],"attachs_count":{}}'),
			JSON.parse('{"type":"message","demo":"true","title":"Ознакомительный шаблон","text":"Это Демо-шаблон личного сообщения с вложением карты, созданный через расширение VK Helper <br><br>Вы можете создавать свои шаблоны сообщений и отвечать на однотипные вопросы станет намного проще!<br><br>К шаблону вы можете приложить любые вложения.<br><br>","icon_check":true,"uniq_text":false,"color":"blue","icon":"bell","keys":[],"attachs":[["map","55.75426648199378_37.621522312212015_4",[55.75426648199378,37.621522312212015,"ru",4],null]],"attachs_count":{"map":1}}')
		]
	},
	
	css : function () {
	/*
#messageTemplates_boxSetting_editable {
	background: #fff;
    color: #000;
    border: 1px solid #c0cad5;
    min-height: 60px;
    padding: 5px 30px 5px 5px;
    vertical-align: top;
    margin: 0;
    overflow: auto;
    outline: 0;
    line-height: 150%;
    word-wrap: break-word;
    cursor: text;
}

#messageTemplates_boxSetting h4.subheader {
	margin-bottom: 3px;
}

.messageTemplates_media.media_selector,
.messageTemplates_media.media_selector .ms_item:before,
.messageTemplates_media.media_selector .ms_item:hover:before {
	opacity: .5;
}


#messageTemplates_tpls_block_messages {
    position: absolute;
    top: -14px;
    left: 15px;
    z-index: 99;
}

#messageTemplates_tpls_block_messages > span.item {
	background: #fafbfc;
	border: 1px solid #c5d0db;
	border-radius: 10px;
	padding: 2px 4px;
	font-size: 11px;
    margin-left: 5px;
    cursor: pointer;
}



#submit_post {
	position: relative;
}
#messageTemplates_tpls_block_post {
    position: absolute;
    top: -9px;
    left: 15px;
    z-index: 99;
}
#messageTemplates_tpls_block_post > span.item {
	background: #fafbfc;
	border: 1px solid #c5d0db;
	border-radius: 10px;
	padding: 2px 4px;
	font-size: 11px;
    margin-left: 5px;
    cursor: pointer;
}


.submit_post {
	position: relative;
}
.messageTemplates_tpls_block_comment {
    position: absolute;
    top: -9px;
    left: 15px;
    z-index: 99;
}
.messageTemplates_tpls_block_comment > span.item {
	background: #fafbfc;
	border: 1px solid #c5d0db;
	border-radius: 10px;
	padding: 2px 4px;
	font-size: 11px;
    margin-left: 5px;
    cursor: pointer;
}


.messageTemplates_tolltip {
}

#public_tpls_list .sort_helper {
    border-bottom: none !important;
}


#public_tpls_list .group_l_row.sort_taken .messageTemplates_media.media_selector {
    right: 60px;
}

.messageTemplates_info_tpls {

}

.messageTemplates_media.media_selector.media_selector {
	position: absolute; 
	right: 0px;
	top: 3px;
}
div.tt_text .messageTemplates_media.media_selector {
	top: -2px;
}
#public_tpls_list .messageTemplates_media.media_selector.media_selector {
	top: 14px;
    right: 45px;
}





#messageTemplates_tpls_block_messages_helping {
	display: none;
    border: 1px solid #d3d9de;
    z-index: 10;
    position: absolute;
    background-color: #fff;
    width: 480px;
}

#messageTemplates_tpls_block_messages_helping > div {
    display: block;
    padding: 9px;
    overflow: hidden;
    white-space: nowrap;
} 

#messageTemplates_tpls_block_messages_helping > div.active {
    background-color: #e7edf2;
}    

#messageTemplates_tpls_block_messages_helping .messageTemplates_media.media_selector.media_selector {
	top: -3px;
}


#messageTemplates_tpls_block_messages_helping.show + #messageTemplates_tpls_block_messages > span.item:not(:hover) {
	opacity: .5;
}


html:not(.vkhelper_plugin_messageTemplates) #messageTemplates_tpls_block_messages,
html:not(.vkhelper_plugin_messageTemplates) #messageTemplates_tpls_block_messages_helping,
html:not(.vkhelper_plugin_messageTemplates) #messageTemplates_tpls_block_post,
html:not(.vkhelper_plugin_messageTemplates) .messageTemplates_tpls_block_comment {
	display: none;
}
	*/
	},

	vk_script : {
		
		params : {

			init : false,
			
			box : {
				hide : function() {
				}
			},

			caretPosition : false,

			medias : [],
		
			type : 'message',
			
			selector_type  : false,
			selector_key   : false,
			selector_icon  : false,
			selector_color : false,
			
			media_select : false,
			
			types : [
				['message' , 'Сообщения'       ],
				['post'    , 'Записи на стену' ],
				['comment' , 'Комментарии'     ]
			],
			
			colors : [
				['red'   , '<span style="color:red">Красный</span>'   ],
				['blue'  , '<span style="color:blue">Синий</span>'    ],
				['green' , '<span style="color:green">Зеленый</span>' ],
				['gray'  , '<span style="color:gray">Серый</span>'    ]
			],
			
			icons : [
				['moon', '<i class="fas fa-moon"></i> Луна'],
				['user', '<i class="fas fa-user"></i> Пользователь'],
				['bell', '<i class="fas fa-bell"></i> Колокольчик'],
				['bomb', '<i class="fas fa-bomb"></i> Бомба'],
				['camera', '<i class="fas fa-camera"></i> Камера'],
				['cloud', '<i class="fas fa-cloud"></i> Облако'],
				['envelope', '<i class="fas fa-envelope"></i> Письмо'],
				['eye', '<i class="fas fa-eye"></i> Глаз'],
				['heart', '<i class="fas fa-heart"></i> Сердце'],
				['lightbulb', '<i class="fas fa-lightbulb"></i> Лампочка'],
				['lock', '<i class="fas fa-lock"></i> Замок'],
				['location-arrow', '<i class="fas fa-location-arrow"></i> Геопозиция'],
				['star', '<i class="fas fa-star"></i> Звезда'],
				['trash', '<i class="fas fa-trash"></i> Корзина']
			],
			
			tags : [
				  ['firstname' , 'Имя'     ]
				, ['lastname'  , 'Фамилия' ]
				, ['time'      , 'Время'   ]
				, ['date'      , 'Дата'    ]
				//, ['focus'     , 'Курсор'  ]
			]
			
		},
		
		on : function () {
			
			if (vkhelper.plugins.messageTemplates.vk_script.params.init == false) {
			
				vkhelper.plugins.messageTemplates.vk_script.params.init = true;
				
				jQuery(document).on('mouseover', '#messageTemplates_tpls_block_messages_helping > div', function() {
					jQuery('#messageTemplates_tpls_block_messages_helping > div').removeClass('active');
					jQuery(this).addClass('active');
				});
				
				jQuery(document).on('click', '#messageTemplates_tpls_block_messages_helping > div', function() {
				
					var tpls_id = jQuery(this).data('tpls_id');
					
					vkhelper.plugins.messageTemplates.vk_script.functions.pastTpls('#content div.im-chat-input--txt-wrap._im_text_wrap div.im_editable[contenteditable=true]', tpls_id);
					vkhelper.plugins.messageTemplates.vk_script.functions.helper.hide();
				});
			
				jQuery(document).mouseup(function (e) {
    				var container = $("#messageTemplates_tpls_block_messages_helping");
    				if (container.has(e.target).length === 0){
    				    vkhelper.plugins.messageTemplates.vk_script.functions.helper.hide();
    				}
				});

				var fr = debounce(vkhelper.plugins.messageTemplates.vk_script.functions.helper.search, 50);
			
				jQuery(document).on('keyup', 'div.im-page div.im-page--history div.im-page--chat-input div.im-chat-input--textarea div.im_editable', function(event) {
			
					var hp = jQuery('#messageTemplates_tpls_block_messages_helping.show');
					
					if (hp.length) {
						
						if (event.which == 38) {
							var q = hp.find('div.active[data-tpls_id]').removeClass('active');
							if (q.prev('div').length) {
								q.prev('div').addClass('active');
							} else {
								hp.find('div:last-child').addClass('active');
							}
							event.stopPropagation();
							return false;
						}
						else if (event.which == 40) {
							var q = hp.find('div.active[data-tpls_id]').removeClass('active');
							if (q.next('div').length) {
								q.next('div').addClass('active');
							} else {
								hp.find('div:first-child').addClass('active');
							}
							event.stopPropagation();
							return false;
						}
						else if (event.which == 37 || event.which == 39) {
							
							var tpls_id = hp.find('div.active[data-tpls_id]').data('tpls_id');

							vkhelper.plugins.messageTemplates.vk_script.functions.pastTpls('#content div.im-chat-input--txt-wrap._im_text_wrap div.im_editable[contenteditable=true]', tpls_id);
							vkhelper.plugins.messageTemplates.vk_script.functions.helper.hide();
							
							event.stopPropagation();
							return false;
						}
						
					}
					
					fr(jQuery(this).text());
					
				});
				
				jQuery(document).on('keydown', 'div.im-page div.im-page--history div.im-page--chat-input div.im-chat-input--textarea div.im_editable', function(event) {
			
					if (jQuery('#messageTemplates_tpls_block_messages_helping.show').length && jQuery.inArray(event.which, [37,38,39,40]) != -1) {
						
						event.stopPropagation();
						return false;
					}
					
				});
				
			}
				
				
			vkhelper.plugins.postMenu.vk_script.functions.postMenuItemsAdd(
				'messageTemplates', {
					html : 'Сохранить как шаблон',
					onChange : function(el) {
						vkhelper.plugins.messageTemplates.vk_script.functions.copy.click(el);
					}
				}
			);
				
			vkhelper.mutationObserver.add('messageTemplates', function() {
	
				if (VKH_debug.mutationObserver) {
					console.log('mutationObserver FUNC messageTemplates');
				}
					
				jQuery('#content div.im-page div.im-page--history div.im-page--chat-input div.im-chat-input--textarea:not([messageTemplates])').each(function() {
				  	
				  	var $this = jQuery(this).attr('messageTemplates', '1');
				  		
				  	$this.append('\
				  		<div id="messageTemplates_tpls_block_messages_helping"></div>\
				  		<div id="messageTemplates_tpls_block_messages"></div>\
				  	');
					
					vkhelper.plugins.messageTemplates.vk_script.functions.blockTpls.update('message');
					
				});
				
				jQuery('#content li.im-mess > div.im-mess--text:not([messageTemplates])').each(function() {
				  	
				  	var $this = jQuery(this).attr('messageTemplates', '1');
				  	
					var keys = {};
					jQuery.each(vkhelper.plugins.messageTemplates.storage.tpls, function(k,v) {
						
						if (v.type != 'message' || !v.keys.length) {
							return;
						}
						
						jQuery.each(v.keys, function(k2,v2) {
							keys[v2[1]] = k;
						});
					});
					
					if (!Object.keys(keys).length) {
						return;
					}
					
					$this.contents().filter(function() {
    					return this.nodeType === 3;
  					}).replaceWith(function() {
  					
  						var text = escapeHtml(this.nodeValue);
  					
  						jQuery.each(keys, function(k,v) {
							text = text.replace(new RegExp('('+ k +')', 'gi'), '<a href="#" onclick="vkhelper.plugins.messageTemplates.vk_script.functions.fastClick('+ v +'); return false;" style="color: red">$1</a>');
						});
						
      					return text;
  					});
  
				});
				
				jQuery('#media_preview:not([messageTemplates])').each(function() {
				  	
				  	var $this = jQuery(this).attr('messageTemplates', '1');
				  		
				  	$this.before('<div id="messageTemplates_tpls_block_post"></div>');
					
					vkhelper.plugins.messageTemplates.vk_script.functions.blockTpls.update('post');
					
				});
				
				jQuery('div.reply_form > div.submit_post.clear_fix:not([messageTemplates])').each(function() {
				  	
				  	var $this = jQuery(this).attr('messageTemplates', '1');
				  		
				  	$this.append('<div class="messageTemplates_tpls_block_comment"></div>');
					
					vkhelper.plugins.messageTemplates.vk_script.functions.blockTpls.update('comment');
					
				});
				
			}); 
			
		},
		
		off : function () {
		
			vkhelper.mutationObserver.remove('messageTemplates');
			
			vkhelper.plugins.postMenu.vk_script.functions.postMenuItemsRemove('messageTemplates');
		},
		
		functions : {
		
			getCaretPosition : function (editableDiv) {
				var caretPos = 0,
 			       sel, range;
 			   if (window.getSelection) {
 			   		sel = window.getSelection();
  			       if (sel.rangeCount) {
  			           range = sel.getRangeAt(0);
  			           if (range.commonAncestorContainer.parentNode == editableDiv || (range.commonAncestorContainer.parentNode && range.commonAncestorContainer.parentNode.parentNode == editableDiv)) {
 			                caretPos = {
 			                    node: range.commonAncestorContainer,
 			                    offset: range.endOffset
 			                }
 			            } else {
 			                caretPos = -1;
 			            }
 			        }
 			    }
 			    return caretPos;
 			},
			
			appendMenuTo : function (el, items, opts) {

				opts = opts || {};
			
    			var els = el.length ? el : [el];
    			
				els.forEach(function (_els) {
				
					var box = document.createElement('div');
						box.classList.add('tt_w');
						box.classList.add('tt_default');
						box.classList.add('tt_down');
						box.style.position = 'absolute';
						box.style.opacity = 'absolute';
						box.style.top = '-124px';
						box.style.display = 'none';
					
					if (opts.width) {
						box.style.width = (opts.width + 30) +'px';
					}
					if (opts.left) {
						box.style.left = opts.left +'px';
					}
    			
					var wrapped = document.createElement('div');
						wrapped.classList.add('wrapped');
					
					var list = document.createElement('div');
					
    				var menu = {
    					setItems: function (items) {
    						list.innerHTML = '';
    						items.forEach(function (item) {
                				var node = document.createElement('a');
                					node.classList.add('ui_actions_menu_item');
                					node.classList.add('_im_settings_action');
                					node.onclick = function () {
                						box.style.display = 'none';
                						if (opts.onChange) {
                	    					opts.onChange(item[0])
                	    				}
                					};
                					node.innerHTML = item[1];
                					list.appendChild(node)
            				});
        				}
    				};

    				menu.setItems(items);
    				wrapped.appendChild(list);
    			
    				box.appendChild(wrapped);
    			
    				
    				var oldBox = _els.querySelector('.tt_w');
    				if (oldBox) {
        				oldBox.removeChild(oldBox);
    				}
    					
    				_els.appendChild(box);
    				_els.onmouseover = function () {
    				    box.style.opacity = 1;
    				    box.style.display = '';
    				    box.style.top = (( (wrapped.clientHeight+8) * -1) + (opts.offsetTop || 0)) + 'px';
    				    clearTimeout(box.ttt);
    				};
    				_els.onmouseout = function () {
    				    clearTimeout(box.ttt);
    				    box.ttt = setTimeout( function () {
    				        box.style.display = 'none';
     				   }, 200 )
    				};

				});		
					
			},

			insertTpl : function (area, tpl, isFocused) {
		
				var lastCaretPosition = vkhelper.plugins.messageTemplates.vk_script.params.caretPosition;
			
				function insertTpl(area, tpl, lastCaretPosition) {
				    if (area) {
				        var startNode = false, insert = {};
				        if (!lastCaretPosition || !lastCaretPosition.node) {
				            var node = getLastTextNode(area);
				            if (node) {
				                startNode = node;
				            } else {
				                startNode = area;
				            }
				        } else {
				            if (lastCaretPosition.node.nodeName != '#text') {
				                if (hasTextNodes(lastCaretPosition.node)) {
				                    startNode = getLastTextNode(lastCaretPosition.node);
				                } else {
				                    while(lastCaretPosition.node.firstChild) {
				                        lastCaretPosition.node.removeChild( lastCaretPosition.node.firstChild )
				                    }
				                    startNode = lastCaretPosition.node;
				                }
				            } else {
				                startNode = lastCaretPosition.node;
				            }

				        }
				        insert = createTplForNode(tpl);
				        //console.log(startNode);
				        if (insert) {
				            if (startNode == area) {
				                for (var i = 0; i < insert.nodes.length; i++) {
				                    if (i == 0) {
				                        startNode.appendChild(insert.nodes[i]);
				                    } else {
				                        if (insert.nodes[i].nodeName == '#text') {
				                            var d = document.createElement('div');
				                            d.appendChild(insert.nodes[i]);
				                            insert.nodes[i] = d;
				                        }
				                        startNode.appendChild(insert.nodes[i]);
				                    }
				                }
				            } else {
				                var lastNode;
				                for (var j = 0; j < insert.nodes.length; j++) {
				                    var currentNode = insert.nodes[j];
				                    if (j == 0) {
				                        if (startNode.nodeName != '#text') {
				                            startNode.appendChild(currentNode);
				                        } else {
				                            var tmp = startNode.textContent;
				                            var o = false;
				                            if (lastCaretPosition && typeof lastCaretPosition.offset != 'undefined') {
				                                o = lastCaretPosition.offset;
				                                if (o == tmp.length) {
				                                    o = false;
				                                }
				                            }
				                            if (o !== false && o !== 0) {
				                                o = parseInt(o);
				                                var x1 = tmp.substr(0,o);
				                                var x2 = tmp.substr(o);
				                                if (!x1 || x1[x1.length - 1] != ' ' || x1[x1.length - 1] != ' ') {
				                                    x1 += ' ';
				                                    startNode.nodeValue = x1;
				                                }
				                                var x2node = document.createTextNode(x2);
				                                insertAfter(x2node, startNode);
				                                insertAfter(currentNode, startNode);
				                            } else {
				                                if (o === false) {
				                                    if (!tmp || tmp[tmp.length - 1] != ' ') {
				                                        tmp += ' ';
				                                        startNode.nodeValue = tmp;
				                                    }
				                                    insertAfter(currentNode, startNode);
				                                } else {
				                                    startNode.parentNode.insertBefore( currentNode, startNode );
				                                }
				                            }
				                        }
				                        lastNode = currentNode;
				                    } else if ( j != insert.nodes.length - 1 ) {
				                        if (typeof lastNode != 'undefined') {
				                            insertAfter(currentNode, lastNode);
				                        }
				                        lastNode = currentNode;
				                    } else {
				                        if (typeof lastNode != 'undefined') {
				                            if (insert.nodes.length == 2) {
				                                if (currentNode.nodeName == '#text') {
				                                    var d = document.createElement('div');
				                                    d.appendChild(currentNode);
				                                    insertAfter(d, lastNode);
				                                }
				                            } else {
				                                insertAfter(currentNode, lastNode);
				                            }
				                        }
				                        if (currentNode.nextSibling) {
				                            var endNode = currentNode.nextSibling;
				                            if (endNode.nodeName == '#text') {
				                                var str = endNode.textContent;
				                                if (str[0] != ' ' && str[0] != ' ') {
				                                    endNode.textContent = ' ' + str;
				                                }
				                            }
				                        }
				                    }
				                    //startNode.appendChild(insert.nodes[j]);
				                }
				            }
				            if (insert.focus.node) {
				                setFocusToNode(insert.focus.node, insert.focus.offset);
				            }
				            var evt = document.createEvent("KeyboardEvent");
				            evt.initEvent("keyup", true, true, window,
				                0, 0, 0, 0,
				                37, 37);
				            area.dispatchEvent(evt);
				            var evt2 = document.createEvent("KeyboardEvent");
				            evt2.initEvent("keyup", true, true, window,
				                0, 0, 0, 0,
				                39, 39);
				            area.dispatchEvent(evt2);
				        }
				    }
				}

				function getLastTextNode(node) {
				    if (hasTextNodes(node)) {
				        for (var i = node.childNodes.length - 1; i >= 0; i++) {
				            var n = node.childNodes[i];
				            if (n.nodeName == '#text') {
				                return n;
				            }
				            if (n.hasChildNodes() && hasTextNodes(n)) {
				                return getLastTextNode(n);
				            }
				        }
				        return false;
				    } else {
				        while(node.firstChild) {
				            node.removeChild(node.firstChild);
				        }
				    }
				    return false;
				}

				function createTplForNode(tpl) {
				    if (tpl) {
				        tpl = tpl.split("\n");
				        var nodes = [];
				        var focus = false;
				        for (var i = 0; i < tpl.length; i++) {
				            var n;
				            var t = tpl[i];
				            var isFocusNode = false, offset = 0;
				            if (t.indexOf('{focus}') != -1 && isFocused == true) {
				                offset = t.indexOf('{focus}');
				                isFocusNode = true;
				                t = t.replace(/\{focus\}/g, '');
				                t = t.replace(/  /g, " \u00a0");
				            }
				            if (i == 0 || i == tpl.length - 1) {
				                n = document.createTextNode(t);
				            } else {
				                n = document.createElement('div');
				                if (t.trim() == '') {
				                    t = '<br>';
				                }
				                n.innerHTML = t;
				            }
				            if (isFocusNode) {
				                focus = {'node': n, 'offset': offset};
				            }
				            nodes.push(n);
				        }
				        if (!focus) {
				            var node = nodes[nodes.length - 1];
				            var pos = ( node.textContent || node.innerText );
				            if (pos) {
				                pos = pos.length;
				            } else {
				                pos = 0;
				            }
				            focus = {
				                'node': node,
				                'offset': pos
				            }
				        }
				        return {'nodes': nodes, 'focus': focus};
				    }
				}

				function setFocusToNode(node, offset) {
				    var l = node.textContent || node.innerHTML;
				    if (l) {
				        if (l != '<br>') {
				            l = l.length;
				        } else {
				            l = 0;
				        }
				    } else {
				        l = 0;
				    }
				    if (typeof offset != 'undefined') {
				        l = offset;
				    }
				    var _range = document.createRange();
				    var _sel = window.getSelection();
				    if (_sel.focusNode) {
				        try {
				            _range.setStart(node, l);
				        } catch (e) {
				        }
				    }
				    _range.collapse(true);
				    _sel.removeAllRanges();
				    _sel.addRange(_range);
				    while ( ( !node.classList || !node.classList.contains('im_editable') ) && node.parentNode) {
				        node = node.parentNode;
				    }
				    if (node.focus) {
				        node.focus();
				    }
				}

				function insertAfter(elem, refElem) {
				    return refElem.parentNode.insertBefore(elem, refElem.nextSibling);
				}

				function hasTextNodes(node) {
				    for (var i = 0; i < node.childNodes.length; i++) {
				        var n = node.childNodes[i];
				        if (n.nodeName == '#text') {
				            return true;
				        }
				        if (n.hasChildNodes()) {
				            return hasTextNodes(n);
				        }
				    }
				    return false;
				}

				insertTpl(area, tpl, lastCaretPosition);
				
			},
			
			
			fastClick : function (tpls_id) {
			
				vkhelper.plugins.messageTemplates.vk_script.functions.pastTpls('#content div.im-chat-input--txt-wrap._im_text_wrap div.im_editable[contenteditable=true]', tpls_id);
			},
			
			blockTpls : {
			
				genTpls : function (tpls_id, opts) {
					
					opts = opts || {};
					
					var t = vkhelper.plugins.messageTemplates.storage.tpls[tpls_id];
					
					if (!t) {
						return '';
					}
					
					var mds = '';
					if (Object.keys(t.attachs_count).length) {
						mds += '<div class="messageTemplates_media media_selector">';
						jQuery.each(t.attachs_count, function(k2,v2) {
							mds += '<span class="ms_item ms_item_'+ k2 +'"></span>';
						});
						mds += '</div>';
					}
					
					var len = opts.len || 30;
					
					var text = jQuery("<div>").text(t.title).html();
					if (text.length > len) { text = text.substr(0,len-3) + '...'; }
					
					
					if (opts.bold) {
						text = '<b>' + text.substr(0,opts.bold) +'</b>' + text.substr(opts.bold);
					}
					
					
					return '<div style="'+ (opts.width ? 'width: '+ opts.width +'px; ' : '') +'position: relative;" class="messageTemplates_info_tpls">'+ text + mds +'</div>';
					
				},
					
				update : function (type) {
				
					if (!type) {
						type = vkhelper.plugins.messageTemplates.vk_script.params.type;
					}
					
					if (type == 'message') {
					
						var main_block_tpls = '#messageTemplates_tpls_block_messages',
							textarea_tpls   = '#content div.im-chat-input--txt-wrap._im_text_wrap div.im_editable[contenteditable=true]';
					} 
					else if (type == 'post') {
					
						var main_block_tpls = '#messageTemplates_tpls_block_post',
							textarea_tpls   = '#post_field';
					}
					else if (type == 'comment') {
					
						var main_block_tpls = '.messageTemplates_tpls_block_comment',
							textarea_tpls   = undefined;
					}
					
					var el = jQuery(main_block_tpls);
						
					if (!el.length) {
						return;
					}
						
					var arr_icon = [], 
						arr_tool = [];
						
					var arr = !vkhelper.plugins.vkh.vk_script.vkh.isActive 
								? vkhelper.plugins.messageTemplates.storage.tpls.slice(0,10) 
								: vkhelper.plugins.messageTemplates.storage.tpls;

					jQuery.each(arr, function(k,v) {
						
						if (v.type != type) {
							return;
						}
							
						if (v.icon_check == true) {
							arr_icon.push('<span \
									class="item" \
									data-tpls="'+ k +'" \
									style="color:'+ v.color +'" \
									onmouseover="vkhelper.plugins.messageTemplates.vk_script.functions.blockTpls.mouseover(this)"\
									onclick="vkhelper.plugins.messageTemplates.vk_script.functions.pastTpls('+ (textarea_tpls ? '\''+ textarea_tpls + '\'' : 'event') +', '+ k +')"\
								><i class="fas fa-'+ v.icon +'"></i></span>');
						} 
						else {
							arr_tool.push([
								k, vkhelper.plugins.messageTemplates.vk_script.functions.blockTpls.genTpls(k)
							]);
						}
							
					});
						
						
					var res = '';
						
					if (arr_tool.length) {
						res += '<span class="item" data-filter="'+ type +'" data-type="list"><i class="fas fa-bars"></i></span>';
					}
						
					res += arr_icon.join('');
						
					res += '<span class="item" data-type="setting" onmouseover="vkhelper.plugins.messageTemplates.vk_script.functions.blockTpls.mouseover(this)" onclick="vkhelper.plugins.messageTemplates.vk_script.functions.boxTpls.open(\''+ type +'\')"><i class="fas fa-wrench"></i></span>';
						
					el.html(res);
						
						
					if (arr_tool.length) {
						
						vkhelper.plugins.messageTemplates.vk_script.functions.appendMenuTo(
							document.querySelectorAll('span.item[data-filter="'+ type +'"][data-type="list"]'), 
							arr_tool, {
								width: 350,
								left: -16,
								offsetTop: -6,
								onChange: function(k){
									vkhelper.plugins.messageTemplates.vk_script.functions.pastTpls(textarea_tpls || event, k);
								}
							}
						);
			
					}
					
				},
					
				mouseover : function (el) {
					
					var $this = jQuery(el);
						
					var text = '';
						
					if ($this.data('type')) {
						return;
						text = '<div style="width:150px">Управление шаблонами</div>';
					} 
					else if ($this.attr('data-tpls')) {
					
						text = vkhelper.plugins.messageTemplates.vk_script.functions.blockTpls.genTpls(
							$this.data('tpls'), {
								width : 350
							}
						);
					}
						
					showTooltip(el, {
						text  : text, 
						dir   : 'auto',
						shift : [22, 10], 
						slide : 15, 
						className : 'messageTemplates_tolltip'
					});
						
				}
				
			},
			
			pastTpls : function (se, tpls_id) {
			
				if (!vkhelper.plugins.messageTemplates.storage.tpls[tpls_id]) {
					return;
				}
				
				var msgText = vkhelper.plugins.messageTemplates.storage.tpls[tpls_id].text || '';
				
				if (vkhelper.plugins.messageTemplates.storage.tpls[tpls_id].uniq_text) {
					msgText = vkhelper.plugins.funcs.list.uniqText(msgText);
					console.log('uniq text');
				}
				
				function markTpl (text) {
					
					var d = new Date();
					
					function fd(a) {
						return a < 10 ? '0' + String(a) : a;
					}
					
					var name = jQuery('a.im-page--title-main-inner._im_page_peer_name').text().split(' ');
					
					text = text
						.replace(/\{firstname\}/g , name[0] || '')
						.replace(/\{lastname\}/g  , name[1] || '')
						.replace(/\{time\}/g      , fd(d.getHours()) +':'+ fd(d.getMinutes()))
						.replace(/\{date\}/g      , fd(d.getDate()) +'.'+ fd(d.getMonth()+1) +'.'+ d.getFullYear());
						
					return text;
				}
				
				if (vkhelper.plugins.messageTemplates.storage.tpls[tpls_id].type == 'message') {
				
					jQuery(se).prevAll('div._im_media_selector').find('div.media_selector').click();
					
					cur.lastAddMedia.unchooseMedia();
					
					if (Object.keys(vkhelper.plugins.messageTemplates.storage.tpls[tpls_id].attachs).length && !vkhelper.plugins.vkh.vk_script.vkh.isActive && !vkhelper.plugins.messageTemplates.storage.tpls[tpls_id].demo) {
						vkhelper.plugins.control.vk_script.functions.fastMessage('error', 'Вложения доступны в <a href="https://vk-helper.pro/buy" target="_blank">платной версии</a> расширения VK Helper');
					} 
					else {
						jQuery.each(vkhelper.plugins.messageTemplates.storage.tpls[tpls_id].attachs, function(k,v) {
							cur.chooseMedia.apply(null, v);
						});	
					}
					
					jQuery(se).html(markTpl(msgText));
					Emoji.focus(jQuery(se).attr('id'));
					return;
					
					jQuery(se).html('');
					
					vkhelper.plugins.messageTemplates.vk_script.functions.insertTpl(
						document.querySelector(se),
						markTpl(msgText || '{focus}'),
						true
					);
					return;
				
				} 
				else if (vkhelper.plugins.messageTemplates.storage.tpls[tpls_id].type == 'post') {
			
					cur.wallAddMedia.unchooseMedia();

					if (Object.keys(vkhelper.plugins.messageTemplates.storage.tpls[tpls_id].attachs).length && !vkhelper.plugins.vkh.vk_script.vkh.isActive && !vkhelper.plugins.messageTemplates.storage.tpls[tpls_id].demo) {
						vkhelper.plugins.control.vk_script.functions.fastMessage('error', 'Вложения доступны в <a href="https://vk-helper.pro/buy" target="_blank">платной версии</a> расширения VK Helper');
					} 
					else {
						jQuery.each(vkhelper.plugins.messageTemplates.storage.tpls[tpls_id].attachs, function(k,v) {
							cur.wallAddMedia.chooseMedia.apply(null, v);
						});	
					}
					
					jQuery(se).html(markTpl(msgText));
					Emoji.focus(jQuery(se).attr('id'));
					return;
					
					
					jQuery(se).html('');
					
					vkhelper.plugins.messageTemplates.vk_script.functions.insertTpl(
						document.querySelector(se),
						markTpl(msgText || '{focus}'),
						true
					);
					return;
				
				} 
				else if (vkhelper.plugins.messageTemplates.storage.tpls[tpls_id].type == 'comment') {
			
					se = jQuery(se.path[0]).closest('div.reply_form');
					
					jQuery(se).find('div.media_selector.clear_fix')[0].click();
					
					cur.lastAddMedia.unchooseMedia();

					if (Object.keys(vkhelper.plugins.messageTemplates.storage.tpls[tpls_id].attachs).length && !vkhelper.plugins.vkh.vk_script.vkh.isActive && !vkhelper.plugins.messageTemplates.storage.tpls[tpls_id].demo) {
						vkhelper.plugins.control.vk_script.functions.fastMessage('error', 'Вложения доступны в <a href="https://vk-helper.pro/buy" target="_blank">платной версии</a> расширения VK Helper');
					} 
					else {
						jQuery.each(vkhelper.plugins.messageTemplates.storage.tpls[tpls_id].attachs, function(k,v) {
							cur.chooseMedia.apply(null, v);
						});	
					}
					
					var textarea = se.find('div[contenteditable="true"]');
					
					
					jQuery(textarea).html(markTpl(msgText));
					Emoji.focus(jQuery(textarea).attr('id'));
					return;
					
					textarea.html(markTpl(msgText || '{focus}'));
					return;
					vkhelper.plugins.messageTemplates.vk_script.functions.insertTpl(
						ge(textarea.attr('id')),
						markTpl(msgText || '{focus}'),
						true
					);
					return;
				
				} 
				
			},
			
			boxTpls : {
			
				contentCreate : function () {
				
					var res = '<div class="summary_tabs clear_fix" style="text-align: center; white-space: nowrap;">';
					
					jQuery.each(vkhelper.plugins.messageTemplates.vk_script.params.types, function(k,v) {
					
						res += '<div class="'+ (vkhelper.plugins.messageTemplates.vk_script.params.type == v[0] ? 'summary_tab_sel' : 'summary_tab') +'" style="display:inline-block;">\
									<a class="summary_tab2" onclick="vkhelper.plugins.messageTemplates.vk_script.params.type = \''+ v[0] +'\'; vkhelper.plugins.messageTemplates.vk_script.functions.boxTpls.open(); return false;">\
										<div class="summary_tab3"><nobr>'+ v[1] +'</nobr></div>\
									</a>\
								</div>';
					
					});
							
					res += '</div>';

					var tpls = {};
					jQuery.each(vkhelper.plugins.messageTemplates.storage.tpls, function(k,v) {
						if (v.type == vkhelper.plugins.messageTemplates.vk_script.params.type) {
							tpls[k] = v;
						}
					});
					
					if (!Object.keys(tpls).length) {
						return res + '<div style="text-align: center; color: #656565; padding: 20px;">Нет шаблонов в данном разделе</div>';
					}
					
					var content = res + '<div style="color: #656565;">';
    				content += '<div id="public_tpls_list" class="group_l_rows" style="box-sizing: border-box; position: relative;">';
    
    				
    				jQuery.each(tpls, function(k,v) {
								
						var mds = '';
						if (Object.keys(v.attachs_count).length) {
							mds += '<div class="messageTemplates_media media_selector" style="margin-left: 24px;">';
							jQuery.each(v.attachs_count, function(k2,v2) {
								mds += '<span class="ms_item ms_item_'+ k2 +'"></span>';
							});
							mds += '</div>';
						}
						
						var icon = '';
						if (v.icon_check == true) {
							icon = '<div style="position: absolute;"><i class="fas fa-'+ v.icon +'" style="opacity: .4; font-size: 14px; color: '+ v.color +';"></i></div>';
						}
						
    					content += '<div class="group_l_row clear_fix js-tpl-item" data-id="' + k + '" id="public_contact_cell' + k + '" style="cursor: move;">\
    							<div class="group_l_actions_wrap" style="margin-top:0px;">\
    								<a class="group_l_delete" onmouseover="showTooltip(this, {text: \'Удалить\', black: 1, shift: [12, 7, 7]})" onclick="vkhelper.plugins.messageTemplates.vk_script.params.box.hide(); vkhelper.plugins.messageTemplates.vk_script.functions.boxTpls.del('+ k +')"></a>&nbsp;\
    								<a class="group_l_edit" onmouseover="showTooltip(this, {text: \'Редактировать\', black: 1, shift: [12, 7, 7]})" onclick="vkhelper.plugins.messageTemplates.vk_script.params.box.hide(); vkhelper.plugins.messageTemplates.vk_script.functions.boxSetting.open({tpls_id:'+ k +'})"></a>\
    							</div>\
    							<div class="group_l_info" style="padding-top: 0px; line-height: normal; font-size: 14px;">\
    								'+ icon +'\
    								<div class="group_l_position" style="padding-top: 0px; margin-left: 26px;">' + (v.title.length > 30 ? v.title.substr(0,27)+'...' : v.title) + '</div>\
    								'+ mds +'\
    							</div>\
    						</div>';
    
					});
				
    				content += '</div>';
    				content += '</div>';
					
					return content;
					
				},
			
				open : function (type) {
				
					if (type) {
						vkhelper.plugins.messageTemplates.vk_script.params.type = type;
					}
					
					vkhelper.plugins.messageTemplates.vk_script.params.box.hide();
					
					var box = new MessageBox({
						title : 'Управление шаблонами <a href="https://vk-helper.pro/pages/func-message-templates.html" target="_blank"><i class="fas fa-question-circle" style="font-size: 16px; margin-bottom: -1px;"></i></a>',
						dark : 1, 
						width: 510,
						onHide : function () {
							if (xSorter) {
								xSorter.destroy();
							}
						}
					})
					.setOptions({bodyStyle: "padding:0;"})
					.content(vkhelper.plugins.messageTemplates.vk_script.functions.boxTpls.contentCreate())
					.setButtons(
						'Добавить шаблон', function() {
							box.hide();
							vkhelper.plugins.messageTemplates.vk_script.functions.boxSetting.open();
						}
					).show();
					
					vkhelper.plugins.messageTemplates.vk_script.params.box = box;
					
					function afterSort() {
						
						var tpls = [];
						jQuery.each(vkhelper.plugins.messageTemplates.storage.tpls, function(k,v) {
							if (v.type == vkhelper.plugins.messageTemplates.vk_script.params.type) {
								tpls.push(k);
							}
						});
						
						var obj = {};
						jQuery('#public_tpls_list > div[data-id]').each(function(k,v) {
							obj[tpls[k]] = vkhelper.plugins.messageTemplates.storage.tpls[jQuery(v).data('id')];
							jQuery(v).data('id',tpls[k]);
						});
					
						vkhelper.plugins.messageTemplates.storage.tpls = jQuery.extend(vkhelper.plugins.messageTemplates.storage.tpls, obj);
						
						
						vkhelper.plugins.messageTemplates.vk_script.functions.blockTpls.update();
						
						vkhelper.messages.sendToBG({ 
							type : 'vkhelper_plugins_messageTemplates_save_all', 
							details : {
								tpls : JSON.parse(JSON.stringify(vkhelper.plugins.messageTemplates.storage.tpls))
							}
						});
					
					}

					if (jQuery('#public_tpls_list').length) {
						var xSorter = sorter.init('public_tpls_list', {scrollNode: ge('public_tpls_list'), onReorder: afterSort});
					}
					
				},
				
				del : function (tpls_id) {
				
					var box = new MessageBox({
						title : 'Удаление шаблона',
						dark : 1
					})
					.content('Вы уверены?')
					.setButtons(
						'Удалить', function() {
							
							vkhelper.plugins.messageTemplates.storage.tpls.splice(tpls_id, 1);
							
							box.hide();
							
							vkhelper.plugins.messageTemplates.vk_script.functions.boxTpls.open();
							
							vkhelper.plugins.messageTemplates.vk_script.functions.blockTpls.update();
							
							vkhelper.messages.sendToBG({ 
								type : 'vkhelper_plugins_messageTemplates_del', 
								details : {
									id : tpls_id
								}
							});
					
						},
						'Отмена', function() { 
							vkhelper.plugins.messageTemplates.vk_script.functions.boxTpls.open();
						}
					).show();
					
				}
				
			},
			
			boxSetting : {
				
				open : function (details, isOpen) {
				
					details = details || {};
					
					if (details.type) {
						vkhelper.plugins.messageTemplates.vk_script.params.type = details.type;
					}
					
					var defails_def = {
						type  : vkhelper.plugins.messageTemplates.vk_script.params.type,
						title : "",
						text  : "",
						icon_check : false,
						uniq_text : false,
						color : vkhelper.plugins.messageTemplates.vk_script.params.colors[0][0],
						icon  : vkhelper.plugins.messageTemplates.vk_script.params.icons[0][0], 
						keys    : [],
						attachs : [],
						attachs_count : {},
					};
					
					var tpls_id = -1;
					if (details.tpls_id != undefined) {
						if (vkhelper.plugins.messageTemplates.storage.tpls[details.tpls_id]) {
							tpls_id = details.tpls_id;
							details = vkhelper.plugins.messageTemplates.storage.tpls[details.tpls_id];
						} else {
							details = jQuery.extend({}, defails_def);
						}
					} 
					else {
						details = jQuery.extend({}, defails_def, details);
					}
					
					var box = new MessageBox({
						title : 'Управление шаблоном <!--<a href="https://vk-helper.pro/pages/func-message-templates.html" target="_blank"><i class="fas fa-question-circle" style="font-size: 16px; margin-bottom: -1px;"></i></a>-->',
						dark : 1,
						width: 450
					})
					.content('\
<div id="messageTemplates_boxSetting">\
	\
	<h4 class="subheader">Тип шаблона:</h4>\
	<div id="messageTemplates_boxSetting_selector_type" style="width:400px"></div>\
	\
	<h4 class="subheader">Название шаблона: <span class="hint_icon" onmouseover="showTooltip(this, {text: \'При вводе текста <b>сообщения</b>, Вы можете начать вводить имя шаблона, и он автоматически подготовится к отправке.\', dir: \'auto\', shift: [22, 10], slide: 15, className: \'settings_tt\'})"></span></h4>\
	<input type="text" tabindex="1" value="" id="messageTemplates_boxSetting_input_title" class="dark" autocomplete="off" style="width:100%">\
	\
	<h4 id="messageTemplates_boxSetting_selector_keys_box" class="subheader">Фразы для быстрых ответов: <span class="hint_icon" onmouseover="showTooltip(this, {text: \'В тесксте сообщений эти фразы будут кликабельны и будут выделяться красным цветом. При нажатии на одну из этих фраз, данный шаблон автоматически подготовится к отправки.\', dir: \'auto\', shift: [22, 10], slide: 15, className: \'settings_tt\'})"></span></h4>\
	<div id="messageTemplates_boxSetting_selector_keys" style="width:400px"></div>\
	\
	<div id="messageTemplates_boxSetting_icon" style="float: right; margin-top: 17px; font-size: 16px;"><i></i></div>\
	\
	<div id="messageTemplates_boxSetting_icon_check" class="checkbox on" onclick="checkbox(this); jQuery(this).prev().toggle(); jQuery(this).next().toggle();" role="checkbox" aria-checked="true" tabindex="0" style="color: #222; font-weight: 500; margin: 18px 0 12px;">\
        Добавить на панель быстрого доступа\
    </div>\
    \
    <div id="messageTemplates_boxSetting_icon_setting" style="margin-left: 23px; margin-top: 10px;">\
    	<h4 class="subheader">Иконка:</h4>\
		<div id="messageTemplates_boxSetting_selector_icon" style="width:377px"></div>\
		\
    	<h4 class="subheader">Цвет иконки:</h4>\
		<div id="messageTemplates_boxSetting_selector_color" style="width:377px"></div>\
    </div>\
	\
    <div class="checkbox on" id="messageTemplates_boxSetting_uniq_text" onclick="checkbox(this);" style="color: #222; font-weight: 500; margin: 18px 0 12px;">Уникализировать текст <span class="hint_icon" onmouseover="showTooltip(this, {text: \'Если включить эту настройку, в тексе будут заменяться(с вероятностью 70%) все похожие русские символы на английские.<br><br>Пример: русская <b>o</b> будет заменена на английскую <b>о</b>, <b>p</b> на <b>p</b>, и т.д.<br><br><b>ВАЖНО!!</b> мы не знаем, как администрация Вконтакте относится к подобному, по этому будьте осторожны при использовании этой функции.\', dir: \'auto\', shift: [22, 10], slide: 15, className: \'settings_tt\'})"></span></div>\
    \
	<h4 class="subheader" style="border-top: solid 1px #e4e6e9; padding-top: 10px;">Содержимое шаблона:</h4>\
	<div class="mail_box_text_wrap _emoji_field_wrap" style="position: relative; margin-top: 0px;">\
    	<div id="messageTemplates_boxSetting_smile" class="emoji_smile_wrap  _emoji_wrap">\
    		<div class="emoji_smile _emoji_btn" onmouseover="return Emoji.show(this, event);" onmouseout="return Emoji.hide(this, event);" onclick="return cancelEvent(event);">\
    			<div class="emoji_smile_icon"></div>\
    		</div>\
    	</div>\
    	<div>\
    		<div style="position: absolute; top: 25px; right: 5px; cursor: pointer" id="messageTemplates_boxSetting_tag_icon" onmousedown="vkhelper.plugins.messageTemplates.vk_script.params.caretPosition = vkhelper.plugins.messageTemplates.vk_script.functions.getCaretPosition(ge(\'messageTemplates_boxSetting_editable\'))">\
    			<i class="fas fa-plus" style="opacity: .4; font-size: 16px; color: #597da3;"></i>\
    		</div>\
    	</div>\
    	<div tabindex="2" contenteditable="true" id="messageTemplates_boxSetting_editable"></div>\
    </div>\
    \
    <div id="messageTemplates_boxSetting_media_preview"></div>\
    <div id="messageTemplates_boxSetting_media"></div>\
    \
</div>'
					)
					.setButtons(
						'Сохранить', function() {
							if (vkhelper.plugins.messageTemplates.vk_script.functions.boxSetting.save(tpls_id)) {
								box.hide();
								
								vkhelper.plugins.messageTemplates.vk_script.functions.boxTpls.open();
								
							}
						}, 
						'Отмена', function() {
							box.hide();
							
							if (!isOpen) { 
								vkhelper.plugins.messageTemplates.vk_script.functions.boxTpls.open();
							}
						}
					);

					vkhelper.plugins.messageTemplates.vk_script.params.box = box;
					
					jQuery('#messageTemplates_boxSetting_icon').css('color', details.color);
					jQuery('#messageTemplates_boxSetting_icon > i').addClass('fas fa-'+ details.icon);
					
					var emj = Emoji.init(ge('messageTemplates_boxSetting_editable'), {
                    	controlsCont: ge("messageTemplates_boxSetting_smile"),
                    	noEnterSend: 1,
                    	noStickers: 1
                	});
                	Emoji.emojiLoadMore(emj);
					
					
					vkhelper.plugins.messageTemplates.vk_script.params.medias = [];
					
					vkhelper.plugins.messageTemplates.vk_script.params.media_select = new MediaSelector(
						"messageTemplates_boxSetting_media", 
						"messageTemplates_boxSetting_media_preview", [
							["photo","Фотография"],
							["video","Видеозапись"],
							["audio","Аудиозапись"],
							["doc","Документ"],
							["map","Карта"],
							["graffiti", "Граффити"],
							["poll", "Опрос", {lang :{q: "Тема опроса", a: "Варианты ответа", i: "Добавить вариант", d: "Удалить вариант", c: "Анонимное голосование"}}]
						],{
							editable: 1,
							sortable: 1,
							onAddMediaChange : function() { 
								vkhelper.plugins.messageTemplates.vk_script.params.medias.push(
									Array.prototype.slice.call(arguments)
								);
							}
						}
					);
					
					vkhelper.plugins.messageTemplates.vk_script.params.selector_type = new Selector(
						ge('messageTemplates_boxSetting_selector_type'), 
						vkhelper.plugins.messageTemplates.vk_script.params.types, {
							selectedItems : details.type, 
							dark : 1, 
							multiselect : 0, 
							autocomplete: 0,
							onChange: function(k) {
								vkhelper.plugins.messageTemplates.vk_script.params.type = k;
								jQuery('#messageTemplates_boxSetting_selector_keys_box').toggle(k == 'message').next().toggle(k == 'message');
							}
						}
					);
					
					
					vkhelper.plugins.messageTemplates.vk_script.params.selector_color = new Selector(
						ge('messageTemplates_boxSetting_selector_color'), 
						vkhelper.plugins.messageTemplates.vk_script.params.colors, {
							selectedItems : details.color, 
							dark : 1, 
							multiselect : 0, autocomplete: 0,
							onChange : function(key) {
								jQuery('#messageTemplates_boxSetting_icon').css('color', key);
							}
						}
					);
					//
					
					vkhelper.plugins.messageTemplates.vk_script.params.selector_icon = new Selector(
						ge('messageTemplates_boxSetting_selector_icon'), 
						vkhelper.plugins.messageTemplates.vk_script.params.icons, {
							selectedItems : details.icon, 
							dark : 1, 
							multiselect : 0, autocomplete: 0,
							onChange : function(key) {
								jQuery('#messageTemplates_boxSetting_icon > *').removeClass().addClass('fas fa-'+ key);
							}
						}
					);
        
        
        			vkhelper.plugins.messageTemplates.vk_script.params.selector_key = new Selector(
        				ge('messageTemplates_boxSetting_selector_keys'), [], {
							selectedItems : details.keys.map(function(k,v) { return k[1]; }),
							dark : 1, 
							dropdown : 0, 
							enableCustom : 1, 
							multiCustom : 1, 
							noResult : false,
							onChange : function () { }
						}
					);

        
					if (details.icon_check == false) {
						jQuery('#messageTemplates_boxSetting_icon_setting').hide();
						jQuery('#messageTemplates_boxSetting_icon').hide();
						jQuery('#messageTemplates_boxSetting_icon_check').removeClass('on');
					}
					
					if (!details.uniq_text) {
						jQuery('#messageTemplates_boxSetting_uniq_text').removeClass('on');
					}
					
					jQuery.each(details.attachs, function(k,v) {
						if (v[0] != 'poll') { new MessageBox().show(); }
						vkhelper.plugins.messageTemplates.vk_script.params.media_select.chooseMedia.apply(null, v);
					});

					vkhelper.plugins.messageTemplates.vk_script.functions.appendMenuTo(
						ge('messageTemplates_boxSetting_tag_icon'), 
						vkhelper.plugins.messageTemplates.vk_script.params.tags, {
							width: 120,
							left: -24,
							onChange: function(k){
								vkhelper.plugins.messageTemplates.vk_script.functions.insertTpl(ge('messageTemplates_boxSetting_editable'), '{'+ k +'}', false);
							}
						}
					);
					
					
					jQuery('#messageTemplates_boxSetting_selector_keys_box')
						.toggle(vkhelper.plugins.messageTemplates.vk_script.params.type == 'message')
						.next()
						.toggle(vkhelper.plugins.messageTemplates.vk_script.params.type == 'message');
					
					box.show();
					
					jQuery('#messageTemplates_boxSetting_input_title').val(details.title);
					jQuery('#messageTemplates_boxSetting_editable').html(details.text);
					elfocus('messageTemplates_boxSetting_input_title');

				},
				
				save : function (tpls_id) {
				
					if (!vkhelper.plugins.vkh.vk_script.vkh.isActive && vkhelper.plugins.messageTemplates.storage.tpls.length >= 10) {
						showDoneBox('В бесплатной версии VK Helper можно создавать только 10 шаблонов. Для снятия этого ограничения, необходимо <a href="https://vk-helper.pro/buy" target="_blank">купить подписку на VK Helper</a>')
						return false;
					}
					
					var obj = {
						type  : vkhelper.plugins.messageTemplates.vk_script.params.selector_type.selectedItems()[0][0],
						title : jQuery('#messageTemplates_boxSetting_input_title').val().trim(),
						text  : jQuery('#messageTemplates_boxSetting_editable').html().trim(), 
						icon_check : jQuery('#messageTemplates_boxSetting_icon_check').hasClass('on'),
						uniq_text : jQuery('#messageTemplates_boxSetting_uniq_text').hasClass('on'),
						color : vkhelper.plugins.messageTemplates.vk_script.params.selector_color.selectedItems()[0][0],
						icon  : vkhelper.plugins.messageTemplates.vk_script.params.selector_icon.selectedItems()[0][0], 
						keys    : vkhelper.plugins.messageTemplates.vk_script.params.selector_key.selectedItems(),
						attachs : [],
						attachs_count : {},
					};
					
					
					var mds = vkhelper.plugins.messageTemplates.vk_script.params.media_select.getMedias();
					
					var st = false;
					jQuery.each(mds, function(k,v) {
						jQuery.each(vkhelper.plugins.messageTemplates.vk_script.params.medias, function(k2,v2) {
							if (v[0] == v2[0] && v[1] == v2[1]) {
								obj.attachs.push(v2);
								obj.attachs_count[v2[0]] = (obj.attachs_count[v2[0]] || 0) + 1;
								
								if (v2[0] == 'poll') {
									var pl = vkhelper.plugins.messageTemplates.vk_script.params.media_select.pollData();
									
									if (pl == false) {
										st = true;
										return false;
									}
									
									obj.attachs[obj.attachs.length-1][2].question = pl.media;
									obj.attachs[obj.attachs.length-1][2].anon = !!pl.anonymous;
									obj.attachs[obj.attachs.length-1][2].answers = [];
									
									jQuery.each(pl, function(k3,v3) {
										if (k3.substr(0,8) == "answers[") {
											obj.attachs[obj.attachs.length-1][2].answers.push([0, v3]);
										}
									});
								}
								
							}
						});
					});
					
					if (st == true) {
						return false;
					}
					
					
					if (obj.title == '') {
						notaBene('messageTemplates_boxSetting_input_title');
						return false;
					}
					
					if (obj.text == '' && !obj.attachs.length) {
						notaBene('messageTemplates_boxSetting_editable');
						return false;
					}
					
					if (obj.type != 'post' && obj.attachs_count.poll != undefined) {
						showDoneBox('Только шаблон записей может содержать опрос.')
						return false;
					}
					
					if (obj.type != 'comment' && Object.keys(obj.attachs) > 2) {
						showDoneBox('Шаблон комментария может содержать только 2 вложения')
						return false;
					}
					
					
					
					if (vkhelper.plugins.messageTemplates.storage.tpls[tpls_id]) {
						vkhelper.plugins.messageTemplates.storage.tpls[tpls_id] = obj;
					} 
					else {
						vkhelper.plugins.messageTemplates.storage.tpls.push(obj);
					}
					
					
					vkhelper.plugins.messageTemplates.vk_script.functions.blockTpls.update(obj.type);
			
					vkhelper.messages.sendToBG({ 
						type : 'vkhelper_plugins_messageTemplates_save', 
						details : {
							id  : tpls_id,
							obj : JSON.parse(JSON.stringify(obj))
						}
					});
					
					return true;
					
				}
			
			},
			
			helper : {
			
				search : function (text) {
				
					text = text.trim().toLowerCase();
					
					var res = [];
					
					if (text != '') {
					
						jQuery.each(vkhelper.plugins.messageTemplates.storage.tpls, function(k,v) {
					
							if (v.type != 'message' || v.title.toLowerCase().indexOf(text) != 0) {
								return;
							}
							
							res.push({
								id : k,
								bold_end : text.length
							});
							
						});
					
					}
					
					if (!res.length) {
						jQuery('#messageTemplates_tpls_block_messages_helping').removeClass('show').hide();
						return;
					}
					
					vkhelper.plugins.messageTemplates.vk_script.functions.helper.setItems(res);
				},
				
				setItems : function (items) {
				
					var els = '';
					jQuery.each(items, function(k,v) {
						els += '<div data-tpls_id="'+ v.id +'">'+ vkhelper.plugins.messageTemplates.vk_script.functions.blockTpls.genTpls(v.id, {len : 40, bold : v.bold_end}) +'</div>';
					});
					
					jQuery('#messageTemplates_tpls_block_messages_helping')
						.html(els)
						.addClass('show')
						.show()
						.css('top', -14 - (33 * items.length))
						.find('div:last-child')
						.addClass('active');
					
				},
				
				hide : function () {
				
					jQuery('#messageTemplates_tpls_block_messages_helping').removeClass('show').hide();
					
				}
			
			},
			
			copy : {
			
				click : function (el) {
					
					var $this = jQuery(el);
				
					var content = jQuery("#wl_post_body_wrap");
					
					if (!content.length) {
						content = $this.closest(".post_info").find('.wall_text');
					}
				
					if (!content) { 
						return;
					}
					
					vkhelper.plugins.funcs.list.vk_getPostInfo(content, function(data) {
					
						vkhelper.plugins.messageTemplates.vk_script.functions.boxSetting.open({
							type : 'post',
							text : data[0],
							attachs : data[1]
						}, 1);
					
					});
	
				}
			
			}
			
		}
		
	},
	
	bg_script : {
		
		messages : {
		
			'vkhelper_plugins_messageTemplates_save' : function (details, tab_id, callback) {
			
				var strg = plugins.storage.get('messageTemplates');
				
				if (!strg.tpls) {
					strg.tpls = [];
				}
				
				if (strg.tpls[details.id]) {
					strg.tpls[details.id] = details.obj;
				}
				else {
					strg.tpls.push(details.obj);
				}
				
				plugins.storage.set('messageTemplates', strg);
				
			},
		
			'vkhelper_plugins_messageTemplates_save_all' : function (details, tab_id, callback) {
			
				var strg = plugins.storage.get('messageTemplates');
				
				strg.tpls = details.tpls;
				
				plugins.storage.set('messageTemplates', strg);
				
			},
		
			'vkhelper_plugins_messageTemplates_del' : function (details, tab_id, callback) {
			
				var strg = plugins.storage.get('messageTemplates');
				
				if (!strg.tpls) {
					return;
				}
				
				strg.tpls.splice(details.id, 1);
				
				plugins.storage.set('messageTemplates', strg);
				
			}
		}
	}
	
};

vkhelper_plugins_list['wallCopy'] = {
	
	lang : {
		ru : {
			cat : 'Для быстрой работы',
			title : 'Копирование записей',
			description : 'Функция позволяет копировать запись на страницу пользователя или сообщества.<br><br><img src="https://vk-helper.pro/image/options/wallCopy_1.jpg" width="393" height="183">',
		
			aboutLink : 'http://vk-helper.pro/?p=page/instruction&type=21'
		}
	},
	
	storage : {	
		enabled : true
	},
	
	css : function () {
	/*
#wallCopy_box div.checkbox { margin-bottom: 10px; }
#wallCopy_box_editable {
	background: #fff;
    color: #000;
    border: 1px solid #c0cad5;
    min-height: 60px;
    padding: 5px 30px 5px 5px;
    vertical-align: top;
    margin: 0;
    overflow: auto;
    outline: 0;
    line-height: 150%;
    word-wrap: break-word;
    cursor: text;
}
	*/
	},

	vk_script : {
		
		params : {
			medias : [],
			media_select : false
		},
		
		on : function () {
						
			vkhelper.plugins.postMenu.vk_script.functions.postMenuItemsAdd(
				'wallCopy', {
					html : 'Копировать запись',
					onChange : function(el) {
						vkhelper.plugins.wallCopy.vk_script.functions.copy.click(el);
					}
				}
			);
			
		},
		
		off : function () {
		
			vkhelper.plugins.postMenu.vk_script.functions.postMenuItemsRemove('wallCopy');
			
		},
		
		functions : {
			
			box : {
				
				open : function (details) {
					console.log(details);
					details = jQuery.extend({
						text    : "",
						attachs : [],
						users   : (vkhelper.plugins.listSelectedItem.vk_script.functions.getAccounts('wallCopy') || []),
						groups  : (vkhelper.plugins.listSelectedItem.storage.list.groups['wallCopy_'+vk.id] || [])
					}, details || {});
					



					var box = new MessageBox({
						title : 'Копирование записи',
						dark : 1
					})
					.content('\
<div id="wallCopy_box">\
	\
	<a href="#" id="wallCopy_box_accounts">Выбрано аккаунтов: <span style="font-weight:600">'+ details.users.length +'</span></a><br><br>\
	\
	<a href="#" id="wallCopy_box_groups">Выбрано сообществ: <span style="font-weight:600">'+ details.groups.length +'</span></a>\
	\
	<h4 class="subheader" style="border-top: solid 1px #e4e6e9; padding-top: 10px;">Параметры публикации:</h4>\
    \
    <div class="checkbox medadd_c_pollcb" id="wallCopy_box_uniq_text" onclick="checkbox(this);" style="-moz-user-select: none;-khtml-user-select: none;user-select: none;">Уникализировать текст <span class="hint_icon" onmouseover="showTooltip(this, {text: \'Если включить эту настройку, в тексе будут заменяться(с вероятностью 70%) все похожие русские символы на английские.<br><br>Пример: русская <b>o</b> будет заменена на английскую <b>о</b>, <b>p</b> на <b>p</b>, и т.д.<br><br><b>ВАЖНО!!</b> мы не знаем, как администрация Вконтакте относится к подобному, по этому будьте осторожны при использовании этой функции.\', dir: \'auto\', shift: [22, 10], slide: 15, className: \'settings_tt\'})"></span></div>\
    <!--\
    <div class="checkbox medadd_c_pollcb" id="wallCopy_box_uniq" onclick="checkbox(this); jQuery(this).next(\'div\').toggle()" style="-moz-user-select: none;-khtml-user-select: none;user-select: none;">Уникализировать запись</div>\
    <div style="overflow: hidden; display: none; margin-left: 30px;">\
    	<div class="clear_fix">\
    		<div class="checkbox medadd_c_pollcb" id="wallCopy_box_uniq_text" onclick="if(jQuery(this).hasClass(\'disabled\'))return; checkbox(this);" style="-moz-user-select: none;-khtml-user-select: none;user-select: none;">Уникализировать текст</div>\
    		<div class="checkbox medadd_c_pollcb" id="wallCopy_box_uniq_photo" onclick="if(jQuery(this).hasClass(\'disabled\'))return; checkbox(this); if(isChecked(\'wallCopy_box_upload_img\')==1)return; checkbox(\'wallCopy_box_upload_img\');" style="-moz-user-select: none;-khtml-user-select: none;user-select: none;">Уникализировать фотографии</div>\
    	</div>\
    </div>\
    -->\
    \
    <div class="checkbox medadd_c_pollcb" id="wallCopy_box_check_timer" onclick="checkbox(this); jQuery(this).next(\'div\').toggle()" style="-moz-user-select: none;-khtml-user-select: none;user-select: none;">Отложить публикацию</div>\
    <div class="medadd_c medadd_c_timer clear_fix" style="overflow: hidden; display: none;">\
    	<div class="clear_fix">\
    		<div class="fl_l">\
    			<div id="wallCopy_box_wrap_timer" class="datepicker_container"></div>\
    		</div>\
    		<div class="fl_l medadd_c_timerat">в</div>\
    		<div class="fl_l">\
    			<div id="wallCopy_box_wrap_timer_time" class="timepicker_container"></div>\
    		</div>\
    	</div>\
    </div>\
    \
    <div class="checkbox medadd_c_pollcb" id="wallCopy_box_del_check_timer" onclick="if(jQuery(this).hasClass(\'disabled\'))return; checkbox(this); jQuery(this).next(\'div\').toggle()" style="-moz-user-select: none;-khtml-user-select: none;user-select: none; display:none;">Автоудаление</div>\
    <div class="medadd_c medadd_c_timer clear_fix" style="overflow: hidden; display: none;">\
    	<div class="clear_fix">\
    		<div class="fl_l">\
    			<div id="wallCopy_box_del_wrap_timer" class="datepicker_container"></div>\
    		</div>\
    		<div class="fl_l medadd_c_timerat">в</div>\
    		<div class="fl_l">\
    			<div id="wallCopy_box_del_wrap_timer_time" class="timepicker_container"></div>\
    		</div>\
    	</div>\
    </div>\
	\
    <div class="checkbox medadd_c_pollcb" id="wallCopy_box_upload_img" onclick="if(jQuery(this).hasClass(\'disabled\'))return; checkbox(this);" style="-moz-user-select: none;-khtml-user-select: none;user-select: none;">Загружать изображения от имени страницы</div>\
    \
	<div id="wallCopy_box_for_groups" style="'+ (details.groups > 0 ? 'display:block' : 'display:none') +'">\
		<div class="checkbox medadd_c_pollcb on" onclick="checkbox(this);" id="wallCopy_box_check_official" style="-moz-user-select: none;-khtml-user-select: none;user-select: none;">Опубликовать от имени группы</div>\
		<div class="checkbox medadd_c_pollcb" onclick="checkbox(this);" id="wallCopy_box_check_signed" style="-moz-user-select: none;-khtml-user-select: none;user-select: none;">Добавить подпись (для сообществ)</div>\
		<div class="checkbox medadd_c_pollcb" onclick="checkbox(this);" id="wallCopy_box_check_ads" style="-moz-user-select: none;-khtml-user-select: none;user-select: none;">Это реклама (для сообществ)</div>\
	</div>\
	\
	<h4 class="subheader">Запись для публикации:</h4>\
	<div class="mail_box_text_wrap _emoji_field_wrap" style="position: relative; margin-top: 0px;">\
    	<div id="wallCopy_box_smile" class="emoji_smile_wrap  _emoji_wrap">\
    		<div class="emoji_smile _emoji_btn" onmouseover="return Emoji.show(this, event);" onmouseout="return Emoji.hide(this, event);" onclick="return cancelEvent(event);">\
    			<div class="emoji_smile_icon"></div>\
    		</div>\
    	</div>\
    	<div tabindex="2" contenteditable="true" id="wallCopy_box_editable" style="min-height:60px"></div>\
    </div>\
    \
    <div id="wallCopy_box_media_preview"></div>\
    <div id="wallCopy_box_media"></div>\
    \
</div>'
					)
					.setButtons(
						'Копировать', function() {
							if (vkhelper.plugins.wallCopy.vk_script.functions.box.go(details.post_id)) {
								box.hide();
							}
						}, 
						'Отмена'
					); 

					var emj = Emoji.init(ge('wallCopy_box_editable'), {
                    	controlsCont: ge("wallCopy_box_smile"),
                    	noEnterSend: 1,
                    	noStickers: 1
                	});
                	Emoji.emojiLoadMore(emj);
					
					if (details.groups.length) {
						jQuery('#wallCopy_box_for_groups').show();
					}
					
					vkhelper.plugins.wallCopy.vk_script.params.medias = [];
					
					vkhelper.plugins.wallCopy.vk_script.params.media_select = new MediaSelector(
						"wallCopy_box_media", 
						"wallCopy_box_media_preview", [
							["photo","Фотография"],
							["video","Видеозапись"],
							["audio","Аудиозапись"],
							["doc","Документ"],
							["graffiti", "Граффити"],
							["poll", "Опрос", {lang :{q: "Тема опроса", a: "Варианты ответа", i: "Добавить вариант", d: "Удалить вариант", c: "Анонимное голосование"}}]
						],{
							editable: 1,
							sortable: 1,
							onAddMediaChange : function() { 
								vkhelper.plugins.wallCopy.vk_script.params.medias.push(
									Array.prototype.slice.call(arguments)
								);
							}
						}
					);
					
					jQuery.each(details.attachs, function(k,v) {
						if (v[0] != 'poll') { new MessageBox().show(); }
						vkhelper.plugins.wallCopy.vk_script.params.media_select.chooseMedia.apply(null, v);
					});
					
					jQuery('#wallCopy_box_editable').html(details.text);

					
					
					if (window.stManager) {
					
						stManager.add(["ui_controls.css", "ui_controls.js", "datepicker.css", "datepicker.js"], function() {
					
    						new Datepicker("wallCopy_box_wrap_timer", {
    						    time: "wallCopy_box_wrap_timer_time",
    						    width: 155,
    						    noPast: !0,
    						    minStep: 1,
    						    onUpdate: function () { }
    						});
    					
    						new Datepicker("wallCopy_box_del_wrap_timer", {
    						    time: "wallCopy_box_del_wrap_timer_time",
    						    width: 155,
    						    noPast: !0,
    						    minStep: 1,
    						    onUpdate: function () { }
    						});
    						
						});
					}
								
					Emoji.editableFocus('wallCopy_box_editable');
					
					
					/*if (!vkhelper.plugins.vkh.vk_script.vkh.isActive) {
						
						jQuery('#wallCopy_box_del_check_timer, #wallCopy_box_upload_img')
							.addClass('disabled')
							.on('mouseover', function() {
								showTooltip(this, {text: 'Доступно в платной версии<br>расширения VK Helper', dir: 'auto', shift: [22, 10], slide: 15, className: 'settings_tt'});
							});
					}
					else {
					*/
						jQuery('#wallCopy_box_upload_img')
							.addClass('on');
					//}
					
                	jQuery('#wallCopy_box_accounts').click(function(event) {
                	
                		vkhelper.plugins.listSelectedItem.vk_script.functions.setListAccounts('wallCopy', {noHide : true}, function(details) {
							
							jQuery('#wallCopy_box_accounts > span').text(details.list.length);
					
						});
					
                		event.stopPropagation();
						return false;
                	});
                	   	
                	jQuery('#wallCopy_box_groups').click(function(event) {
                	
                		vkhelper.plugins.listSelectedItem.vk_script.functions.setListGroups('wallCopy', {noHide : true}, function(details) {
					
							jQuery('#wallCopy_box_groups > span').text(details.list.length);
							
							jQuery('#wallCopy_box_for_groups').toggle(details.list.length > 0);
							
						});
					
                		event.stopPropagation();
						return false;
                	});
                	
                	box.show();
                	
				},
				
				go : function (post_id) {
				
					var obj = {
						uid : vk.id,
						post_id   : post_id,
						users     : (vkhelper.plugins.listSelectedItem.vk_script.functions.getAccounts('wallCopy') || []),
						groups    : (vkhelper.plugins.listSelectedItem.storage.list.groups['wallCopy_'+vk.id] || []),
						text      : Emoji.editableVal(ge('wallCopy_box_editable')).trim(),
						attachs   : [],
						ads       : jQuery('#wallCopy_box_check_ads').hasClass('on'),
						signed    : jQuery('#wallCopy_box_check_signed').hasClass('on'),
						official  : jQuery('#wallCopy_box_check_official').hasClass('on'),
						postpone  : jQuery('#wallCopy_box_check_timer').hasClass('on') ? val('wallCopy_box_wrap_timer') : false,
						del       : jQuery('#wallCopy_box_del_check_timer').hasClass('on') ? val('wallCopy_box_del_wrap_timer') : false,
						uploadImg : jQuery('#wallCopy_box_upload_img').hasClass('on')
					};
							
					if (!obj.users.length && !obj.groups.length) {
						showDoneBox('Вы не указали, куда копировать пост');
						return;
					}
					
					if (!vkhelper.plugins.vkh.vk_script.vkh.isActive && obj.users.length + obj.groups.length > 1) {
						showDoneBox('В бесплатной версии VK Helper разрешено копирование записи только на одну страницу. Для снятия этого ограничения, необходимо <a href="https://vk-helper.pro/buy" target="_blank">оформить платную подписку</a>.');
						return;
					}
					
					if (obj.postpone && Number(obj.postpone) <= parseInt(Number(new Date())/1000)) {
						showDoneBox('Неверная дата публикации');
						return;
					}
							
					if (obj.del != false && (Number(obj.postpone) || parseInt(Number(new Date())/1000)) > ( Number(obj.del) - (60 * 20))) {
						showDoneBox('Удалять запись можно не раньше чем через 20 минут после публикации');
						return;
					}
					
					if (isChecked('wallCopy_box_uniq') && isChecked('wallCopy_box_uniq_photo')) {
						alert('Уникализируем фото');
						return;
					}
					
					if (isChecked('wallCopy_box_uniq_text')) {
						obj.text = vkhelper.plugins.funcs.list.uniqText(obj.text);
					}
							
					var mds = vkhelper.plugins.wallCopy.vk_script.params.media_select.getMedias();
					
					var atch = [];
					var st = false;
					jQuery.each(mds, function(k,v) {
						jQuery.each(vkhelper.plugins.wallCopy.vk_script.params.medias, function(k2,v2) {
							if (v[0] == v2[0] && v[1] == v2[1]) {
								atch.push(v2);
								
								if (v2[0] == 'poll') {
									var pl = vkhelper.plugins.wallCopy.vk_script.params.media_select.pollData();
									
									if (pl == false) {
										st = true;
										return false;
									}
									
									atch[atch.length-1][2].question = pl.media;
									atch[atch.length-1][2].anon = !!pl.anonymous;
									atch[atch.length-1][2].answers = [];
									
									jQuery.each(pl, function(k3,v3) {
										if (k3.substr(0,8) == "answers[") {
											atch[atch.length-1][2].answers.push([0, v3]);
										}
									});
								}
								
							}
						});
					});
					
					if (st == true) {
						return false;
					}
					
					
					jQuery.each(atch, function(k,v) {
					
						var add = [];
						
						switch (v[0]) {
						
							case 'poll':
							
								add.push('poll');
								
								var answers = [];
								
								jQuery.each(v[2].answers, function(k2,v2) {
									answers.push(v2[1]);
								});
								
								add.push({
									anon     : v[2].anon,
									question : v[2].question,
									answers  : answers
								});
								
							break;
						
							case 'photo':
								add.push('photo');
								add.push(v[1]);
								
								var img_obj = ['',0,0];
								jQuery.each(v[2].editable.sizes, function(k2,v2) {
									if (v2[1] >= img_obj[1] && v2[2] >= img_obj[2]) {
										img_obj = v2;
									}
								});
								
								add.push(img_obj[0]);
								
							break;
						
							case 'doc':
							case 'video':
							case 'audio':
							
								add.push(v[0]);
								add.push(v[1]);
								
							break;
							
						}
						
						if (add.length) {
							obj.attachs.push(add);
						}
						
					});
					
					
					vkhelper.plugins.control.vk_script.functions.fastMessage('waiting', 'Начинаем копирование записи', 1000);
					
					vkhelper.messages.sendToBG({ 
						type : 'vkhelper_wallCopy_task', 
						details : obj
					});
									
					return true;
					
				}
			
			},
			
			copy : {
			
				click : function (el) {
					
					var $this = jQuery(el);
				
					var content = jQuery("#wl_post_body_wrap");
					
					if (!content.length) {
						content = $this.closest(".post_info").find('.wall_text');
					}
				
				
					if (!content) 
						return;
						
					vkhelper.plugins.funcs.list.vk_getPostInfo(content, function(data) {

						vkhelper.plugins.wallCopy.vk_script.functions.box.open({
							text : data[0],
							attachs : data[1],
							post_id : content.find('.wall_post_cont[id]').attr('id').substr(3)
						});
					
					});
	
				}
			
			}
			
		}
		
	},
	
	bg_script : {
		
		messages : {
		
			'vkhelper_wallCopy_task' : function (details, tab_id, callback) {
		
				// - - - - - - - - - - - -
				
				var atttachs_load = details.attachs.filter(function(d){ return (d[0] == 'photo' && details.uploadImg) || d[0] == 'poll'; }) //  && VKH.p.get().isActive
				
				task.add('last', {
					initiator : 'wallCopy.bg.msg.vkhelper_wallCopy_task',
					title : '<b>Копирование</b> записи <a href="https://vk.com/wall'+details.post_id +'" target="_blank">wall'+details.post_id +'</a>',
					isVisible : true,
					maxCount  : (details.users.length + details.groups.length) * atttachs_load.length + (details.users.length + details.groups.length),
					onFinished : function (task_id, details) {
						messages.sendToVk({
							type : 'control_fastMessage_view',
							details : {
								status : 'success',
								text : 'Запись скопирована на страницы: '+ (details.log_success || []).length +' из '+ ((details.log_success || []).length + (details.log_errors || []).length)
							}
						});
					}
				}, function(task_id, task_callback) {
				
					var VKH_autodel_taskId = -1;
					
					function go() {
					
						var array_upload = jQuery.extend([], atttachs_load);
						
						var array_upload_new = [];
						
						function checkUploadData(uid, gid, callback) {
						
							gid = gid || false;
							
							if (!array_upload.length) {
								callback();
								return;
							}
							
							var attach = array_upload.shift();
							
							switch (attach[0]) {
							
								case 'poll':
									
									VK.api('polls.create', {
										question     : attach[1].question,
										is_anonymous : Number(attach[1].anon),
										owner_id     : -gid || uid,
										add_answers  : JSON.stringify(attach[1].answers)
									}, {
										uid : uid,
										task_id : task_id
									}, function(response) {
								
										if (response.status != 'success') {
								
											task.update(task_id, {
												nowCountAdd : 1,
												addErrors : {
													uid : uid,
													error : 'unkniwn_error',
													data : response.details
												}
											});
											checkUploadData(uid, gid, callback);
											return false;
										}
									
										task.update(task_id, {
											nowCountAdd : 1
										});
											
										array_upload_new.push([
											'poll',
											response.details.owner_id +'_'+ response.details.id
										]);
								
										checkUploadData(uid, gid, callback);
										
									});
									
								break;
							
								case 'photo':
								
									var param = {};
									
									if (gid) {
										param.group_id = gid;
									}
							
									VK.api('photos.getWallUploadServer', param, {
										uid : uid, 
										task_id : task_id
									}, function(response) {
								
										if (response.status != 'success' || !response.details.upload_url) {
								
											task.update(task_id, {
												nowCountAdd : 1,
												addErrors : {
													uid : uid,
													error : 'unkniwn_error',
													data : response.details
												}
											});
											checkUploadData(uid, gid, callback);
											return false;
										}
										
										
										plugins.list.funcs.list.imgUrlToBlob(attach[2], function(bl) {
							
											var fd = new FormData;
											fd.append('photo', bl, '1.jpeg');
		
											jQuery.ajax({
    											url: response.details.upload_url,
    											data: fd,
    											processData: false,
    											contentType: false,
    											type: 'POST',
    											success: function (data) {
    								
    												data = jQuery.parseJSON(data);
    									
    												if (!data.server || !data.photo || data.photo == '[]' || !data.hash) {
														task.update(task_id, {
															nowCountAdd : 1,
															addErrors : {
																uid : uid,
																error : 'error_upload_file'
															}
														});
														checkUploadData(uid, gid, callback);
														return false;
    												}
    									
    												var data2 = {
    													server : data.server,
    													photo  : data.photo,
    													hash   : data.hash
    												};
    									
    												if (gid) {
    													data2.group_id = gid;
    												} 
    												else {
    													data2.user_id = uid;
    												}
    									
    												
    												VK.api('photos.saveWallPhoto', data2, {
														uid : uid, 
														task_id : task_id
													}, function(response) {
								
														if (response.status != 'success') {
												
															task.update(task_id, {
																nowCountAdd : 1,
																addErrors : {
																	uid : uid,
																	error : 'unkniwn_error',
																	data : response.details
																}
															});
															checkUploadData(uid, gid, callback);
															return false;
														}
														
														task.update(task_id, {
															nowCountAdd : 1
														});
										
														array_upload_new.push([
															'photo',
															attach[1], 
															response.details[0].owner_id +'_'+ response.details[0].id
														]);
									
														checkUploadData(uid, gid, callback);
														return false;
															
													});
										
												},
    											error: function (data) {
								
													task.update(task_id, {
														nowCountAdd : 1,
														addErrors : {
															uid : uid,
															error : 'error_upload_file'
														}
													});
													checkUploadData(uid, gid, callback);
													return false;
								
    											}
  											});
  		
										});
										
										
									});
									
								break;
								
								default:
									checkUploadData(uid, gid, callback);
								
							}
						
						}
						
						function send(uid, gid, callback) {
						
							var data = {
								owner_id : gid ? -gid : uid,
								message  : details.text,
								attachments : jQuery.extend([], details.attachs), 
								signed : Number(details.signed),
								from_group : Number(details.official)
							};
					
							if (details.postpone != false) {
								data.publish_date = details.postpone;
							}
					
							jQuery.each(array_upload_new, function(k,v) {
								jQuery.each(data.attachments, function(k2,v2) {
								
									if (v[0] == v2[0]) {
									
										if (v[0] == 'poll') {
											data.attachments[k2] = [
												v[0],
												v[1]
											];
										}
										else if (v[0] == 'photo' && v[1] == v2[1]) {
											data.attachments[k2] = [
												v[0],
												v[2]
											];
										}
									}
									
								});
							});
							
							data.attachments = data.attachments.map(function(d) { return d[0] + d[1] }).join(',');
							
							var re = {};
							if (gid) {
								re.gid = gid;
							}
							
							VK.api('wall.post', data, {
								uid : uid,
								task_id : task_id,
								errors : [214, 219, 220, 222, 224]
							}, function(response) {
								
								if (response.status != 'success') {
								
									if (response.details.error) {
								
										if (response.details.error == "error_api_catch") {
									
											task.update(task_id, {
												nowCountAdd : 1,
												addErrors : jQuery.extend({
													uid : uid,
													error : 'api_error_'+ response.details.data.error_code,
													data : response.details.data
												}, re)
											});
											callback();
											return false;
											
										}
										
										task.update(task_id, {
											nowCountAdd : 1,
											addErrors : jQuery.extend({
												uid : uid,
												error : response.details.error,
												data : response.details
											}, re)
										});
										callback();
										return false;
									
									}
									
									
									task.update(task_id, {
										nowCountAdd : 1,
										addErrors : jQuery.extend({
											uid : uid,
											error : 'unkniwn_error',
											data : response.details
										}, re)
									});
									callback();
									return false;
								}
								
								
								if (!response.details.post_id) {
									task.update(task_id, {
										nowCountAdd : 1,
										addErrors : jQuery.extend({
											uid : uid,
											error : 'unkniwn_error',
											data : response.details
										}, re)
									});
									callback();
									return false;
								}
								
								if (VKH_autodel_taskId != -1) {
									// Это надо проверить
									/*
									VKH.api('multiRepost.autodel', {
										task_id : VKH_autodel_taskId,
										uid : uid,
										post_id : response.details.post_id
									}, function (response) {
									
										if (response.status != 'success') {
											task.update(task_id, {
												nowCountAdd : 1,
												addSuccess : {
													uid : uid,
													post_id : response.details.post_id,
													text : 'Репост совершен, но из-за проблем с сервером VK Helper, автоудаление не будет выполнено.',
													vkh_error : true
												}
											});
											go();
											return false;	
										}
										
										task.update(task_id, {
											nowCountAdd : 1,
											addSuccess : {
												uid : uid,
												post_id : response.details.post_id
											}
										});
										go();
										
									});
									*/
								} 
								else {
									task.update(task_id, {
										nowCountAdd : 1,
										addSuccess : jQuery.extend({
											uid : uid,
											post_id : response.details.post_id
										}, re)
									});
									callback();
								}
								return false;
								
							});
							
						}
						
						if (details.users.length) {
						
							var uid = details.users.shift();
							
							checkUploadData(uid, false, function () {
							
								send(uid, false, function () {
									
									go();
									
								});
								
							});

							return false;
						
						}
						else if (details.groups.length) {
							
							var gid = details.groups.shift();
							
							checkUploadData(details.uid, gid, function () {
							
								send(details.uid, gid, function () {
									
									go();
									
								});
								
								
							});
							
							return false;
							
						}
						else {
							task_callback();
							return false;
						}
						
					}
					
					if (details.del) {
					
						VKH.api('wallCopy.autodel.create', details, function (response) {
							
							if (response.status != 'success') {
								task.update(task_id, {
									nowCountAdd : 'max',
									addErrors : {text:'Параметр <b>Автоудаление</b> временно недоступен, попробуйте выполнить действие немного позже, или отключите этот параметр.'}
								});
								task_callback();
								return false;
							}
							
							VKH_autodel_taskId = response.task_id;
							
							go();
						
						});
						
					}
					else {
						go();
					}
					
				});
	
			}
		}
		
	}
	
};




vkhelper_plugins_list['accountOnline'] = {

	lang : {
		ru : {
			cat : 'Другое',
			title : 'Поддерживать подключенные аккаунты в Онлайне',
			aboutLink : 'http://vk-helper.pro/?p=page/instruction&type=1',
			description : 'Все <a href="https://vk-helper.pro/pages/account-add.html" target="_blank">добавленные аккаунты</a> в расширение VK Helper будут находится в режиме Online до тех пор, пока не закроется браузер.'
		}
	},
	
	storage : {	
		enabled : false
	},
	
	bg_script : {
	
		timer_main : false,
		timer_users : {},
		
		on : function () {
		
			function setOnlineUid(uid) {
			
				if (!plugins.isEnable('accountOnline')) {
					return;
				}
				
				if (!account.get.uid(uid)) {
					return;
				}
					
				
				task.add('first', {
					initiator : 'accountOnline.bg_script.on',
					isVisible : false
				}, function(task_id, task_callback) {
					
					VK.api('account.setOnline', {}, {
						uid : uid,
						task_id : task_id
					}, function(response) {
						
						plugins.get('accountOnline').bg_script.timer_users[uid] = setTimeout(
							function () {
								setOnlineUid(uid);
							}, (Math.floor(Math.random() * 300) + 250) * 1000
						);
						
						task_callback();
						return false;
					});										
							
				});
				
				
				
			}
			
			function setOnlineEach() {
			
				if (!plugins.isEnable('accountOnline')) {
					return;
				}
				
				var acc_all = account.get.all();
				
				// если есть добавленные аккаунты
				if (Object.keys(acc_all).length > 0) {
				
					jQuery.each(acc_all, function(uid, obj) {   
				 
						if (obj.details && obj.app) {
						
							setOnlineUid(uid);
						
						}
					});
				
				} else {
				
					plugins.get('accountOnline').bg_script.timer_main = setTimeout(setOnlineEach, 300000);
					
				}
				
			} 
			
			setOnlineEach();
			
		},
	
		off : function () {
		
			clearTimeout(plugins.get('accountOnline').bg_script.timer_main);
		
			if (plugins.get('accountOnline').bg_script.timer_users) {
				
				jQuery.each(plugins.get('accountOnline').bg_script.timer_users, function(uid) {   
				
					clearTimeout(plugins.get('accountOnline').bg_script.timer_users[uid]);
					
				});
				
			}
			
		}
	
	}
	
};



/*

vkhelper_plugins_list['notiMessage'] = {
	
	lang : {
		ru : {
			cat : 'Основное',
			title : 'Уведомлять о новых сообщениях + быстрый ответ',
			aboutLink : 'http://vk-helper.pro/?p=page/instruction&type=3',
			description : 'Если на любой из подключенных аккаунтов придет сообщение, то браузер оповестит Вас всплывающим сообщением. Уведомление будет отображено на активной вкладке браузера. В полученном уведомлении можно ответить на сообщение не переходя на нужный аккаунт.<br><br><img src="https://vk-helper.pro/image/options/notiMessage_1.jpg" width="341" height="121">',
		
		},
		en : {
			cat : 'Basic',
			title : 'Notify me of new posts with quick reply',
			aboutLink : 'http://vk-helper.pro/?p=page/instruction&type=3'
		}
	},
			
	storage : {
		enabled : false
	}, 
	
	plugins_toggle : {
		proxyUser : false
	}, 
	
	bg_script : {
	
		on : function () {
				
			plugins.enable(
				'longPoll', 
				true, 
				function() {}
			);
				
		},
		
		off : function () {
			
			if (plugins.get('messageInformer').storage.enabled != true) {
			
				plugins.enable(
					'longPoll', 
					false, 
					function() {}
				);
			}
			
		}
		
	}
	
};

*/
	


vkhelper_plugins_list['logoV2'] = {
	
	lang : {
		ru : {
			cat : 'Интерфейс',
			title : 'Заменить логотип VK на Вконтакте',
			aboutLink : 'http://vk-helper.pro/?p=page/instruction&type=4',
			description : 'Логотип социальной сети будет изменен с VK на Вконтакте<br><br><img src="https://vk-helper.pro/image/faq/new_logo_2.png" width="220" height="88">'
		},
		en : {
			cat : 'Interface',
			title : 'Replace the VK logo on Vkontakte',
			aboutLink : 'http://vk-helper.pro/?p=page/instruction&type=4'
		}
	},
	
	css : "\
		html.vkhelper_plugin_logoV2 #top_nav div.top_home_logo { \
			background: url(https://vk.com/images/logo.png) no-repeat; \
			height: 25px; \
			width: 135px; \
			margin: 8px 10px 0 0; \
		}",
			
	storage : {	
		enabled : false
	}
};

vkhelper_plugins_list['feedPostHide'] = {
	
	lang : {
		ru : {
			cat : 'Интерфейс',
			title : 'Скрывать форму "Что у Вас нового?" в ленте новостей',
			aboutLink : 'http://vk-helper.pro/?p=page/instruction&type=5',
			description : 'Форма для публикации новой записи не будет отображаться на странице с новостями(https://vk.com/feed)<br><br><img src="https://vk-helper.pro/image/faq/feed_form.png" width="500" height="186">'
		},
		en : {
			cat : 'Interface',
			title : 'Hide form "What\'s new?" in the news line',
			aboutLink : 'http://vk-helper.pro/?p=page/instruction&type=5'
		}
	},
	
	css : "\
		html.vkhelper_plugin_feedPostHide #main_feed > .feed_post_field_wrap { \
			display: none \
		}",
			
	storage : {	
		enabled : false
	}
};

vkhelper_plugins_list['leftMenuDownLinksHide'] = {
	
	lang : {
		ru : {
			cat : 'Интерфейс',
			title : 'Скрывать ссылки под левым меню (Блог, Разработчикам, ...)',
			aboutLink : 'http://vk-helper.pro/?p=page/instruction&type=7',
			description : 'Ссылки "Блог, Разработчикам, ..." под левым меню будут скрыты<br><br><img src="https://vk-helper.pro/image/faq/left_menu_link_hide.png" width="208" height="106">'
		},
		en : {
			cat : 'Interface',
			title : 'Hide links under the left menu (Blog, Developers, ...)',
			aboutLink : 'http://vk-helper.pro/?p=page/instruction&type=7'
		}
	},
	
	css : "\
		html.vkhelper_plugin_leftMenuDownLinksHide #side_bar_inner div.left_menu_nav_wrap { \
			display: none \
		}",
			
	storage : {	
		enabled : false
	}
};

vkhelper_plugins_list['backgroundWhite'] = {
	
	lang : {
		ru : {
			cat : 'Интерфейс',
			title : 'Белый фон',
			aboutLink : 'http://vk-helper.pro/?p=page/instruction&type=8',
			description : 'Фон социальной сети VK.com будет белым '
		},
		en : {
			cat : 'Interface',
			title : 'White background',
			aboutLink : 'http://vk-helper.pro/?p=page/instruction&type=8'
		}
	},
	
	css : "\
		html.vkhelper_plugin_backgroundWhite body, \
		html.vkhelper_plugin_backgroundWhite .im-page.im-page_classic.im-page_group .im-group-online { \
			background-color: white; \
		}\
		html.vkhelper_plugin_backgroundWhite .im-page_classic.im-page .im-page--header,\
		html.vkhelper_plugin_backgroundWhite .im-page--chat-header  { \
			border-top-color: white; \
		}",
			
	storage : {	
		enabled : false
	}
};

vkhelper_plugins_list['adsLeftHide'] = {
	
	lang : {
		ru : {
			cat : 'Интерфейс',
			title : 'Скрывать рекламу слева',
			aboutLink : 'http://vk-helper.pro/?p=page/instruction&type=9',
			description : 'Реклама в левом блоке будет скрыта.<br><br><img src="https://vk-helper.pro/image/faq/func-ads-left-hide_1.png" width="302" height="532">'
		},
		en : {
			cat : 'Interface',
			title : 'Hide advertising on the left',
			aboutLink : 'http://vk-helper.pro/?p=page/instruction&type=9'
		}
	},
	
	css : "\
		html.vkhelper_plugin_adsLeftHide #ads_left,\
		html.vkhelper_plugin_adsLeftHide #ads_left * { \
			display: none; \
		}",
			
	storage : {	
		enabled : true
	}
};

vkhelper_plugins_list['feedAdvPost'] = {
	
	lang : {
		ru : {
			cat : 'Интерфейс',
			title : 'Скрывать рекламные записи от ВК в ленте новостей',
			aboutLink : 'http://vk-helper.pro/?p=page/instruction&type=10',
			description : 'Рекламные записи от ВК в ленте новостей будут скрыты<br><br><img src="https://vk-helper.pro/image/faq/func-feed-adv-post_1.png" width="500" height="585">'
		},
		en : {
			cat : 'Interface',
			title : 'Hide advertising records from VK in the news line',
			aboutLink : 'http://vk-helper.pro/?p=page/instruction&type=10'
		}
	},
	
	css : "\
		html.vkhelper_plugin_feedAdvPost #content div.post[data-ad-view] { \
			display: none; \
		}",
			
	storage : {	
		enabled : true
	}
	
};

vkhelper_plugins_list['groupWallAdsHide'] = {
	
	lang : {
		ru : {
			cat : 'Интерфейс',
			title : 'Скрывать рекламные записи сообществ',
			aboutLink : 'http://vk-helper.pro/?p=page/instruction&type=11',
			description : 'Рекламные записи сообществ будут скрыты<br><br><img src="https://vk-helper.pro/image/faq/func-group-wall-ads-hide_1.png" width="500" height="605">'
		},
		en : {
			cat : 'Interface',
			title : 'Hide community records',
			aboutLink : 'http://vk-helper.pro/?p=page/instruction&type=11'
		}
	},
	
	storage : {	
		enabled : true
	},
	
	vk_script : {
	
		on : function () {
	
			vkhelper.mutationObserver.add('groupWallAdsHide', function() {
					
				jQuery('.post:has(div.wall_marked_as_ads)').hide(0);	
					
			});
		
		},
		
		off : function () {
		
			jQuery('.post:has(div.wall_marked_as_ads)').show(0);	
			vkhelper.mutationObserver.remove('groupWallAdsHide');
		}
		
	}
};

vkhelper_plugins_list['friendsHistory'] = {
	
	lang : {
		ru : {
			cat : 'Интерфейс',
			title : 'Скрыть "Истории друзей" из ленты новостей',
			aboutLink : 'http://vk-helper.pro/?p=page/instruction&type=12',
			description : 'Блок "Истории друзей" в ленте новостей будет скрыт<br><br><img src="https://vk-helper.pro/image/faq/func-friends-history_1.png" width="500" height="260">'
		},
		en : {
			cat : 'Interface',
			title : 'Hide "Friends stories" from news feed',
			aboutLink : 'http://vk-helper.pro/?p=page/instruction&type=12'
		}
	},
	
	css : "\
		html.vkhelper_plugin_friendsHistory #stories_feed_wrap { \
			display: none; \
		}",
			
	storage : {	
		enabled : false
	}
};

vkhelper_plugins_list['recomendGroupBlockHide'] = {
	
	lang : {
		ru : {
			cat : 'Интерфейс',
			title : 'Скрыть блок "Рекомендуемые сообщества"',
			aboutLink : 'http://vk-helper.pro/?p=page/instruction&type=13',
			description : 'Блок "Рекомендуемые сообщества" на странице сообществ будет скрыт<br><br><img src="https://vk-helper.pro/image/faq/func-recomend-group-block-hide_1.png" width="408" height="691">'
		},
		en : {
			cat : 'Interface',
			title : 'Hide the "Featured Communities" block',
			aboutLink : 'http://vk-helper.pro/?p=page/instruction&type=13'
		}
	},
	
	css : "\
		html.vkhelper_plugin_recomendGroupBlockHide #groups_filters_wrap { \
			display: none; \
		}",
			
	storage : {	
		enabled : false
	}
};

vkhelper_plugins_list['possibleFriendsBlockHide'] = {
	
	lang : {
		ru : {
			cat : 'Интерфейс',
			title : 'Скрыть блок "Возможные друзья"',
			aboutLink : 'http://vk-helper.pro/?p=page/instruction&type=14',
			description : 'Блок "Возможные друзья" на странице с друзьями будет скрыт<br><br><img src="https://vk-helper.pro/image/faq/func-possible-friends-block-hide_1.png" width="398" height="603">'
		},
		en : {
			cat : 'Interface',
			title : 'Hide the "Possible friends" block',
			aboutLink : 'http://vk-helper.pro/?p=page/instruction&type=14'
		}
	},
	
	css : "\
		html.vkhelper_plugin_possibleFriendsBlockHide #friends_possible_block { \
			display: none; \
		}",
			
	storage : {	
		enabled : false
	}
};

vkhelper_plugins_list['leftMenuSettingHide'] = {
	
	lang : {
		ru : {
			cat : 'Интерфейс',
			title : 'Скрыть шестеренку в левом меню',
			aboutLink : 'http://vk-helper.pro/?p=page/instruction&type=15',
			description : 'Шестеренка в левом меню будет скрыта(которая отвечает за редактирование левого меню)<br><br><img src="https://vk-helper.pro/image/faq/func-left-menu-setting-hide_1.png" width="238" height="285">'
		},
		en : {
			cat : 'Interface',
			title : 'Hide the gear in the left menu',
			aboutLink : 'http://vk-helper.pro/?p=page/instruction&type=15'
		}
	},
	
	css : "\
		html.vkhelper_plugin_leftMenuSettingHide #side_bar_inner .left_settings { \
			display: none; \
		}",
			
	storage : {	
		enabled : false
	}
};

vkhelper_plugins_list['profileFullInfo'] = {
	
	lang : {
		ru : {
			cat : 'Интерфейс',
			title : 'Разворачивать подробную информацию о пользователе',
			aboutLink : 'http://vk-helper.pro/?p=page/instruction&type=16',
			description : 'При посещении страницы пользователя, подробная информация о пользователе будет автоматически разворачиваться<br><br><img src="https://vk-helper.pro/image/faq/func-profile-full-info_1.png" width="500" height="248">'
		},
		en : {
			cat : 'Interface',
			title : 'Expand detailed user information',
			aboutLink : 'http://vk-helper.pro/?p=page/instruction&type=16'
		}
	},
	
	css : "\
		html.vkhelper_plugin_profileFullInfo #page_info_wrap .profile_more_info { \
			display: none; \
		}\
		html.vkhelper_plugin_profileFullInfo #page_info_wrap #profile_full { \
			display: block; \
		}",
			
	storage : {	
		enabled : false
	}
};

vkhelper_plugins_list['hideComment'] = {
	
	lang : {
		ru : {
			cat : 'Интерфейс',
			title : 'Скрывать комментарии на стене',
			aboutLink : 'http://vk-helper.pro/?p=page/instruction&type=47',
			description : 'Все комментарии к записям на стенах пользователей и сообществ будут скрыты. Рядом с каждой записью будет отображаться иконка, при нажатии на которую, комментарии отобразятся для просмотра. <br><br><img src="https://vk-helper.pro/image/faq/hideComment_1.png" width="500" height="112">'
		},
		en : {
			cat : 'Interface',
			title : 'Hide comments on the wall',
			aboutLink : 'http://vk-helper.pro/?p=page/instruction&type=47'
		}
	},
	
	css : function () {
		/*
		html.vkhelper_plugin_hideComment div.replies { 
			display: none; 
		}
		*/
	},
	
	storage : {	
		enabled : false
	},
	
	vk_script : {
	
		on : function () {
	
			jQuery('body').on('click', '#content .post .wall_text+.like_wrap div.like_btns > .like_btn.comment:not([vkhelper_postMenu])', function() {
					
				jQuery(this).closest('.post_info').find('.replies').toggle();
					
			});
		
		}
		
	}
};



vkhelper_plugins_list['audioSave'] = {
	
	lang : {
		ru : {
			cat : 'Аудиозаписи',
			title : 'Скачивание аудиозаписей',
			aboutLink : 'http://vk-helper.pro/?p=page/instruction&type=17',
			description : 'При наведении курсором на аудиозапись, будет отображаться иконка для скачивания. Аудиозаписи скачиваются в каталог: <b><small>стандартный_каталог_загрузок</small>/vkhelper/audio/</b><br><br><img src="https://vk-helper.pro/image/faq/save_audio.png" width="460" height="251">',
			
			download_icon : 'Скачать'
		},
		en : {
			cat : 'Audio recordings',
			title : 'Download audio',
			aboutLink : 'http://vk-helper.pro/?p=page/instruction&type=17',
			download_icon : 'Download'
		}
	},
	
	css : "\
		html.vkhelper_plugin_audioSave .vkhelper_saveAudio_icon {\
			background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABW0lEQVR4Xp2TPUjDQBiG34RrAykFyVLFRASlgwVB1NXNRZycShfBIm5ODroU7FJB/KG7hYKoODgJDp1cXHTQpS6itHEwoCEYq2haYvjgoD8mlj7L+8HdPfnuJ8LwXO4YQBIeZ8oGumHBzPHyhAFIFrbSkCWG8fIFuqEwkqZcWj9IMq46vapgIlVCN5wflTE/OUg1QxuGYSCIWCwGTocgFApBURQE4TiOr4DQdR1BaJoWLKAJwQQLZFnuXbBWvKPsWfD1VsG39Qw/pD4VibEEHo0PH8H7K1IzcUQiERKoqopwOAzLslDVdRxePuHhZQij/dG/BUL9ky/Gfn6Xcmd7D6ZpAq4L5v5AQCtii0AA/3L7tVInnA7B7X0V8YEoX0wPqplGowHbtn0PMZsvljKri7PUniiKtOfl9AoJarUaXNeFJEnemEBdMi85VHm/9CaAzHT0Bv9xbU+hiewvJx5hJ9oSrKMAAAAASUVORK5CYII=');\
			background-repeat: no-repeat;\
			background-position: center center;\
			background-size: 60%;\
		}\
		html:not(.vkhelper_plugin_audioSave) .vkhelper_saveAudio_icon {\
			display: none;\
		}",
			
	storage : {	
		enabled : false
	},
	
	vk_script : {
	
		on : function () {
		
			jQuery('html.vkhelper_plugin_audioSave').on('mouseover', '.audio_row:has(.audio_row__actions:not([vkhelper_audioSave]))', function () { 

				jQuery(this)
					.find('.audio_row__actions:not([vkhelper_audioSave])')
					.attr('vkhelper_audioSave', '1')
					.prepend("<button aria-label=\"\" data-action=\"more\" class=\"audio_row__action audio_row__action_more _audio_row__action_more vkhelper_saveAudio_icon\" "+ 
							"	data-title=\""+ vkhelper.lang.get('audioSave', 'download_icon') +"\" onmouseover=\"showTitle(this);\" onclick=\"event.preventDefault();\">"+ 
							"</button>")
					.find('.vkhelper_saveAudio_icon').click(function (event) { 
		
						
						function vkhelper_plugins_audioSave_encodeExtra(url) {

							// code from https://vk.com/js/al/audioplayer.js
            
        		    		function i() {
    		        		    return window.wbopen && ~(window.open + "").indexOf("wbopen")
		            		}
        		    		function o(t) {
    		        		    if (!i() && ~t.indexOf("audio_api_unavailable")) {
            		    		    var e = t.split("?extra=")[1].split("#")
            				          , o = "" === e[1] ? "" : a(e[1]);
            				        if (e = a(e[0]),
            				        "string" != typeof o || !e)
        		    		            return t;
    		        		        o = o ? o.split(String.fromCharCode(9)) : [];
 		           		        for (var s, r, n = o.length; n--; ) {
            		            		if (r = o[n].split(String.fromCharCode(11)),
            		        		    s = r.splice(0, 1, e)[0],
             		    		       !l[s])
             				               return t;
             				           e = l[s].apply(null, r)
            		 		       }
        		     		       if (e && "http" === e.substr(0, 4))
    		         		           return e
		                		}
                				return t
            				}
            				function a(t) {
        		    		    if (!t || t.length % 4 == 1)
    		        		        return !1;
		            		    for (var e, i, o = 0, a = 0, s = ""; i = t.charAt(a++); )
            				        i = r.indexOf(i),
        		    		        ~i && (e = o % 4 ? 64 * e + i : i,
    		        		        o++ % 4) && (s += String.fromCharCode(255 & e >> (-2 * o & 6)));
		            		    return s
            				}
           					function s(t, e) {
            		    		var i = t.length
        		          		, o = [];
    		            		if (i) {
		                		    var a = i;
		                		    for (e = Math.abs(e); a--; )
		                		        e = (i * (a + 1) ^ e + a) % i,
		                		        o[a] = e
        		        		}
    		            		return o
		            		}
       		     		
    		        		var r = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMN0PQRSTUVWXYZO123456789+/=",
		            		    l = {
        		    		        v: function(t) {
    		        		            return t.split("").reverse().join("")
		            		        },
		            		        r: function(t, e) {
            				            t = t.split("");
        		    		            for (var i, o = r + r, a = t.length; a--; )
    		        		                i = o.indexOf(t[a]),
		            		                ~i && (t[a] = o.substr(i - e, 1));
            		        		    return t.join("")
            		    		    },
            				        s: function(t, e) {
            				            var i = t.length;
            				            if (i) {
        		    		                var o = s(t, e)
    		        		                  , a = 0;
		            		                for (t = t.split(""); ++a < i; )
            				                    t[a] = t.splice(o[i - 1 - a], 1, t[a])[0];
               				             t = t.join("")
            		   		         }
        		        		        return t
    		            		    },
		                		    i: function(t, e) {
                		    		    return l.s(t, e ^ vk.id)
                				    },
                				    x: function(t, e) {
                				        var i = [];
            		    		        return e = e.charCodeAt(0),
        		        		        each(t.split(""), function(t, o) {
    		            		            i.push(String.fromCharCode(o.charCodeAt(0) ^ e))
		                		        }),
                		    		    i.join("")
                		  		  }
           		    		}
               		
            		   		return o(url);
     		   		}
        		
        		
						var aid = jQuery(this).closest('.audio_row').data('full-id');
						
						jQuery.ajax({
							method : "POST",
							url : 'https://vk.com/al_audio.php', 
							dataType : 'text', 
							data : {
								act : 'reload_audio', 
								al  : 1, 
								ids : aid
							},
							success : function (data) {
							
								var dataJson = jQuery.parseJSON(data.match(/\[(.*)\]/g)[0])[0],
									url = vkhelper_plugins_audioSave_encodeExtra(dataJson[2]),
									url_dec = url.split('?')[0].split('.'),
									filename = dataJson[4] +' - '+ dataJson[3] +'.'+ url_dec[url_dec.length - 1];
					
					
								vkhelper.messages.sendToBG({ 
									type : 'vkhelper_plugins_audioSave_download', 
									details : {
										url: url,
										filename: 'vkhelper/audio/' + filename
									}
								});
					
							}
						});
						
						event.stopPropagation();
						return false;
		
					});
					
			});
			
		}
		
	}, 
	
	bg_script : {
	
		messages : {
		
			'vkhelper_plugins_audioSave_download' : function (details, tab_id, callback) {

				chrome.downloads.download({
  					url: details.url,
  					filename: details.filename
				});
				
			}
			
		}
		
	}
	
};

vkhelper_plugins_list['audioCoverHide'] = {
	
	lang : {
		ru : {
			cat : 'Аудиозаписи',
			title : 'Скрывать обложку прослушиваемой аудиозаписи',
			aboutLink : 'http://vk-helper.pro/?p=page/instruction&type=19',
			description : 'Включив данную функцию, обложка прослушиваемой аудиозаписи не будет отображаться<br><br><img src="https://vk-helper.pro/image/faq/cover_audio_hide.png" width="500" height="73">'
		},
		en : {
			cat : 'Audio recordings',
			title : 'Hide the cover of the audition',
			aboutLink : 'http://vk-helper.pro/?p=page/instruction&type=19'
		}
	},
	
	css : "\
		html.vkhelper_plugin_audioCoverHide .audio_page_player .audio_page_player__cover { \
			display: none; \
		}",
			
	storage : {	
		enabled : false
	}
};

vkhelper_plugins_list['audioWidthMin'] = {
	
	lang : {
		ru : {
			cat : 'Аудиозаписи',
			title : 'Уменьшить промежутки между аудио',
			aboutLink : 'http://vk-helper.pro/?p=page/instruction&type=18',
			description : 'Аудиозаписи будут отображены меньшего размера чем обычно, что позволит отображать больше аудиозаписей на странице<br><br><img src="https://vk-helper.pro/image/faq/func-audio-width-min_2.png" width="500" height="416">'
		},
		en : {
			cat : 'Audio recordings',
			title : 'Reduce gaps between audio',
			aboutLink : 'http://vk-helper.pro/?p=page/instruction&type=18'
		}
	},
	
	css : "\
		html.vkhelper_plugin_audioWidthMin .audio_page_sections .audio_row .audio_row__cover {\
			background-size: 30px 30px;\
			width: 30px;\
			height: 30px;\
		}\
		html.vkhelper_plugin_audioWidthMin .audio_page_sections .audio_row .audio_row__cover_back {\
			width: 30px;\
			height: 30px;\
		}\
		html.vkhelper_plugin_audioWidthMin .audio_page_sections .audio_row .audio_row__sound_bars {\
			width: 30px;\
			height: 30px;\
			top: 7px;\
			left: 5px;\
		}\
		html.vkhelper_plugin_audioWidthMin .audio_page_sections .audio_row .audio_row__cover_icon {\
			width: 30px;\
			height: 30px;\
		}\
		html.vkhelper_plugin_audioWidthMin .audio_page_sections .audio_row .audio_row__performer_title {\
			height: auto;\
		}\
		html.vkhelper_plugin_audioWidthMin .audio_page_sections .audio_row .audio_row__performer {\
			top: 19px;\
		}\
		html.vkhelper_plugin_audioWidthMin .audio_page_sections .audio_row {\
			height: 44px;\
		}\
		html.vkhelper_plugin_audioWidthMin .audio_page_sections .audio_row .audio_row__inner {\
			padding-left: 44px;\
		}\
		html.vkhelper_plugin_audioWidthMin .audio_page_sections .audio_row .audio_row__title {\
			top: -14px;\
		}\
		html.vkhelper_plugin_audioWidthMin .audio_page_sections .audio_row .audio_row__duration {\
			top: 12px;\
		}\
		html.vkhelper_plugin_audioWidthMin .audio_page_sections .audio_row .audio_row__actions {\
			top: -4px;\
		}",
			
	storage : {	
		enabled : false
	}
};


/*
vkhelper_plugins_list['pollReset'] = {
	
	lang : {
		ru : {
			cat : 'Другое',
			title : 'Возможность отмены своего голоса в опросе',
			aboutLink : 'http://vk-helper.pro/?p=page/instruction&type=20',
			description : 'Возле опросов появляется кнопка "Переголосовать", нажав на нее Ваш голос удалится с опроса и Вы сможете проголосовать за другой вариант<br><br><img src="https://vk-helper.pro/image/options/pollReset_1.jpg" width="500" height="174">',
		
			reset_link    : 'Переголосовать',
			result_link   : 'Результаты',
			
			reset_success : 'Голос отменен. Обновите страницу.',
			
			resultBoxTitle : 'Результаты опроса', 
			resultBoxContent : 'Для просмотра результатов опроса, проголосуйте за любой вариант, после чего вам будут доступны результаты опроса.<br><br>После просмотра результатов, Вы можете отменить свой голос в опросе.'
		},
		en : {
			cat : 'Other',
			title : 'Ability to cancel your vote in the survey',
			aboutLink : 'http://vk-helper.pro/?p=page/instruction&type=20',
			
			reset_link    : 'Re-vote',
			result_link   : 'Results',
			
			reset_success : 'The voice is canceled. Please refresh the page.',
			
			resultBoxTitle : 'View Poll Results', 
			resultBoxContent : 'To view the results of the survey, vote for any option, after which the results of the survey will be available to you.<br><br>After viewing the results, you can cancel your vote in the poll.'
		}
	},

	storage : {	
		enabled : false
	},
	
	css : ".vkhelper_poll_total_btn { color: #939393; }",
	
	vk_script : {
	
		on : function () {
	
			vkhelper.mutationObserver.add('pollReset', function() {
				
				// результаты	
				jQuery('div.page_poll_options:not([vkhelper_pollReset_result])').each(function() {
				  	
					jQuery(this)
			  			.attr('vkhelper_pollReset_result', 1)
			  			.nextAll('div.page_poll_bottom')
			  			.find('div.page_poll_total')
			  			.prepend('<a class="vkhelper_poll_total_btn fl_r" href="#" onclick="return false;" vkhelper_pollReset_result_link>'+ vkhelper.lang.get('pollReset', 'result_link') +'</a> <span class="divider fl_r"></span>')
			  			.find('a[vkhelper_pollReset_result_link]')
			  			.click(function() {
			  				
			  				showFastBox(
			  					vkhelper.lang.get('pollReset', 'resultBoxTitle'),
			  					vkhelper.lang.get('pollReset', 'resultBoxContent')
			  				);
				
			  			});
			  			
			  	});
				
				
				// переголосовать				
				jQuery('div.page_poll_stats:not([vkhelper_pollReset_reset])').each(function() {
			
					jQuery(this)
			  			.attr('vkhelper_pollReset_reset', 1)
			  			.nextAll('div.page_poll_bottom')
			  			.find('div.page_poll_total')
			  			.prepend('<a class="vkhelper_poll_total_btn fl_r" href="#" onclick="return false;" vkhelper_pollReset_reset_link>'+ vkhelper.lang.get('pollReset', 'reset_link') +'</a> <span class="divider fl_r"></span>')
			  			.find('a[vkhelper_pollReset_reset_link]')
			  			.click(function() {

							if (jQuery(this).attr('st') == 'ok') {
								return;
							}
							
							jQuery(this).attr('st', 'ok');
							
			  				showProgress(this);
			  					
			  				var o = jQuery(this).closest('div.page_media_poll').find('input[id^="post_poll_raw"]').val().split('_');
			  				
							vkhelper.messages.sendToBG({ 
								type : 'vkhelper_plugins_pollReset_reset', 
								details : {
									uid : vk.id,
									poll_id: o[1],
									poll_author: o[0], 
									is_board : 0
								}
							});
							
			  			});
				});
			  	
			});
		
		},
		
		off : function () {
			
			vkhelper.mutationObserver.remove('pollReset');
		
		},
	
		messages : {
		
			'vkhelper_plugins_pollReset_reset_success' : function (details) {
			
				if (!details.answers) {
					showDoneBox(vkhelper.lang.get('pollReset', 'reset_success'));
					return;
				}
						
				var post = jQuery('input[id^="post_poll_raw"][value="'+ details.owner_id +'_'+ details.id +'"]').attr('id').substr(13);
				
				ajax.post('/al_wall.php',{
                  act: 'post_tt',
                  post: post,
                  self:1
                  }, {
                     onDone:function(data,js){
                        var poll = geByClass1('page_media_poll_wrap',se(data));
                        var pollOnPage = geByClass1('page_media_poll_wrap',ge('wpt'+ post));
                        if (poll && pollOnPage)
                           pollOnPage.innerHTML = poll.innerHTML;
                     },
                     onFail:function(msg){
                        return true;
                     }
                  }
               );
               
			}
			
		}
		
	},
	
	bg_script : {
	
		messages : {
		
			'vkhelper_plugins_pollReset_reset' : function (details, tab_id, callback) {

				task.add('first', {
					initiator : 'pollReset.bg.msg.vkhelper_plugins_pollReset_reset',
					isVisible : false
				}, function(task_id, task_callback) {
				
					var code = 'var a = API.polls.getById({owner_id : '+ details.poll_author +', poll_id : '+ details.poll_id +', is_board : 0}).answer_id; '+
							   'if (a == 0) return 0; '+ 
							   'var b = API.polls.deleteVote({owner_id : '+ details.poll_author +', poll_id : '+ details.poll_id +', is_board : 0, answer_id : a}); '+
							   'return API.polls.getById({owner_id : '+ details.poll_author +', poll_id : '+ details.poll_id +', is_board : 0}); ';
					
					VK.api('execute', {
						code : code
					}, {
						uid : details.uid,
						task_id : task_id
					}, function(response) {
								
						messages.sendToVk({ 
							type : 'vkhelper_plugins_pollReset_reset_success',
							details : response.details
						}, tab_id);
						
						task_callback();
						
					});
							
				});	
			
			}
			
		}
		
	}
	
};
*/


vkhelper_plugins_list['saveAudionMessage'] = {
	
	lang : {
		ru : {
			cat : 'Диалоги',
			title : 'Скачивание голосовых сообщений',
			aboutLink : 'http://vk-helper.pro/?p=page/instruction&type=27',
			description : 'Функция добавляет возле каждого голосового сообщения кнопку для скачивания. Голосовые сообщения скачиваются в каталог: <b><small>стандартный_каталог_загрузок</small>/vkhelper/audio_message/</b><br><br><img src="https://vk-helper.pro/image/faq/audiomessage.png" width="436" height="71">',	
			
			fields : {
				ext : {
					name  : 'Формат скачивания',
					items : [
						'mp3',
						'ogg'
					]
				}
			}
		},
		en : {
			cat : 'Dialogs',
			title : 'Downloading voice messages',
			aboutLink : 'http://vk-helper.pro/?p=page/instruction&type=27',
			
			fields : {
				ext : {
					name  : 'Download Format',
					items : [
						'mp3',
						'ogg'
					]
				}
			}
		}
	},
	
	fields : {
		ext : {
			type  : 'radio',
			items : [
				{
					value : 'mp3'
				},{
					value : 'ogg'
				}
			]
		}
	},
	
	css : "\
		html:not(.vkhelper_plugin_saveAudionMessage) .vkhelper_saveAudionMessage_link {\
			display: none;\
		}\
		html.vkhelper_plugin_saveAudionMessage .vkhelper_saveAudionMessage_link {\
			border: none;\
			display: block;\
			cursor: pointer;\
			width: 24px;\
			height: 24px;\
			float: left;\
			margin-left: 5px;\
			background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABW0lEQVR4Xp2TPUjDQBiG34RrAykFyVLFRASlgwVB1NXNRZycShfBIm5ODroU7FJB/KG7hYKoODgJDp1cXHTQpS6itHEwoCEYq2haYvjgoD8mlj7L+8HdPfnuJ8LwXO4YQBIeZ8oGumHBzPHyhAFIFrbSkCWG8fIFuqEwkqZcWj9IMq46vapgIlVCN5wflTE/OUg1QxuGYSCIWCwGTocgFApBURQE4TiOr4DQdR1BaJoWLKAJwQQLZFnuXbBWvKPsWfD1VsG39Qw/pD4VibEEHo0PH8H7K1IzcUQiERKoqopwOAzLslDVdRxePuHhZQij/dG/BUL9ky/Gfn6Xcmd7D6ZpAq4L5v5AQCtii0AA/3L7tVInnA7B7X0V8YEoX0wPqplGowHbtn0PMZsvljKri7PUniiKtOfl9AoJarUaXNeFJEnemEBdMi85VHm/9CaAzHT0Bv9xbU+hiewvJx5hJ9oSrKMAAAAASUVORK5CYII=');\
			background-repeat: no-repeat;\
			background-position: center center;\
			background-size: 60%;\
		}\
		html.vkhelper_plugin_saveAudionMessage .audio-msg-track .audio-msg-track--wave-wrapper .audio-msg-track--wave {\
			width: 270px;\
		}",
			
	storage : {	
		enabled : false,
		ext : 'mp3'
	},
	
	
	vk_script : {
	
		on : function () {
		
			vkhelper.mutationObserver.add('saveAudionMessage', function() {
			
				jQuery('div.im_msg_audiomsg:not([vkhelper_saveAudionMessage])').each(function() {
				  	
					jQuery(this)
			  			.attr('vkhelper_saveAudionMessage', 1)
			  			.find('button:first')
						.after('<span class="vkhelper_saveAudionMessage_link"></span>')
						.next('.vkhelper_saveAudionMessage_link')
						.click(function(event) {
							
							var o = jQuery(this).closest('.im_msg_audiomsg').find('div[id^="audiomsgpl_"]');
								
							vkhelper.messages.sendToBG({ 
								type : 'vkhelper_plugins_saveAudionMessage_download', 
								details : {
									ext: {
										'mp3' : o.data('mp3'),
										'ogg' : o.data('ogg')
									}, 
									filename : o.attr('id')
								}
							});
								
							event.stopPropagation();
							return false;
				
						});
						
			  	});
					
			});
			
		},
	
		off : function () {
		
			vkhelper.mutationObserver.remove('saveAudionMessage');
			
		}
		
	}, 
	
	bg_script : {
	
		messages : {
		
			'vkhelper_plugins_saveAudionMessage_download' : function (details, tab_id, callback) {
				
				var ext = plugins.get('saveAudionMessage').storage.ext;
				
				chrome.downloads.download({
  					url: details.ext[ext],
  					filename: 'vkhelper/audio_message/' + details.filename +'.'+ ext
				});
				
			}
			
		}
		
	}
	
};

vkhelper_plugins_list['dialogPassword'] = {
	
	lang : {
		ru : {
			cat : 'Диалоги',
			title : 'Пароль на диалоги',
			aboutLink : 'http://vk-helper.pro/?p=page/instruction&type=26',			
			description : 'При посещении страницы с диалогами, пользователю потребуется ввести пароль, после чего страница станет доступной<br><br><img src="https://vk-helper.pro/image/faq/messages_password.png" width="500" height="213">',	
			
			fields : {
				pin : {
					name  : 'Пароль'
				}
			},
			block_text : 'Для доступа к странице введите пароль'
		},
		en : {
			cat : 'Dialogs',
			title : 'Password for dialogs',
			aboutLink : 'http://vk-helper.pro/?p=page/instruction&type=26',
			fields : {
				pin : {
					name  : 'Password'
				}
			},
			block_text : 'To access the page, enter the password'
		}
	},
		
	fields : {
		pin : {
			type : 'input_password'
		}
	},
	
	css : "\
		html.vkhelper_plugin_dialogPassword:not(.vkhelper_plugin_dialogPassword_success) .fc_tab_wrap, \
		html.vkhelper_plugin_dialogPassword:not(.vkhelper_plugin_dialogPassword_success) #content > .im-page-wrapper, \
		html:not(.vkhelper_plugin_dialogPassword) #vkhelper_dialogPassword_block, \
		html.vkhelper_plugin_dialogPassword.vkhelper_plugin_dialogPassword_success #vkhelper_dialogPassword_block { \
			display: none;  \
		} \
		html.vkhelper_plugin_dialogPassword:not(.vkhelper_plugin_dialogPassword_success) #vkhelper_dialogPassword_block { \
			padding:40px; \
			color:#656565; \
			text-align:center; \
			font-size:2.5em \
		} \
		html.vkhelper_plugin_dialogPassword:not(.vkhelper_plugin_dialogPassword_success) #vkhelper_dialogPassword_block input { \
			text-align:center; \
			font-size:.8em \
		}\
		html.vkhelper_plugin_dialogPassword.vkhelper_plugin_dialogPassword_success #im_dialogs div.ui_scroll_outer { \
			padding-right: 0px; \
		}",
			
	storage : {	
		enabled : false,
		pin     : ''
	},
	
	vk_script : {
	
		on : function () {
		
			vkhelper.messages.sendToBG({ 
				type : 'vkhelper_plugins_dialogPassword_lock', 
				details : {}
			});
								
			vkhelper.mutationObserver.add('dialogPassword', function() {
			
				jQuery('html.vkhelper_plugin_dialogPassword #content > .im-page-wrapper:not([vkhelper_dialogPassword])').each(function () {
			
					jQuery(this)
						.attr('vkhelper_dialogPassword', '1')
						.after('<div id="vkhelper_dialogPassword_block">'+ vkhelper.lang.get('dialogPassword', 'block_text') +':<br><br><input type="password" class="text"></div>')
						.next('#vkhelper_dialogPassword_block')
						.find('input')
						.keydown(debounce(function () {
						
							if (vkhelper.plugins.dialogPassword.storage.pin == jQuery(this).val()) {
							
								jQuery('html').addClass('vkhelper_plugin_dialogPassword_success');
								
								// отправляем запрос на разблокировку запросов
								vkhelper.messages.sendToBG({ 
									type : 'vkhelper_plugins_dialogPassword_unlock', 
									details : {}
								});
								
							}
							
							return false;
							
						}, 250))
						.focus();
					
				});
					
			});
			
		},
	
		off : function () {
		
			vkhelper.mutationObserver.remove('dialogPassword');
			
		}
		
	}, 
	
	bg_script : {
	
		on : function () {
		
			webRequest.add({
				name : 'dialogPassword', 
				event : 'onBeforeRequest', 
				func : function(e){  
					
					if (e.type == "main_frame") {
						return {redirectUrl: "https://vk.com/id0"};
					}
					
					if (!e.requestBody || !e.requestBody.formData || e.requestBody.formData.act != "a_dialogs_preload") {
						return;
					}
					
                	return {cancel: true};
                	
  				}, 
  				filter : {
    				urls: ["*://vk.com/al_im.php", "*://vk.com/im*"], 
    				types: ["xmlhttprequest", "main_frame", "sub_frame"]
  				},
  				opt : ["blocking", "requestBody"]
			});
			
		},
		
		off : function () {
		
			webRequest.remove({
				name : 'dialogPassword', 
				event : 'onBeforeRequest'
			});
			
		},
		
		messages : {
		
			'vkhelper_plugins_dialogPassword_unlock' : function (details, tab_id, callback) {
				plugins.get('dialogPassword').bg_script.off();
			},
		
			'vkhelper_plugins_dialogPassword_lock' : function (details, tab_id, callback) {
				plugins.get('dialogPassword').bg_script.on();
			}
			
		}
	}
	
};

vkhelper_plugins_list['dialogMessageStatRead'] = {
	
	lang : {
		ru : {
			cat : 'Диалоги',
			title : 'Не помечать сообщения как прочитанные',
			aboutLink : 'http://vk-helper.pro/?p=page/instruction&type=24',
			description : 'Все открываемые диалоги будут оставаться непрочитанными для собеседников.<br><br>На <a href="https://vk.com/im" target="_blank">странице с диалогами</a>, возле шестеренки, отображается иконка глазика. Перечеркнутый глазик означает, что сообщения остаются непрочитанными. Если же глазик НЕ перечеркнут, то сообщения будут помечаться как прочитанные. Нажав на глазик, он переключится из одного состояния в другое<br><br><b>Обратите внимание!</b> Внешне может казаться, словно сообщения отмечаются прочитанными – но повторно зайдя в раздел сообщений, вы должны увидеть, что счетчик непрочитанных остался прежним.<br><br><b>Важно!</b> При открытии диалога по прямой ссылке(https://vk.com/im?sel=xxx), непрочитанные сообщения будут помечены как прочитанные(т.е. функция не сработает)<br><br><img src="https://vk-helper.pro/image/options/dialogMessageStatRead_1.jpg" width="330" height="59">',
			keys : 'не показывать собеседнику',
			stat_on : 'Сообщения остаются непрочитанными',
			stat_off : 'Сообщения помечаются как прочитанные'
		},
		en : {
			cat : 'Dialogs',
			title : 'Do not mark messages as read',
			aboutLink : 'http://vk-helper.pro/?p=page/instruction&type=24',
			
			stat_on : 'Messages remain unread',
			stat_off : 'Messages are marked as read'
		}
	},
	
	storage : {	
		enabled : false,
		on : true // блокировка запросов изначально включена(т.е. иконка нажата)
	},
	
	css : "\
		html:not(.vkhelper_plugin_dialogMessageStatRead) #vkhelper_plugins_dialogMessageStatRead_icon {\
			display:none;\
		}\
		html.vkhelper_plugin_dialogMessageStatRead #vkhelper_plugins_dialogMessageStatRead_icon {\
   			background: url(/images/icons/im_actions.png?6) -2px -460px no-repeat;\
    		width: 18px;\
    		height: 18px;\
    		display: block;\
    		float: right;\
    		margin: 14px 5px;\
    		animation: none;\
   			cursor: pointer;\
    	}\
		html.vkhelper_plugin_dialogMessageStatRead #vkhelper_plugins_dialogMessageStatRead_icon:not(.vkhelper_dialogMessageStatRead_icon_on) {\
			background: url(/images/icons/im_actions.png?6) -2px -440px no-repeat;\
		}\
		html.vkhelper_plugin_dialogMessageStatRead #content div.im-page.im-page_classic #vkhelper_plugins_dialogMessageStatRead_icon {\
   			margin: -2px 0px -2px 10px;\
    	}",
		
	vk_script : {
		
		on : function () {
		
			vkhelper.mutationObserver.add('dialogMessageStatRead', function() {
				
				jQuery('#content div._im_dialogs_settings a.im-page--dialogs-settings:not([vkhelper_dialogMessageStatRead]):not([vkhelper_dialogMessageStatRead])').each(function() {
				  	
				  	var st = vkhelper.plugins.dialogMessageStatRead.storage.on,
				  		$this = jQuery(this);
				  		
			  		$this
			  			.attr('vkhelper_dialogMessageStatRead', 1)
			  			.after('<a class="_im_settings_action fl_r" id="vkhelper_plugins_dialogMessageStatRead_icon" data-title onmouseover="showTitle(this);"></a>')
			  			.next('#vkhelper_plugins_dialogMessageStatRead_icon')
			  			.click(function(event) {
			  			
			  				var t = jQuery('#vkhelper_plugins_dialogMessageStatRead_icon').hasClass('vkhelper_dialogMessageStatRead_icon_on');
			  				
			  				vkhelper.messages.sendToBG({ 
								type : 'vkhelper_plugins_dialogMessageStatRead_toggle', 
								details : {
									stat : t ? false : true
								}
							});
			  				
			  				jQuery('#vkhelper_plugins_dialogMessageStatRead_icon')
			  					.toggleClass('vkhelper_dialogMessageStatRead_icon_on', !t)
			  					.attr('data-title', !t ? vkhelper.lang.get('dialogMessageStatRead', 'stat_on') : vkhelper.lang.get('dialogMessageStatRead', 'stat_off'));
			  			
			  				tooltips.hideAll();
			  				showTitle('vkhelper_plugins_dialogMessageStatRead_icon');
			  				
			  				event.stopPropagation();
			  				return false;
			  				
			  			});
				  	
				  	jQuery('#vkhelper_plugins_dialogMessageStatRead_icon')
				  		.toggleClass('vkhelper_dialogMessageStatRead_icon_on', st)
			  			.attr('data-title', st ? vkhelper.lang.get('dialogMessageStatRead', 'stat_on') : vkhelper.lang.get('dialogMessageStatRead', 'stat_off'));
				  		
			  	});
			  	
			}); 
			
		},
		
		off : function () {
		
			vkhelper.mutationObserver.remove('dialogMessageStatRead');
			
		}
		
	},
		  
	bg_script : {
	
		on : function () {
		
			// проверяем или включена функция, если да, то начинаем блокировать

			if (plugins.storage.get('dialogMessageStatRead').on == true) { 
				plugins.get('dialogMessageStatRead').bg_script.functions.lock();
			}
			
		},
	
		off : function () {
		
			plugins.get('dialogMessageStatRead').bg_script.functions.unlock();
			
		},
		
		messages : {
		
			'vkhelper_plugins_dialogMessageStatRead_toggle' : function (details, tab_id, callback) {

				var strg = plugins.storage.get('dialogMessageStatRead');
				
					strg.on = details.stat;
				
				plugins.storage.set('dialogMessageStatRead', strg);
				
				if (details.stat == true) {
					plugins.get('dialogMessageStatRead').bg_script.functions.lock();
				} else {
					plugins.get('dialogMessageStatRead').bg_script.functions.unlock();
				}
					
			}
			
		},
		
		functions : {
			
			lock : function () {
			
				webRequest.add({
					name : 'dialogMessageStatRead', 
					event : 'onBeforeRequest', 
					func : function(e){  

						var act = '';
						
						if (e.requestBody && e.requestBody.formData && e.requestBody.formData.act) {
						
  							act = e.requestBody.formData.act[0];
  							
  						} else if (e.requestBody && e.requestBody.raw && e.requestBody.raw[0] && e.requestBody.raw[0].bytes) {
                	
                			var o = {};
            				var a = plugins.get('dialogMessageStatRead').bg_script.functions.arrayBufferToString(e.requestBody.raw[0].bytes);
						
               				a.split('&').map(function(v) { return v.split('='); }).forEach(function(k) { o[k[0]] = k[1]; });

							act = o.act;
						
            			}
            			
            			if (act == "a_mark_read") {
               				return {cancel: true}; 
						}
						
  					}, 
  					filter : {
    					urls: ["*://vk.com/al_im.php"], 
    					types: ["xmlhttprequest"]
  					},
  					opt : ["blocking", "requestBody"]
				});
			
			},
			
			unlock : function () {
			
				webRequest.remove({
					name : 'dialogMessageStatRead', 
					event : 'onBeforeRequest'
				});
			
			},
		
			arrayBufferToString : function (buffer) {
			
				var byteArray = new Uint8Array(buffer);
				var str = "", cc = 0, numBytes = 0;
 				   for(var i=0, len = byteArray.length; i<len; ++i){
 				       var v = byteArray[i];
 				       if(numBytes > 0){
 				           //2 bit determining that this is a tailing byte + 6 bit of payload
 				           if((cc&192) === 192){
 				               //processing tailing-bytes
 				               cc = (cc << 6) | (v & 63);
  				          }else{
 				               throw new Error("this is no tailing-byte");
  				          }
 				       }else if(v < 128){
  				          //single-byte
  				          numBytes = 1;
  				          cc = v;
  				      }else if(v < 192){
  				          //these are tailing-bytes
  				          throw new Error("invalid byte, this is a tailing-byte")
  				      }else if(v < 224){
  				          //3 bits of header + 5bits of payload
  				          numBytes = 2;
  				          cc = v & 31;
  				      }else if(v < 240){
  				          //4 bits of header + 4bit of payload
  				          numBytes = 3;
  				          cc = v & 15;
  				      }else{
  				          //UTF-8 theoretically supports up to 8 bytes containing up to 42bit of payload
 				           //but JS can only handle 16bit.
 				           throw new Error("invalid encoding, value out of range")
 				       }

 				       if(--numBytes === 0){
 				           str += String.fromCharCode(cc);
 				       }
 				   }
 				   if(numBytes){
 				       throw new Error("the bytes don't sum up");
 				   }
 				   return str;
			}
			
		}
			
	}
	
};

vkhelper_plugins_list['dialogHideTyping'] = {
	
	lang : {
		ru : {
			cat : 'Диалоги',
			title : 'Не показывать собеседнику, когда вы набираете сообщение',
			aboutLink : 'http://vk-helper.pro/?p=page/instruction&type=23',
			description : 'На странице с открытым диалогом, возле поля для ввода сообщения, отображается иконка карандашика. Перечеркнутый карандашик означает, что собеседник НЕ видит, когда Вы набираете сообщение. Если же карандашик НЕ перечеркнут, то собеседник видит, когда Вы набираете сообщение. Нажав на карандашик, он переключится из одного состояния в другое<br><br><img src="https://vk-helper.pro/image/options/dialogHideTyping_1.jpg" width="500" height="96"><br><br><img src="https://vk-helper.pro/image/faq/writeStat.png" width="223" height="38">',
		
			stat_on : 'Собеседник НЕ видит, когда вы набираете сообщение',
			stat_off : 'Собеседник видит, когда вы набираете сообщение'
		},
		en : {
			cat : 'Dialogs',
			title : 'Do not show the other person when you type the message',
			aboutLink : 'http://vk-helper.pro/?p=page/instruction&type=23',
			
			stat_on : 'The other person does not see when you type the message',
			stat_off : 'The interlocutor sees when you type'
		}
	},
	
	storage : {	
		enabled : false,
		on : true // блокировка запросов изначально включена(т.е. иконка нажата)
	},
	
	css : "\
		html:not(.vkhelper_plugin_dialogHideTyping) #vkhelper_plugins_dialogHideTyping_icon {\
			display:none;\
		}\
		html.vkhelper_plugin_dialogHideTyping #vkhelper_plugins_dialogHideTyping_icon {\
   			position: absolute;\
    		z-index: 2;\
    		overflow: hidden;\
    		right: 71px;\
    		bottom: 0;\
		}\
		html.vkhelper_plugin_dialogHideTyping #vkhelper_plugins_dialogHideTyping_icon > label {\
			background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACLklEQVR42mNgAIIWBgZ5EGbAAioqKqJbWlo+19bWfgKyXTAUdDAw6LczMPwH4TYGhnhkubKysui+vr4vv379+v/gwYO/tTk5X6t8fKLQDfCHGQA1xB4kXlRUFNfd3Q3WDAJ7urrgaqpsbNJQDAEKzkcy4H2Fi0t1e3s7XPPpTZv+I1tS4ev7LTc31wXdkP1wQzg4/j85fRqhmZMTrnl5cPD/NWvW/Kuvr/+VmZnpguwV/hYOjgcwhdMUFP4fX7ECRfM0Tc3/e/fu/T9x4sT/a9eu/ZuVlfUJbkBCQoJqTUnJlzn6+gjnsrKiaN65ceP/SZMm/V+wYMH/FUDDy8vLv8INiImJ6QUK/Nm8ePH/Lh4eUFjANU9VVwdrBtkM0rx8+fL/dXV134B6qsCaQ0NDOePi4j6dPXsWrKhKTAw5Vv5Pt7RE0VxVVfUtIiKiCm57YGBgKFDyJyjQ1kdHo4Q4DE+wsQFrBrryW0hISBVKDPj5+W2+ffv2v83x8SiaGk1NUfi1hoa/fX19UTU7OzsrxcbGfjk3Zw6K4k0NDf937dr1vzkw8D9aQkNJrQxubm4N89vafiMrWl9b+//EiRNgPHXq1H8lFhYo8qDkDzfA2tr6wc7+/n8wyXleXqCE8rexsfFHUFDQFycnp6NAnIicWkHJH26AhobGT2AY/J+dkfGv0d//F5D9xc7O7oitrW2pubm5DLJrQc7H8IKsrOwdVVXVn2ZmZmeArsHQRAgAALtVemfCF61VAAAAAElFTkSuQmCC') 50% no-repeat;\
    		width: 24px;\
    		height: 24px;\
    		padding: 6px 7px 6px 5px;\
    		opacity: 0.7;\
    		cursor: pointer;\
    		display: block;\
		}\
		html.vkhelper_plugin_dialogHideTyping #vkhelper_plugins_dialogHideTyping_icon:not(.vkhelper_dialogHideTyping_icon_on) > label {\
			background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAmNJREFUeNqMUrtrWnEUPlevj8RgNL4HMxQcDCLBIQmKg6CQwanBxYAUpFAJCIFI/gFrJldpodCxFEMfS3XopIODSJQmJKiDb0wQdYhefMWe3wWD1jTkwIF7f+d85/F9h5pOpzBv4XB44b/T6Ryurq5+GAwG08lk8loqlf6ej3PgGWu1WodyufxjIBBY83q9Ig6H8wPf7C8q0Gw2PQR8dHQk4vF4MBqNOEqlUkRR1HeM2Z8tUKvVCDji9/tZcLFYhFgsBnt7e3BwcLCCa3/DHPuTBUqlkkehUESOj48fwfF4HHZ3d0EikRDnms3mNeTiF+baFwr4fD4WfHJyIuLz+Y/gnZ0dQACbUy6XyYSU0Wjkkklo8uhyuWB9fV2n0Wgip6enS+CNjQ0WXKlU4OrqiuQCqsIRi8VcetZ9OBy+G4/HwkQiAUgWJJPJJfDl5SULFggEcH19zdTr9ffsCrjrCkr0FifhYgDOzs5ge3v7v2D8ZvL5fBDXCLEToETO/f19gclkAp1OB41GA/r9/pPgXC7H4HpBVCRE4rMCHovFwsNLg2q1Cpubm3B+fg4qlQru7+/BYDAA4SWTyTCFQiFotVpDs9Vpp9P5SiaT2bRaLUW6MQzDSka83W5DKpUCUjidTrNj22y20LxyNBLnwfH5pNPd3d3CTSDLgLJOsfMQ5Qs6HI7Qv3dD93q9N1tbWzSRjXQidnt7+4ByjbLZ7Ljb7ebw6RPewWe1Wr10tZRerx8gcXy32/1wc3Mzuri4IKAsxn6if8EJarPkaDS6XAAJKwqFQi2e6B8k6isB4Q3U4IX2V4ABABLtJ0KgAjIKAAAAAElFTkSuQmCC') 50% no-repeat;\
		}\
		html.vkhelper_plugin_dialogHideTyping div.im-chat-input .im-chat-input--text {\
			padding-right: 105px;\
		}",
	
	vk_script : {
		
		on : function () {
		
			vkhelper.mutationObserver.add('dialogHideTyping', function() {
					
				jQuery('#content div.im-chat-input--txt-wrap:not([vkhelper_dialogHideTyping])').each(function() {
				  	
				  	var st = vkhelper.plugins.dialogHideTyping.storage.on,
				  		$this = jQuery(this);
					
			  		$this
			  			.attr('vkhelper_dialogHideTyping', 1)
			  			.prepend('<div id="vkhelper_plugins_dialogHideTyping_icon"><label data-title onmouseover="showTitle(this);"></label></div>')
			  			.find('#vkhelper_plugins_dialogHideTyping_icon')
			  			.click(function(event) {
			  			
			  				var t = jQuery('#vkhelper_plugins_dialogHideTyping_icon').hasClass('vkhelper_dialogHideTyping_icon_on');
			  				
			  				vkhelper.messages.sendToBG({ 
								type : 'vkhelper_plugins_dialogHideTyping_toggle', 
								details : {
									stat : t ? false : true
								}
							});
			  				
			  				jQuery('#vkhelper_plugins_dialogHideTyping_icon')
			  					.toggleClass('vkhelper_dialogHideTyping_icon_on', !t)
			  					.find('label')
			  					.attr('data-title', !t ? vkhelper.lang.get('dialogHideTyping', 'stat_on') : vkhelper.lang.get('dialogHideTyping', 'stat_off'));
			  			
			  				tooltips.hideAll();
			  				showTitle(document.querySelector('#vkhelper_plugins_dialogHideTyping_icon > label'));
			  				
			  				event.stopPropagation();
			  				return false;
			  				
			  			});
				  	
				  	jQuery('#vkhelper_plugins_dialogHideTyping_icon')
				  		.toggleClass('vkhelper_dialogHideTyping_icon_on', st)
				  		.find('label')
			  			.attr('data-title', st ? vkhelper.lang.get('dialogHideTyping', 'stat_on') : vkhelper.lang.get('dialogHideTyping', 'stat_off'));
				  		
			  	});
			  	
			}); 
			
		},
		
		off : function () {
		
			vkhelper.mutationObserver.remove('dialogHideTyping');
			
		}
		
	},
 		  
	bg_script : {
	
		on : function () {
		
			// проверяем или включена функция, если да, то начинаем блокировать

			if (plugins.storage.get('dialogHideTyping').on == true) { 
				plugins.get('dialogHideTyping').bg_script.functions.lock();
			}
			
		},
	
		off : function () {
		
			plugins.get('dialogHideTyping').bg_script.functions.unlock();
			
		},
		
		messages : {
		
			'vkhelper_plugins_dialogHideTyping_toggle' : function (details, tab_id, callback) {

				var strg = plugins.storage.get('dialogHideTyping');
				
					strg.on = details.stat;
				
				plugins.storage.set('dialogHideTyping', strg);
				
				if (details.stat == true) {
					plugins.get('dialogHideTyping').bg_script.functions.lock();
				} else {
					plugins.get('dialogHideTyping').bg_script.functions.unlock();
				}
					
			}
			
		},
		
		functions : {
			
			lock : function () {
			
				webRequest.add({
					name : 'dialogHideTyping', 
					event : 'onBeforeRequest', 
					func : function(e){  
	
						if (e.requestBody && e.requestBody.formData && e.requestBody.formData.act && e.requestBody.formData.act[0] == "a_typing") {
  							return {cancel: true}; 
  						}
                	
  					}, 
  					filter : {
    					urls: ["*://vk.com/al_im.php"], 
    					types: ["xmlhttprequest"]
  					},
  					opt : ["blocking", "requestBody"]
				});
			
			},
			
			unlock : function () {
			
				webRequest.remove({
					name : 'dialogHideTyping', 
					event : 'onBeforeRequest'
				});
			
			}
			
		}
			
	}
	
};



vkhelper_plugins_list['superBan'] = {
	
	lang : {
		ru : {
			cat : 'Для админов',
			title : 'Супер-БАН пользователей по комментариям',
			aboutLink : 'http://vk-helper.pro/?p=page/instruction&type=28',
			description : 'Данная функция позволяет удалять спамеров по комментариям в СВОИХ сообществах в 1 клик<br><br><img src="https://vk-helper.pro/image/faq/group_ban_1.png" width="500" height="175">',
			fields : {
				action : {
					name  : 'Событие',
					items : [
						'Бан без удаления комментариев',
						'Бан и удаление выбранного комментария'
					]
				},
				reason : {
					name  : 'Причина блокировки',
					items : [
						'Другое',
						'Спам',
						'Оскорбление участников',
						'Нецензурные выражения',
						'Сообщения не по теме'
					]
				},
				end_date : {
					name  : 'Время блокировки',
					items : [
						'Год',
						'Месяц',
						'Неделя',
						'День',
						'Час'
					]
				},
				comment : {
					name  : 'Комментарий'
				},
				comment_visible : {
					name  : 'Показывать этот комментарий заблокированному пользователю'
				}
			},
			
			linkTitle : 'Супер-БАН',
			tabRequest_errorTitle : 'Ошибка!',
			tabRequest_errorNoPage : 'Функцией Супер-БАН можно пользоваться только на своей странице и в своих сообществах.',
			tabRequest_errorNoYouAccount : 'Нельзя блокировать свой аккаунт',
			tabRequest_errorNoBanAdmin : 'Нельзя блокировать руководителя страницы',
			tabRequest_errorDeleteComment : 'Не удалось удалить комментарий',
			tabRequest_errorBanUser : 'Не удалось заблокировать пользователя',
			tabRequest_banUser : 'Пользователь заблокирован',
			tabRequest_successTitle : 'Отлично!',
			tabRequest_successContent : 'Комментарий удален'
		},
		en : {
			cat : 'For admins',
			title : 'Super-BAN users by comments',
			aboutLink : 'http://vk-helper.pro/?p=page/instruction&type=28',
			fields : {
				action : {
					name  : 'Event',
					items : [
						'Ban without deleting comments',
						'Ban and delete the selected comment'
					]
				},
				reason : {
					name  : 'Reason for blocking',
					items : [
						'Other',
						'Spamming',
						'Insulting the participants',
						'Obscene expressions',
						'Off-Topic Messages'
					]
				},
				comment : {
					name  : 'A comment'
				},
				comment_visible : {
					name  : 'Show this comment to a blocked user'
				}
			},
			
			linkTitle : 'Super-BAN',
			tabRequest_errorTitle : 'Error!',
			tabRequest_errorNoPage : 'Super-BAN can only be used on its own page and in its communities.',
			tabRequest_errorNoYouAccount : 'You can not block your account',
			tabRequest_errorNoBanAdmin : 'You can not block the page manager',
			tabRequest_errorDeleteComment : 'Failed to delete comment',
			tabRequest_errorBanUser : 'The user could not be blocked',
			tabRequest_banUser : 'User is blocked',
			tabRequest_successTitle : 'Excellent!',
			tabRequest_successContent : 'Comment deleted'
		}
	},
	
	fields : {
	
		action : {
			type  : 'radio',
			items : [
				{
					value : 0
				},{
					value : 1
				}
			]
		},
							
		reason : {
			type  : 'select',
			items : [
				{
					value : 0
				},{
					value : 1
				},{
					value : 2
				},{
					value : 3
				},{
					value : 4
				}
			]
		},	
		
		end_date : {
			type  : 'select',
			items : [
				{
					value : 0
				},{
					value : 1
				},{
					value : 2
				},{
					value : 3
				},{
					value : 4
				}
			]
		},
		
		comment : {
			type : 'input_text'
		},
		
		comment_visible : {
			type : 'input_checkbox'
		}
		
	},
	
	storage : {	
		enabled : false,
		action : 0,
		reason : 0
	},
	
	css : function () {
		/*
		html:not(.vkhelper_plugin_superBan) .vkhelper_superBan_link {
			display: none;
		}
		html.vkhelper_plugin_superBan .vkhelper_superBan_link {
			background-image: none;
			width: auto;
			margin-top: -1px;
			font-weight: bold;
			color: #607B8B;
		}
		*/
	},
	
	vk_script : {
		
		on : function () {
		
			jQuery('html.vkhelper_plugin_superBan').on('mouseover', '.reply_dived[data-post-id]:not([vkhelper_superBan])', function () {

				jQuery(this)
					.attr('vkhelper_superBan', '1')
					.find('.post_actions')
					.append('<div class="reply_action fl_r vkhelper_superBan_link" data-title="'+ vkhelper.lang.get('superBan', 'linkTitle') +'" onmouseover="showTitle(this);">BAN</div>')
					.find('.vkhelper_superBan_link')
					.click(function(event) {
					
						var id_user = jQuery(this).parents('.reply_content').find('a.author').attr('data-from-id');
						var id_page = jQuery(this).parents('.post').attr('data-post-id').split('_')[0];
						var comment_id = jQuery(this).parents('.reply').attr('data-post-id').split('_')[1];
	
						vkhelper.messages.sendToBG({ 
							type : 'vkhelper_plugins_superBan_start', 
							details : {
								uid : vk.id,
								id_user : id_user,
								id_page : id_page,
								comment_id : comment_id
							}
						});
						
						event.stopPropagation();
						return false;
							
					});
			
			});
				
		}
		
	},
 		
	bg_script : {
	
		messages : {
		
			'vkhelper_plugins_superBan_start' : function (details, tab_id, callback) {

				if (details.id_page > 0 && details.uid != details.id_page) {
				
					messages.sendToVk({ 
						type : 'system_doneBox',
						details : {
							text : lang.get('superBan', 'tabRequest_errorNoPage')
						}
					}, tab_id);
					return;
				}
				
				if (details.id_user == details.uid) {
				
					messages.sendToVk({ 
						type : 'system_doneBox',
						details : {
							text : lang.get('superBan', 'tabRequest_errorNoYouAccount')
						}
					}, tab_id);
					return;
				}
				
				if (details.id_user == details.id_page) {
				
					messages.sendToVk({ 
						type : 'system_doneBox',
						details : {
							text : lang.get('superBan', 'tabRequest_errorNoBanAdmin')
						}
					}, tab_id);
					return;
				}
				
				task.add('first', {
					initiator : 'superBan.bg.msg.vkhelper_plugins_superBan_start',
					isVisible : false
				}, function(task_id, task_callback) {
				
					if (details.id_page < 0) {
					
						VK.api('groups.getById', {
							group_id : -details.id_page
						}, {
							uid : details.uid,
							task_id : task_id
						}, function(response) {
						
							if (response.details[0].is_admin != 1) {
									
								messages.sendToVk({ 
									type : 'system_doneBox',
									details : {
										text : lang.get('superBan', 'tabRequest_errorNoPage')
									}
								}, tab_id);
								task_callback();
								return;
							}
									
							go();
							
						});
						return;
					}
					
					go();
				
					function go() {
					
						var d = plugins.get('superBan').storage;
				
						// удаление выбранного комментария
						if (d.action == 1) {	
					
							VK.api('wall.deleteComment', {
								owner_id   : details.id_page,
								comment_id : details.comment_id
							}, {
								uid : details.uid,
								task_id : task_id
							}, function(response) {
							
								if (response.details == 1) {
									// удален
									/*	
									messages.sendToVk({ 
										type : 'system_doneBox',
										details : {
											text : lang.get('superBan', 'tabRequest_successContent')
										}
									}, tab_id);
									*/
									return;
								}
								
								messages.sendToVk({ 
									type : 'system_doneBox',
									details : {
										text : lang.get('superBan', 'tabRequest_errorDeleteComment')
									}
								}, tab_id);
								task_callback();
								return;
								
							});
						
						}
					
						if (details.id_page > 0) {
							// страница
							var method = 'account.banUser';
							var params = {
								user_id : details.id_user
							};
						} 
						else {
							// сообщество
							
							var end_date = [
								60*60*24*365,
								60*60*24*30,
								60*60*24*7,
								60*60*24,
								60*60
							];
							var method = 'execute';
							var params = {
								code : ' var n = API.utils.getServerTime(); '+
									   ' return API.groups.banUser({ '+
									   '   "group_id" : '+ -details.id_page +', '+
									   '   "user_id" : '+ details.id_user +', '+
									   '   "end_date" : n + '+ end_date[Number(d.end_date)+1 || 0] +', '+
									   '   "reason" : "'+ (d.reason || 0) +'", '+
									   '   "comment" : "'+ (d.comment || "") +'", '+
									   '   "comment_visible" : "'+ (d.comment_visible || 0) +'" '+
									   ' });'	
							};
						}
						
						VK.api(method, params, {
							uid : details.uid,
							task_id : task_id
						}, function(response) {
						
							if (response.details == 1) {
									
								messages.sendToVk({ 
									type : 'system_doneBox',
									details : {
										text : lang.get('superBan', 'tabRequest_banUser')
									}
								}, tab_id);
								task_callback();
								return;
							}
								
							messages.sendToVk({ 
								type : 'system_doneBox',
								details : {
									text : lang.get('superBan', 'tabRequest_errorBanUser')
								}
							}, tab_id);
							task_callback();
							return;
							
						});
						
					}
									
				});	
				
			}
			
		}
		
	}
	
};

vkhelper_plugins_list['wikiPagesInClub'] = {
	
	lang : {
		ru : {
			cat : 'Для админов',
			title : 'Управление Wiki-страницами',
			aboutLink : 'http://vk-helper.pro/?p=page/instruction&type=40',
			description : 'В меню сообщества появляется пункт "Wiki-страницы". Нажав на этот пункт пользователь может просмотреть все wiki-страницы сообщества и создать новую wiki-страницу<br><br><img src="https://vk-helper.pro/image/faq/wikiPagesInClub_1.png" width="313" height="357"><br><br><img src="https://vk-helper.pro/image/faq/wikiPagesInClub_2.png" width="500" height="203">',
			
			link : 'Wiki-страницы',
			notWikiPages : 'В сообществе нет Wiki-страниц',
			copyLink : 'Скопировать ссылку на Wiki-страницу',
			messageBox_title : 'Управление Wiki-страницами',
			messageBox_btnCreate : 'Создать новую страницу',
			messageBox_writeTitle : 'Укажите заголовок страницы',
			messageBox_loading : 'Загрузка...',
			
			messageBox_table_title : 'Заголовок',
			messageBox_table_views : 'Просмотры',
			messageBox_table_date_create : 'Создание',
			messageBox_table_editing : 'Редактирование',
			messageBox_table_actions : 'Действия'
		},
		en : {
			cat : 'For admins',
			title : 'Managing Wiki Pages',
			aboutLink : 'http://vk-helper.pro/?p=page/instruction&type=40',
			
			link : 'Wiki pages',
			notWikiPages : 'There are no Wiki pages in the community',
			copyLink : 'Copy the link to the Wiki page',
			messageBox_title : 'Managing Wiki Pages',
			messageBox_btnCreate : 'Create a new page',
			messageBox_writeTitle : 'Specify the page title',
			messageBox_loading : 'Loading...',
			
			messageBox_table_title : 'Title',
			messageBox_table_views : 'Views',
			messageBox_table_date_create : 'Create',
			messageBox_table_editing : 'Edit',
			messageBox_table_actions : 'Actions'
		}
	},
	
	storage : {	
		enabled : false
	},
	
	css : "\
		html:not(.vkhelper_plugin_wikiPagesInClub) .vkhelper_wikiPagesInClub_button {\
			display:none;\
		}\
		#vkhelper_wikiPagesInClub_table {\
			width: 100%;\
			border-collapse: collapse;\
		}\
		#vkhelper_wikiPagesInClub_table td, #vkhelper_wikiPagesInClub_table th {\
			padding: 3px;\
			border: 1px solid #bdb7b7;\
			text-align:center;\
		}\
		#vkhelper_wikiPagesInClub_table th {\
			background: #c5d3e2;\
		}",
	
	vk_script : {
		
		on : function () {
		
			jQuery('html.vkhelper_plugin_wikiPagesInClub').on('click', '#public_actions_wrap div.page_actions_cont:not([vkhelper_wikiPagesInClub]):not(a[href^="/stats?gid="]), #group_actions_wrap div.page_actions_cont:not([vkhelper_wikiPagesInClub]):not(a[href^="/stats?gid="])', function() {

				jQuery(this)
					.attr('vkhelper_wikiPagesInClub', '1')
					.find('.page_actions_inner')
					.append('<a class="page_actions_item vkhelper_wikiPagesInClub_button" href="#" tabindex="0" role="link">'+ vkhelper.lang.get('wikiPagesInClub', 'link') +'</a>')
					.find('a.vkhelper_wikiPagesInClub_button')
					.click(function(event) {
					
						vkhelper.plugins.wikiPagesInClub.vk_script.functions.openBox();
						
						event.stopPropagation();
						
						return false;
						
					});

			});
			
		},
		
		messages : {
			
			'vkhelper_plugins_wikiPagesInClub_getListPages_Success' : function (details) {
				
				if (!details.list.length) {
					jQuery('#vkhelper_wikiPagesInClub_BoxContent').html('<b>'+ vkhelper.lang.get('wikiPagesInClub', 'notWikiPages') +'</b>');
					return;
				}
				
				var t = '';
				jQuery.each(details.list, function(k,v){
					
					var d_created = new Date(v.created * 1000);
					var time_created = d_created.getDate() +'.'+ (d_created.getMonth()+1) +'.'+ d_created.getFullYear() +' '+ d_created.getHours() +':'+ d_created.getMinutes();
					var link_created = v.creator_id && v.creator_name ? '<br><a href="https://vk.com/id'+ v.creator_id +'" target="_blank">'+ v.creator_name +'</a>' : '';
					
					var d_edited = new Date(v.edited * 1000);
					var time_edited = d_edited.getDate() +'.'+ (d_edited.getMonth()+1) +'.'+ d_edited.getFullYear() +' '+ d_edited.getHours() +':'+ d_edited.getMinutes();
					var link_edited = v.editor_id && v.editor_name ? '<br><a href="https://vk.com/id'+ v.editor_id +'" target="_blank">'+ v.editor_name +'</a>' : '';

					t += '<tr>'+
							'<td><a href="https://vk.com/page-'+ v.group_id +'_'+ v.id +'" target="_blank">'+ v.title +'</a></td>'+
							
							'<td>'+ v.views +'</td>'+
							
							'<td>'+ time_created +' '+ link_created +'</td>'+
							
							'<td>'+ time_edited +' '+ link_edited +'</td>'+
							
							'<td>'+
								'<a href="#" onclick="showFastBox(\''+ vkhelper.lang.get('wikiPagesInClub', 'copyLink') +'\', \'<input id=\\\'vkhelper_wiki_copy\\\' type=\\\'text\\\' value=\\\'page-'+ v.group_id +'_'+ v.id +'\\\' class=\\\'dark\\\' style=\\\'width:100%; text-align:center\\\'>\'); jQuery(\'#vkhelper_wiki_copy\').focus().select(); return false;" target="_blank">Copy</a>'+
							'</td>'+
						 '</tr>';
					
				});
				
				
				t = '<table id="vkhelper_wikiPagesInClub_table"><tr>'+
						'<th>'+ vkhelper.lang.get('wikiPagesInClub', 'messageBox_table_title') +'</th>'+
						'<th>'+ vkhelper.lang.get('wikiPagesInClub', 'messageBox_table_views') +'</th>'+
						'<th>'+ vkhelper.lang.get('wikiPagesInClub', 'messageBox_table_date_create') +'</th>'+
						'<th>'+ vkhelper.lang.get('wikiPagesInClub', 'messageBox_table_editing') +'</th>'+
						'<th>'+ vkhelper.lang.get('wikiPagesInClub', 'messageBox_table_actions') +'</th>'+
					'</tr>' + t + '</table>';
					
				jQuery('#vkhelper_wikiPagesInClub_BoxContent').html(t);
								
			}
			
		},
		
		functions : {
		
			openBox : function () {
				
				var a = new MessageBox({
					title : vkhelper.lang.get('wikiPagesInClub', 'messageBox_title') +' <button style="margin: 12px;" class="flat_button" onclick="var a = prompt(\''+ vkhelper.lang.get('wikiPagesInClub', 'messageBox_writeTitle') +':\'); if (a && a.trim() != \'\') { window.open(\'http://vk.com/pages?oid='+ cur.oid +'&p=\'+ a); } ">'+ vkhelper.lang.get('wikiPagesInClub', 'messageBox_btnCreate') +'</button>',
					width : 900,
					grey  : true, 
					hideButtons : true
				})
					.content('<div id="vkhelper_wikiPagesInClub_BoxContent">'+ vkhelper.lang.get('wikiPagesInClub', 'messageBox_loading') +'</div>')
					.show();
				
				vkhelper.messages.sendToBG({ 
					type : 'vkhelper_plugins_wikiPagesInClub_getListPages', 
					details : {
						uid : vk.id,
						club_id : -cur.oid
					}
				});
									
			
			}
		
		}
		
	},
	
	bg_script : {
		
		messages : {
		
			'vkhelper_plugins_wikiPagesInClub_getListPages' : function (details, tab_id, callback) {

				task.add('first', {
					initiator : 'wikiPagesInClub.bg.msg.vkhelper_plugins_wikiPagesInClub_getListPages',
					isVisible : false
				}, function(task_id, task_callback) {
				
					VK.api('pages.getTitles', {
						group_id : details.club_id
					}, {
						uid : details.uid,
						task_id : task_id
					}, function(response) {
								
						messages.sendToVk({
							type : 'vkhelper_plugins_wikiPagesInClub_getListPages_Success', 
							details : {
								list : response.details
							}
						}, tab_id);
						
						task_callback();
						
					});
							
				});
				
			}
			
		}
			
	}
	
};

vkhelper_plugins_list['selectSubscribeClub'] = {
	
	lang : {
		ru : {
			cat : 'Для админов',
			title : 'Выделять подписчиков сообщества',
			aboutLink : 'http://vk-helper.pro/?p=page/instruction&type=38',			
			description : 'На стене сообщества, все пользователи будут выделяться красным и синим цветом.<br>Красный - пользователь не является участником сообщества;<br>Синий - является участником сообщества. <br><br><img src="https://vk-helper.pro/image/faq/selectSubscribeClub_1.png" width="500" height="356">',
			keys: 'цвета'
		},
		en : {
			cat : 'For admins',
			title : 'Select community subscribers',
			aboutLink : 'http://vk-helper.pro/?p=page/instruction&type=38'
		}
	},
	
	storage : {	
		enabled : false
	},
	
	css : function () {
		/*
		html.vkhelper_plugin_selectSubscribeClub a.author.vkhelper_nosubscribe {
			color: red;
		}
		html.vkhelper_plugin_selectSubscribeClub a.author.vkhelper_subscribe {
			color: blue;
		}
		*/
	},
	
	vk_script : {
		
		on : function () {
		
			vkhelper.mutationObserver.add('selectSubscribeClub', function() {
			
				
				var p = jQuery('#group, #public');
				
				if (!p.length) {
					return;
				}
				
				var p2 = p.find('a[class="author"][data-from-id]:not([vkhelper_selectSubscribeClub])');
				
				if (!p2.length) {
					return;
				}
				
				
				
				var d = p.find('#wall_tabs a[href$="?own=1"]:first');
				if (!d.length) { return false; }
				
				var h = d.attr('href').match( /.+?wall-(.*)\?own=1/i );
				if (!h.length) { return false; }
				
				var club_id = Number(h[1]);
				
				
				p2.each(function() {
				  	
				  	var $this = jQuery(this),
				  		from_id = $this.attr('data-from-id');
				  	
				  	if ($this.attr('vkhelper_selectSubscribeClub')) {
				  		return;
				  	}
				  	
				  	$this.attr('vkhelper_selectSubscribeClub', '1');
				  	
				  	if (from_id > 0) {
				  	
				  		if (!window['arr_user_club']) {
				  			window['arr_user_club'] = {};
				  		}
				  		
				  		if (!window['arr_user_club'][club_id]) {
				  			window['arr_user_club'][club_id] = {};
				  		}
				  		
				  		// проверяем или этот пользователь уже есть в массиве
				  		// если нет, то добавляем его и выставляем значение -1, т.е. инфа о пользователе еще не загружена
				  		// если есть, то ставим этому пользователю пометку
				  		
				  		if (!window['arr_user_club'][club_id][from_id]) {
				  			window['arr_user_club'][club_id][from_id] = -2;
				  		} else {
				  			
				  			// если инфа о пользователе уже загружена
				  			if (window['arr_user_club'][club_id][from_id] == 0) {
				  			
				  				p.find('a[class="author"][data-from-id="'+ from_id +'"]')
				  					.addClass('vkhelper_nosubscribe')
				  					.removeClass('vkhelper_subscribe');
				  			
				  			} else if (window['arr_user_club'][club_id][from_id] == 1) {
				  			
				  				p.find('a[class="author"][data-from-id="'+ from_id +'"]')
				  					.addClass('vkhelper_subscribe')
				  					.removeClass('vkhelper_nosubscribe');
				  				
				  			}
				  			
				  		}
				  		
				  	}
				  		
			  	});
			  	
			  	
			  	if (!window['arr_user_club'] || !window['arr_user_club'][club_id]) {
			  		return;
			  	}
			  	
				  	
			  	
			  	var arr_loading = [];
			  	
			  	jQuery.each(window['arr_user_club'][club_id], function(k,v) {
			  	
			  		if (v != -2) return;
			  		
			  		arr_loading.push(k);
			  		
			  		window['arr_user_club'][club_id][k] = -1;
			  		
			  	});
			  	
			  	
			  	if (!arr_loading.length) {
			  		return;
			  	}
			  	
				vkhelper.messages.sendToBG({ 
					type : 'vkhelper_plugins_selectSubscribeClub_list', 
					details : {
						uid  : vk.id,
						list : arr_loading,
						group_id : club_id
					}
				});	
				
			}); 
			
		},
		
		off : function () {
		
			vkhelper.mutationObserver.remove('selectSubscribeClub');
			
		},
		
		messages : {
		
			'vkhelper_plugins_selectSubscribeClub_list_get' : function (details) {
					
				var d = jQuery('#wall_tabs a[href$="?own=1"]:first');
				if (!d.length) { return false; }
				
				var h = d.attr('href').match( /.+?wall-(.*)\?own=1/i );
				if (!h.length) { return false; }
				
				var club_id = Number(h[1]);
					
					
				jQuery.each(details.list, function(k,v) {
					
					window['arr_user_club'][details.group_id][v.user_id] = v.member;
					
					if (club_id != details.group_id) {
						return;
					}
				
				  	if (v.member == 0) {
				  			
				  		jQuery('a[class="author"][data-from-id="'+ v.user_id +'"]')
				  			.addClass('vkhelper_nosubscribe')
				  			.removeClass('vkhelper_subscribe');
				  			
				  	} else {
				  			
				  		jQuery('a[class="author"][data-from-id="'+ v.user_id +'"]')
				  			.addClass('vkhelper_subscribe')
				  			.removeClass('vkhelper_nosubscribe');
				  				
				  	}	
				  			
				});
				
			}
			
		}
		
	},
	
	bg_script : {
		
		messages : {
		
			'vkhelper_plugins_selectSubscribeClub_list' : function (details, tab_id, callback) {
			
				if (!window['vkhelper_plugins_selectSubscribeClub_list']) {
					window['vkhelper_plugins_selectSubscribeClub_list'] = {};
				} 
				
				if (!window['vkhelper_plugins_selectSubscribeClub_list'][details.group_id]) {
					window['vkhelper_plugins_selectSubscribeClub_list'][details.group_id] = {};
				}
				
				
				var bb  = [], // каких пользователей надо получить
					bb2 = []; // каких пользователей надо в конце подгрузить
				jQuery.each(details.list, function(k,v) {
					if (!window['vkhelper_plugins_selectSubscribeClub_list'][details.group_id][v]) {
						bb.push(v);
					} 
					else {
						bb2.push(v);
					}
				}); 
				
				if (!bb) {
					var res = [];
					jQuery.each(details.list, function(k,v) {
						res.push(window['vkhelper_plugins_selectSubscribeClub_list'][details.group_id][v]);
					}); 
					
					messages.sendToVk({
						type : 'vkhelper_plugins_selectSubscribeClub_list_get', 
						details : {
							list : res,
							group_id : details.group_id
						}
					}, tab_id);
					return;
				}
				
				task.add('first', {
					initiator : 'selectSubscribeClub.bg.msg.vkhelper_plugins_selectSubscribeClub_list',
					isVisible : false
				}, function(task_id, task_callback) {
				
					VK.api('groups.isMember', {
						user_ids : bb.join(','),
						group_id : details.group_id
					}, {
						uid : details.uid,
						task_id : task_id
					}, function(response) {
						
						if (!response.details.length) {
							task_callback();
							return;
						}
						
						jQuery.each(response.details, function (k,v) {
							window['vkhelper_plugins_selectSubscribeClub_list'][details.group_id][k] = v;
						});
						
						if (bb2.length) {
							jQuery.each(bb2, function(k,v) {
								response.details.push(window['vkhelper_plugins_selectSubscribeClub_list'][details.group_id][v]);
							}); 
						}
						
						messages.sendToVk({
							type : 'vkhelper_plugins_selectSubscribeClub_list_get', 
							details : {
								list : response.details,
								group_id : details.group_id
							}
						}, tab_id);
						
						task_callback();
						return;
					
					});
							
				});	
			
			}
			
		}
			
	}
	
};

vkhelper_plugins_list['authorPostPoned'] = {
	
	lang : {
		ru : {
			cat : 'Для админов',
			title : 'Отображать автора отложенной записи',
			aboutLink : 'http://vk-helper.pro/?p=page/instruction&type=43',			
			description : 'Возле каждой отложенной записи на стене сообщества, будет отображаться автор этой записи<br><br><img src="https://vk-helper.pro/image/faq/authorPostPoned_1.png" width="500" height="238">'
		},
		en : {
			cat : 'For admins',
			title : 'Show author of a deferred entry',
			aboutLink : 'http://vk-helper.pro/?p=page/instruction&type=43'
		}
	},
	
	storage : {	
		enabled : false
	},
	
	vk_script : {
	
		on : function () {
		
			vkhelper.mutationObserver.add('authorPostPoned', function() {
			
				var a = jQuery('#public #page_postponed_posts > div.postponed:not([vkhelper_authorPostPoned]), #group #page_postponed_posts > div.postponed:not([vkhelper_authorPostPoned])');
				
				if (!a.length) {
					return;
				}
				
				a.each(function() {
				  	
				  	var $this = jQuery(this).attr('vkhelper_authorPostPoned', '1'),
				  		post_id = $this.attr('data-post-id');
				  	
				  	if (post_id) {
				  	
				  		if (!window['vkhelper_authorPostPoned_arrUser']) {
				  			window['vkhelper_authorPostPoned_arrUser'] = {};
				  		}
				  		
				  		
				  		if (!window['vkhelper_authorPostPoned_arrUser'][post_id]) {
				  		
				  			window['vkhelper_authorPostPoned_arrUser'][post_id] = -2;
				  			
				  			$this.find('.wall_text').append('<div class="wall_signed" style="color:rgba(0, 0, 0, 0.23);">Определение автора...</div>');
				  			
				  		} else if (window['vkhelper_authorPostPoned_arrUser'][post_id] != -1) {
				  			
				  			// если инфа о пользователе уже загружена
				  			if (typeof window['vkhelper_authorPostPoned_arrUser'][post_id] == "object") {
				  			
				  				$this.find('.wall_text > .wall_signed').html('<div class="wall_signed"><a class="wall_signed_by" href="/id'+ window['vkhelper_authorPostPoned_arrUser'][post_id].uid +'" mention_id="id'+ window['vkhelper_authorPostPoned_arrUser'][post_id].uid +'" onmouseover="mentionOver(this)">'+ window['vkhelper_authorPostPoned_arrUser'][post_id].name +'</a></div>');
				  				
				  			}
				  			
				  		}
				  		
				  		
				  	}
				  		
			  	});
			  	
			  	
			  	if (!window['vkhelper_authorPostPoned_arrUser']) {
			  		return;
			  	}
			  	
			  	
			  	var arr_loading = [];
			  	
			  	jQuery.each(window['vkhelper_authorPostPoned_arrUser'], function(k,v) {
			  	
			  		if (v != -2) return;
			  		
			  		arr_loading.push(k);
			  		
			  		window['vkhelper_authorPostPoned_arrUser'][k] = -1;
			  		
			  	});
			  	
			  	if (!arr_loading.length) {
			  		return;
			  	}
			  	
				vkhelper.messages.sendToBG({
					type : 'vkhelper_plugins_authorPostPoned_list', 
					details : {
						list: arr_loading,
						uid : vk.id
					}
				});	
					
			});
			
		},
	
		off : function () {
		
			vkhelper.mutationObserver.remove('authorPostPoned');
			
		},
		
		messages : {
		
			'vkhelper_plugins_authorPostPoned_list_get' : function (details) {
			
				jQuery.each(details.list, function(k,v) {
					
					window['vkhelper_authorPostPoned_arrUser'][v.post_id] = {
						uid : v.uid,
						name : v.name
					};
						
				  	jQuery('div.wall_module:has(#page_wall_postponed > a.ui_tab_sel) #page_postponed_posts > div.postponed[data-post-id="'+ v.post_id +'"] .wall_text > .wall_signed')
				  		.html('<a class="wall_signed_by" target="_blank" href="/id'+ v.uid +'" mention_id="id'+ v.uid +'" onmouseover="mentionOver(this)">'+ v.name +'</a>');
				  				
				});
		
			}
		}
		
	}, 
	
	bg_script : {
	
		messages : {
		
			'vkhelper_plugins_authorPostPoned_list' : function (details, tab_id, callback) {
			
				var r = [];
				
				jQuery.each(details.list, function(k,v) {
				
					var t = Math.ceil(k / 12);
					
					if (!r[t]) r[t] = [];
					
					r[t].push(v);
					
				});
				
				
				task.add('first', {
					initiator : 'authorPostPoned.bg.msg.vkhelper_plugins_authorPostPoned_list',
					isVisible : false
				}, function(task_id, task_callback) {
				
					function go(i) {
				
						if (!r[i] || r[i].length < 1) {
							task_callback();
							return;
						}
				
						var code = '\
							var res = []; \
							var a = API.wall.getById({"posts":"'+ r[i].join(',') +'"});\
							var i = 0;\
							while (i < a.length) {\
								var st = false;\
								if (a[i].created_by) {\
									var w = res;\
									while (w.length > 0) {\
										var e = w.shift();\
										if (e.uid == a[i].created_by && st == false) {\
											res.push({\
												"name" : e.name,\
												"uid" : e.uid,\
												"post_id" : a[i].owner_id +"_"+ a[i].id\
											});\
											st = true;\
										}\
									}\
									if (st == false) {\
										var u = API.users.get({"user_ids" : a[i].created_by })[0];\
										res.push({\
											"name" : u.first_name +" "+ u.last_name,\
											"uid" : a[i].created_by,\
											"post_id" :  a[i].owner_id +"_"+ a[i].id\
										});\
									}\
								}\
								i = i + 1;\
							}\
							return res;';
						
						VK.api('execute', {
							code : code
						}, {
							uid : details.uid,
							task_id : task_id
						}, function(response) {
									
							if (!response.details.length) {
								task_callback();
								return;
							}
							
							messages.sendToVk({ 
								type : 'vkhelper_plugins_authorPostPoned_list_get', 
								details : {
									list : response.details,
								}
							}, tab_id);
							
							setTimeout(function() {
								go(++i);
							}, 1000);
							
						});
					
					}
				
					go(0);
						
				});	
			}
			
		}
		
	}
	
};



vkhelper_plugins_list['profileMessageOpenDialog'] = {
	
	lang : {
		ru : {
			cat : 'Для быстрой работы',
			title : 'Обходить окно написания сообщения, сразу открывать диалог',
			aboutLink : 'http://vk-helper.pro/?p=page/instruction&type=34',
			description : 'При нажатии на кнопку "Написать сообщение"(на личой странице пользователя), будет открываться диалог с пользователем, а не окно для написания нового сообщения. <br><br><img src="https://vk-helper.pro/image/faq/new_message.png" width="238" height="53">'
		},
		en : {
			cat : 'For quick work',
			title : 'Immediately open a dialog',
			aboutLink : 'http://vk-helper.pro/?p=page/instruction&type=34'
		}
	},
	
	storage : {	
		enabled : false
	},
	
	vk_script : {
	
		on : function () {
		
			jQuery('html.vkhelper_plugin_profileMessageOpenDialog').on('mouseover', '#profile_message_send:not([vkhelper_profileMessageOpenDialog])', function () { 

				jQuery(this)
					.attr('vkhelper_profileMessageOpenDialog', '1')
					.find('button.flat_button.profile_btn_cut_left')
					.click(function(event) { 
			
						nav.go({0:'im','sel':cur.oid});
	
						event.stopPropagation();  
			
						return false;
			
					});

			}); 
			
		}
		
	}
	
};

vkhelper_plugins_list['away'] = {
	
	lang : {
		ru : {
			cat : 'Для быстрой работы',
			title : 'Обходить страницу перенаправления (away.php)',
			aboutLink : 'http://vk-helper.pro/?p=page/instruction&type=30',
			description : 'При переходе по ссылке на посторонний ресурс, ссылка будет прямой, т.е. без перенаправления away.php. Таким образом ссылки будут открываться быстрее и вы сможете посещать все заблокированные ссылки в Вконтакте<br><br><img src="https://vk-helper.pro/image/options/away_1.jpg" width="500" height="227">'
		},
		en : {
			cat : 'For quick work',
			title : 'To bypass redirect page (away.php)',
			aboutLink : 'http://vk-helper.pro/?p=page/instruction&type=30'
		}
	},
	
	storage : {	
		enabled : false
	},
	
	vk_script : {
	
		on : function () {
		
			jQuery('html.vkhelper_plugin_away').on('mouseover', 'a[href^="/away.php?to="]', function () { 
	
				var $this = jQuery(this), 
					href = $this.attr('href'), 
					to = href.match(new RegExp('to=([^&=]+)'))[1];

				try {
					href = decodeURIComponent(to);
				} catch(e) { 
					href = vkUnescapeCyrLink(to);
				}
	
				$this.attr('href', href);
	
			});


			function vkUnescapeCyrLink(str){ // auto detect decode from utf8/win1251 escaped

				return str.replace(/(%[A-F0-9]{2})+/ig, function(s){
					try {
						return decodeURIComponent(s);
					}
					catch (e) {
						try {
							return vkCyr.unescape(s);
						} catch (e) {
							return s;
						}
					}
				});
	
			}
   
   
			var vkCyr = {
			   enc_map:{0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, 10: 10, 11: 11, 12: 12, 13: 13, 14: 14, 15: 15, 16: 16, 17: 17, 18: 18, 19: 19, 20: 20, 21: 21, 22: 22, 23: 23, 24: 24, 25: 25, 26: 26, 27: 27, 28: 28, 29: 29, 30: 30, 31: 31, 32: 32, 33: 33, 34: 34, 35: 35, 36: 36, 37: 37, 38: 38, 39: 39, 40: 40, 41: 41, 42: 42, 43: 43, 44: 44, 45: 45, 46: 46, 47: 47, 48: 48, 49: 49, 50: 50, 51: 51, 52: 52, 53: 53, 54: 54, 55: 55, 56: 56, 57: 57, 58: 58, 59: 59, 60: 60, 61: 61, 62: 62, 63: 63, 64: 64, 65: 65, 66: 66, 67: 67, 68: 68, 69: 69, 70: 70, 71: 71, 72: 72, 73: 73, 74: 74, 75: 75, 76: 76, 77: 77, 78: 78, 79: 79, 80: 80, 81: 81, 82: 82, 83: 83, 84: 84, 85: 85, 86: 86, 87: 87, 88: 88, 89: 89, 90: 90, 91: 91, 92: 92, 93: 93, 94: 94, 95: 95, 96: 96, 97: 97, 98: 98, 99: 99, 100: 100, 101: 101, 102: 102, 103: 103, 104: 104, 105: 105, 106: 106, 107: 107, 108: 108, 109: 109, 110: 110, 111: 111, 112: 112, 113: 113, 114: 114, 115: 115, 116: 116, 117: 117, 118: 118, 119: 119, 120: 120, 121: 121, 122: 122, 123: 123, 124: 124, 125: 125, 126: 126, 127: 127, 1027: 129, 8225: 135, 1046: 198, 8222: 132, 1047: 199, 1168: 165, 1048: 200, 1113: 154, 1049: 201, 1045: 197, 1050: 202, 1028: 170, 160: 160, 1040: 192, 1051: 203, 164: 164, 166: 166, 167: 167, 169: 169, 171: 171, 172: 172, 173: 173, 174: 174, 1053: 205, 176: 176, 177: 177, 1114: 156, 181: 181, 182: 182, 183: 183, 8221: 148, 187: 187, 1029: 189, 1056: 208, 1057: 209, 1058: 210, 8364: 136, 1112: 188, 1115: 158, 1059: 211, 1060: 212, 1030: 178, 1061: 213, 1062: 214, 1063: 215, 1116: 157, 1064: 216, 1065: 217, 1031: 175, 1066: 218, 1067: 219, 1068: 220, 1069: 221, 1070: 222, 1032: 163, 8226: 149, 1071: 223, 1072: 224, 8482: 153, 1073: 225, 8240: 137, 1118: 162, 1074: 226, 1110: 179, 8230: 133, 1075: 227, 1033: 138, 1076: 228, 1077: 229, 8211: 150, 1078: 230, 1119: 159, 1079: 231, 1042: 194, 1080: 232, 1034: 140, 1025: 168, 1081: 233, 1082: 234, 8212: 151, 1083: 235, 1169: 180, 1084: 236, 1052: 204, 1085: 237, 1035: 142, 1086: 238, 1087: 239, 1088: 240, 1089: 241, 1090: 242, 1036: 141, 1041: 193, 1091: 243, 1092: 244, 8224: 134, 1093: 245, 8470: 185, 1094: 246, 1054: 206, 1095: 247, 1096: 248, 8249: 139, 1097: 249, 1098: 250, 1044: 196, 1099: 251, 1111: 191, 1055: 207, 1100: 252, 1038: 161, 8220: 147, 1101: 253, 8250: 155, 1102: 254, 8216: 145, 1103: 255, 1043: 195, 1105: 184, 1039: 143, 1026: 128, 1106: 144, 8218: 130, 1107: 131, 8217: 146, 1108: 186, 1109: 190},
			   dec_map:{0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, 10: 10, 11: 11, 12: 12, 13: 13, 14: 14, 15: 15, 16: 16, 17: 17, 18: 18, 19: 19, 20: 20, 21: 21, 22: 22, 23: 23, 24: 24, 25: 25, 26: 26, 27: 27, 28: 28, 29: 29, 30: 30, 31: 31, 32: 32, 33: 33, 34: 34, 35: 35, 36: 36, 37: 37, 38: 38, 39: 39, 40: 40, 41: 41, 42: 42, 43: 43, 44: 44, 45: 45, 46: 46, 47: 47, 48: 48, 49: 49, 50: 50, 51: 51, 52: 52, 53: 53, 54: 54, 55: 55, 56: 56, 57: 57, 58: 58, 59: 59, 60: 60, 61: 61, 62: 62, 63: 63, 64: 64, 65: 65, 66: 66, 67: 67, 68: 68, 69: 69, 70: 70, 71: 71, 72: 72, 73: 73, 74: 74, 75: 75, 76: 76, 77: 77, 78: 78, 79: 79, 80: 80, 81: 81, 82: 82, 83: 83, 84: 84, 85: 85, 86: 86, 87: 87, 88: 88, 89: 89, 90: 90, 91: 91, 92: 92, 93: 93, 94: 94, 95: 95, 96: 96, 97: 97, 98: 98, 99: 99, 100: 100, 101: 101, 102: 102, 103: 103, 104: 104, 105: 105, 106: 106, 107: 107, 108: 108, 109: 109, 110: 110, 111: 111, 112: 112, 113: 113, 114: 114, 115: 115, 116: 116, 117: 117, 118: 118, 119: 119, 120: 120, 121: 121, 122: 122, 123: 123, 124: 124, 125: 125, 126: 126, 127: 127, 128: 1026, 129: 1027, 130: 8218, 131: 1107, 132: 8222, 133: 8230, 134: 8224, 135: 8225, 136: 8364, 137: 8240, 138: 1033, 139: 8249, 140: 1034, 141: 1036, 142: 1035, 143: 1039, 144: 1106, 145: 8216, 146: 8217, 147: 8220, 148: 8221, 149: 8226, 150: 8211, 151: 8212, 153: 8482, 154: 1113, 155: 8250, 156: 1114, 157: 1116, 158: 1115, 159: 1119, 160: 160, 161: 1038, 162: 1118, 163: 1032, 164: 164, 165: 1168, 166: 166, 167: 167, 168: 1025, 169: 169, 170: 1028, 171: 171, 172: 172, 173: 173, 174: 174, 175: 1031, 176: 176, 177: 177, 178: 1030, 179: 1110, 180: 1169, 181: 181, 182: 182, 183: 183, 184: 1105, 185: 8470, 186: 1108, 187: 187, 188: 1112, 189: 1029, 190: 1109, 191: 1111, 192: 1040, 193: 1041, 194: 1042, 195: 1043, 196: 1044, 197: 1045, 198: 1046, 199: 1047, 200: 1048, 201: 1049, 202: 1050, 203: 1051, 204: 1052, 205: 1053, 206: 1054, 207: 1055, 208: 1056, 209: 1057, 210: 1058, 211: 1059, 212: 1060, 213: 1061, 214: 1062, 215: 1063, 216: 1064, 217: 1065, 218: 1066, 219: 1067, 220: 1068, 221: 1069, 222: 1070, 223: 1071, 224: 1072, 225: 1073, 226: 1074, 227: 1075, 228: 1076, 229: 1077, 230: 1078, 231: 1079, 232: 1080, 233: 1081, 234: 1082, 235: 1083, 236: 1084, 237: 1085, 238: 1086, 239: 1087, 240: 1088, 241: 1089, 242: 1090, 243: 1091, 244: 1092, 245: 1093, 246: 1094, 247: 1095, 248: 1096, 249: 1097, 250: 1098, 251: 1099, 252: 1100, 253: 1101, 254: 1102, 255: 1103},
			   coder: function(s, map){
			     var L = [];
			     for (var i=0; i<s.length; i++) {
			         var ord = s.charCodeAt(i);
			         if (!(ord in map))
			             throw "Character "+s.charAt(i)+" isn't supported by win1251!";
			         L.push(String.fromCharCode(map[ord]))
			     }
			     return L.join('')
			   },
			   toWin: function(s){
			      return vkCyr.coder(s, vkCyr.enc_map);
			   },
			   toUnicode: function(s){
			      return vkCyr.coder(s, vkCyr.dec_map);
			   },
 			  escape: function(s){
			      return escape(vkCyr.toWin(s));
 			  },
 			  unescape: function(s){
 			     return (vkCyr.toUnicode(unescape(s)));
 			  }
			};
			
		}
		
	}
	
};

vkhelper_plugins_list['photoURIcopy'] = {
	
	lang : {
		ru : {
			cat : 'Для быстрой работы',
		
			title : 'Открывать оригинал изображения',
			aboutLink : 'http://vk-helper.pro/?p=page/instruction&type=41',
			description : 'При наведении курсора на изображение размещенное на стене или на обложку сообщества, справа вверху отобразится три иконки "Скачать оригинал изображения", "Скопировать URL изображения" и "Открыть оригинал изображения в новой вкладке"<br><br><img src="https://vk-helper.pro/image/faq/photoURIcopy_1.png" width="500" height="480">',
			
			copyLink : 'Скопировать URL изображения',
			openLink : 'Открыть оригинал изображения в новой вкладке',
			downloadLink : 'Скачать оригинал изображения',
			
			messagesCopySuccessTitle : 'Ссылка на изображение'
	
		},
		en : {
			cat : 'For quick work',
		
			title : 'Open Original Image',
			aboutLink : 'http://vk-helper.pro/?p=page/instruction&type=41',
			
			copyLink : 'Copy image URL',
			openLink : 'Open the original image in a new tab',
			downloadLink : 'Download original image',
			
			messagesCopySuccessTitle : 'Image Link'
	
		}
	},
	
	storage : {	
		enabled : false
	},
	
	css : "\
		html.vkhelper_plugin_photoURIcopy div.vkhelper_photoURIcopy_openLink {\
			top: 2px;\
			right: 2px;\
			position: absolute;\
			display: none;\
			background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAGnSURBVDjLnZOxilNBGIW/mXt3CZsYQQtjJYqPkE4L8Q20WARbmxWEFQvBXrByQdDKF3CL1QcQH8DOKmVIkWIFbdybTe7M/x+Lm+zeFELcAz/DwJnD4eOf8OD5p4d37w2f/qrUwR25k3PG5cgMl5AZ5k5/O81Ho+mHo7e7RyxVDu8M97c63TjosIk61cz2gfOAWVKc/T5hU50mxfa9lInXj29vHPDkzYT1ADkAi2x8/jq6fpy7N37+8eJfPHqX+zx7/1397VSNRtOXJRIAMcB4tnOr19thcHWjMt1qZu9KcwMghEBVi+o/eZSW81nARXiUOaXzgBYPuTCH7I65Y1nNyKlN3BxcwtwoLTUNItDmoRhQECWRECIhGKEQhUfK3Pg8G+V0PPm2d5Du5zpxZXDtrA0BCoEkCkEMBWUAC8Ji09TNG8NqXnz8IUnK7sruSmaqzTQ30yIlndZJszrpZJ4kSY9efVnfqjaP9hmBECNFEQkxEIuVP1O2A9Z4LB8Xy3OlrbbfbD1gOp4c7h2k3VwnzAx3Jy0WzY90Q6ZmK93xBsNh0JL8RfUXD1Ut4VHY1QEAAAAASUVORK5CYII=');\
			width: 16px; height: 16px;\
			opacity: .4;\
		}\
		html.vkhelper_plugin_photoURIcopy div.vkhelper_photoURIcopy_copyLink {\
			top: 2px;\
			right: 20px;\
			position: absolute;\
			display: none;\
			background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAThJREFUeNqUk7+uREAUxg/ZygPovIlolBsRzW4hkWgkNvEoCg0FUSj0XmBbvIk/T+DPxnUmGRmx3Hu/5DPIOT/fjBluWRbIsiwEABeuFVmW9Tq8RUCapsvn87k01qwOsZ41j5B5ngms73vouo64bVtomoYYpWka1rlxHIdsAAKYpok8cBy3M8/zZESN4wiGYWCtG646BZRlSVxVFXFd10BrEPJ4PAgkCAICuVE6BciyTOZG14feS5K0xfY8D3zfx0V/HQDv93tr+iZFUUAUxa2HAIZh2ACqqu4SfBvZnl0CXLSiKC4T3O93YHsOCXRdP/36rwkQkOf5IS6r5/N5ncA0zcv503GXgO4DVJIklwfCtm1gew5TcBxnF/8swW4KeBbwDwiCAH8R1tLzQwHRus9d+J8ivPwIMACvvBTYMz6bygAAAABJRU5ErkJggg==');\
			width: 16px; height: 16px;\
			opacity: .3;\
		}\
		html.vkhelper_plugin_photoURIcopy div.vkhelper_photoURIcopy_openLink:hover, \
		html.vkhelper_plugin_photoURIcopy div.vkhelper_photoURIcopy_downloadLink:hover, \
		html.vkhelper_plugin_photoURIcopy div.vkhelper_photoURIcopy_copyLink:hover {\
			opacity: .8;\
		}\
		html.vkhelper_plugin_photoURIcopy a:hover > div.vkhelper_photoURIcopy_copyLink, \
		html.vkhelper_plugin_photoURIcopy a:hover > div.vkhelper_photoURIcopy_openLink, \
		html.vkhelper_plugin_photoURIcopy a:hover > div.vkhelper_photoURIcopy_downloadLink, \
		html.vkhelper_plugin_photoURIcopy div.page_cover:hover > div.vkhelper_photoURIcopy_copyLink, \
		html.vkhelper_plugin_photoURIcopy div.page_cover:hover > div.vkhelper_photoURIcopy_openLink, \
		html.vkhelper_plugin_photoURIcopy div.page_cover:hover > div.vkhelper_photoURIcopy_downloadLink {\
			display: block;\
		}\
		html.vkhelper_plugin_photoURIcopy div.vkhelper_photoURIcopy_downloadLink {\
			top: 2px;\
			right: 38px;\
			position: absolute;\
			display: none;\
			background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABW0lEQVR4Xp2TPUjDQBiG34RrAykFyVLFRASlgwVB1NXNRZycShfBIm5ODroU7FJB/KG7hYKoODgJDp1cXHTQpS6itHEwoCEYq2haYvjgoD8mlj7L+8HdPfnuJ8LwXO4YQBIeZ8oGumHBzPHyhAFIFrbSkCWG8fIFuqEwkqZcWj9IMq46vapgIlVCN5wflTE/OUg1QxuGYSCIWCwGTocgFApBURQE4TiOr4DQdR1BaJoWLKAJwQQLZFnuXbBWvKPsWfD1VsG39Qw/pD4VibEEHo0PH8H7K1IzcUQiERKoqopwOAzLslDVdRxePuHhZQij/dG/BUL9ky/Gfn6Xcmd7D6ZpAq4L5v5AQCtii0AA/3L7tVInnA7B7X0V8YEoX0wPqplGowHbtn0PMZsvljKri7PUniiKtOfl9AoJarUaXNeFJEnemEBdMi85VHm/9CaAzHT0Bv9xbU+hiewvJx5hJ9oSrKMAAAAASUVORK5CYII=');\
			width: 16px; height: 16px;\
			opacity: .3;\
		}",
		  
	vk_script : {
	
		on : function () {
		
			jQuery('html.vkhelper_plugin_photoURIcopy').on('mouseover', 'a.image_cover[onclick^="return showPhoto("][style*="background-image: url("]:not([vkhelper_photoURIcopy]), div.page_cover:not([vkhelper_photoURIcopy])', function () { 

				var $this = jQuery(this);
				
				$this
					.attr('vkhelper_photoURIcopy', '1')
					.append(''+
						'<div class="vkhelper_photoURIcopy_copyLink" data-title="'+ vkhelper.lang.get('photoURIcopy', 'copyLink') +'" onmouseover="showTitle(this);"></div>'+
						'<div class="vkhelper_photoURIcopy_openLink" data-title="'+ vkhelper.lang.get('photoURIcopy', 'openLink') +'" onmouseover="showTitle(this);"></div>'+
						'<div class="vkhelper_photoURIcopy_downloadLink" data-title="'+ vkhelper.lang.get('photoURIcopy', 'downloadLink') +'" onmouseover="showTitle(this);"></div>')
					.find('.vkhelper_photoURIcopy_copyLink')
					.click(function (event) { 
					
						if ($this.hasClass('page_cover')) {
						
							var img_url = $this.css('background-image').replace('url(','').replace(')','').replace(/\"/gi, "");
							
						} else {
						
							var p_attrclick = jQuery(this).parent().attr('onclick').match(/base\":\"(.+?)\",(.+?)}/);
							var p_attrclick2 = p_attrclick[2].match(/\[(.+?)\]/ig);
							var v_1 = '', v_2 = 0, v_3 = 0;
							p_attrclick2.forEach(function(y) {
								var e = y.match(/\"(.+?)\",(\d*),(\d*)/);
								if (e[2] >= v_2 || e[3] >= v_3) {
									v_1 = e[1]; v_2 = e[2]; v_3 = e[3];
								}
							});
							
							var img_url = v_1.substr(0,4) == 'http' ? v_1 +'.jpg' : p_attrclick[1] + v_1 +'.jpg';
							
						}
						
						showFastBox(
							vkhelper.lang.get('photoURIcopy', 'messagesCopySuccessTitle'), 
							'<input id="vkhelper_photoURIcopy_copyLink" type="text" value="'+ img_url +'" class="dark" style="width:100%; text-align:center">'
						); 
						
						jQuery('#vkhelper_photoURIcopy_copyLink').focus().select();
						
						event.stopPropagation();
				
						return false;
		
					})
					.next()
					.click(function (event) { 
					
						if ($this.hasClass('page_cover')) {
						
							var img_url = $this.css('background-image').replace('url(','').replace(')','').replace(/\"/gi, "");
							
						} else {
						
							var p_attrclick = jQuery(this).parent().attr('onclick').match(/base\":\"(.+?)\",(.+?)}/);
							var p_attrclick2 = p_attrclick[2].match(/\[(.+?)\]/ig);
							var v_1 = '', v_2 = 0, v_3 = 0;
							p_attrclick2.forEach(function(y) {
								var e = y.match(/\"(.+?)\",(\d*),(\d*)/);
								if (e[2] >= v_2 || e[3] >= v_3) {
									v_1 = e[1]; v_2 = e[2]; v_3 = e[3];
								}
							});
			
							var img_url = v_1.substr(0,4) == 'http' ? v_1 +'.jpg' : p_attrclick[1] + v_1 +'.jpg';
	
						}
						
						window.open(img_url);
						
						event.stopPropagation();
				
						return false;
		
					})
					.next()
					.click(function (event) { 
					
						if ($this.hasClass('page_cover')) {
						
							var img_url = $this.css('background-image').replace('url(','').replace(')','').replace(/\"/gi, "");
							var filename = 'cover'+ cur.oid;
						
						} else {
						
							var p_attrclick = jQuery(this).parent().attr('onclick').match(/base\":\"(.+?)\",(.+?)}/);
							var p_attrclick2 = p_attrclick[2].match(/\[(.+?)\]/ig);
							var v_1 = '', v_2 = 0, v_3 = 0;
							p_attrclick2.forEach(function(y) {
								var e = y.match(/\"(.+?)\",(\d*),(\d*)/);
								if (e[2] >= v_2 || e[3] >= v_3) {
									v_1 = e[1]; v_2 = e[2]; v_3 = e[3];
								}
							});
							
							var img_url = v_1.substr(0,4) == 'http' ? v_1 +'.jpg' : p_attrclick[1] + v_1 +'.jpg';
		
							var filename = 'photo' + jQuery(this).parent().attr('onclick').match(/return showPhoto\('(-?[0-9]*_[0-9]*)'/)[1];
						
						}
						
						vkhelper.messages.sendToBG({
							type : 'vkhelper_plugins_photoURIcopy_download', 
							details : {
								url : img_url,
								filename : filename +'.jpg'
							}
						});	
						
						event.stopPropagation();
				
						return false;
		
					});
					
			});
			
		}
		
	},
	
	bg_script : {
	
		messages : {
		
			'vkhelper_plugins_photoURIcopy_download' : function (details, tab_id, callback) {
			
				chrome.downloads.download({
  					url: details.url,
  					filename: 'vkhelper/images/' + details.filename
				});
				
			}
		}
	}
	
};

vkhelper_plugins_list['shortLinkLeftMenu'] = {
	
	lang : {
		ru : {
			cat : 'Для быстрой работы',
			title : 'Быстрый доступ к vk.cc из левого меню',
			aboutLink : 'http://vk-helper.pro/?p=page/instruction&type=45',
			description : 'В левом меню появляется ссылка, которая открывает окно для сокращения ссылок через сервис vk.cc<br><br><img src="https://vk-helper.pro/image/faq/shortLinkLeftMenu_1.png" width="263" height="500">',
			
			menuItem_shortLink : 'Сократить ссылку',
			messageBoxShorting_title : 'Сократить ссылку через vk.cc',
			
			messageBoxShorting_labelLink : 'Cсылка, которую Вы хотите сократить',
			messageBoxShorting_labelPrivate : 'Статистика ссылки видна только Вам',
			messageBoxShorting_allLinks : 'Все сокращенные ссылки',
			successTitle : 'Сокращенная ссылка',
			messageBoxShorting_button : 'Сократить'
		},
		en : {
			cat : 'For quick work',
			title : 'Quick access to vk.cc from the left menu',
			aboutLink : 'http://vk-helper.pro/?p=page/instruction&type=45',
			
			menuItem_shortLink : 'Shorten the link',
			messageBoxShorting_title : 'Shorten the link through vk.cc',
			
			messageBoxShorting_labelLink : 'The link you want to shorten',
			messageBoxShorting_labelPrivate : 'Link statistics are visible only to you',
			messageBoxShorting_allLinks : 'All shortcuts',
			successTitle : 'Shortcut',
			messageBoxShorting_button : 'Reduce'
		}
	},
	
	storage : {	
		enabled : false
	},
	
	css : "\
		html.vkhelper_plugin_shortLinkLeftMenu #vkhelper_shortLinkLeftMenu {\
			display: block;\
		}\
		html:not(.vkhelper_plugin_shortLinkLeftMenu) #vkhelper_shortLinkLeftMenu {\
			display: none;\
		}",
		  
	vk_script : {
	
		on : function () {
		
			vkhelper.mutationObserver.add('shortLinkLeftMenu', function() {
				
				jQuery('#side_bar_inner ol:not([vkhelper_shortLinkLeftMenu])').each(function() {
				  	
				  	var $this = jQuery(this).attr('vkhelper_shortLinkLeftMenu', '1');
				  	
				  	var tpl = '<span id="vkhelper_shortLinkLeftMenu">'+
				  				'<div class="more_div"></div> '+
				  				'<li>'+
				  					'<a href="#" class="left_row"> '+
				  						'<span class="left_fixer"> '+
				  							'<span class="left_icon fl_l" style="background-position: 7px -582px;"></span> '+
				  							'<span class="left_label inl_bl">'+ vkhelper.lang.get('shortLinkLeftMenu', 'menuItem_shortLink') +'</span> '+
				  						'</span> '+
				  					'</a> '+
				  				'</li> '+
				  				'</span>';
				  				
				  	if ($this.find('span.vkhelper_left_menu').length) {
				  		$this
				  			.find('span.vkhelper_left_menu')
				  			.before(tpl)
				  	} else {
				  		$this.append(tpl)
				  	
				  	}
				  	
				  	$this
				  		.find('span#vkhelper_shortLinkLeftMenu > li')
				  		.click(function(event){
				  			
							var a = new MessageBox({title : vkhelper.lang.get('shortLinkLeftMenu', 'messageBoxShorting_title')})
								.content(''+
										'<div id="vkhelper_shortLinkLeftMenu_box">'+
											'<div class="pedit_label">'+ vkhelper.lang.get('shortLinkLeftMenu', 'messageBoxShorting_labelLink') +':</div>'+
											'<div class="pedit_labeled">'+
												'<input type="text" id="vkhelper_shortLinkLeftMenu_link" style="width: 100%" class="dark">'+
											'</div><br>'+
											'<div class="settings_narrow_row"> '+
      											'<div class="checkbox" id="vkhelper_shortLinkLeftMenu_private" onclick="checkbox(this)" role="checkbox" aria-checked="true" tabindex="0"> '+
        											''+ vkhelper.lang.get('shortLinkLeftMenu', 'messageBoxShorting_labelPrivate') +' '+
      											'</div> '+
    										'</div> '+
										'</div>')
								.setButtons(vkhelper.lang.get('shortLinkLeftMenu', 'messageBoxShorting_button'), function() {

									var link = jQuery('#vkhelper_shortLinkLeftMenu_link').val().trim();
						
									function is_valid_url(url) {
										var reg = /^(http(s)?:\/\/)?(www\.)?[a-zа-яё0-9]+([\-\.]{1}[a-zа-яё0-9]+)*\.[a-zа-яё]{2,10}(:[0-9]{1,10})?(\/.*)?$/ig;
    									return reg.test(url);
									}
			
						
									if (link == '' || !is_valid_url(link)) {
										notaBene('vkhelper_shortLinkLeftMenu_link');
										return;
									}
						
									vkhelper.messages.sendToBG({
										type : 'vkhelper_plugins_shortLinkLeftMenu_short', 
										details : {
											uid : vk.id,
											link : link,
											private_link : jQuery('#vkhelper_shortLinkLeftMenu_private').hasClass('on') 
										}
									});
							
									a.hide();

								}, 'Отмена')
								.show();
					
							a.setControlsText('<a href="https://vk.cc" target=_blank">'+ vkhelper.lang.get('shortLinkLeftMenu', 'messageBoxShorting_allLinks') +'</a>');
					
							jQuery('#vkhelper_shortLinkLeftMenu_link').focus();
				
							event.stopPropagation();
						
							return false;
				  			
				  		});
				  	
			  	});
			  	
			});
			
		},
		
		off : function () {
		
			vkhelper.mutationObserver.remove('shortLinkLeftMenu');
			
		},
		
		messages : {
		
			'vkhelper_plugins_shortLinkLeftMenu_Success' : function (details) {
				  			
				showFastBox(vkhelper.lang.get('shortLinkLeftMenu', 'successTitle'), '<input type="text" value="'+ details.link +'" class="dark" style="width:100%; text-align:center" id="vkhelper_shortLinkLeftMenu_inputSuccess">');
				
				jQuery('#vkhelper_shortLinkLeftMenu_inputSuccess').select();
				
			}
			
		}
		
	},
	
	bg_script : {
	
		messages : {
		
			'vkhelper_plugins_shortLinkLeftMenu_short' : function (details, tab_id, callback) {
			
				task.add('first', {
					initiator : 'shortLinkLeftMenu.bg.msg.vkhelper_plugins_shortLinkLeftMenu_short',
					isVisible : false
				}, function(task_id, task_callback) {
				
					VK.api('utils.getShortLink', {
						url : details.link,
						private : details.private_link ? 1 : 0
					}, {
						uid : details.uid,
						task_id : task_id
					}, function(response) {
							
						messages.sendToVk({ 
							type : 'vkhelper_plugins_shortLinkLeftMenu_Success', 
							details : {
								link : response.details.short_url
							}
						}, tab_id);
						
						task_callback();
						
					});
							
				});	
				
			}
			
		}
	}
	
};

vkhelper_plugins_list['myLinkLeftMenu'] = {
	
	lang : {
		ru : {
			cat : 'Для быстрой работы',
			title : 'Добавление своих ссылок в левое меню',
			aboutLink : 'http://vk-helper.pro/?p=page/instruction&type=46',
			description : 'В левом меню отобразится пункт "Добавить ссылку". Этот пункт позволяет добавлять свои произвольные ссылки в левое меню<br><br><img src="https://vk-helper.pro/image/faq/myLinkLeftMenu_1.png" width="279" height="458"><br><br><img src="https://vk-helper.pro/image/faq/myLinkLeftMenu_2.png" width="447" height="270">',
			
			menuItem_link : 'Добавить ссылку',
			messagesBoxAdd_title : 'Добавить ссылку в левое меню',
			messagesBoxAdd_labelName : 'Название ссылки для отображения в левом меню',
			messagesBoxAdd_labelLink : 'Cсылка для перехода',
			messagesBoxAdd_labelNewWindow : 'Открывать ссылку в новом окне',
			messagesBoxAdd_button : 'Добавить'
		},
		en : {
			cat : 'For quick work',
			title : 'Adding your links to the left menu',
			aboutLink : 'http://vk-helper.pro/?p=page/instruction&type=46',
			
			menuItem_link : 'Add link',
			messagesBoxAdd_title : 'Add link to the left menu',
			messagesBoxAdd_labelName : 'The name of the link to display in the left menu',
			messagesBoxAdd_labelLink : 'Link for the transition',
			messagesBoxAdd_labelNewWindow : 'Open link in a new window',
			messagesBoxAdd_button : 'Add'
		}
	},
	
	storage : {	
		enabled : false
	},
	
	css : "\
		html.vkhelper_plugin_shortLinkLeftMenu #vkhelper_shortLinkLeftMenu,\
		#vkhelper_myLinkLeftMenu li[data-link]:hover .vkhelper_plugin_myLinkLeftMenu_remove {\
			display: block;\
		}\
		html:not(.vkhelper_plugin_shortLinkLeftMenu) #vkhelper_shortLinkLeftMenu {\
			display: none;\
		}\
		#vkhelper_myLinkLeftMenu .vkhelper_plugin_myLinkLeftMenu_remove {\
			display: none; position: absolute; right: 0px;\
		}",
		  
	vk_script : {
	
		on : function () {
		
			vkhelper.mutationObserver.add('myLinkLeftMenu', function() {
				
				jQuery('#side_bar_inner ol:not([vkhelper_myLinkLeftMenu])').each(function() {
				  	
				  	var $this = jQuery(this).attr('vkhelper_myLinkLeftMenu', '1');
				  	
				  	if (!$this.find('span#vkhelper_myLinkLeftMenu').length) {
				  		$this.append('<span id="vkhelper_myLinkLeftMenu"><div class="more_div"></div></span>');
				  	}
				  	
				  	var el = '';
				  	
				  	var strg = vkhelper.plugins.myLinkLeftMenu.storage;
				  	
				  	if (strg.list && strg.list.length > 0) {
				  		
				  		jQuery.each(strg.list, function(k,v) {
				  		
				  			if (!v.title || !v.link) {
				  				return;
				  			}
				  			
							var h = v.link.substr(0, 5);
				
							var link = h == 'https' ||  h == 'http:' ? v.link : 'http://' + v.link;
				
							el += ''+
								'<li data-link>'+
				  				'<a href="'+ link +'" target="_blank" class="left_row"> '+
				  					'<span class="left_fixer"> '+
				  						'<object type="internal/link" class="vkhelper_plugin_myLinkLeftMenu_remove"><a href="#" onclick="return false;" class="left_count_wrap fl_r left_count_wrap_hovered"><span class="inl_bl left_count">X</span></a></object> '+
				  						'<span class="left_icon fl_l" style="background-position: 7px -470px;"></span> '+
				  						'<span class="left_label inl_bl">'+ v.title +'</span> '+
				  					'</span> '+
				  				'</a> '+
				  				'</li>';
				  			
				  		});
				  		
				  	}
				  	
				  	$this
				  		.find('span#vkhelper_myLinkLeftMenu')
				  		.append(el + 
				  			'<li data-add-link>'+
				  				'<a href="#" class="left_row"> '+
				  					'<span class="left_fixer"> '+
				  						'<span class=" fl_l" style="width: 35px; height: 25px; opacity: 0.75; filter: alpha(opacity=75); background: url(/images/icons/common.png?6) no-repeat 10px 8px;"></span> '+
				  						'<span class="left_label inl_bl">'+ vkhelper.lang.get('myLinkLeftMenu', 'menuItem_link') +'</span> '+
				  					'</span> '+
				  				'</a> '+
				  			'</li>')
				  		.find('li[data-add-link] > a')
				  		.click(function(event){
				  			
				  			var a = new MessageBox({title : vkhelper.lang.get('myLinkLeftMenu', 'messagesBoxAdd_title')})
								.content(''+
										'<div id="vkhelper_myLinkLeftMenu_box">'+
											'<div class="pedit_label">'+ vkhelper.lang.get('myLinkLeftMenu', 'messagesBoxAdd_labelName') +':</div>'+
											'<div class="pedit_labeled">'+
												'<input type="text" id="vkhelper_myLinkLeftMenu_title" style="width: 100%" class="dark">'+
											'</div><br>'+
											'<div class="pedit_label">'+ vkhelper.lang.get('myLinkLeftMenu', 'messagesBoxAdd_labelLink') +':</div>'+
											'<div class="pedit_labeled">'+
												'<input type="text" id="vkhelper_myLinkLeftMenu_link" style="width: 100%" class="dark">'+
											'</div><br>'+
											'<div class=""> '+
      											'<div class="checkbox on" id="vkhelper_myLinkLeftMenu_target" onclick="checkbox(this)" role="checkbox" aria-checked="true" tabindex="0"> '+
        											''+ vkhelper.lang.get('myLinkLeftMenu', 'messagesBoxAdd_labelNewWindow') +
      											'</div> '+
    										'</div> '+
										'</div>')
								.setButtons(vkhelper.lang.get('myLinkLeftMenu', 'messagesBoxAdd_labelLink'), function() {

									var title = jQuery('#vkhelper_myLinkLeftMenu_title').val().trim(), 
										link = jQuery('#vkhelper_myLinkLeftMenu_link').val().trim();
				
									function is_valid_url(url) {
										var reg = /^(http(s)?:\/\/)?(www\.)?[a-zа-яё0-9]+([\-\.]{1}[a-zа-яё0-9]+)*\.[a-zа-яё]{2,10}(:[0-9]{1,10})?(\/.*)?$/ig;
    									return reg.test(url);
									}
					
					
									if (title == '') {
										notaBene('vkhelper_myLinkLeftMenu_title');
										return;
									}
						
									if (link == '' || !is_valid_url(link)) {
										notaBene('vkhelper_myLinkLeftMenu_link');
										return;
									}
						
									vkhelper.messages.sendToBG({
										type : 'vkhelper_plugins_myLinkLeftMenu_add', 
										details : {
											link   : link,
											title  : title,
											target : jQuery('#vkhelper_myLinkLeftMenu_target').hasClass('on') 
										}
									}, '*');
						
									a.hide();

								}, 'Отмена')
								.show();
					
							jQuery('#vkhelper_myLinkLeftMenu_title').focus();
				
				
				  			
							event.stopPropagation();
						
							return false;
				  			
				  		});
				  	
				  	
				  	
				  	jQuery('.vkhelper_plugin_myLinkLeftMenu_remove')
				  		.click(function(event) { 
				  			
				  			if (!confirm('Удалить ссылку?')) {
				  				return;
				  			}
				  			
				  			var el = jQuery(this).closest('li[data-link]');
				  			
							vkhelper.messages.sendToBG({
								type : 'vkhelper_plugins_myLinkLeftMenu_remove', 	
								details : {
									id : el.prevAll('li[data-link]').length
								}
							});
							
				  			el.hide(0, function () { this.remove(); }); 
				  			
							event.stopPropagation();
						
							return false;
							
				  		});
				  		
				  		
			  	});
			  	
			});
			
		},
		
		off : function () {
		
			vkhelper.mutationObserver.remove('myLinkLeftMenu');
			
		},
		
		messages : {
		
			'vkhelper_plugins_myLinkLeftMenu_Success' : function (details) {
			
				var h = details.link.substr(0, 5);
				
				var link = h == 'https' ||  h == 'http:' ? details.link : 'http://' + details.link;
				
				var target = details.target ? ' target="_blank" ' : '';
				
				var e = jQuery('#side_bar_inner ol span#vkhelper_myLinkLeftMenu li[data-link]:last');
				
				jQuery('#side_bar_inner ol span#vkhelper_myLinkLeftMenu li[data-add-link]')
					.before(''+
				  			'<li data-link>'+
				  				'<a href="'+ link +'" '+ target +' class="left_row" > '+
				  					'<span class="left_fixer"> '+
				  						'<object type="internal/link" class="vkhelper_plugin_myLinkLeftMenu_remove"><a href="#" onclick="return false;" class="left_count_wrap fl_r left_count_wrap_hovered"><span class="inl_bl left_count">X</span></a></object> '+
				  						'<span class="left_icon fl_l" style="background-position: 7px -470px;"></span> '+
				  						'<span class="left_label inl_bl">'+ details.title +'</span> '+
				  					'</span> '+
				  				'</a> '+
				  			'</li>')
					.prev()
					.find('.vkhelper_plugin_myLinkLeftMenu_remove')
					.click(function(event) { 
				  		
				  		var el = jQuery(this).closest('li[data-link]');
				  			
						vkhelper.messages.sendToBG({
							type : 'vkhelper_plugins_myLinkLeftMenu_remove', 
							from : 'script',
							to   : 'bg',
							details : {
								id : el.prevAll('li[data-link]').length
							}
						}, '*');
							
				  		el.hide(0, function () { this.remove(); }); 
				  			
						event.stopPropagation();
						
						return false;
							
				  	});
				
			}
			
		}
		
	},
	
	bg_script : {
	
		messages : {
		
			'vkhelper_plugins_myLinkLeftMenu_add' : function (details, tab_id, callback) {
			
				/*
				details.link
				details.title
				details.target
				*/
				
				var strg = plugins.storage.get('myLinkLeftMenu');
				
				if (!strg.list) {
					strg.list = [];
				}
				
				strg.list.push({
					link   : details.link,
					title  : details.title,
					target : details.target
				});
				
				plugins.storage.set('myLinkLeftMenu', strg);
				
				
				messages.sendToVk({ 
					type : 'vkhelper_plugins_myLinkLeftMenu_Success', 
					details : {
						link   : details.link,
						title  : details.title,
						target : details.target
					}
				});
					
			},
		
			'vkhelper_plugins_myLinkLeftMenu_remove' : function (details, tab_id, callback) {
			
				/*
				details.id
				*/
				
				var strg = plugins.storage.get('myLinkLeftMenu');
				
				if (!strg.list) {
					return;
				}
				
				strg.list.splice(details.id, 1);
				
				plugins.storage.set('myLinkLeftMenu', strg);
				
			}
			
		}
	}
	
};


vkhelper_plugins_list['clearAccountFunc'] = {
	
	lang : {
		ru : {
			cat : 'Для быстрой работы',
			title : 'Набор функций для быстрого управления страницей',
			aboutLink : 'http://vk-helper.pro/?p=page/instruction&type=51',
			description : 'Функция добавляет пункт "Управление страницей" в левое меню.<br>При нажатии на этот пункт, пользователю откроется окно с множеством функций.<br><br><b>Доступные функции:</b><br><br>1. Друзья:<br>1.1. Одобрение всех заявок в друзья<br>1.2. Удаление друзей(по критериям)<br>1.3. Удаление исходящих заявок и интересных людей<br>1.4. Добавление подписчиков в друзья<br><br>2. Личные сообщения:<br>2.1. Удаление диалогов<br><br>3. Стена:<br>3.1. Удаление записей на стене (и для сообществ)<br><br>4. Закладки:<br>4.1. Очистка списка понравившихся фотографий<br>4.2. Очистка списка понравившихся видеозаписей<br>4.3. Очистка списка понравившихся записей<br><br>5. Сообщества:<br>5.1. Очистка списка сообществ<br><br><img src="https://vk-helper.pro/image/faq/clearAccountFunc_1.png"><br><br><img src="https://vk-helper.pro/image/faq/clearAccountFunc_2.png" width="447" height="453">',

			keys : 'быстрое удаление диалогов Одобрение всех заявок в друзья заявки в друзья Удаление друзей удалить друзей Удаление исходящих заявок и интересных людей Добавление подписчиков в друзья добавить подписчиков Удалить диалоги удаление диалогов удалить сообщения удаление сообщений Удаление записей на стене Удалеть записи на стене Очистка списка понравившихся фотографий Очистить список понравившихся фотографий удалить лайки убрать лайки видеозаписей записей Очистка списка сообществ удалить сообщества Очистить список сообществ',
			
			
			menuItem : 'Управление страницей',
		
			messageBox_title : 'Управление страницей',
				
			messageBox_content_friendsRequestInpJoin : 'Одобрение всех заявок в друзья',
			messageBox_content_friendDeleteRequestOut : 'Удаление исходящих заявок и интересных людей',
			messageBox_content_subscribeToFriends : 'Добавление подписчиков в друзья',
			messageBox_content_dialogsDelete : 'Удаление диалогов',
			messageBox_content_wallDelete : 'Удаление записей на стене (и для сообществ)',
				
			messageBox_content_friends : 'Друзья',
			messageBox_content_messages : 'Личные сообщения',
			messageBox_content_wall : 'Стена',
			messageBox_content_fave : 'Закладки',
			messageBox_content_groups : 'Сообщества',
			
			messageBox_btnCancle : 'Отмена',
			messageBox_btnClear : 'Очистить',
			messageBox_btnDelete : 'Удалить',
			messageBox_btnAccept : 'Принять',
			messageBox_btnAdd : 'Добавить',
			
			messageBox_content_faveRemoveLikesPhoto : 'Очистка списка понравившихся фотографий',
			messageBox_content_faveRemoveLikesVideo : 'Очистка списка понравившихся видеозаписей',
			messageBox_content_faveRemoveLikesWall : 'Очистка списка понравившихся записей',
			messageBox_content_faveRemoveLikesPhoto_confirm : 'Вы действительно хотите <b>очистить список понравившихся фотографий</b>?',
			messageBox_content_faveRemoveLikesVideo_confirm : 'Вы действительно хотите <b>очистить список понравившихся видеозаписей</b>?',
			messageBox_content_faveRemoveLikesWall_confirm  : 'Вы действительно хотите <b>очистить список понравившихся записей</b>?',
			
			messageBox_content_groupsLeave : 'Очистка списка сообществ',
			messageBox_content_groupsLeave_conform1 : 'Вы действительно хотите <b>очистить список сообществ</b>?',
			messageBox_content_groupsLeave_conform2 : '<b>НЕ</b> удалять сообщества, в которых Вы являетесь администратором, редактором или модератором',
			
			messageBox_content_friendsDelete : 'Удаление друзей',
			messageBox_content_friendsDelete_confirm : 'Вы действительно хотите',
			
			messageBox_content_friendsDelete_confirm_type_1 : 'удалить всех друзей',
			messageBox_content_friendsDelete_confirm_type_2 : 'удалить удаленных друзей',
			messageBox_content_friendsDelete_confirm_type_3 : 'удалить заблокированных друзей',
			messageBox_content_friendsDelete_confirm_type_4 : 'удалить друзей, которые не заходили на свою страницу в течении %days% дней',
			messageBox_content_friendsDelete_confirm_type_5 : 'удалить друзей, у которых закрыты личные сообщения',
			messageBox_content_friendsDelete_confirm_type_6 : 'удалить друзей, у которых закрыта стена',
			messageBox_content_friendsDelete_confirm_type_7 : 'удалить друзей, у которых имя совпадает с фамилией',
			messageBox_content_friendsDelete_confirm_type_8 : 'удалить друзей, у которых не установлена фотография',
			
			messageBox_content_friendsDelete_title : 'Параметры удаления',
			messageBox_content_friendsDelete_type_1 : 'Всех друзей',
			messageBox_content_friendsDelete_type_2 : 'Удаленных друзей',
			messageBox_content_friendsDelete_type_3 : 'Заблокированных друзей',
			messageBox_content_friendsDelete_type_4 : 'Кто давно не заходил на свою страницу',
			messageBox_content_friendsDelete_type_4_data : 'кто не посещал соц. сеть в течении %input% дней',
			messageBox_content_friendsDelete_type_5 : 'У кого закрыты личные сообщения',
			messageBox_content_friendsDelete_type_6 : 'У кого закрыта стена',
			messageBox_content_friendsDelete_type_7 : 'С одинаковым именем и фамилией',
			messageBox_content_friendsDelete_type_8 : 'Без фотографии',
			
			messageBox_content_friendDeleteRequestOut_confirm : 'Вы действительно хотите <b>удалить исходящие заявки и интересных людей</b>?',
			messageBox_content_friendsRequestInpJoin_confirm : 'Вы действительно хотите <b>принять все заявки в друзья</b>?',
			
			messageBox_content_subscribeToFriends_confirm : 'Вы действительно хотите <b>добавить подписчиков в друзья</b>?',
			
			
			messageBox_content_wallDelete_title : 'Удаление записей на стене',
			
    		messageBox_content_wallDelete_content_selectPage : 'Выберите страницу',
			messageBox_content_wallDelete_content_selectPage_1 : 'Личная страница',
			messageBox_content_wallDelete_content_selectPage_2 : 'Сообщество',
			messageBox_content_wallDelete_content_paramsDelete : 'Параметры удаления',
			messageBox_content_wallDelete_content_paramsDelete_1 : 'Удалить все записи на стене',
			messageBox_content_wallDelete_content_paramsDelete_2 : 'Удалить записи владельца стены',
			messageBox_content_wallDelete_content_paramsDelete_3 : 'Удалить записи не от владельца стены',
				
			messageBox_content_wallDelete_content_paramsDelete_confirm_1 : 'удалить все записи на стене',
			messageBox_content_wallDelete_content_paramsDelete_confirm_2 : 'удалить записи владельца стены',
			messageBox_content_wallDelete_content_paramsDelete_confirm_3 : 'удалить записи не от владельца стены',
			messageBox_content_wallDelete_content_paramsDelete_confirm_mypage : 'личной страницы',
			messageBox_content_wallDelete_content_paramsDelete_confirm_group : 'сообщества',
			messageBox_content_wallDelete_content_paramsDelete_confirm_content : 'Вы действительно хотите',
			
			messageBox_content_dialogsDelete_params : 'Параметры удаления',
			messageBox_content_dialogsDelete_checkbox : 'Удалить только диалоги, в которых есть непрочитанные входящие сообщения.',
			messageBox_content_dialogsDelete_type_1 : 'удалить диалоги, в которых есть непрочитанные входящие сообщения',
			messageBox_content_dialogsDelete_type_2 : 'удалить все диалоги',
			messageBox_content_dialogsDelete_lastConfirm : 'Вы действительно хотите <b>%t%</b> на личной странице?',
			
			tabRequest_success : 'Успешно завершено!',
			
			tabRequest_faveRemoveLikes_photo : 'Очистка списка понравившихся фотографий',
			tabRequest_faveRemoveLikes_video : 'Очистка списка понравившихся видеозаписей',
			tabRequest_faveRemoveLikes_post  : 'Очистка списка понравившихся записей',
			tabRequest_groupsLeave_title : 'Очистка списка сообществ',
			tabRequest_friendsDelete_title : 'Удаление друзей',
			tabRequest_friendDeleteRequestOut_title : 'Удаление исходящих заявок',
			tabRequest_friendsRequestInpJoin_title : 'Одобрение всех заявок в друзья',
			tabRequest_subscribeToFriends_title : 'Добавление подписчиков в друзья',
			tabRequest_wallDelete_title : 'Удаление записей на стене',
			tabRequest_dialogsDelete_title : 'Удаление сообщений на странице'
			
		},
		en : {
			cat : 'For quick work',
			title : 'A set of functions for quick page management',
			aboutLink : 'http://vk-helper.pro/?p=page/instruction&type=51',
			keys : 'Approval of all applications in friends in friends Deleting deleted messages Deleting deleted requests and interesting users Adding subscribers to friends Add subscribers Delete deleted deleted entries Delete deleted entries on the wall Clear the list of liked photos Clear the list of liked photos Delete Hide videos Hide favorite videos of entries Clear all communities Delete communities Clear community list',
			
			menuItem : 'Manage the page',
		
		
			messageBox_title : 'Manage the page',
				
			messageBox_content_friendsRequestInpJoin : 'Approve all applications to friends',
			messageBox_content_friendDeleteRequestOut : 'Removing outbound applications and interesting people',
			messageBox_content_subscribeToFriends : 'Adding Subscribers to Friends',
			messageBox_content_dialogsDelete : 'Deleting Dialogs',
			messageBox_content_wallDelete : 'Delete entries on the wall (and for communities)',
				
			messageBox_content_friends : 'Friends',
			messageBox_content_messages : 'Private messages',
			messageBox_content_wall : 'Wall',
			messageBox_content_fave : 'Fave',
			messageBox_content_groups : 'Groups',
			
			messageBox_btnCancle : 'Cancel',
			messageBox_btnClear : 'Clear',
			messageBox_btnDelete : 'Remove',
			messageBox_btnAccept : 'To accept',
			messageBox_btnAdd : 'Add',
			
			messageBox_content_faveRemoveLikesPhoto : 'Clearing the list of photos you like',
			messageBox_content_faveRemoveLikesVideo : 'Clearing the list of liked videos',
			messageBox_content_faveRemoveLikesWall : 'Clearing the list of liked wall',
			messageBox_content_faveRemoveLikesPhoto_confirm : 'ВAre you sure you want to <b>clear the list of liked photos</b>?',
			messageBox_content_faveRemoveLikesVideo_confirm : 'Are you sure you want to <b>clear the list of your favorite videos</b>?',
			messageBox_content_faveRemoveLikesWall_confirm  : 'Are you sure you want to <b>clear the list of liked records</b>?',
			
			messageBox_content_groupsLeave : 'Clearing a list of communities',
			messageBox_content_groupsLeave_conform1 : 'Are you sure you want to <b>clear the community list</b>?',
			messageBox_content_groupsLeave_conform2 : '<b>NOT</b> delete communities in which you are an administrator, editor, or moderator',
			
			messageBox_content_friendsDelete : 'Deleting friends',
			messageBox_content_friendsDelete_confirm : 'Do you really want',
			
			messageBox_content_friendsDelete_confirm_type_1 : 'delete all friends',
			messageBox_content_friendsDelete_confirm_type_2 : 'delete deleted friends',
			messageBox_content_friendsDelete_confirm_type_3 : 'delete blocked friends',
			messageBox_content_friendsDelete_confirm_type_4 : 'delete friends who did not visit your page within %days% days',
			messageBox_content_friendsDelete_confirm_type_5 : 'delete friends who have private messages closed',
			messageBox_content_friendsDelete_confirm_type_6 : 'remove friends who have closed the wall',
			messageBox_content_friendsDelete_confirm_type_7 : 'remove friends whose name coincides with the last name',
			messageBox_content_friendsDelete_confirm_type_8 : 'delete friends who do not have a photo',
			
			messageBox_content_friendsDelete_title : 'Delete options',
			messageBox_content_friendsDelete_type_1 : 'All friends',
			messageBox_content_friendsDelete_type_2 : 'Remote Friends',
			messageBox_content_friendsDelete_type_3 : 'Blocked friends',
			messageBox_content_friendsDelete_type_4 : 'Who has not visited your page for a long time',
			messageBox_content_friendsDelete_type_4_data : 'who did not attend soc. network during %input% days',
			messageBox_content_friendsDelete_type_5 : 'Who has private messages closed',
			messageBox_content_friendsDelete_type_6 : 'Who has the wall shut?',
			messageBox_content_friendsDelete_type_7 : 'With the same name and surname',
			messageBox_content_friendsDelete_type_8 : 'No photo',
			
			messageBox_content_friendDeleteRequestOut_confirm : 'Are you sure you want to <b>delete outbound applications and interesting people</b>?',
			messageBox_content_friendsRequestInpJoin_confirm : 'Are you sure you want to <b>accept all applications as friends</b>?',
			
			messageBox_content_subscribeToFriends_confirm : 'Are you sure you want to <b>add subscribers to your friends</b>?',
			
			
			messageBox_content_wallDelete_title : 'Deleting posts on the wall',
			
    		messageBox_content_wallDelete_content_selectPage : 'Select page',
			messageBox_content_wallDelete_content_selectPage_1 : 'Personal page',
			messageBox_content_wallDelete_content_selectPage_2 : 'Community',
			messageBox_content_wallDelete_content_paramsDelete : 'Delete options',
			messageBox_content_wallDelete_content_paramsDelete_1 : 'Delete all entries on the wall',
			messageBox_content_wallDelete_content_paramsDelete_2 : 'Delete Wall Owner Records',
			messageBox_content_wallDelete_content_paramsDelete_3 : 'Delete entries not from the owner of the wall',
				
			messageBox_content_wallDelete_content_paramsDelete_confirm_1 : 'delete all entries on the wall',
			messageBox_content_wallDelete_content_paramsDelete_confirm_2 : 'remove wall holder entries',
			messageBox_content_wallDelete_content_paramsDelete_confirm_3 : 'remove records not from the owner of the wall',
			messageBox_content_wallDelete_content_paramsDelete_confirm_mypage : 'personal page',
			messageBox_content_wallDelete_content_paramsDelete_confirm_group : 'communities',
			messageBox_content_wallDelete_content_paramsDelete_confirm_content : 'Do you really want',
			
			messageBox_content_dialogsDelete_params : 'Delete options',
			messageBox_content_dialogsDelete_checkbox : 'Delete only the dialogs that have unread incoming messages.',
			messageBox_content_dialogsDelete_type_1 : 'Delete dialogs that have unread incoming messages',
			messageBox_content_dialogsDelete_type_2 : 'delete all dialogs',
			messageBox_content_dialogsDelete_lastConfirm : 'Are you sure you want <b>%t%</b> on your personal page?',
			
			tabRequest_success : 'Successfully completed!',
			
			tabRequest_faveRemoveLikes_photo : 'Clearing the list of photos you like',
			tabRequest_faveRemoveLikes_video : 'Clearing the list of liked videos',
			tabRequest_faveRemoveLikes_post  : 'Clearing the list of liked records',
			tabRequest_groupsLeave_title : 'Clearing a list of communities',
			tabRequest_friendsDelete_title : 'Deleting friends',
			tabRequest_friendDeleteRequestOut_title : 'Deleting Outbound Requests',
			tabRequest_friendsRequestInpJoin_title : 'Approve all applications to friends',
			tabRequest_subscribeToFriends_title : 'Adding Subscribers to Friends',
			tabRequest_wallDelete_title : 'Deleting posts on the wall',
			tabRequest_dialogsDelete_title : 'Deleting posts on the wall'
			
		}
	},
	
	storage : {	
		enabled : false
	},
	
	css : function () {
		/*
		html.vkhelper_plugin_clearAccountFunc .radiobtn.disabled { 
			opacity: 0.4; 
		}
		*/
	},
	
	vk_script : {
		
		on : function () {
		
			vkhelper.mutationObserver.add('clearAccountFunc', function() {
			
				jQuery('#side_bar_inner ol:not([vkhelper_clearAccountFunc])').each(function() {
				  	
				  	var $this = jQuery(this).attr('vkhelper_clearAccountFunc', '1');
				  	
				  	if (!$this.find('span.vkhelper_left_menu').length) {
				  		$this.append('<span class="vkhelper_left_menu"><div class="more_div"></div></span>');
				  	}
				  	
				  	$this
				  		.find('span.vkhelper_left_menu')
				  		.append(''+
				  			'<li id="vkhelper_clearAccountFunc">'+
				  				'<a href="#" class="left_row"> '+
				  					'<span class="left_fixer"> '+
				  						'<span class="left_icon fl_l"></span> '+
				  						'<span class="left_label inl_bl">'+ vkhelper.lang.get('clearAccountFunc', 'menuItem') +'</span> '+
				  					'</span> '+
				  				'</a> '+
				  			'</li>')
				  		.find('#vkhelper_clearAccountFunc')
				  		.click(function(event){
				  		
				  			vkhelper.plugins.clearAccountFunc.vk_script.functions.openBox();
				  			
							event.stopPropagation();
						
							return false;
				  			
				  		});
				  	
				  	
			  	});
			
			}); 
			
		},
		
		off : function () {
		
			vkhelper.mutationObserver.remove('clearAccountFunc');
			
		},
		
		functions : {
			
			openBox : function () {
		
				var a = new MessageBox({title : vkhelper.lang.get('clearAccountFunc', 'messageBox_title'), hideButtons : true})
					.content(''+ 
						vkhelper.lang.get('clearAccountFunc', 'messageBox_content_friends') + ':<br>'+
						'- <a href="#" id="vkhelper_plugins_clearAccountFunc_friendsRequestInpJoin_openBox" onclick="return false;">'+ vkhelper.lang.get('clearAccountFunc', 'messageBox_content_friendsRequestInpJoin') +'</a><br>'+
						'- <a href="#" id="vkhelper_plugins_clearAccountFunc_friendsDelete_openBox" onclick="return false;">'+ vkhelper.lang.get('clearAccountFunc', 'messageBox_content_friendsDelete') +'</a><br>'+
						'- <a href="#" id="vkhelper_plugins_clearAccountFunc_friendDeleteRequestOut_openBox" onclick="return false;">'+ vkhelper.lang.get('clearAccountFunc', 'messageBox_content_friendDeleteRequestOut') +'</a><br>'+
						'- <a href="#" id="vkhelper_plugins_clearAccountFunc_subscribeToFriends_openBox" onclick="return false;">'+ vkhelper.lang.get('clearAccountFunc', 'messageBox_content_subscribeToFriends') +'</a><br><br>'+					
						vkhelper.lang.get('clearAccountFunc', 'messageBox_content_messages') + ':<br>'+
						'- <a href="#" id="vkhelper_plugins_clearAccountFunc_dialogsDelete_openBox" onclick="return false;">'+ vkhelper.lang.get('clearAccountFunc', 'messageBox_content_dialogsDelete') +'</a><br><br>'+
						vkhelper.lang.get('clearAccountFunc', 'messageBox_content_wall') + ':<br>'+
						'- <a href="#" id="vkhelper_plugins_clearAccountFunc_wallDelete_openBox" onclick="return false;">'+ vkhelper.lang.get('clearAccountFunc', 'messageBox_content_wallDelete') +'</a><br><br>'+
						vkhelper.lang.get('clearAccountFunc', 'messageBox_content_fave') + ':<br>'+
						'- <a href="#" class="vkhelper_plugins_clearAccountFunc_faveRemoveLikes_openBox" data-type="photo" onclick="return false;">'+ vkhelper.lang.get('clearAccountFunc', 'messageBox_content_faveRemoveLikesPhoto') +'</a><br>'+
						'- <a href="#" class="vkhelper_plugins_clearAccountFunc_faveRemoveLikes_openBox" data-type="video" onclick="return false;">'+ vkhelper.lang.get('clearAccountFunc', 'messageBox_content_faveRemoveLikesVideo') +'</a><br>'+
						'- <a href="#" class="vkhelper_plugins_clearAccountFunc_faveRemoveLikes_openBox" data-type="wall" onclick="return false;">'+ vkhelper.lang.get('clearAccountFunc', 'messageBox_content_faveRemoveLikesWall') +'</a><br><br>'+
						vkhelper.lang.get('clearAccountFunc', 'messageBox_content_groups') + ':<br>'+
						'- <a href="#" id="vkhelper_plugins_clearAccountFunc_groupsLeave_openBox" onclick="return false;">'+ vkhelper.lang.get('clearAccountFunc', 'messageBox_content_groupsLeave') +'</a><br>')
					.show();
				
	
				jQuery('.vkhelper_plugins_clearAccountFunc_faveRemoveLikes_openBox').click(function(){
				
					vkhelper.plugins.clearAccountFunc.vk_script.functions.faveRemoveLikes_openBox(jQuery(this).data('type'));
					
					a.hide();
					
					return false;
					
				});
	
				jQuery('#vkhelper_plugins_clearAccountFunc_groupsLeave_openBox').click(function(){
				
					vkhelper.plugins.clearAccountFunc.vk_script.functions.groupsLeave_openBox();
					
					a.hide();
					
					return false;
					
				});
				
				jQuery('#vkhelper_plugins_clearAccountFunc_friendsDelete_openBox').click(function(){
				
					vkhelper.plugins.clearAccountFunc.vk_script.functions.friendsDelete_openBox();
					
					a.hide();
					
					return false;
					
				});
				
				jQuery('#vkhelper_plugins_clearAccountFunc_friendDeleteRequestOut_openBox').click(function(){
				
					vkhelper.plugins.clearAccountFunc.vk_script.functions.friendDeleteRequestOut_openBox();
					
					a.hide();
					
					return false;
					
				});
				
				jQuery('#vkhelper_plugins_clearAccountFunc_friendsRequestInpJoin_openBox').click(function(){
				
					vkhelper.plugins.clearAccountFunc.vk_script.functions.friendsRequestInpJoin_openBox();
					
					a.hide();
					
					return false;
					
				});
				
				jQuery('#vkhelper_plugins_clearAccountFunc_subscribeToFriends_openBox').click(function(){
				
					vkhelper.plugins.clearAccountFunc.vk_script.functions.subscribeToFriends_openBox();
					
					a.hide();
					
					return false;
					
				});
				
				jQuery('#vkhelper_plugins_clearAccountFunc_wallDelete_openBox').click(function(){

					vkhelper.plugins.clearAccountFunc.vk_script.functions.wallDelete_openBox();
					
					a.hide();
					
					return false;
					
				});
				
				jQuery('#vkhelper_plugins_clearAccountFunc_dialogsDelete_openBox').click(function(){

					vkhelper.plugins.clearAccountFunc.vk_script.functions.dialogsDelete_openBox();
					
					a.hide();
					
					return false;
					
				});
				
			},
			
			faveRemoveLikes_openBox : function (type) {
					
				var type_arr  = {
					'photo' : [
						vkhelper.lang.get('clearAccountFunc', 'messageBox_content_faveRemoveLikesPhoto'),
						vkhelper.lang.get('clearAccountFunc', 'messageBox_content_faveRemoveLikesPhoto_confirm'),
					],
					'video' : [
						vkhelper.lang.get('clearAccountFunc', 'messageBox_content_faveRemoveLikesVideo'),
						vkhelper.lang.get('clearAccountFunc', 'messageBox_content_faveRemoveLikesVideo_confirm')
					],
					'wall'  : [
						vkhelper.lang.get('clearAccountFunc', 'messageBox_content_faveRemoveLikesWall'),
						vkhelper.lang.get('clearAccountFunc', 'messageBox_content_faveRemoveLikesWall_confirm')
					]
				};
				
				if (!type_arr[type]) {
					return;
				}
				
				var a = new MessageBox({title : type_arr[type][0]})
					.content(type_arr[type][1])
					.setButtons(vkhelper.lang.get('clearAccountFunc', 'messageBox_btnClear'), function() {

						a.hide();
						
						vkhelper.messages.sendToBG({ 
							type : 'vkhelper_plugins_clearAccountFunc_faveRemoveLikes', 
							details : {
								uid  : vk.id, 
								type : type
							}
						});
						
					}, vkhelper.lang.get('clearAccountFunc', 'messageBox_btnCancle'))
					.show();
			},
			
			groupsLeave_openBox : function () {
			
				var a = new MessageBox({title : vkhelper.lang.get('clearAccountFunc', 'messageBox_content_groupsLeave')})
					.content(vkhelper.lang.get('clearAccountFunc', 'messageBox_content_groupsLeave_conform1') +'<br><br><div class="checkbox on" id="vkhelper_plugins_clearAccountFunc_groupsLeave_openBox_isAdmin" onclick="checkbox(this);">'+ vkhelper.lang.get('clearAccountFunc', 'messageBox_content_groupsLeave_conform2') +'</div>')
					.setButtons(vkhelper.lang.get('clearAccountFunc', 'messageBox_btnClear'), function() {

						var is_admin = jQuery('#vkhelper_plugins_clearAccountFunc_groupsLeave_openBox_isAdmin').hasClass('on') ? 1 : 0;
						
						a.hide();
						
						vkhelper.messages.sendToBG({ 
							type : 'vkhelper_plugins_clearAccountFunc_groupsLeave', 
							details : {
								uid  : vk.id, 
								is_admin : is_admin
							}
						});
						
					}, vkhelper.lang.get('clearAccountFunc', 'messageBox_btnCancle'))
					.show();
			},
			
			friendsDelete_openBox : function () {
				
				var a = new MessageBox({title : vkhelper.lang.get('clearAccountFunc', 'messageBox_content_friendsDelete')})
					.content(''+
					'<h4 class="subheader">'+ vkhelper.lang.get('clearAccountFunc', 'messageBox_content_friendsDelete_title') +'</h4>'+
		
					'<div id="vkhelper_plugins_clearAccountFunc_friendsDelete_openBox_radio">'+
						'<div style=""><div class="radiobtn on" data-type="1">'+ vkhelper.lang.get('clearAccountFunc', 'messageBox_content_friendsDelete_type_1') +'</div></div>'+
    					'<div style="padding-top: 11px;"><div class="radiobtn" data-type="2">'+ vkhelper.lang.get('clearAccountFunc', 'messageBox_content_friendsDelete_type_2') +'</div></div>'+
    					'<div style="padding-top: 11px;"><div class="radiobtn" data-type="3">'+ vkhelper.lang.get('clearAccountFunc', 'messageBox_content_friendsDelete_type_3') +'</div></div>'+
    					'<div style="padding-top: 11px;"><div class="radiobtn" data-type="4">'+ vkhelper.lang.get('clearAccountFunc', 'messageBox_content_friendsDelete_type_4') +'</div>'+
    						'<div style="margin:10px 0 0 20px; display:none">'+ vkhelper.lang.get('clearAccountFunc', 'messageBox_content_friendsDelete_type_4_data', {input : '<input type="text" size="2" value="30" id="vkhelper_plugins_clearAccountFunc_friendsDelete_openBox_radio_4_days" class="dark" autocomplete="off">'}) +'</div>'+
    					'</div>'+
    					'<div style="padding-top: 11px;"><div class="radiobtn" data-type="5">'+ vkhelper.lang.get('clearAccountFunc', 'messageBox_content_friendsDelete_type_5') +'</div></div>'+
    					'<div style="padding-top: 11px;"><div class="radiobtn" data-type="6">'+ vkhelper.lang.get('clearAccountFunc', 'messageBox_content_friendsDelete_type_6') +'</div></div>'+
    					'<div style="padding-top: 11px;"><div class="radiobtn" data-type="7">'+ vkhelper.lang.get('clearAccountFunc', 'messageBox_content_friendsDelete_type_7') +'</div></div>'+
    					'<div style="padding-top: 11px;"><div class="radiobtn" data-type="8">'+ vkhelper.lang.get('clearAccountFunc', 'messageBox_content_friendsDelete_type_8') +'</div></div>'+
    				'</div>'
					)
					.setButtons(vkhelper.lang.get('clearAccountFunc', 'messageBox_btnDelete'), function() {

						var details = {
							type : jQuery('#vkhelper_plugins_clearAccountFunc_friendsDelete_openBox_radio .radiobtn.on').data('type')
						};
						
						if (details.type == 4) {
						
							details.days = jQuery('#vkhelper_plugins_clearAccountFunc_friendsDelete_openBox_radio_4_days').val();
							
							if (parseInt(details.days, 10) != details.days || details.days < 1) {
								notaBene('vkhelper_plugins_clearAccountFunc_friendsDelete_openBox_radio_4_days');
								return;
							}
						}
						
						var t;
						switch (details.type) {
							case 1:
							case 2:
							case 3:
							case 5:
							case 6:
							case 7:
							case 8:
								t = vkhelper.lang.get('clearAccountFunc', 'messageBox_content_friendsDelete_confirm_type_'+ details.type);
							break;
							case 4:
								t = vkhelper.lang.get('clearAccountFunc', 'messageBox_content_friendsDelete_confirm_type_4', {days : details.days});
							break;
						}
						
						if (!t) return;
						
						var b = new MessageBox({title : vkhelper.lang.get('clearAccountFunc', 'messageBox_content_friendsDelete')})
							.content(vkhelper.lang.get('clearAccountFunc', 'messageBox_content_friendsDelete_confirm') +' <b>'+ t +'</b>?')
							.setButtons(vkhelper.lang.get('clearAccountFunc', 'messageBox_btnDelete'), function() {

								b.hide();
								a.hide();
								
								details.uid = vk.id;
								
								vkhelper.messages.sendToBG({ 
									type : 'vkhelper_plugins_clearAccountFunc_friendsDelete', 
									details : details
								});
							
							}, vkhelper.lang.get('clearAccountFunc', 'messageBox_btnCancle'))
							.show();
					
					}, vkhelper.lang.get('clearAccountFunc', 'messageBox_btnCancle'))
					.show();
					
							
					jQuery('#vkhelper_plugins_clearAccountFunc_friendsDelete_openBox_radio .radiobtn').click(function(){

						var $this = jQuery(this), 
							t     = $this.data('type');
	
						jQuery('#vkhelper_plugins_clearAccountFunc_friendsDelete_openBox_radio .radiobtn').removeClass('on');
	
						$this.addClass('on');
	
						if (t == 4) {
		
							$this.next().show().find('input').select().focus();
		
						} else {
	
							jQuery('#vkhelper_plugins_clearAccountFunc_friendsDelete_openBox_radio .radiobtn[data-type="4"]').next().hide();
							
						}
	
					});

			},
			
			friendDeleteRequestOut_openBox : function () {
					
				var a = new MessageBox({title : vkhelper.lang.get('clearAccountFunc', 'messageBox_content_friendDeleteRequestOut')})
					.content(vkhelper.lang.get('clearAccountFunc', 'messageBox_content_friendDeleteRequestOut_confirm'))
					.setButtons(vkhelper.lang.get('clearAccountFunc', 'messageBox_btnDelete'), function() {

						a.hide();
						
						vkhelper.messages.sendToBG({ 
							type : 'vkhelper_plugins_clearAccountFunc_friendDeleteRequestOut', 
							details : {
								uid : vk.id
							}
						});
						
					}, vkhelper.lang.get('clearAccountFunc', 'messageBox_btnCancle'))
					.show();
					
			},
			
			friendsRequestInpJoin_openBox : function () {
					
				var a = new MessageBox({title : vkhelper.lang.get('clearAccountFunc', 'messageBox_content_friendsRequestInpJoin')})
					.content(vkhelper.lang.get('clearAccountFunc', 'messageBox_content_friendsRequestInpJoin_confirm'))
					.setButtons(vkhelper.lang.get('clearAccountFunc', 'messageBox_btnAccept'), function() {

						a.hide();
						
						vkhelper.messages.sendToBG({ 
							type : 'vkhelper_plugins_clearAccountFunc_friendsRequestInpJoin', 
							details : {
								uid : vk.id
							}
						});
						
					}, vkhelper.lang.get('clearAccountFunc', 'messageBox_btnCancle'))
					.show();
					
			},
			
			subscribeToFriends_openBox : function () {
				
				var a = new MessageBox({title : vkhelper.lang.get('clearAccountFunc', 'messageBox_content_subscribeToFriends')})
					.content(vkhelper.lang.get('clearAccountFunc', 'messageBox_content_subscribeToFriends_confirm'))
					.setButtons(vkhelper.lang.get('clearAccountFunc', 'messageBox_btnAdd'), function() {

						a.hide();
						
						vkhelper.messages.sendToBG({ 
							type : 'vkhelper_plugins_clearAccountFunc_subscribeToFriends', 
							details : {
								uid : vk.id
							}
						});
						
					}, vkhelper.lang.get('clearAccountFunc', 'messageBox_btnCancle'))
					.show();
					
			},
			
			wallDelete_openBox : function () {
			
				var a = new MessageBox({title : vkhelper.lang.get('clearAccountFunc', 'messageBox_content_wallDelete_title')})
					.content('\
					<h4 class="subheader">'+vkhelper.lang.get('clearAccountFunc', 'messageBox_content_wallDelete_content_selectPage') +'</h4>\
					<div id="vkhelper_plugins_clearAccountFunc_wallDelete_openBox_radio">\
						<div style="">\
							<div class="radiobtn on" data-type="1">'+ vkhelper.lang.get('clearAccountFunc', 'messageBox_content_wallDelete_content_selectPage_1') +'</div>\
						</div>\
						<div style="padding-top: 11px;">\
							<div class="radiobtn" data-type="2">'+ vkhelper.lang.get('clearAccountFunc', 'messageBox_content_wallDelete_content_selectPage_2') +'</div>\
							<div style="display: none; margin: 11px 0 0 20px" id="vkhelper_plugins_clearAccountFunc_selectGroup_wallDelete">\
							</div>\
						</div>\
					</div>\
					\
					<h4 class="subheader">'+ vkhelper.lang.get('clearAccountFunc', 'messageBox_content_wallDelete_content_paramsDelete') +'</h4>\
					<div id="vkhelper_plugins_clearAccountFunc_wallDelete_openBox_params_radio">\
						<div style=""><div class="radiobtn on" data-type="1">'+ vkhelper.lang.get('clearAccountFunc', 'messageBox_content_wallDelete_content_paramsDelete_1') +'</div></div>\
						<div style="padding-top: 11px;"><div class="radiobtn" data-type="2">'+ vkhelper.lang.get('clearAccountFunc', 'messageBox_content_wallDelete_content_paramsDelete_2') +'</div></div>\
						<div style="padding-top: 11px;"><div class="radiobtn" data-type="3">'+ vkhelper.lang.get('clearAccountFunc', 'messageBox_content_wallDelete_content_paramsDelete_3') +'</div></div>\
					</div>')
					.setButtons(vkhelper.lang.get('clearAccountFunc', 'messageBox_btnDelete'), function() {
							
						var details = {
							owner : 0,
							type  : jQuery('#vkhelper_plugins_clearAccountFunc_wallDelete_openBox_params_radio .radiobtn.on').data('type')
						};
						
						
						switch (jQuery('#vkhelper_plugins_clearAccountFunc_wallDelete_openBox_radio .radiobtn.on').data('type')) {
						
							case 1:
								details.owner = vk.id;
							break;
							
							case 2:
								
								details.owner = -Number(jQuery('#vkhelper_plugins_clearAccountFunc_selectGroup_wallDelete').attr('gid'));
								
							break;
						
						}
						
						if (details.owner == 0) {
							return;
						}
						
						var t;
						switch (details.type) {
							case 1:
								t = vkhelper.lang.get('clearAccountFunc', 'messageBox_content_wallDelete_content_paramsDelete_confirm_1');
							break;
							case 2:
								t = vkhelper.lang.get('clearAccountFunc', 'messageBox_content_wallDelete_content_paramsDelete_confirm_2');
							break;
							case 3:
								t = vkhelper.lang.get('clearAccountFunc', 'messageBox_content_wallDelete_content_paramsDelete_confirm_3');
							break;
						}
						
						var t2 = details.owner > 0 
									? vkhelper.lang.get('clearAccountFunc', 'messageBox_content_wallDelete_content_paramsDelete_confirm_mypage') 
									: vkhelper.lang.get('clearAccountFunc', 'messageBox_content_wallDelete_content_paramsDelete_confirm_group') +' <b>'+ jQuery('#vkhelper_plugins_clearAccountFunc_selectGroup_wallDelete').text() +'</b>';
						
						if (!t) return;
						
						var b = new MessageBox({title : vkhelper.lang.get('clearAccountFunc', 'messageBox_content_wallDelete_title')})
							.content(vkhelper.lang.get('clearAccountFunc', 'messageBox_content_wallDelete_content_paramsDelete_confirm_content') +' <b>'+ t +'</b> '+ t2 +'?')
							.setButtons(vkhelper.lang.get('clearAccountFunc', 'messageBox_btnDelete'), function() {

								b.hide();
								a.hide();
								
								details.uid = vk.id;
								
								vkhelper.messages.sendToBG({ 
									type : 'vkhelper_plugins_clearAccountFunc_wallDelete', 
									details : details
								});
								
							}, vkhelper.lang.get('clearAccountFunc', 'messageBox_btnCancle'))
							.show();

					}, vkhelper.lang.get('clearAccountFunc', 'messageBox_btnCancle'))
					.show();
					
				jQuery('#vkhelper_plugins_clearAccountFunc_wallDelete_openBox_radio .radiobtn').click(function(){
					
					if (jQuery(this).hasClass('disabled')) return;
					
					var $this = jQuery(this), 
						t     = $this.data('type');
	
					jQuery('#vkhelper_plugins_clearAccountFunc_wallDelete_openBox_radio .radiobtn').removeClass('on');
	
					$this.addClass('on');
	
					if (t == 2) {
		
						jQuery('#vkhelper_plugins_clearAccountFunc_selectGroup_main').show();
		
						vkhelper.plugins.listSelectedItem.vk_script.functions.setListGroups('clearAccountFunc_wallDelete', {noHide : true, oneItem : true}, function(details) {
					
							if (!details.list.length) {
								jQuery('#vkhelper_plugins_clearAccountFunc_selectGroup_wallDelete').hide();
								return;
							}
							
							jQuery('#vkhelper_plugins_clearAccountFunc_selectGroup_wallDelete').attr('gid', details.list[0]).html(details.items[details.list[0]].title).show();
					
						});
						
					} else {
	
						jQuery('#vkhelper_plugins_clearAccountFunc_selectGroup_main').hide();
							
					}
	
				});
				
				jQuery('#vkhelper_plugins_clearAccountFunc_wallDelete_openBox_params_radio .radiobtn').click(function(){

					if (jQuery(this).hasClass('disabled')) return;
					
					jQuery('#vkhelper_plugins_clearAccountFunc_wallDelete_openBox_params_radio .radiobtn').removeClass('on');
						
					jQuery(this).addClass('on');
	
				});

			},
			
			dialogsDelete_openBox : function () {
					
				var a = new MessageBox({title : vkhelper.lang.get('clearAccountFunc', 'messageBox_content_dialogsDelete')})
					.content(''+
					'<h4 class="subheader">'+ vkhelper.lang.get('clearAccountFunc', 'messageBox_content_dialogsDelete_params') +'</h4>'+
					'<div class="checkbox" id="vkhelper_plugins_clearAccountFunc_dialogsDelete_openBox_unread" onclick="checkbox(this);">'+ vkhelper.lang.get('clearAccountFunc', 'messageBox_content_dialogsDelete_checkbox') +'</div>')
					.setButtons(vkhelper.lang.get('clearAccountFunc', 'messageBox_btnDelete'), function() {
								
						var details = {
							unread  : jQuery('#vkhelper_plugins_clearAccountFunc_dialogsDelete_openBox_unread').hasClass('on') ? 1 : 0
						};
						
						var t = details.unread == 1 
									? vkhelper.lang.get('clearAccountFunc', 'messageBox_content_dialogsDelete_type_1')
									: vkhelper.lang.get('clearAccountFunc', 'messageBox_content_dialogsDelete_type_2');
						
						var b = new MessageBox({title : vkhelper.lang.get('clearAccountFunc', 'messageBox_content_dialogsDelete')})
							.content(vkhelper.lang.get('clearAccountFunc', 'messageBox_content_dialogsDelete_lastConfirm', {t : t}))
							.setButtons(vkhelper.lang.get('clearAccountFunc', 'messageBox_btnDelete'), function() {

								b.hide();
								a.hide();
								
								details.uid = vk.id;
								
								vkhelper.messages.sendToBG({ 
									type : 'vkhelper_plugins_clearAccountFunc_dialogsDelete', 
									details : details
								});
								
							}, vkhelper.lang.get('clearAccountFunc', 'messageBox_btnCancle'))
							.show();

					}, vkhelper.lang.get('clearAccountFunc', 'messageBox_btnCancle'))
					.show();
					
			}
			
		}
		
	},
	
	bg_script : {
		
		messages : {

			'vkhelper_plugins_clearAccountFunc_faveRemoveLikes' : function (details, tab_id, callback) {

				var type_arr  = {
					'photo' : {
						text   : lang.get('clearAccountFunc', 'tabRequest_faveRemoveLikes_photo'),
						method : 'getPhotos',
						type   : 'photo'
					},
					'video' : {
						text   : lang.get('clearAccountFunc', 'tabRequest_faveRemoveLikes_video'),
						method : 'getVideos',
						type   : 'video'
					},
					'wall' : {
						text   : lang.get('clearAccountFunc', 'tabRequest_faveRemoveLikes_post'),
						method : 'getPosts',
						type   : 'post'
					}
				};
				
				if (!type_arr[details.type]) {
					return;
				}
				
				task.add('last', {
					initiator : 'clearAccountFunc.bg.msg.vkhelper_plugins_clearAccountFunc_faveRemoveLikes',
					isVisible : true,
					title : '<b>'+ type_arr[details.type].text +'</b>',
					maxCount  : 1,
					onFinished : function (task_id, details) {
					
						messages.sendToVk({
							type : 'control_fastMessage_view',
							details : {
								status : 'success',
								text : 'Удалено лайков: '+ details.maxCount
							}
						});
							
					}
				}, function(task_id, task_callback) {
				
					var now_count = 0,
						list = [];
				
					var code = '\
						var res = [];\
						var i = 0;\
						while (i < 25) {\
							var a = API.fave.'+ type_arr[details.type].method +'({"count":1000,"offset":i*1000});\
							if (a.items.length > 0) {\
								res.push(a.items);\
								i = i + 1;\
							} else {\
								i = 25;\
							}\
						}\
						return res;';
					
					VK.api('execute', {
						code : code
					}, {
						uid : details.uid,
						task_id : task_id
					}, function(response) {
							
						for (var a in response.details) { 
							list = list.concat(response.details[a]);
						}
						
						list = jQuery.map(list, function(d) {
  							
  							return {
  								owner_id : d.owner_id,
  								id : d.id
  							};
				
						});
						
						task.update(task_id, {
							maxCount : list.length
						});
						
						if (!list.length) {
							task.update(task_id, {
								addSuccess : {
									text : 'Нет понравившихся элементов'
								}
							});
							task_callback();
							return;
						}
											
						go();
						
					});
					
					function go() {
						
						var arr = [];
					
						for (var i = 0, len = list.length; i < 25; i++) {
						
							if (!list.length) {
								break;
							}
						
							var a = list.shift();
							
							arr.push("{owner_id : "+ a.owner_id +", id : "+ a.id +"}");
						}
						
						
						var code = '\
							var arr = ['+ arr.join(',') +'];\
							var e = arr.length;\
							var i = 0;\
							while (i < e) {\
								API.likes.delete({\
									type : "'+ type_arr[details.type].type +'",\
									owner_id : arr[i].owner_id,\
									item_id : arr[i].id\
								});\
								i = i + 1;\
							}\
							return arr.length;';
									
						VK.api('execute', {
							code : code
						}, {
							uid : details.uid,
							task_id : task_id
						}, function(response) {
					
							task.update(task_id, {
								nowCountAdd : arr.length
							});
							
							// если больше нечего удалять
							if (!list.length) {
								task.update(task_id, {
									addSuccess : {
										text : 'Все понравившиеся элементы удалены'
									}
								});
								task_callback();
								return;
							}
									
							// если пользователь отклонил
							//if (!tabRequest.get(id_tabRequest)) {
							//	return false;
							//}
						
							setTimeout(go, 1000);
								
						});
					
					}
							
				});

			},
			
			'vkhelper_plugins_clearAccountFunc_groupsLeave' : function (details, tab_id, callback) {

				// details.is_admin == 1 не удаляем сообщества, в которых пользователь админ
				// создаем заметку

				
				task.add('last', {
					initiator : 'clearAccountFunc.bg.msg.vkhelper_plugins_clearAccountFunc_groupsLeave',
					isVisible : true,
					title : '<b>Выйти из сообществ</b> на странице <a href="https://vk.com/id'+ details.uid +'" target="_blank">id'+details.uid +'</a>',
					maxCount  : 1,
					onFinished : function (task_id, details) {
					
						messages.sendToVk({
							type : 'control_fastMessage_view',
							details : {
								status : 'success',
								text : 'Вышли из сообществ: '+ details.maxCount
							}
						});
							
					}
				}, function(task_id, task_callback) {
				
					var now_count = 0,
						list = [];
				
					var code = '\
						var res = {"all":[], "admin":[]};\
						var i = 0;\
						while (i < 12) {\
							var a = API.groups.get({"count":1000,"offset":i*1000});\
							if (a.items.length > 0) {\
								res.all.push(a.items);\
								var b = API.groups.get({"count":1000,"offset":i*1000,"filter":"moder"});\
								if (b.items.length > 0) { res.admin.push(b.items); }\
								i = i + 1;\
							} else {\
								i = 12;\
							}\
						}\
						return res;';
					
					VK.api('execute', {
						code : code
					}, {
						uid : details.uid,
						task_id : task_id
					}, function(response) {
					
						for (var a in response.details.all) {
							list = list.concat(response.details.all[a]);
						}
						
						if (details.is_admin == 1) {
						
							jQuery.each(response.details.admin, function(k,v) {
								jQuery.each(v, function(k2,v2) {
									var it = list.indexOf(v2);
									if (it != -1) {
										list.splice(it, 1);
									}
								});
							});
							
						}
						
						task.update(task_id, {
							maxCount : list.length
						});
						
						if (!list.length) {
							task.update(task_id, {
								addSuccess : {
									text : 'Нет сообществ для выхода'
								}
							});
							task_callback();
							return;
						}
						
						go();
						
					});
					
					function go() {
						
						var arr = [];
					
						for (var i = 0, len = list.length; i < 25; i++) {
						
							if (!list.length) {
								break;
							}
						
							arr.push(list.shift());
							
						}
						
						var code = '\
							var arr = ['+ arr.join(',') +'];\
							var e = arr.length;\
							var i = 0;\
							while (i < e) {\
								API.groups.leave({\
									group_id : arr[i]\
								});\
								i = i + 1;\
							}\
							return arr.length;';
									
						VK.api('execute', {
							code : code
						}, {
							uid : details.uid,
							task_id : task_id
						}, function(response) {
					
							task.update(task_id, {
								nowCountAdd : arr.length
							});
							
							// если больше нечего удалять
							if (!list.length) {
								task.update(task_id, {
									addSuccess : {
										text : 'Успешно вышли из всех сообществ'
									}
								});
								task_callback();
								return;
							}
									
							// если пользователь отклонил
							//if (!tabRequest.get(id_tabRequest)) {
							//	return false;
							//}
						
							setTimeout(go, 1000);
								
						});
					
					}
							
				});
			
			},
			
			'vkhelper_plugins_clearAccountFunc_friendsDelete' : function (details, tab_id, callback) {

				task.add('last', {
					initiator : 'clearAccountFunc.bg.msg.vkhelper_plugins_clearAccountFunc_friendsDelete',
					isVisible : true,
					title : '<b>Удаление друзей</b>',
					maxCount  : 1,
					onFinished : function (task_id, details) {
					
						messages.sendToVk({
							type : 'control_fastMessage_view',
							details : {
								status : 'success',
								text : 'Удалено друзей: '+ details.maxCount
							}
						});
							
					}
				}, function(task_id, task_callback) {
					
					var fields = '';
					switch (details.type) {
						case 1:
							fields = '';
						break;
						case 2:
							fields = 'nickname';
						break;
						case 3:
							fields = 'nickname';
						break;
						case 4:
							fields = 'last_seen';
						break;
						case 5:
							fields = 'can_write_private_message';
						break;
						case 6:
							fields = 'can_post';
						break;
						case 7:
							fields = 'nickname';
						break;
						case 8:
							fields = 'photo_50';
						break;
					}
				
				
					var now_count = 0,
						list = [];
				
					var code = '\
						var res = [];\
						var i = 0;\
						while (i < 25) {\
							var a = API.friends.get({"count":5000,"offset":i*5000,"fields":"'+ fields +'"});\
							if (a.items.length > 0) {\
								res.push(a.items);\
								i = i + 1;\
							} else {\
								i = 25;\
							}\
						}\
						return res;';
					
					VK.api('execute', {
						code : code
					}, {
						uid : details.uid,
						task_id : task_id
					}, function(response) {
							
						for (var a in response.details) { 
							list = list.concat(response.details[a]);
						}
						
						list = jQuery.map(list, function(d) {
  							
  							switch (details.type) {
								case 1:
									return jQuery.isNumeric(d) ? d : 0;
								break;
								case 2:
									return d.deactivated == 'deleted' ? d.id : 0;
								break;
								case 3:
									return d.deactivated == 'banned' ? d.id : 0;
								break;
								case 4:
									return d.last_seen && (d.last_seen.time <= (Math.floor(Date.now() / 1000) - (60 * 60 * 24 * details.days))) ? d.id : 0;
								break;
								case 5:
									return !d.deactivated && d.can_write_private_message == 0 ? d.id : 0;
								break;
								case 6:
									return !d.deactivated && d.can_post == 0 ? d.id : 0;
								break;
								case 7:
									return d.first_name == d.last_name ? d.id : 0;
								break;
								case 8:
									return !d.deactivated && d.photo_50 == 'http://vk.com/images/camera_c.gif' ? d.id : 0;
								break;
					
							}
				
						});
						
						list = list.filter(function(val) {
							return parseInt(val, 10) == val && val > 0;
						});
						
						
						task.update(task_id, {
							maxCount : list.length
						});
						
						if (!list.length) {
							task.update(task_id, {
								addSuccess : {
									text : 'Нет друзей для удаления'
								}
							});
							task_callback();
							return;
						}
											
						go();
						
					});
					
					function go() {
						
						var arr = [];
					
						for (var i = 0, len = list.length; i < 25; i++) {
						
							if (!list.length) {
								break;
							}
						
							arr.push(list.shift());
						}
						
						
						var code = '\
							var arr = ['+ arr.join(',') +'];\
							var e = arr.length;\
							var i = 0;\
							while (i < e) {\
								API.friends.delete({\
									user_id : arr[i]\
								});\
								i = i + 1;\
							}\
							return arr.length;';
									
						VK.api('execute', {
							code : code
						}, {
							uid : details.uid,
							task_id : task_id
						}, function(response) {
					
							task.update(task_id, {
								nowCountAdd : arr.length
							});
							
							// если больше нечего удалять
							if (!list.length) {
								task.update(task_id, {
									addSuccess : {
										text : 'Друзья удалены'
									}
								});
								task_callback();
								return;
							}
									
							// если пользователь отклонил
							//if (!tabRequest.get(id_tabRequest)) {
							//	return false;
							//}
						
							setTimeout(go, 1000);
								
						});
					
					}
							
				});
				
			},
			
			'vkhelper_plugins_clearAccountFunc_friendDeleteRequestOut' : function (details, tab_id, callback) {

				task.add('last', {
					initiator : 'clearAccountFunc.bg.msg.vkhelper_plugins_clearAccountFunc_friendDeleteRequestOut',
					isVisible : true,
					title : '<b>Удаление исходящих заявок в друзья</b>',
					maxCount  : 1,
					onFinished : function (task_id, details) {
					
						messages.sendToVk({
							type : 'control_fastMessage_view',
							details : {
								status : 'success',
								text : 'Удалено исходящих заявок в друзья: '+ details.maxCount
							}
						});
							
					}
				}, function(task_id, task_callback) {
				
					var now_count = 0,
						list = [];
				
					var code = '\
						var res = [];\
						var i = 0;\
						while (i < 25) {\
							var a = API.friends.getRequests({"count":1000,"offset":i*1000,"out":"1"});\
							if (a.items.length > 0) {\
								res.push(a.items);\
								i = i + 1;\
							} else {\
								i = 25;\
							}\
						}\
						return res;';
					
					VK.api('execute', {
						code : code
					}, {
						uid : details.uid,
						task_id : task_id
					}, function(response) {
							
						for (var a in response.details) { 
							list = list.concat(response.details[a]);
						}
						
						task.update(task_id, {
							maxCount : list.length
						});
						
						if (!list.length) {
							task.update(task_id, {
								addSuccess : {
									text : 'Нет заявок для удаления'
								}
							});
							task_callback();
							return;
						}
											
						go();
						
					});
					
					function go() {
						
						var arr = [];
					
						for (var i = 0, len = list.length; i < 25; i++) {
						
							if (!list.length) {
								break;
							}
						
							arr.push(list.shift());
						}
						
						
						var code = '\
							var arr = ['+ arr.join(',') +'];\
							var e = arr.length;\
							var i = 0;\
							while (i < e) {\
								API.friends.delete({\
									user_id : arr[i]\
								});\
								i = i + 1;\
							}\
							return arr.length;';
									
						VK.api('execute', {
							code : code
						}, {
							uid : details.uid,
							task_id : task_id
						}, function(response) {
					
							task.update(task_id, {
								nowCountAdd : arr.length
							});
							
							// если больше нечего удалять
							if (!list.length) {
								task.update(task_id, {
									addSuccess : {
										text : 'Все исходящие заявки удалены'
									}
								});
								task_callback();
								return;
							}
									
							// если пользователь отклонил
							//if (!tabRequest.get(id_tabRequest)) {
							//	return false;
							//}
						
							setTimeout(go, 1000);
								
						});
					
					}
							
				});
				
			},
			
			'vkhelper_plugins_clearAccountFunc_friendsRequestInpJoin' : function (details, tab_id, callback) {

				task.add('last', {
					initiator : 'clearAccountFunc.bg.msg.vkhelper_plugins_clearAccountFunc_friendsRequestInpJoin',
					isVisible : true,
					title : '<b>Одобрение всех заявок в друзья</b>',
					maxCount  : 1,
					onFinished : function (task_id, details) {
					
						messages.sendToVk({
							type : 'control_fastMessage_view',
							details : {
								status : 'success',
								text : 'Одобрено заявок в друзья: '+ details.maxCount
							}
						});
							
					}
				}, function(task_id, task_callback) {
				
					var now_count = 0,
						list = [];
				
					var code = '\
						var res = [];\
						var i = 0;\
						while (i < 25) {\
							var a = API.friends.getRequests({"count":1000,"offset":i*1000});\
							if (a.items.length > 0) {\
								res.push(a.items);\
								i = i + 1;\
							} else {\
								i = 25;\
							}\
						}\
						return res;';
					
					VK.api('execute', {
						code : code
					}, {
						uid : details.uid,
						task_id : task_id
					}, function(response) {
							
						for (var a in response.details) { 
							list = list.concat(response.details[a]);
						}
						
						task.update(task_id, {
							maxCount : list.length
						});
						
						if (!list.length) {
							task.update(task_id, {
								addSuccess : {
									text : 'Нет заявок для одобрения'
								}
							});
							task_callback();
							return;
						}
											
						go();
						
					});
					
					function go() {
						
						var arr = [];
					
						for (var i = 0, len = list.length; i < 25; i++) {
						
							if (!list.length) {
								break;
							}
						
							arr.push(list.shift());
						}
						
						
						var code = '\
							var arr = ['+ arr.join(',') +'];\
							var e = arr.length;\
							var i = 0;\
							while (i < e) {\
								API.friends.add({\
									user_id : arr[i]\
								});\
								i = i + 1;\
							}\
							return arr.length;';
									
						VK.api('execute', {
							code : code
						}, {
							uid : details.uid,
							task_id : task_id
						}, function(response) {
					
							task.update(task_id, {
								nowCountAdd : arr.length
							});
							
							// если больше нечего удалять
							if (!list.length) {
								task.update(task_id, {
									addSuccess : {
										text : 'Все заявки в друзья одобрены'
									}
								});
								task_callback();
								return;
							}
									
							// если пользователь отклонил
							//if (!tabRequest.get(id_tabRequest)) {
							//	return false;
							//}
						
							setTimeout(go, 1000);
								
						});
					
					}
							
				});
				
			},
			
			'vkhelper_plugins_clearAccountFunc_subscribeToFriends' : function (details, tab_id, callback) {

				task.add('last', {
					initiator : 'clearAccountFunc.bg.msg.vkhelper_plugins_clearAccountFunc_subscribeToFriends',
					isVisible : true,
					title : '<b>Добавление подписчиков в друзья</b>',
					maxCount  : 1,
					onFinished : function (task_id, details) {
					
						messages.sendToVk({
							type : 'control_fastMessage_view',
							details : {
								status : 'success',
								text : 'Добавлено подписчиков в друзья: '+ details.maxCount
							}
						});
							
					}
				}, function(task_id, task_callback) {
				
					var now_count = 0,
						list = [];
				
					var code = '\
						var res = [];\
						var i = 0;\
						while (i < 25) {\
							var a = API.users.getFollowers({"count":1000,"offset":i*1000});\
							if (a.items.length > 0) {\
								res.push(a.items);\
								i = i + 1;\
							} else {\
								i = 25;\
							}\
						}\
						return res;'
					
					VK.api('execute', {
						code : code
					}, {
						uid : details.uid,
						task_id : task_id
					}, function(response) {
							
						for (var a in response.details) { 
							list = list.concat(response.details[a]);
						}
						
						task.update(task_id, {
							maxCount : list.length
						});
						
						if (!list.length) {
							task.update(task_id, {
								addSuccess : {
									text : 'Нет заявок для добавления'
								}
							});
							task_callback();
							return;
						}
											
						go();
						
					});
					
					function go() {
						
						var arr = [];
					
						for (var i = 0, len = list.length; i < 25; i++) {
						
							if (!list.length) {
								break;
							}
						
							arr.push(list.shift());
						}
						
						var code = '\
							var arr = ['+ arr.join(',') +'];\
							var e = arr.length;\
							var i = 0;\
							while (i < e) {\
								API.friends.add({\
									user_id : arr[i]\
								});\
								i = i + 1;\
							}\
							return arr.length;';
									
						VK.api('execute', {
							code : code
						}, {
							uid : details.uid,
							task_id : task_id
						}, function(response) {
					
							task.update(task_id, {
								nowCountAdd : arr.length
							});
							
							// если больше нечего удалять
							if (!list.length) {
								task.update(task_id, {
									addSuccess : {
										text : 'Все подписчики добавлены в друзья'
									}
								});
								task_callback();
								return;
							}
									
							// если пользователь отклонил
							//if (!tabRequest.get(id_tabRequest)) {
							//	return false;
							//}
						
							setTimeout(go, 1000);
								
						});
					
					}
							
				});
				
			},
			
			'vkhelper_plugins_clearAccountFunc_wallDelete' : function (details, tab_id, callback) {

				if (details.owner == 0) {
					return;
				}	
				
				var link = details.owner > 0 ? 'id' + details.owner : 'club' + (-details.owner);
				
				task.add('last', {
					initiator : 'clearAccountFunc.bg.msg.vkhelper_plugins_clearAccountFunc_wallDelete',
					isVisible : true,
					title : '<b>Удаление записей на стене</b> <a href="https://vk.com/'+ link +'" target="_blank">'+ link +'</a>',
					maxCount  : 1,
					onFinished : function (task_id, details) {
					
						messages.sendToVk({
							type : 'control_fastMessage_view',
							details : {
								status : 'success',
								text : 'Удалено записей: '+ details.maxCount
							}
						});
							
					}
				}, function(task_id, task_callback) {
				
					var now_count = 0,
						list = [],
						types = {
							1 : "all",
							2 : "owner",
							3 : "others"
						};
				
					var code = '\
						var res = [];\
						var i = 0;\
						while (i < 25) {\
							var a = API.wall.get({"count":100,"offset":i*100,"owner_id":"'+ details.owner +'","filter":"'+ types[details.type] +'"});\
							if (a.items.length > 0) {\
								res.push(a.items);\
								i = i + 1;\
							} else {\
								i = 25;\
							}\
						}\
						return res;';
					
					VK.api('execute', {
						code : code
					}, {
						uid : details.uid,
						task_id : task_id
					}, function(response) {
							
						for (var a in response.details) { 
							list = list.concat(response.details[a]);
						}
						
						task.update(task_id, {
							maxCount : list.length
						});
						
						if (!list.length) {
							task.update(task_id, {
								addSuccess : {
									text : 'Нет записей для удаления'
								}
							});
							task_callback();
							return;
						}
											
						go();
						
					});
					
					function go() {
						
						var arr = [];
					
						for (var i = 0, len = list.length; i < 25; i++) {
						
							if (!list.length) {
								break;
							}
						
							var t = list.shift();
							
							arr.push('{"owner_id":"'+ t.owner_id +'","id":"'+ t.id +'"}');
						}
					
						
						var code = '\
							var arr = ['+ arr.join(',') +'];\
							var e = arr.length;\
							var i = 0;\
							while (i < e) {\
								API.wall.delete({\
									owner_id : arr[i].owner_id,\
									post_id  : arr[i].id\
								});\
								i = i + 1;\
							}\
							return arr.length;';
									
						VK.api('execute', {
							code : code
						}, {
							uid : details.uid,
							task_id : task_id
						}, function(response) {
					
							task.update(task_id, {
								nowCountAdd : arr.length
							});
							
							// если больше нечего удалять
							if (!list.length) {
								task.update(task_id, {
									addSuccess : {
										text : 'Все записи удалены'
									}
								});
								task_callback();
								return;
							}
									
							// если пользователь отклонил
							//if (!tabRequest.get(id_tabRequest)) {
							//	return false;
							//}
						
							setTimeout(go, 1000);
								
						});
					
					}
							
				});
				
			},
			
			'vkhelper_plugins_clearAccountFunc_dialogsDelete' : function (details, tab_id, callback) {
				
				task.add('last', {
					initiator : 'clearAccountFunc.bg.msg.vkhelper_plugins_clearAccountFunc_dialogsDelete',
					isVisible : true,
					title : '<b>Удаление сообщений</b> на странице <a href="https://vk.com/id'+ details.uid +'" target="_blank">id'+details.uid +'</a>',
					maxCount  : 1,
					onFinished : function (task_id, details) {
					
						messages.sendToVk({
							type : 'control_fastMessage_view',
							details : {
								status : 'success',
								text : 'Удалено диалогов: '+ details.maxCount
							}
						});
							
					}
				}, function(task_id, task_callback) {
				
					var now_count = 0,
						list = [];
				
					var code = '\
						var res = [];\
						var i = 0;\
						while (i < 25) {\
							var a = API.messages.getDialogs({"count":200,"offset":i*200,"unread":"'+ (details.unread == 1 ? 1 : 0) +'"});\
							if (a.items.length > 0) {\
								res.push(a.items);\
								i = i + 1;\
							} else {\
								i = 25;\
							}\
						}\
						return res;';
					
					VK.api('execute', {
						code : code
					}, {
						uid : details.uid,
						task_id : task_id
					}, function(response) {
							
						for (var a in response.details) { 
							list = list.concat(response.details[a]);
						}
						
						task.update(task_id, {
							maxCount : list.length
						});
						
						if (!list.length) {
							task.update(task_id, {
								addSuccess : {
									text : 'Нет диалогов для удалений'
								}
							});
							task_callback();
							return;
						}
											
						go();
						
					});
					
					function go() {
						
						var arr = [];
					
						for (var i = 0, len = list.length; i < 25; i++) {
						
							if (!list.length) {
								break;
							}
						
							var t = list.shift();
							
							arr.push('{"chat_id":"'+ (t.message.chat_id || 0) +'","user_id":"'+ (t.message.user_id || 0) +'"}');
						}
						
						
						var code = '\
							var arr = ['+ arr.join(',') +'];\
							var e = arr.length;\
							var i = 0;\
							while (i < e) {\
								if (arr[i].chat_id) {\
									API.messages.deleteDialog({\
										peer_id : 2000000000 + arr[i].chat_id\
									});\
								} else {\
									API.messages.deleteDialog({\
										user_id : arr[i].user_id\
									});\
								}\
								i = i + 1;\
							}\
							return arr.length;';
									
						VK.api('execute', {
							code : code
						}, {
							uid : details.uid,
							task_id : task_id
						}, function(response) {
					
							task.update(task_id, {
								nowCountAdd : arr.length
							});
							
							// если больше нечего удалять
							if (!list.length) {
								task.update(task_id, {
									addSuccess : {
										text : 'Все диалоги удалены'
									}
								});
								task_callback();
								return;
							}
									
							// если пользователь отклонил
							//if (!tabRequest.get(id_tabRequest)) {
							//	return false;
							//}
						
							setTimeout(go, 1000);
								
						});
					
					}
							
				});

			}
			
		}
			
	}
	
};

vkhelper_plugins_list['middleName'] = {
	
	lang : {
		ru : {
			cat : 'Другое',
			title : 'Редактирование отчества',
			aboutLink : 'http://vk-helper.pro/?p=page/instruction&type=33',
			description : 'На странице редактирования основной информации(https://vk.com/edit) Вы сможете указать свое отчество.<br><b>Важно!</b> Ваше отчество видят ВСЕ пользователи, которые заходят через полную версию сайта(vk.com). Через мобильные приложения отчество НЕ ВИДНО!<br><br><img src="https://vk-helper.pro/image/faq/middlename.png" width="500" height="267">',
			
			labelMiddleName : 'Отчество'
		},
		en : {
			cat : 'Other',
			title : 'Editing middle name',
			aboutLink : 'http://vk-helper.pro/?p=page/instruction&type=33',
			labelMiddleName : 'Middle name'
		}
	},
	
	storage : {	
		enabled : false
	},
	
	vk_script : {
		
		on : function () {
		
			vkhelper.mutationObserver.add('middleName', function() {
					
				if (jQuery('#pedit_middle_name').length == 0) {
					jQuery('#pedit_general:not(#pedit_middle_name):has(#pedit_first_name) div.pedit_row:eq(1):not([vkhelper_middleName])')
						.attr('vkhelper_middleName', '1')
						.after('<div id="vkhelper_middleName_block" class="pedit_row clear_fix"><div class="pedit_label">'+ vkhelper.lang.get('middleName', 'labelMiddleName') +':</div><div class="pedit_labeled"><input type="text" value="" id="pedit_middle_name" class="dark" autocomplete="off"></div><div class="fl_l" id="pedit_name_tt_place"></div></div>');
				}	
					
			}); 
		},
		
		off : function () {
		
			vkhelper.mutationObserver.remove('middleName');
			
		}
		
	}
	
};

vkhelper_plugins_list['wallBlockInfo'] = {
	
	lang : {
		ru : {
			cat : 'Другое',
			title : 'Информер количества записей сообщества',
			aboutLink : 'http://vk-helper.pro/?p=page/instruction&type=31',
			description : 'В каждом сообществе справа добавляется информер, в котором отображается информация по записям за текущий день, а именно: сколько опубликованных записей, сколько отложенных записей, сколько доступно записей для размещения<br><br><img src="https://vk-helper.pro/image/faq/group_msg_stat.png" width="284" height="207">',
			
			labelDay : 'Записи за день',
			label_1 : 'Опубликовано',
			label_2 : 'Отложено',
			label_3 : 'Осталось',
		},
		en : {
			cat : 'Other',
			title : 'Informer of the number of community entries',
			aboutLink : 'http://vk-helper.pro/?p=page/instruction&type=31',
			
			labelDay : 'Daily Entries',
			label_1 : 'Published',
			label_2 : 'Snoozed',
			label_3 : 'Remained',
		}
	},
	
	storage : {	
		enabled : false
	},
	
	css : "\
		#vkhelper_wallBlockInfo_block {\
			display: none;\
		}\
		html.vkhelper_plugin_wallBlockInfo #vkhelper_wallBlockInfo_block {\
			display: block;\
			padding: 10px;\
		}\
		html.vkhelper_plugin_wallBlockInfo #vkhelper_wallBlockInfo_block span {\
			margin: 5px 3px;\
			font-size: 15px;\
			cursor: default;\
			color: #5b6e85;\
		}",
	
	vk_script : {
		
		on : function () {
		
			vkhelper.mutationObserver.add('wallBlockInfo', function() {
					
				jQuery('#public #narrow_column:not([vkhelper_wallBlockInfo]), #group #narrow_column:not([vkhelper_wallBlockInfo])').each(function () {
		
					var $this = jQuery(this),
						block = $this.find('div[class="page_block"]:first');
						
					if (block.length) {
					
						$this
							.attr('vkhelper_wallBlockInfo', '1');

						block
							.before('\
								<div id=\"vkhelper_wallBlockInfo_block\" class=\"page_block clear_fix\">\
									<span>'+ vkhelper.lang.get('wallBlockInfo', 'labelDay') +':</span> \
									<span class=\"vkhelper_w_1\" data-title=\"'+ vkhelper.lang.get('wallBlockInfo', 'label_1') +'\" onmouseover=\"showTitle(this);\">--</span> \
									<span class=\"vkhelper_w_2\" data-title=\"'+ vkhelper.lang.get('wallBlockInfo', 'label_2') +'\" onmouseover=\"showTitle(this);\">--</span> \
									<span class=\"vkhelper_w_3\" data-title=\"'+ vkhelper.lang.get('wallBlockInfo', 'label_3') +'\" onmouseover=\"showTitle(this);\">--</span>\
								</div>');
						
						setTimeout(function() {
						
							if (!cur.oid) {
								return;
							}
							
							vkhelper.messages.sendToBG({ 
								type : 'vkhelper_plugins_wallBlockInfo_getCounts', 
								details : {
									uid : vk.id, 
									oid : cur.oid
								}
							});
						}, 500);
						
					}	
					
				});	
					
			}); 
		},
		
		off : function () {
		
			vkhelper.mutationObserver.remove('wallBlockInfo');
			
		},
		
		messages : {
		
			'vkhelper_plugins_wallBlockInfo_success' : function (details) {
				
				var usedCount = 0;
				var postponedCount = 0;
			
        	    var now = new Date();
        	    var zoneMSK = (180 + now.getTimezoneOffset()) * 60 * 1000;
            
            
        	    var date = new Date((now.getTime() + zoneMSK) - (86400000));
        	    	date.setHours(23);
        	    	date.setMinutes(59);
        	    	date.setSeconds(59);
        	    var count = 0;
        	    for (var i = 0; i < details.counts.used.length; i++) {
        	        if (new Date(details.counts.used[i] * 1000 + zoneMSK) > date)
        	            usedCount++;
        	    }
        
            	var date = new Date((now.getTime() + zoneMSK) + (86400000));
           			date.setHours(0);
            		date.setMinutes(0);
            		date.setSeconds(0);
            		date.setMilliseconds(0);
            	for (var i = 0; i < details.counts.postponed.length; i++) {
            	    if (new Date(details.counts.postponed[i] * 1000 + zoneMSK) < date) {
            	        postponedCount++;
            	    }
            	}
        
				jQuery('#vkhelper_wallBlockInfo_block .vkhelper_w_1').text(usedCount);
				jQuery('#vkhelper_wallBlockInfo_block .vkhelper_w_2').text(postponedCount);
				jQuery('#vkhelper_wallBlockInfo_block .vkhelper_w_3').text(50 - usedCount - postponedCount);
				
			}
			
		}
		
	},
	
	bg_script : {
		
		messages : {
		
			'vkhelper_plugins_wallBlockInfo_getCounts' : function (details, tab_id, callback) {
			
				task.add('first', {
					initiator : 'wallBlockInfo.bg.msg.vkhelper_plugins_wallBlockInfo_getCounts',
					isVisible : false
				}, function(task_id, task_callback) {
				
					var code = '\
						var isAdmin = false;\
						var postponed = [];\
						var used = [];\
						if (API.groups.getById({"group_id" : '+ -details.oid +'})[0].admin_level >= 2) {\
							isAdmin = true;\
							postponed = API.wall.get({"owner_id" : '+ details.oid +', "count" : 50, "filter" : "postponed"}).items@.date;\
						}\
						used = API.wall.get({"owner_id" : '+ details.oid +', "count" : 50, "filter" : "all"}).items@.date;\
						return [isAdmin, [postponed, used]];';
					
					VK.api('execute', {
						code : code
					}, {
						uid : details.uid,
						task_id : task_id
					}, function(response) {
						
						if (response.status && response.status == 'fail') {
							task_callback();
							return;
						}
						
						messages.sendToVk({
							type : 'vkhelper_plugins_wallBlockInfo_success', 
							details : {
								isAdmin : response.details[0],
								counts  : {
									postponed : response.details[1][0],
									used      : response.details[1][1]
								}
							}
						}, tab_id);
						
						task_callback();
						
					});
							
				});	
				
			}
			
		}
			
	}
	
};

vkhelper_plugins_list['historyCreate'] = {
	
	lang : {
		ru : {
			cat : 'Другое',
			title : 'Создание истории',
			aboutLink : 'http://vk-helper.pro/?p=page/instruction&type=35',
			description : 'На странице Новости, в блоке "Истории", отображается кнопка для публикации своей истории<br><br><img src="https://vk-helper.pro/image/faq/historyCreate_1.png" width="500" height="180">',
			
			label_history : 'История',
			label_historics : 'Истории',
			
			tabRequest_title : 'Загрузка истории',
			tabRequest_success : 'История успешно загружена!',
			tabRequest_error : 'Возникла ошибка при загрузке истории!',
			
			messageBox_title : 'Создание истории',
			messageBox_content_1 : 'Выберите файл для создания истории.<br>Ниже описаны поддерживаемые форматы файлов.',
			messageBox_content_photo : 'Фото',
			messageBox_content_success : '<b>Загрузка завершена!</b><br>История будет отображена на Вашей странице.',
			messageBox_content_error : 'Загрузка не удалась!',
			messageBox_content_loading : 'Загрузка...',
			messageBox_content_change_file : 'Выбрать файл'			
		},
		en : {
			cat : 'Other',
			title : 'Creating a story',
			aboutLink : 'http://vk-helper.pro/?p=page/instruction&type=35',
			
			label_history : 'History',
			label_historics : 'Stories',
			
			tabRequest_title : 'Download History',
			tabRequest_success : 'History has been successfully downloaded!',
			tabRequest_error : 'An error occurred while loading the history!',
			
			messageBox_title : 'Creating History',
			messageBox_content_1 : 'Select the file to create the history. <br> Supported file formats are described below.',
			messageBox_content_photo : 'Photo',
			messageBox_content_success : '<b>Download complete!</b><br>The story will be displayed on your page.',
			messageBox_content_error : 'Download failed!',
			messageBox_content_loading : 'Loading...',
			messageBox_content_change_file : 'Select file'			
		}
	},
	
	storage : {	
		enabled : false
	},
	
	css : function () {
		/*
		html .vkhelper_historyCreate_link {
			display: none;
		}
		html.vkhelper_plugin_historyCreate .vkhelper_historyCreate_link {
			display: inline-block;
		}
		html #stories_feed_wrap.vkhelper_historycreate_block {
			display: none;
		}
		html.vkhelper_plugin_historyCreate #stories_feed_wrap.vkhelper_historycreate_block {
			display: block;
		}
		html.vkhelper_plugin_historyCreate .vkhelper_historyCreate_link_img {
			background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAANuUlEQVR42sVaiVdU5xWfvy+VWVg0izmxpmlaz2kWT209jWFmABVNqkZTY2JiW5NGkzaIzMx7M4OACwJJcAEElUXBBYcBZZ/tLb/ee783gFHiG00rnst74/De+353+d3lex4A9tOIXTy3Ldu2DdskyRqGPZaesTuv3rUbO4bsoy1X7S/0Pvsfeq99vG3Ajnx/3f7h5rh988GsvWgadh7qOv552nUUxeOclPzDF1m2hYJt4s7cAho6ruK9z9qwYbeOl3fGsHY7SW0MleEIymujJBoq6+i7HTo21Mex+aMEjiZ7MJS6j7xlkmYMPMvPI0BkgfTb4t8WHS0LeVowaY4WnqdzA4aVw+RcFvEfhlF39DzW74zDH9IRCJKE467EF4qjPBRDVV0UWw6fxTet1zA6NYu8acK0CiQGCa2BFGWDgapVmci7A7ICBgnI+DZp3aLF043pIQs5A229Y3h9TwRl4SjKahJ0TMIb1glMrCQgDN4b5uvjqAhG8CpZ8dipa0gvZJCzM7BMg1aRFQVadoHO+bNdKhDlOpaZJ83kkaNjz60pbDvSgsrQSfirk/DJ4nXSrJJAyL1Fysl6FUF1nY8UIBat1ugeMfxhfwLN3TeRISCWSQAM9gy2iyk2cQmEMJMV6Dq6uCBuNJ8rINY9irV1/ECNtBiFN0R+L+5BYMKs2bho1i0Qr3NNURn+UFKu94dJSaEEqqqbcCR5GamFBRgMhjyi6FzuLcJ+SWA4LmYKJj5pOIcqClwfPayCNOalB/mDJDUMgh+eUKCC8RIsotH9mh2LRiVeAiFWRgJrxPXYwhqqKX6mMuxaObEKA3oiEPY/i4OZgOTJGlNzGXx4vAPrmHlK0PYvKgTwT4dOC7sZ1iJJ0cF42aYo3noEiK3+hGNi0chi77ddEpRl4Zij+f8/EG+Y4oastOVgGyYyOVpbbil9LP+2loFIXBBagyyxmM/hs6Yf4a9VGhHfrXk+QHwSPwmKJQ1bD7cS7WfEayxSdpFd+eixBIItPM28zckpeWkMFRSEPvZl9l/yZ/9zci2OoYpgVLwiUKPhc60P85QGJGaIki2xhAOEvY7jokBAhsanic//IxoQAMz1pJHnFSPMamVhTrZJ8o4mAZP4cQAFzjFLTGbAo7iJgVjI5E1Uf90ui14pj9XUCgnwg8KKhgPi08vil+PjF+hbuoYVlXAN7vf7dUzOZyVJW1J1WAyECzdLAvzCzUmsc52ddUdWgtKFih+W+GOlophEw/pD93JH3THKMX2qdEIObAgPV54cPPO5HN76mLTiOhcUrfAwkPKfSujx4gsnJAb9TwHES0z6Ut1J3EjPUtBzrNgMhIxDTHX2ypgEto+kdCB8HpOkJourSSyJWvDjRHeAxJes5zpugpoky6+aeyUkCAAHe95mttrTcEGCianOLRD/CiAVpIDK4EmsDTWgKtggRxE+DzY+Rpro7yMOeF1KFveUTLFHwb/5kzbMGqbQsYfDfCabx+/2JAWEP+wyRqTYUzXSuweb8cPIHYyMpzA8PonB1CRGSG7cm6D/I7mXpnMS/r9UGjdTE8SOKfSP30OY2gBf6JQqe4qWfFKMyHOjVDadRN+tWaFhDwWK3T2cJn+OOWW17hqIt0bVX9+1D1D+4T6FmISTFThZ5R1G4RyVV6U4DCeB2ZLQuC24MJLCuvd0sk6j68BXKSEubcOR2CVJGx6qqexDTRedRicqZnZtkXBMCr945xVamEFg8k7WtcV3pYdwegnTqRoYgICQHsfCCAVsJRFMGSnEPRBVhfvpurf3RaicIteazubtLeQaHDwMxG1P4XcaIz8B0Tv7pQHLkaYLVHJzQ5Q1Chi8N432K7dxpm8M14jaMwWiSjMnydd22ttbk7MUX02k4aSwnBv28jvEwi722s5GTMzOwzOSXrA31uuqPA8nXJcifgm6pGhG7xoQp2H3Mcm9MrTIoy09eKX+BC2OFdSIqpoo6o+dxzx9ZxUyYkEGPzY5J/7OigkIcyVcKDEhimcvWrcjhpsT0/BcHJm0X96ZdLJwooSaarkX0TuvSWnN/X2BWOTr1h7x+X0netB1dQyXh8fw1Zk+vFino+7LdrIMu5sp/M9AuDB1TTLOs5XSY6isTaB3dAKermt37Jd2JJ4JSLxLAeGqbXIxiw27mhA61iE9jc0EIC1rHl+eGRD/7hlNi0WWgAR10W7pQDRxx0sj9+A51zf6zECKFuHEdHU0hSrSVFPnsLCSSYFfsDLCLL30wKrqKFoo+UoZTsA5RgJUcviD2lMB8VfH0D14B57z/bd+MSDsLgO3J6h8iKOx/TqByAgQU7rOPLoGx+nBGs7031alKv39aHpGuVYJExihfo5PLkjJkt2Dd+HpHp545hgpuhYDmaOm7I0PG/DOwbMUC2qxplOhftzYg6q6GCXN+8jS5yy51tDkPNZQ4P4qrJUIpFmIpoKef+kGudbVu9P2+vqEIPOGqUQJNru8oSZMs4YA6Z0DqlujfGFQLLST67y6vRFvHzqHE+eH0PTDNdQe6yKXayI2u4J7U7N4d38Cb350Bm/sVWOgNbUxYSK1Dk0q3LJVqNgvybtZch4He/+tNDwTCzn7Nx8w/WrSTAVCbulX5RBug+OdV50sTtonIBkK8lYCs2FnA9FjEpXC9634trkPRsGiqnUaFVS9tg3ex9n+FPzbmkWBZUTRTNc+0XpS5l0/B4TX8Aox4SjFmWehYNjvHW5xShRn9OkaSFLAx8kiHMw84bBNzuDS5WA+n8d10lbv2G1MzefQMXQL+vdjON7WjxepwEzdX8Ct9H28UKOs4atJiNv4w6r0EQutUqIEnD5+4/aTdO8sFY3Uj3x16jKZMuIsTnMJRJO/5cIxShbJSl4woWbstppSymdb4oMZbde3XVhfG8VbB9qwiVwrNTuD8ak5bDpwBpv2teH1D5LwVnOcRlWsrlKJqzlzQkqkrdRDZQ2nseobf4BKManu2iIqRrifPoVjp6+QOzlTGF60rQbQZvHcVv11/TcXsPVgA6apiZvJ5pAzMpJj5ujzHOWfyKVRYSO2hGoRtCcAieJY2w26f0EBmc9bePtj0kaIXCykuW+sxMRxbNyl4fi5AWgdPYh1XIHWydIvx1hnn3Psx+aDbXjzrw2Inr9Mn3swl8liejGDaEc/Ip292HOikwI/Li5bHo6s2hupsa1G8RHB8FRGFOXh0o2r1sPaJWEgP93ALQX6Q6rL84aZ0yleqp2Oz/nOXxwy1HCBl0B5jS4daPn7rSRNuPNgGrfTU1i7TRMNB4JRrKmJ0N/rMoL1r8JaQgJU+f7l7+3IWcriHnXI4yL1BRUlbA0IMTixoua2qv38ac+uGrC4ysQ8fa9WZXjg/SjGph9gbGpKFYxBla29MtXUBbh3lfrLy8+iWGroHJTJI7uxdIhMmxmq6auPnBX+ds1aYTV45pmTT+Il9ugUhS1RrVyBp/jK/6PUf+jY+mkr/kzu9kJtMyXFmLiTmvAn5P6r9Ubcs/96VwTjM4so2GrLwcMNHDc9PIC4PjlDfue+1Q045vctzbD0R0c/Mjtejie/lP5xZR3q2yukmTtJGj7llOdFt9RXzWkcx9qFYSIKVTVYavgg25n0u4BFAnSgsVNGlJXvU/DXaPLgx/J5qOheTjMUijsPfnhW5f85KW4OrYgp/4qhhlKUpr4P8nTmJFk3iS2U9+aI9fJC8UZx+GDLppbt7Nvdncvjd3uVm1RwVepoOvDcRqaaWgdblhup2gh+HE6RFbKq07RVg+ZhWxiyL2I6O1QFdN9ISQVbVhy9hOLPDwhbgwLbS0xWRes40TUsVYTKT8WjrbYV1A4DpFaSnVvqrZs6rmPd9oTy6ZJ6hV8YSFARBSfsAw3tWMjl1f6ms81jO3MZD2S3UI1pTGcb2jCpZTVtHKeWtbw6VsL08X9hETWm2n2sHbMFNY2RpcvYidYpYIyiRZx/UiMpQAZFzhwVff9qvUJM1qRa0VDcqcWWA9nn9CSBpUl8qYtdDv6A1Fiq9GFW4/NKArL7my5MzGckhvkFBdmbsosTMhQt8uiurlgG6gWBRbJOpHNIyuUypwZSSS4hFXOFM5bxSWCWoOmaZYrmrYsK0X6z5BEOah89by251cHGCzKs4BouJ3OBnPvtaau4peVsceWNvEwEN+1V+x2S3Go05yUBTbYISgWyPFKKLw2z2YU5aZbR/V+t+w7JizexSF5RYEaV3amCdKKugSxvMSoCYL8skGXSsxl82thN3V9CLMKJTs1/4yVvDVQUXXVpMq/qp7X03Y6jXRhKPUDOVACYldhDlOubpb2LogjAXCIAy3k3JEelzI30HOr/2YK1oX+TKzTBGywC0kvYG4w7Q3OKLyKUKrLG5r81o3t4SjZjDVu1BAZUrpB9fzkvAchSCNlqk1RtlCogxcF01rBw+cYkPtd68c6hs+otIJkY6iuE57Ox5QAuZv+Qs59CFcSmfa3Y39CN0/13MZMvOC/tmE6OKL4RYzmUpF6ucelaq7zWZCtgy58dDqcHLxItXhufw/HTg9j2RQt+u/sEXtsRwfodzXhpewvlIzpS776+PoKNu7/DHw/r+CLai+7RB5jK5cTatmGK9s2ne+sKz/C+lvOSi3R/BVkEa5PbzllKWqm5Bdy+P4PRyQcYTU/i9tQMUtMLVCMVkC1wX59XWxCWapFNJy9Yq2j8ST//BVGSbksy263IAAAAAElFTkSuQmCC') center center no-repeat;
		}
		*/
	},
	
	vk_script : {
		
		on : function () {
		
			vkhelper.mutationObserver.add('historyCreate', function() {
					
				// если есть блок с историями друзей
				jQuery('#stories_feed_wrap:not([vkhelper_historyCreate])')
					.attr('vkhelper_historyCreate', '1')
					.find('#stories_feed_items')
					.prepend('<a href="#" class="stories_feed_item story_feed_new_item vkhelper_historyCreate_link" onclick=""><div class="stories_feed_item_ava"><div class="stories_feed_item_ava_img vkhelper_historyCreate_link_img"></div></div><div class="stories_feed_item_name">'+ vkhelper.lang.get('historyCreate', 'label_history') +'</div></a>')
					.find('a.vkhelper_historyCreate_link:first')
					.click(function(event) {

						vkhelper.plugins.historyCreate.vk_script.functions.openBox();
						
						event.stopPropagation();
				
						return false;
						
					});
					
				// если нет блока с историями друзей, то создаем такой блок и в нем отображаем иконку для создания истории
				jQuery('#main_feed:not(:has(#stories_feed_wrap)):not([vkhelper_historyCreate])')
					.attr('vkhelper_historyCreate', '1')
					.find('.wall_wrap')
					.before('<div class="page_block stories_feed_wrap clear_fix vkhelper_historycreate_block" id="stories_feed_wrap" vkhelper_historycreate="1">'+
  								'<div class="stories_feed_cont">'+
    								'<div class="stories_feed_title clear_fix">'+ vkhelper.lang.get('historyCreate', 'label_historics') +'</div>'+
    									'<div class="stories_feed_items_wrap">'+
     										'<div class="stories_feed_items" id="stories_feed_items_container">'+
        										'<div id="stories_feed_items"><a href="#" class="stories_feed_item story_feed_new_item vkhelper_historyCreate_link" onclick=""><div class="stories_feed_item_ava"><div class="stories_feed_item_ava_img vkhelper_historyCreate_link_img"></div></div><div class="stories_feed_item_name">'+ vkhelper.lang.get('historyCreate', 'label_history') +'</div></a>'+    
        									'</div>'+
      									'</div>'+
    								'</div>'+
  								'</div>'+
							'</div>')
					.prev()
					.find('a.stories_feed_item')
					.click(function(event) {
					
						vkhelper.plugins.historyCreate.vk_script.functions.openBox();
					
						event.stopPropagation();
				
						return false;
						
					});
						
			}); 
			
		},
		
		off : function () {
		
			vkhelper.mutationObserver.remove('historyCreate');
			
		},
		
		functions : {
			 
			openBox : function () {
				
				var a = new MessageBox({title : vkhelper.lang.get('historyCreate', 'messageBox_title'), hideButtons : true, width : 550})
   					.content(
   							'<center>'+
   							vkhelper.lang.get('historyCreate', 'messageBox_content_1') + '<br><br><b>'+ vkhelper.lang.get('historyCreate', 'messageBox_content_photo') +':</b><br> JPG, JPEG, GIF или PNG.<br><br><b>Видео:</b><br> AVI, MP4, 3GP, MPEG, MOV, FLV, F4V, WMV, MKV, WEBM, VOB, RM, RMVB, M4V, MPG, OGV, TS, M2TS, MTS.<br><br>'+					
      						'<div id="vkhelper_plugins_historyCreate_Box_success" class="msg ok_msg" style="display: none;"><div class="msg_text">'+ vkhelper.lang.get('historyCreate', 'messageBox_content_success') +'</div></div>'+
   							'<div id="vkhelper_plugins_historyCreate_Box_error" class="msg error" style="display: none;"><div class="msg_text"><b>'+ vkhelper.lang.get('historyCreate', 'messageBox_content_error') +'</b><br><span></span></div></div>'+
   							'<div id="vkhelper_plugins_historyCreate_Box_loading" style="display: none;">'+ vkhelper.lang.get('historyCreate', 'messageBox_content_loading') +'</div>'+
   							'<button id="vkhelper_plugins_historyCreate_Box_button" class="flat_button upload_btn " onclick="this.nextSibling.click()">'+ vkhelper.lang.get('historyCreate', 'messageBox_content_change_file') +'</button>'+
      						'<input class="file" type="file" accept="image/*,video/*" size="28" id="vkhelper_plugins_historyCreate_inputFile" style="visibility: hidden; position: absolute;">'+      					
      						'</center>')
    				.show();
    
    			jQuery('#vkhelper_plugins_historyCreate_inputFile')
    				.change(function() {
    				
						var type = this.files[0].type.split('/');
					
						jQuery('#vkhelper_plugins_historyCreate_Box_button').hide();
						jQuery('#vkhelper_plugins_historyCreate_Box_error').hide();
						jQuery('#vkhelper_plugins_historyCreate_Box_loading').show();
							
							
    					var file = jQuery('#vkhelper_plugins_historyCreate_inputFile').prop('files')[0];

						if (file) {
    						var reader = new FileReader();
    						reader.readAsDataURL(file);
    						reader.onload = function(e) {
      						  
      					 		vkhelper.messages.sendToBG({ 
									type : 'vkhelper_plugins_historyCreate_upload', 
									details : {
										uid  : vk.id,
										type : type[0],
										exp  : type[1],
										file : e.target.result
									}
								});
						
   							};
						}

						a.hide();
						
    				});
    				
			}
		
		}
		
	},
	
	bg_script : {
		
		messages : {
		
			'vkhelper_plugins_historyCreate_upload' : function (details, tab_id, callback) {

				function b64toBlob(b64Data, contentType, sliceSize) {
 				       contentType = contentType || '';
 				       sliceSize = sliceSize || 512;

 				       var byteCharacters = atob(b64Data);
 				       var byteArrays = [];

 				       for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
 				           var slice = byteCharacters.slice(offset, offset + sliceSize);

 				           var byteNumbers = new Array(slice.length);
 				           for (var i = 0; i < slice.length; i++) {
 				               byteNumbers[i] = slice.charCodeAt(i);
 				           }

 				           var byteArray = new Uint8Array(byteNumbers);

 				           byteArrays.push(byteArray);
 				       }

 				     var blob = new Blob(byteArrays, {type: contentType});
 				     return blob;
				}

				task.add('last', {
					initiator : 'historyCreate.bg.msg.vkhelper_plugins_historyCreate_upload',
					isVisible : true,
					title : '<b>Загрузка истории</b> на страницу <a href="https://vk.com/id'+ details.uid +'" target="_blank">id'+ details.uid +'</a>',
					maxCount  : 1,
					onFinished : function (task_id, details) {
					
						if (details.log_errors) {
						
							messages.sendToVk({
								type : 'control_fastMessage_view',
								details : {
									status : 'error',
									text : 'Не удалось загрузить историю'
								}
							});
						
						} 
						else {
						
							messages.sendToVk({
								type : 'control_fastMessage_view',
								details : {
									status : 'success',
									text : 'История загружена'
								}
							});
						
						}
							
					}
				}, function(task_id, task_callback) {
			
					var method = details.type == 'image' 
								? 'stories.getPhotoUploadServer' 
								: 'stories.getVideoUploadServer';
				
					VK.api(method, {
						add_to_news : 1
					}, {
						uid : details.uid,
						task_id : task_id
					}, function(response) {
								
						if (response.status != 'success') {
								
							task.update(task_id, {
								nowCountAdd : 'max',
								addErrors : {
									uid : details.uid,
									error : 'unkniwn_error',
									data : response.details
								}
							});
							task_callback();
							return false;
						}
										
						// Split the base64 string in data and contentType
						var block = details.file.split(";");
						// Get the content type of the image
						var contentType = block[0].split(":")[1];// In this case "image/gif"
						// get the real base64 content of the file
						var realData = block[1].split(",")[1];// In this case "R0lGODlhPQBEAPeoAJosM...."
						// Convert it to a blob to upload
						var blob = b64toBlob(realData, contentType);
						
						var fd = new FormData;
						fd.append('file', blob, '1.'+ details.exp);
						
						var xhr = jQuery.ajax({
    						url: response.details.upload_url,
    						data: fd,
    						processData: false,
    						contentType: false,
    						type: 'POST',
    						success: function (data) {
    								
    							if (!data || !data.response || !data.response.story.owner_id || !data.response.story.owner_id) {
    							
    								// Ошибка при загрузке истории
    								task.update(task_id, {
    									nowCountAdd : 'max',
    									addErrors : {
											uid : details.uid,
											error : 'unkniwn_error',
											data : data,
											text : 'Ошибка при загрузке истории'
										}
									});
								
    								task_callback();
									return;
    							}
    							
    							// История загружена
    							task.update(task_id, {
    								nowCountAdd : 'max',
									addSuccess : {
										story_upload : true,
										id : data.response.story.id,
										owner_id : data.response.story.owner_id
									}
								});
    							task_callback();
								return;
    						},
    						error: function (data) {
								
    							// История НЕ загружена
    							task.update(task_id, {
    								nowCountAdd : 'max',
    								addErrors : {
										uid : details.uid,
										error : 'unkniwn_error',
										data : data
									}
								});
								
    							task_callback();
								return;
    						},
    						xhr: function() {
								var xhr = new window.XMLHttpRequest();
								// прогресс загрузки на сервер
								xhr.upload.addEventListener("progress", function(evt){
								
									if (evt.lengthComputable) {
										
										// если отменили публикуцию
										if (!tabRequest.get(id_tabRequest)) {
											xhr.abort();
											return false;
										}
										
    									task.update(task_id, {
    										nowCount : evt.loaded,
    										maxCount : evt.total
										});
										
									}
								}, false);
		
								return xhr;
							}
  						});
  						
					});
					
				});
				
			}
			
		}
			
	}
	
};

vkhelper_plugins_list['banList'] = {
	
	lang : {
		ru : {
			cat : 'Другое',
			title : 'Импорт/Экспорт ЧС',
			aboutLink : 'http://vk-helper.pro/?p=page/instruction&type=32',
			description : 'На странице управления черным списком(личной страницы или сообщества) появляется две кнопки: импорт и экспорт. Это позволит переносить черный список с одного аккаунта(сообщества) в другой.<br><br><img src="https://pp.vk.me/c637418/v637418552/2f1ca/n3YA83A5y-4.jpg" width="500" height="75">',
			
			btnExport : 'Экс.',
			btnImport : 'Имп.',
			messageBoxExport_title : 'Экспорт черного списка',
			messageBoxExport_content : 'Экспортировать данные списком?',
			messageBoxExport_btnStart : 'Начать экспорт',
			messageBoxExport_btnCancle : 'Отмена',
					
			messageBoxImport_title : 'Импорт черного списка',
			messageBoxImport_btnStart : 'Начать импорт',
			messageBoxImport_btnCancle : 'Отмена',
			messageBoxImport_content_t1 : 'Список пользователей для импорта',
			messageBoxImport_content_t2 : 'Можно указывать ссылку на пользователя, id пользователя, и короткий адрес пользователя. В одной строке разрешено указывать только одного пользователя.',
			messageBoxImport_errorFormat : 'Не верный формат импортируемых данных',
			messageBoxImport_errorEmptyList : 'Укажите список для импорта',
		
			tabRequest_import_title : 'Импорт черного списка',
			tabRequest_import_ended_success : 'Добавлено пользователей',
			tabRequest_import_ended_error : 'Не удалось добавить пользователей',
			tabRequest_import_ended_title : 'Успешно завершено!',
		
			tabRequest_export_title : 'Экспорт черного списка',
			tabRequest_export_ended_title : 'Экспорт завершен. <a href="#" onclick="vkhelper_tabRequestResult(this); return false;">Просмотреть результаты</a>',
			tabRequest_export_ended_result : 'Результат экспорта'	
		},
		en : {
			cat : 'Other',
			title : 'Import/Export blacklist',
			aboutLink : 'http://vk-helper.pro/?p=page/instruction&type=32',
			
			btnExport : 'Exp.',
			btnImport : 'Imp.',
			messageBoxExport_title : 'Exporting the black list',
			messageBoxExport_content : 'Export data by list?',
			messageBoxExport_btnStart : 'Start Export',
			messageBoxExport_btnCancle : 'Cancel',
					
			messageBoxImport_title : 'Import Black List',
			messageBoxImport_btnStart : 'Start import',
			messageBoxImport_btnCancle : 'Cancel',
			messageBoxImport_content_t1 : 'List of users to import',
			messageBoxImport_content_t2 : 'You can specify a link to the user, the user id, and the user\'s short address. Only one user is allowed per line.',
			messageBoxImport_errorFormat : 'Not a valid import data format',
			messageBoxImport_errorEmptyList : 'Specify the list to import',
		
			tabRequest_import_title : 'Import Black List',
			tabRequest_import_ended_success : 'Added users',
			tabRequest_import_ended_error : 'Failed to add users',
			tabRequest_import_ended_title : 'Successfully completed!',
		
			tabRequest_export_title : 'Exporting the black list',
			tabRequest_export_ended_title : 'The export is complete. <a href="#" onclick="vkhelper_tabRequestResult(this); return false;">View results</a>',
			tabRequest_export_ended_result : 'Export result'	
		}
	},
	
	storage : {	
		enabled : false
	},
	
	css : function () {
		/*
		#vkhelper_banList_export, 
		#vkhelper_banList_import {
			display: none;
		}
		html.vkhelper_plugin_banList #vkhelper_banList_export, 
		html.vkhelper_plugin_banList #vkhelper_banList_import {
			display: block;
		}
		*/
	},
	
	vk_script : {
		
		on : function () {
		
			vkhelper.mutationObserver.add('banList', function() {
					
				jQuery('#wide_column:has(button.flat_button[onclick*=\"Blacklist()\"]):not([vkhelper_banList])').each(function () {
					
					jQuery(this)
						.attr('vkhelper_banList', 1)
						.find('button.flat_button[onclick*=\"Blacklist()\"]')
						.after('\
							<button class=\"flat_button\" id=\"vkhelper_banList_export\">'+ vkhelper.lang.get('banList', 'btnExport') +'</button>\
							<button class=\"flat_button\" id=\"vkhelper_banList_import\">'+ vkhelper.lang.get('banList', 'btnImport') +'</button>')
						.next('#vkhelper_banList_export')
						.click(function() {
							
							var a = new MessageBox({title : vkhelper.lang.get('banList', 'messageBoxExport_title')})
									.content(vkhelper.lang.get('banList', 'messageBoxExport_content'))
									.setButtons(vkhelper.lang.get('banList', 'messageBoxExport_btnStart'), function() {
	
										a.hide();
									
										vkhelper.messages.sendToBG({ 
											type : 'vkhelper_plugins_banList_export', 
											details : {
												uid: vk.id,
												gid: cur.gid || -cur.oid || false
											}
										});
							
									}, vkhelper.lang.get('banList', 'messageBoxExport_btnCancle'))
									.show();
						
						})
						.next('#vkhelper_banList_import')
						.click(function() {
						
							var a = new MessageBox({title : vkhelper.lang.get('banList', 'messageBoxImport_title')})
								.content(vkhelper.lang.get('banList', 'messageBoxImport_content_t1') +':<br><textarea style="width: 390px; height: 300px;" id="vkhelper_plugins_banlist_textarea"></textarea><br><br>'+ vkhelper.lang.get('banList', 'messageBoxImport_content_t2'))
								.setButtons(vkhelper.lang.get('banList', 'messageBoxImport_btnStart'), function() {
	
									var list;
	
									try {
							
										list = jQuery('#vkhelper_plugins_banlist_textarea')
												.val().trim().split('\n')
												.map(function(d){ 
													d = d.trim();
													if (/^[0-9]*$/i.test(d)) {
														return Number(d);
													} else if (/^((https?:\/\/)?(www\.)?vk.com\/)?id[0-9]*$/i.test(d)) {
														return Number(d.replace(/^((https?:\/\/)?(www\.)?vk.com\/)?id([0-9]*)$/i, '$4'));
													} else if (/^[A-z]{1}[A-z0-9_]{4,}$/i.test(d)) {
														return d;
													} else if (/^((https?:\/\/)?(www\.)?vk.com\/)?([A-z]{1}[A-z0-9_\.]{4,})$/i.test(d)) {
														return d.replace(/^((https?:\/\/)?(www\.)?vk.com\/)?([A-z]{1}[A-z0-9_\.]{4,})$/i, '$4');
													}
											
													d = JSON.parse(d);
													if (/^[0-9]*$/i.test(d[0])) {
														return d;
													}
			
													return 0;
												})
												.filter(function(uid) {
  													return uid != '';
												});
												
									} catch(e) {
							
										alert(vkhelper.lang.get('banList', 'messageBoxImport_errorFormat'));
										return false;
									}
			
									if (!list.length || list[0] == '') {
										alert(vkhelper.lang.get('banList', 'messageBoxImport_errorEmptyList'));
										return false;
									}
	
									a.hide();
							
									vkhelper.messages.sendToBG({ 
										type : 'vkhelper_plugins_banList_import', 
										details : {
											list: list,
											uid: vk.id,
											gid: cur.gid || -cur.oid || false
										}
									}, '*');
		
						
								}, vkhelper.lang.get('banList', 'messageBoxImport_btnCancle'))
								.show();
								
						});
						
				});
					
			}); 
		},
		
		off : function () {
		
			vkhelper.mutationObserver.remove('banList');
			
		}
		
	},
	
	bg_script : {
		
		messages : {
			
			'vkhelper_plugins_banList_import' : function (details, tab_id, callback) {

				task.add('last', {
					initiator : 'banList.bg.msg.vkhelper_plugins_banList_import',
					isVisible : true,
					title : '<b>Импорт ЧС</b> на страницу <a href="https://vk.com/'+ (details.gid ? 'club'+ details.gid : 'id'+ details.uid) +'" target="_blank">'+ (details.gid ? 'club'+ details.gid : 'id'+ details.uid) +'</a>',
					maxCount  : details.list.length,
					onFinished : function (task_id, details) {
						
						messages.sendToVk({
							type : 'control_fastMessage_view',
							details : {
								status : 'success',
								text : 'Импортировано в ЧС: '+ (details.log_success || []).length +' из '+ details.maxCount
							}
						});
						
					}
				}, function(task_id, task_callback) {
			
					function go() {
						
						if (!details.list.length) {
							task_callback();
							return false;
						}
						
						var item = details.list.shift();
						
						if (details.gid) {
						
							if (Array.isArray(item))  {
			
								var code = '\
									return API.groups.banUser({\
										group_id :  '+ details.gid +',\
										user_id  :  '+ (item[0] || 0) +',\
										end_date :  '+ (item[3] || 0) +',\
										comment  : "'+ (item[1] || 0) +'",\
										comment_visible : '+ (item[2] || 0) +'\
									});';
			
							} 
							else if (Number.isInteger(item)) {
			
								var code = '\
									return API.groups.banUser({\
										group_id : '+ details.gid +',\
										user_id  : '+ item +'\
									});';
				
							}
							else {
			
								var code = '\
									var a = API.utils.resolveScreenName({screen_name : "'+ item +'"});\
									if (a.type != "user") return 0;\
									var id =  API.users.get({user_ids : "'+ item +'"})@.id[0];\
									return API.groups.banUser({\
										group_id : '+ details.gid +',\
										user_id  : id \
									});';
					
							}
				
						} else {
						
							if (Array.isArray(item))  {
			
								var code = '\
									var a = API.users.get({"user_ids":"'+ (item[0] || 0) +'", "fields":"blacklisted_by_me"})[0];\
									if (a.blacklisted_by_me == 0) {\
										return API.account.banUser({\
											user_id  : '+ (item[0] || 0) +'\
										});\
									}';
			
							}
							else if (Number.isInteger(item)) {
			
								var code = '\
									var a = API.users.get({"user_ids":"'+ (item || 0) +'", "fields":"blacklisted_by_me"})[0];\
									if (a.blacklisted_by_me == 0) {\
										return API.account.banUser({\
											user_id  : '+ item +'\
										});\
									}';
				
							} 
							else {
			
								var code = '\
									var a = API.users.get({"user_ids":"'+ (item || 0) +'", "fields":"blacklisted_by_me"})[0];\
									if (a.blacklisted_by_me == 0) {\
										var a = API.utils.resolveScreenName({screen_name : "'+ item +'"});\
										if (a.type != "user") return 0;\
										var id =  API.users.get({user_ids : "'+ item +'"})@.id[0];\
										return API.account.banUser({\
											user_id  : id\
										});\
									}';
					
							}
				
						}
					
						VK.api('execute', {
							code : code
						}, {
							uid : details.uid,
							task_id : task_id
						}, function(response) {
			
							if (response.status != 'success' || response.details != 1) {
								
								task.update(task_id, {
									nowCountAdd : 1,
									addErrors : {
										text : 'Не удалось добавить страницу в ЧС',
										uid : details.uid,
										error : 'unkniwn_error',
										data : response.details,
										item : item
									}
								});
								setTimeout(go, 300);
								return false;
							}
							
							task.update(task_id, {
								nowCountAdd : 1,
								addSuccess : {
									text : 'Страница добавлена в ЧС',
									item : item
								}
							});
							setTimeout(go, 300);
							return false;
								
						});					
								
					}
				
					go();
				
				});
				
			},
		
			'vkhelper_plugins_banList_export' : function (details, tab_id, callback) {

				task.add('last', {
					initiator : 'banList.bg.msg.vkhelper_plugins_banList_export',
					isVisible : true,
					title : '<b>Экспорт ЧС</b> со страницы <a href="https://vk.com/'+ (details.gid ? 'club'+ details.gid : 'id'+ details.uid) +'" target="_blank">'+ (details.gid ? 'club'+ details.gid : 'id'+ details.uid) +'</a>',
					onFinished : function (task_id, details) {
						
						messages.sendToVk({
							type : 'control_fastMessage_view',
							details : {
								status : 'success',
								text : 'Экспорт ЧС завершен'
							}
						});
						
					}
				}, function(task_id, task_callback) {
				
					var export_list = []; // список для сохранения экспорта
					
					function go(i) {
						
						i = i || 0;
						
						if (details.gid) {
							var code = '\
								return API.groups.getBanned({\
									group_id : '+ details.gid +',\
									offset   : '+ (i * 200) +',\
									count    : 200\
								}); ';
						} 
						else {
							var code = '\
								return API.account.getBanned({\
									offset : '+ (i * 200) +',\
									count  : 200\
								}); ';
						}
					
						VK.api('execute', {
							code : code
						}, {
							uid : details.uid,
							task_id : task_id
						}, function(response) {
							
							if (response.status != 'success') {
								
								task.update(task_id, {
									nowCountAdd : 1,
									addErrors : {
										text : 'Не удалось экспортировать ЧС',
										details : details
									}
								});
								task_callback();
								return false;
							}
							
							export_list = export_list.concat(
								response.details.items.map(function(d){ 
									return d.ban_info ? JSON.stringify([d[d.type].id, d.ban_info.comment, d.ban_info.comment_visible, d.ban_info.end_date]) : d.id;
								})
							);
							
							// если еще есть
							if (response.details.count > response.details.items.length) {
								task.update(task_id, {
									nowCountAdd : response.details.items.length,
									maxCount : response.details.count
								});
								go(i++);
								return;
							}
							
							
							task.update(task_id, {
								nowCountAdd : response.details.items.length,
								addSuccess : {
									text : export_list.length ? 'Список ЧС:<br><textarea style="width:97%;height:450px">'+ export_list.join('\n') +'</textarea><br>' : 'ЧС пуст' 
								}
							});
							task_callback();
							return false;
								
						});					
								
					}
				
					go();
					
				});
			
			}
			
		}
			
	}
	
};

vkhelper_plugins_list['linkStatClub'] = {
	
	lang : {
		ru : {
			cat : 'Другое',
			title : 'Кнопка "Статистика сообщества"',
			aboutLink : 'http://vk-helper.pro/?p=page/instruction&type=39',
			description : 'В меню сообщества появляется пункт "Статистика сообщества". Нажав на этот пункт откроется страница со статистикой сообщества(если в этом сообществе статистика открыта)<br><br><img src="https://vk-helper.pro/image/faq/linkStatClub_1.png" width="352" height="353">',
			
			link : 'Статистика сообщества'
		},
		en : {
			cat : 'Other',
			title : 'Community Statistics button',
			aboutLink : 'http://vk-helper.pro/?p=page/instruction&type=39',
			
			link : 'Community statistics'
		}
	},
	
	storage : {	
		enabled : false
	},
	
	css : "\
		html:not(.vkhelper_plugin_linkStatClub) .vkhelper_linkStatClub_button {\
			display:none;\
		}",
		  
	vk_script : {
		
		on : function () {
		
			jQuery('body').on('click', '#public_actions_wrap div.page_actions_cont:not([vkhelper_linkStatClub]):not(a[href^="/stats?gid="]), #group_actions_wrap div.page_actions_cont:not([vkhelper_linkStatClub]):not(a[href^="/stats?gid="])', function() {

				var d = jQuery('#wall_tabs a[href$="?own=1"]:first');
				if (!d.length) { return false; }
				
				var h = d.attr('href').match( /.+?wall-(.*)\?own=1/i );
				if (!h.length) { return false; }
				
				var club_id = Number(h[1]);
				
				jQuery(this)
					.attr('vkhelper_linkStatClub', '1')
					.find('.page_actions_inner')
					.append('<a class="page_actions_item vkhelper_linkStatClub_button" href="/stats?gid='+ club_id +'" tabindex="0" role="link">'+ vkhelper.lang.get('linkStatClub', 'link') +'</a>');

			});
			
		}
		
	}
	
};

vkhelper_plugins_list['searchPostInWall'] = {
	
	lang : {
		ru : {
			cat : 'Другое',
			title : 'Поиск записей на стене по пользователю',
			aboutLink : 'http://vk-helper.pro/?p=page/instruction&type=42',
			description : 'На стене пользователей и сообществ появится вкладка "Поиск", нажав на эту кнопку Вы сможете искать на стене записи определенного пользователя<br><br><img src="https://vk-helper.pro/image/faq/searchPostInWall_1.png" width="500" height="220">',
			
			search_link : 'Поиск',
			view : 'Смотреть',
			messagesBox_title : 'Расширенный поиск записей',
			messagesBox_labelUser : 'ID или ссылка на пользователя',
			messagesBox_btnGo : 'Продолжить',
			messagesBox_btnCancle : 'Отмена',
				
			messagesBoxResult_title : 'Результаты расширенного поиска записей',
			messagesBoxResult_content_table_text : 'Текст',
			messagesBoxResult_content_table_attach : 'Вложения',
			messagesBoxResult_content_table_date : 'Дата',
			messagesBoxResult_content_table_likes : 'Лайки',
			messagesBoxResult_content_table_reposts : 'Репосты',
			messagesBoxResult_content_table_comments : 'Комментарии',
			messagesBoxResult_content_table_actions : 'Действия',
				
			messagesBoxResult_content_table_none : 'Записи не найдены',
			messagesBoxResult_content_table_search : 'Идет поиск записей...',
			messagesBoxResult_content_table_search_all : 'Искать еще',
			messagesBoxResult_content_table_walls : 'Обработано записей'	
		},
		en : {
			cat : 'Other',
			title : 'Find records on the wall by user',
			aboutLink : 'http://vk-helper.pro/?p=page/instruction&type=42',
			
			search_link : 'Search',
			view : 'Watch',
			messagesBox_title : 'Advanced Record Search',
			messagesBox_labelUser : 'ID or user reference',
			messagesBox_btnGo : 'Continue',
			messagesBox_btnCancle : 'Cancel',
				
			messagesBoxResult_title : 'Advanced Record Search Results',
			messagesBoxResult_content_table_text : 'Text',
			messagesBoxResult_content_table_attach : 'Attachments',
			messagesBoxResult_content_table_date : 'Date',
			messagesBoxResult_content_table_likes : 'Likes',
			messagesBoxResult_content_table_reposts : 'Reposts',
			messagesBoxResult_content_table_comments : 'Comments',
			messagesBoxResult_content_table_actions : 'Actions',
				
			messagesBoxResult_content_table_none : 'No post found',
			messagesBoxResult_content_table_search : 'Posts searching...',
			messagesBoxResult_content_table_search_all : 'Search More',
			messagesBoxResult_content_table_walls : 'Processed records'	
		}
	},
	
	storage : {	
		enabled : false
	},
	
	css : function () {
		/*
		html:not(.vkhelper_plugin_searchPostInWall) .vkhelper_searchPostInWall_link {
			display:none;
		}
		#vkhelper_searchPostInWall_table {
			width: 100%;
			border-collapse: collapse;
		}
		#vkhelper_searchPostInWall_table td, #vkhelper_searchPostInWall_table th {
			padding: 3px;
			border: 1px solid #bdb7b7;
			text-align:center;
		}
		#vkhelper_searchPostInWall_table th {
			background: #c5d3e2;
		}
		#vkhelper_searchPostInWall_table tr[name='not'] {
			display: none;
		}
		#vkhelper_searchPostInWall_table tr[name='loading'] {
		}
		#vkhelper_searchPostInWall_table tr[name='search_butt'] {
			display: none;
			background-color: green;
			font-size: 1.1em;
			color: white;
			cursor: pointer;
		}
		#vkhelper_searchPostInWall_count {
			font-weight: bold;
		}
		#vkhelper_searchPostInWall_count_all {
			font-weight: bold;
		}
		*/
	},
	
	vk_script : {
		
		on : function () {
		
			vkhelper.mutationObserver.add('searchPostInWall', function() {
			
				var p = jQuery('#wall_tabs:not([vkhelper_searchPostInWall])');
				
				p.attr('vkhelper_searchPostInWall', '1');
				
				if (p.length != 1) {
					return false;
				}
				
				p
					.append('<li><a href="#" class="ui_tab vkhelper_searchPostInWall_link">'+ vkhelper.lang.get('searchPostInWall', 'search_link') +'</a></li>')
					.find('.vkhelper_searchPostInWall_link')
					.click(function(event){
					
						vkhelper.plugins.searchPostInWall.vk_script.functions.openBox();
						
						event.stopPropagation();
						
						return false;
						
					});
						
			}); 
			
		},
		
		off : function () {
		
			vkhelper.mutationObserver.remove('searchPostInWall');
			
		},
		
		messages : {
		
			'vkhelper_plugins_searchPostInWall_getListPost_Success' : function (details) {

				var tb = jQuery('#vkhelper_searchPostInWall_table');
				
				var offset = Math.min(details.offset * 100 + 100, details.count);
				
				tb.data('offset', details.offset);
				tb.data('count' , details.count);
				
				if (tb.attr('data-uid') != details.uid || tb.attr('data-oid') != details.oid) {
					return;
				}
				
				jQuery('#vkhelper_searchPostInWall_count').text(offset);
				jQuery('#vkhelper_searchPostInWall_count_all').text(details.count);
				
				tb.find('tr[name="loading"]').hide();
				
				// отображаем кнопку подгрузки
				if (offset < details.count) {
					tb.find('tr[name="search_butt"]').show();
				}
				
				
				var t = '';
				jQuery.each(details.list, function(k,v){
					
					var d_created = new Date(v.date * 1000);
					var time_created = d_created.getDate() +'.'+ (d_created.getMonth()+1) +'.'+ d_created.getFullYear() +' '+ d_created.getHours() +':'+ d_created.getMinutes();
					
					var d_edited = new Date(v.edited * 1000);
					var time_edited = d_edited.getDate() +'.'+ (d_edited.getMonth()+1) +'.'+ d_edited.getFullYear() +' '+ d_edited.getHours() +':'+ d_edited.getMinutes();
					var link_edited = v.editor_id && v.editor_name ? '<br><a href="https://vk.com/id'+ v.editor_id +'" target="_blank">'+ v.editor_name +'</a>' : '';

					t += '<tr name="item">'+
							'<td>'+ (v.text || '---') +'</td>'+
							'<td>'+ (v.attachments ? v.attachments.length : 0) +'</td>'+
							'<td>'+ time_created +'</td>'+
							'<td>'+ (v.likes    ? v.likes.count    : 0) +'</td>'+
							'<td>'+ (v.reposts  ? v.reposts.count  : 0) +'</td>'+
							'<td>'+ (v.comments ? v.comments.count : 0) +'</td>'+
							'<td>'+
								'<a href="https://vk.com/wall'+ v.owner_id +'_'+ v.id +'" target="_blank">'+ vkhelper.lang.get('searchPostInWall', 'view') +'</a>'+
							'</td>'+
						 '</tr>';
					
				});
				
				tb.find('tbody > tr:not([name="item"]):first').before(t);
			
				if (!tb.find('tbody > tr[name="item"]').length) {
					tb.find('tbody > tr[name="not"]').show();
				}
		}
		
		},
		
		functions : {
		
			openBox : function () {
				
				var a = new MessageBox({title : vkhelper.lang.get('searchPostInWall', 'messagesBox_title')})
					.content('<div style="text-align: center" id="vkhelper_searchPostInWall_blockFilter">'+
							'<div class="pedit_label">'+ vkhelper.lang.get('searchPostInWall', 'messagesBox_labelUser') +':</div>'+
							'<div class="pedit_labeled">'+
								'<input type="text" name="uid" id="vkhelper_searchPostInWall_blockFilter_uid" style="text-align:center" class="dark" autofocus>'+
							'</div>'+
							'</div>')
					.setButtons(vkhelper.lang.get('searchPostInWall', 'messagesBox_btnGo'), function() {

						var f = jQuery('#vkhelper_searchPostInWall_blockFilter');
						
						var uid = f.find('input[name="uid"]').val().trim();
						
						if (/^[0-9]*$/i.test(uid)) {
							uid = Number(uid);
						} else if (/^((https?:\/\/)?(www\.)?vk.com\/)?id[0-9]*$/i.test(uid)) {
							uid = Number(uid.replace(/^((https?:\/\/)?(www\.)?vk.com\/)?id([0-9]*)$/i, '$4'));
						} else if (/^[A-z]{1}[A-z0-9_]{4,}$/i.test(uid)) {
							uid = uid;
						} else if (/^((https?:\/\/)?(www\.)?vk.com\/)?([A-z]{1}[A-z0-9_\.]{4,})$/i.test(uid)) {
							uid = uid.replace(/^((https?:\/\/)?(www\.)?vk.com\/)?([A-z]{1}[A-z0-9_\.]{4,})$/i, '$4');
						} else {
							uid = 0;
						}
						
						if (uid == '' || uid == 0) {
							notaBene('vkhelper_searchPostInWall_blockFilter_uid');
							return;
						}
						
						if (typeof uid == 'number') {
							uid = 'id' + uid;
						}
							
						vkhelper.messages.sendToBG({
							type : 'vkhelper_plugins_searchPostInWall_getListPost', 
							details : {
								uid : vk.id, 
								oid : cur.oid,
								filter : {
									uid : uid
								}
							}
						});
				
						
						a.hide();
				
						new MessageBox({
							title : vkhelper.lang.get('searchPostInWall', 'messagesBoxResult_title'),
							width : 900,
							grey  : true, 
							hideButtons : true
						})
							.content('<table id="vkhelper_searchPostInWall_table" data-oid="'+ cur.oid +'" data-offset="0" data-count="0" data-uid="'+ uid +'">'+
									 '<thead>'+
									 '<tr>'+
										'<th>'+ vkhelper.lang.get('searchPostInWall', 'messagesBoxResult_content_table_text') +'</th>'+
										'<th>'+ vkhelper.lang.get('searchPostInWall', 'messagesBoxResult_content_table_attach') +'</th>'+
										'<th>'+ vkhelper.lang.get('searchPostInWall', 'messagesBoxResult_content_table_date') +'</th>'+
										'<th>'+ vkhelper.lang.get('searchPostInWall', 'messagesBoxResult_content_table_likes') +'</th>'+
										'<th>'+ vkhelper.lang.get('searchPostInWall', 'messagesBoxResult_content_table_reposts') +'</th>'+
										'<th>'+ vkhelper.lang.get('searchPostInWall', 'messagesBoxResult_content_table_comments') +'</th>'+
										'<th>'+ vkhelper.lang.get('searchPostInWall', 'messagesBoxResult_content_table_actions') +'</th>'+
									 '</tr>'+
									 '</thead>'+
									 '<tbody>'+
									 '<tr name="not"><td colspan="7">'+ vkhelper.lang.get('searchPostInWall', 'messagesBoxResult_content_table_none') +'</td></tr>'+
									 '<tr name="loading"><td colspan="7">'+ vkhelper.lang.get('searchPostInWall', 'messagesBoxResult_content_table_search') +'</td></tr>'+
									 '<tr name="search_butt"><td colspan="7">'+ vkhelper.lang.get('searchPostInWall', 'messagesBoxResult_content_table_search_all') +'</td></tr>'+
									 '</tbody>'+
									 '</table>'+
									 '<br>'+ vkhelper.lang.get('searchPostInWall', 'messagesBoxResult_content_table_walls') +': <span id="vkhelper_searchPostInWall_count">0</span> из <span id="vkhelper_searchPostInWall_count_all">0</span>')
							.show();
					
						jQuery('#vkhelper_searchPostInWall_table tr[name="search_butt"]').click(function() {
							
							var tb = jQuery('#vkhelper_searchPostInWall_table');
							tb.find('tr[name="loading"]').show();
							tb.find('tr[name="search_butt"]').hide();
							tb.find('tbody > tr[name="not"]').hide();
				
							vkhelper.messages.sendToBG({
								type : 'vkhelper_plugins_searchPostInWall_getListPost', 
								details : {
									uid : vk.id,
									oid : cur.oid,
									offset : Number(jQuery('#vkhelper_searchPostInWall_table').data('offset')) + 1,
									filter : {
										uid : jQuery('#vkhelper_searchPostInWall_table').attr('data-uid')
									}
								}
							});
								
						});
					
					
					}, vkhelper.lang.get('searchPostInWall', 'messagesBox_btnCancle'))
					.show();
							
					jQuery('#vkhelper_searchPostInWall_blockFilter_uid').focus();
					
			}
		
		}
		
	},
	
	bg_script : {
		
		messages : {
		
			'vkhelper_plugins_searchPostInWall_getListPost' : function (details, tab_id, callback) {

				task.add('first', {
					initiator : 'searchPostInWall.bg.msg.vkhelper_plugins_searchPostInWall_getListPost',
					isVisible : false
				}, function(task_id, task_callback) {
				
					var code = '\
						var uid = API.utils.resolveScreenName({"screen_name" : "'+ details.filter.uid +'"});\
						if (uid.length == 0 || uid.type != "user") { return -1; }\
						uid = uid.object_id;\
						var res = [];\
						var a = API.wall.get({\
							"owner_id" : '+ details.oid +',\
							"offset" : '+ (100 * (details.offset || 0)) +',\
							"count" : 100\
						});\
						var t = a.items.length;\
						if (t == 0) { return [0, a.count]; }\
						var g = 0;\
						while (g < t) {\
							if (a.items[g].from_id == uid || a.items[g].signer_id == uid) {\
								res.push(a.items[g]);\
							}\
							g = g + 1;\
						}\
						return [res, a.count];';
					
					VK.api('execute', {
						code : code
					}, {
						uid : details.uid,
						task_id : task_id
					}, function(response) {
								
						messages.sendToVk({ 
							type : 'vkhelper_plugins_searchPostInWall_getListPost_Success',
							details : {
								offset : (details.offset || 0),
								count  : response.details[1],
								list   : response.details[0],
								uid    : details.filter.uid,
								oid    : details.oid
							}
						}, tab_id);
						
						task_callback();
						
					});
							
				});	
				
			}
			
		}
			
	}
	
};

// СМОТРЕЛ, доделать
vkhelper_plugins_list['saveAlbumToZip'] = {
	
	lang : {
		ru : {
			cat : 'Другое',
			title : 'Скачивание альбомов с фотографиями',
			aboutLink : 'http://vk-helper.pro/?p=page/instruction&type=44',
			description : 'При просмотре альбома фотографий, отображается ссылка "Скачать альбом в ZIP". Нажав на эту ссылку, все фотографии из альбома будут скачаны на Ваш компьютер в ZIP архиве.  Архивы с фотографиями скачиваются в <b>стандартный каталог загрузок браузера</b><br><br><img src="https://vk-helper.pro/image/faq/saveAlbumToZip_1.png" width="500" height="124">',
			
			link : 'Скачать альбом в ZIP',
			
			messageBox_title : 'Скачать альбом в ZIP',
			messageBox_content : 'Все фотографии альбома будут скачаны в ZIP архиве на Ваш компьютер.',
			messageBox_btnGo : 'Продолжить',
			messageBox_btnCancle : 'Отмена',
			
			tabRequest_title : 'Формирование альбома с фотографиями',
			tabRequest_readme : 'Альбом фотографий загружен с VK.com при помощи расширения VK Helper\r\rСсылка на сайт расширения: https://vk-helper.pro',
			tabRequest_success : 'Архив сформирован. <a href="#" onclick="vkhelper_tabRequestResult(this); return false;">Скачать</a>',
			tabRequest_error : 'Возникла ошибка при загрузке архива'
		},
		en : {
			cat : 'Other',
			title : 'Download albums with photos',
			aboutLink : 'http://vk-helper.pro/?p=page/instruction&type=44',
			
			link : 'Download album in ZIP',
			
			messageBox_title : 'Download album in ZIP',
			messageBox_content : 'All photos of the album will be downloaded in a ZIP archive to your computer.',
			messageBox_btnGo : 'Continue',
			messageBox_btnCancle : 'Cancel',
			
			tabRequest_title : 'Downloading an album in ZIP',
			tabRequest_readme : 'The photo album is downloaded from VK.com using the VK Helper extension\r\rLink to the extension site: https://vk-helper.pro',
			tabRequest_success : 'ZIP archive loaded',
			tabRequest_error : 'There was an error loading the archive'
		}
	},
	
	storage : {	
		enabled : false
	},
	
	vk_script : {
		
		on : function () {
		
			vkhelper.mutationObserver.add('saveAlbumToZip', function() {
			
				jQuery('#photos_all_block .photos_album_intro_info:not([vkhelper_saveAlbumToZip])').each(function() {
				  	
				  	var $this = jQuery(this).attr('vkhelper_saveAlbumToZip', '1');
				  	$this
				  		.append('<span class="divide">|</span><span><a href="#" onclick="return false;" class="vkhelper_saveAlbumToZip_link">'+ vkhelper.lang.get('saveAlbumToZip', 'link') +'</a></span>')
				  		.find('.vkhelper_saveAlbumToZip_link')
				  		.click(function(event){
				  		
							vkhelper.plugins.saveAlbumToZip.vk_script.functions.openBox();
						
							event.stopPropagation();
						
							return false;
				  			
				  		});
				  	
			  	});
						
			}); 
		},
		
		off : function () {
		
			vkhelper.mutationObserver.remove('saveAlbumToZip');
			
		},
		
		functions : {
		
			openBox : function () {
				
				var a = cur.moreFrom.substr(5).split('_');
				  	
				var owner_id = a[0];
				var album_id = a[1];
				  	
				album_id = album_id == '00' ? 'wall' : (album_id == '0' ? 'profile' : (album_id == '000' ? 'saved' : album_id) );
				  	
				var a = new MessageBox({title : vkhelper.lang.get('saveAlbumToZip', 'messageBox_title')})
					.content(vkhelper.lang.get('saveAlbumToZip', 'messageBox_content'))
					.setButtons(vkhelper.lang.get('saveAlbumToZip', 'messageBox_btnGo'), function() {

						vkhelper.messages.sendToBG({ 
							type : 'vkhelper_plugins_saveAlbumToZip_start', 
							details : {
								uid : vk.id,
								owner_id : owner_id,
								album_id : album_id
							}
						});
					
						a.hide();
						
					}, vkhelper.lang.get('saveAlbumToZip', 'messageBox_btnCancle'))
					.show();
					
			}
		
		}
		
	},
	
	bg_script : {
		
		messages : {
		
			'vkhelper_plugins_saveAlbumToZip_start' : function (details, tab_id, callback) {
			
				task.add('last', {
					initiator : 'historyCreate.bg.msg.vkhelper_plugins_historyCreate_upload',
					isVisible : true,
					title : '<b>Скачивание альбома</b> <a href="https://vk.com/album'+ details.owner_id +'_'+ details.album_id +'" target="_blank">album'+ details.owner_id +'_'+ details.album_id +'</a>',
					maxCount  : 1,
					onFinished : function (task_id, details) {
					
						if (details.log_errors) {
						
							messages.sendToVk({
								type : 'control_fastMessage_view',
								details : {
									status : 'error',
									text : 'Не удалось загрузить историю'
								}
							});
						
						} 
						else {
						
							messages.sendToVk({
								type : 'control_fastMessage_view',
								details : {
									status : 'success',
									text : 'История загружена'
								}
							});
						
						}
							
					}
				}, function(task_id, task_callback) {
			
					var code = '\
						var res = [];\
						var i = 0;\
						while (i < 5) {\
							var u = API.photos.get({"owner_id" : "'+ details.owner_id +'", "album_id" : "'+ details.album_id +'", "photo_sizes" : "1", "offset" : i * 1000, "count" : "1000" });\
							res.push(u.items);\
							if (u.count < (i + 1) * 1000) { return res; }\
							i = i + 1;\
						}\
						return res;'
						
					VK.api('execute', {
						code : code
					}, {
						uid : details.uid,
						task_id : task_id
					}, function(response) {
								
						if (response.status != 'success') {
								
							task.update(task_id, {
								nowCountAdd : 'max',
								addErrors : {
									text : 'Не удалось получить список фотографий',
									uid : details.uid,
									error : 'unkniwn_error',
									data : response.details
								}
							});
							task_callback();
							return false;
						}
						
						function downloadUrlAsPromise(url) {
								
  							return new Promise(function (resolve, reject) {
  								
  								//if (!tabRequest.get(id_tabRequest)) {
								//	return false;
								//}
					
  								var xhr = new XMLHttpRequest();
  								xhr.open('GET', url, true);
  								xhr.responseType = "arraybuffer";
  								xhr.onreadystatechange = function(evt) {
     
      								if (xhr.readyState === 4) {
          								if (xhr.status === 200) {
          									resolve(xhr.response);
          								} else {
          									reject(new Error("Ajax error for " + url + ": " + xhr.status));
          								}
      								}
      								
      							}
      							
      							xhr.send();
  								
  							})
  							.then(function() {
  								
  								now_count++;
  								
  								task.update(task_id, {
    								nowCountAdd : 1
								});
									
								if (max_count <= now_count) {
								
									task.update(task_id, {
										nowCountAdd : 'max',
										addSuccess : {
											text : 'Не удалось получить список фотографий',
											result : result
										}
									});
									task_callback();
									return false;
								}
									
  							})
  							.catch(function() {
  								
  								now_count++;
  								
  								task.update(task_id, {
    								nowCountAdd : 1
								});
							
								if (max_count <= now_count) {
									
									task.update(task_id, {
										nowCountAdd : 'max',
										addSuccess : {
											text : 'Не удалось получить список фотографий',
											result : result
										}
									});
									task_callback();
									return false;
							
								}
									
  							});
  								
  						}
  							
  							
						var result = {
  							type : 'zip',
  							name : "album"+ details.owner_id +"_"+ details.album_id +".zip",
  							files : {
  								"readme.txt" : lang.get('saveAlbumToZip', 'tabRequest_readme'),
  								"photos" : {}
  							}
  						};
  							
  						var max_count = 0,
  							now_count = 0;
						jQuery.each(response.details, function(k, v) {
							max_count += v.length;
						});
						
						task.update(task_id, {
    						maxCount : max_count
						});
											
						jQuery.each(response.details, function(k, v) {
								
							jQuery.each(v, function(k2, v2) {
								
								var name = v2.owner_id +'_'+ v2.id;
									
								var imgUrl = false;
								var width = 0;
									
								jQuery.each(v2.sizes, function(k3, v3) {
									
									if (width < v3.width || width == 0) {
										width  = v3.width;
										imgUrl = v3.src;
									}
										
								});
									
								result.files.photos[name + ".jpg"] = {
									url : imgUrl
								};
									
								downloadUrlAsPromise(imgUrl);
									
							});
						
						});
							
						return false;
					});
				});
					
			}
			
		}
			
	}
	
};

vkhelper_plugins_list['linkMentionsClub'] = {
	
	lang : {
		ru : {
			cat : 'Другое',
			title : 'Кнопка "Упоминания сообщества"',
			aboutLink : 'http://vk-helper.pro/?p=page/instruction&type=50',
			description : 'В меню сообщества появляется пункт "Упоминания сообщества". Нажав на этот пункт пользователь может просмотреть все упоминания сообщества<br><br><img src="https://vk-helper.pro/image/faq/linkMentionsClub_1.png" width="256" height="151">',
			
			link : 'Упоминания сообщества'
		},
		en : {
			cat : 'Other',
			title : 'Button "Community References"',
			aboutLink : 'http://vk-helper.pro/?p=page/instruction&type=50',
			
			link : 'Community References'
		}
	},
	
	storage : {	
		enabled : false
	},
	
	css : "\
		html:not(.vkhelper_plugin_linkMentionsClub) .vkhelper_linkMentionsClub_button {\
			display:none;\
		}",
		  
	vk_script : {
		
		on : function () {
		
			jQuery('body').on('click', '#public_actions_wrap div.page_actions_cont:not([vkhelper_linkMentionsClub]):not(a[href^="/stats?gid="]), #group_actions_wrap div.page_actions_cont:not([vkhelper_linkMentionsClub]):not(a[href^="/stats?gid="])', function() {

				var d = jQuery('#wall_tabs a[href$="?own=1"]:first');
				if (!d.length) { return false; }
				
				var h = d.attr('href').match( /.+?wall-(.*)\?own=1/i );
				if (!h.length) { return false; }
				
				var club_id = Number(h[1]);
				
				jQuery(this)
					.attr('vkhelper_linkMentionsClub', '1')
					.find('.page_actions_inner')
					.append('<a class="page_actions_item vkhelper_linkMentionsClub_button" href="/feed?section=mentions&obj=-'+ club_id +'" tabindex="0" role="link">'+ vkhelper.lang.get('linkMentionsClub', 'link') +'</a>');

			});
			
		}
		
	}
	
};



vkhelper_plugins_list['sendPostToGroupFromAdmin'] = {
	
	lang : {
		ru : {
			cat : 'Для админов',
			title : 'Записи и комментарии от имени сообщества',
			aboutLink : 'http://vk-helper.pro/?p=page/instruction&type=55',			
			description : 'В своих сообществах, по умолчанию новые записи и комментарии будут публиковаться от имени сообщества, а не от Вашего имени.'
		},
		en : {
			cat : 'For admins',
			title : 'Records and comments on behalf of the community'
		}
	},
	
	storage : {	
		enabled : false
	},
	
	vk_script : {
		
		init : false,
		
		on : function () {
		
			if (vkhelper.plugins['sendPostToGroupFromAdmin'].vk_script.init == true) {
				return;
			} 
			
			vkhelper.plugins['sendPostToGroupFromAdmin'].vk_script.init = true;
			
			
			jQuery('body').on('focus', '#group #post_field', function() {
			
				if (vkhelper.plugins['sendPostToGroupFromAdmin'].storage.enabled == false) {
					return;
				}
				
				if (!cur.is_group_admin) {
					return false;
				}
				 
				wall.setReplyAsGroup(ge('official'), { from: -cur.group_id });
				
			});
			
			jQuery('body').on('focus', 'div.reply_field.submit_post_field', function() {
			
				if (vkhelper.plugins['sendPostToGroupFromAdmin'].storage.enabled == false) {
					return;
				}
				
				if (!cur.is_group_admin) {
					return false;
				}
				
				wall.setReplyAsGroup(ge('reply_box' + jQuery(this).attr('id').substr(11)), { from: -cur.group_id });
				 
			});
			
			if (window.stManager) {
				stManager.add(["page.js"], function() {
			
					Wall.replyClick = new Function('post, reply, event, answering', Wall.replyClick.toString().replace(/.+?\{/i, '').replace(/\}$/i, '') + " if (vkhelper.plugins['sendPostToGroupFromAdmin'].storage.enabled == false || !cur.is_group_admin) { return false; } wall.setReplyAsGroup(ge('reply_as_group'+ post), { from: -cur.group_id }); return false; ");
			
				});
			}
			
		}
		
	}
	
};

vkhelper_plugins_list['photoCopySearch'] = {
	
	lang : {
		ru : {
			cat : 'Другое',
			title : 'Поиск похожих фотографий',
			description : 'Вы сможете в 1 клик найти копии фотографий в интернете. К примеру, данную функцию можно использовать для определения фейковых страниц.<br><br>Откройте нужную фотографию, нажмите "<b>Еще</b>" под фотографией и в открывшемся меню используйте пункт "<b>Поиск копий</b>"<br><br><img src="https://vk-helper.pro/image/options/photoCopySearch_1.jpg" width="404" height="350">',
			
			aboutLink : 'http://vk-helper.pro/?p=page/instruction&type=59',
			
			label : 'Поиск копий'
		},
		en : {
			cat : 'Other',
			title : 'Find similar photos',
			label : 'Search for copies'
		}
	},
	
	storage : {	
		enabled : false
	},
	
	css : "\
		#pv_more_acts_tt .vkhelper_ph_copy_search.pv_more_act_item:before {\
    		display: none;\
		}\
		#pv_more_acts_tt .vkhelper_ph_copy_search.pv_more_act_item {\
    		padding: 8px 10px;\
		}\
		html.vkhelper_plugin_photoCopySearch .vkhelper_ph_copy_search_links {\
    		padding-left: 0px;\
		}\
		#pv_more_acts_tt div.pv_counter.vkhelper_ph_copy_search_label.pv_more_act_item:before {\
    		background-image: none;\
		}\
		html.vkhelper_plugin_photoCopySearch #pv_more_acts_tt div.pv_counter.vkhelper_ph_copy_search_label.pv_more_act_item {\
    		padding-left: 0px;\
    		/*margin-left: -10px;*/\
    		cursor: default;\
		}\
		html:not(.vkhelper_plugin_photoCopySearch) .vkhelper_ph_copy_search_links, \
		html:not(.vkhelper_plugin_photoCopySearch) #pv_more_acts_tt div.pv_counter.vkhelper_ph_copy_search_label.pv_more_act_item {\
			display: none;\
		}",

	vk_script : {
		
		on : function () {
		
			vkhelper.mutationObserver.add('photoCopySearch', function() {
					
				jQuery('#pv_box #pv_more_acts_tt div.pv_more_acts:not([photoCopySearch])').each(function() {
				  	
				  	var $this = jQuery(this).attr('photoCopySearch', '1'),
				  		img_url = $this.find('#pv_more_act_download').attr('href');
				  		
				  	$this.append('\
				  		<div class="pv_counter vkhelper_ph_copy_search_label pv_more_act_item">Поиск копий:</div>\
				  		<div class="vkhelper_ph_copy_search_links">\
				  			<a target="_blank" class="pv_more_act_item fl_l vkhelper_ph_copy_search" href="https://www.google.com/searchbyimage?image_url='+ img_url +'">Google</a>\
				  			<a target="_blank" class="pv_more_act_item fl_l vkhelper_ph_copy_search" href="http://www.tineye.com/search?url='+ img_url +'">TinEye</a>\
				  			<a target="_blank" class="pv_more_act_item fl_l vkhelper_ph_copy_search" href="http://yandex.ru/images/search?img_url='+ img_url +'&amp;rpt=imageview">Yandex</a>\
				  			<a target="_blank" class="pv_more_act_item fl_l vkhelper_ph_copy_search" href="/feed?section=photos_search&amp;q=copy%3Aphoto'+ cur.pvCurPhoto.id +'">VK</a>\
				  			<div class="clear"></div>\
				  		</div>');
				
					new ElementTooltip(geByClass1("pv_actions_more")).show();
					
				});
					
			}); 
		},
		
		off : function () {
		
			vkhelper.mutationObserver.remove('photoCopySearch');
			
		}
		
	}
	
};

vkhelper_plugins_list['suggestsWall'] = {
	
	lang : {
		ru : {
			cat : 'Для админов',
			title : 'Список всех предлагаемых новостей в одном месте',
			description : 'Функция добавляет возможность просматривать список всех предложенных новостей во всех администрируемых сообществах.<br><br>В левом меню перейдите по ссылке "<a href="https://vk.com/groups" target="_blank">Группы</a>", в правам меню отобразится пункт "<b>Предлагаемые новости</b>" и рядом с ним будет указано общее количество предлагаемых новостей во всех сообществах. При нажатии на этот пункт откроется список всех Ваших групп, рядом с названием будет отображаться количество предлагаемых новостей в конкретном сообществе. При нажатии на нужное сообщество, откроется список предлагаемых новостей.<br><br><img src="https://vk-helper.pro/image/options/suggestsWall_1.jpg" width="330" height="327">',
			
			aboutLink : 'http://vk-helper.pro/?p=page/instruction&type=56',	
			
			label : 'Предлагаемые новости',
			nonePost : 'Нет ни одной предлагаемой новости.'
		},
		en : {
			cat : 'For admins',
			title : 'A list of all the news in one place',
			label : 'Suggested news',
			nonePost : 'There is not one proposed news.'
		}
	},
	
	storage : {	
		enabled : false
	},	
	
	css : function () {
		/*
		#ui_rmenu_category0_suggests span.fl_r {
			margin-right: 10px;
		}
		#ui_rmenu_category0_suggests div.pr  {
			margin: 14px 10px;
			float: right;
		}
		#ui_rmenu_category0_suggests_list span.fl_r {
			margin-right: 10px;
			margin-left: 10px;
		}
		#ui_rmenu_category0_suggests_list span.fl_r.bold {
			font-weight: 900;
			color: red;
		}
		
		#ui_rmenu_category0_suggests_list div.pr  {
			margin: 14px 10px;
			float: right;
		}
		
		.wall_module .wall_posts.block .post {
			display: block;
		}
		*/
	},
	
	vk_script : {
		
		on : function () {
		
			vkhelper.mutationObserver.add('suggestsWall', function() {
					
				try {
					if (jQuery.inArray(cur.module, ["groups_list", "groups_catalog"]) == -1) {
						return;
					}
				} catch (e) {
					return false;
				}
				
				jQuery('#narrow_column:not([suggestsWall])').each(function() {
				  	
				  	var $this = jQuery(this).attr('suggestsWall', '1');
				  		
				  	$this.find('div.ui_rmenu_pr').append('\
				  		<a id="ui_rmenu_category0_suggests" href="#" onclick="uiRightMenu.switchMenu(this); return false;" class="ui_rmenu_item _ui_item_category0_suggests groups_section_category0_suggests" onclick=" return uiRightMenu.go(this, event);">\
				  			<span>\
				  				'+ vkhelper.lang.get('suggestsWall', 'label') +' \
				  			</span>\
				  			<span class="fl_r"></span>\
				  			<div class="pr " id="" style="opacity: 1;"><div class="pr_bt"></div><div class="pr_bt"></div><div class="pr_bt"></div></div>\
  						</a>\
  						<div id="ui_rmenu_category0_suggests_list" data-sublist-id="category0_suggests" class="_ui_rmenu_sublist _ui_rmenu_category0_suggests_list unshown">');
				
					// отправляем запрос на получение списка сообществ и кол-во предложки
					
					vkhelper.messages.sendToBG({ 
						type : 'vkhelper_plugins_suggestsWall_init', 
						details : {
							uid : vk.id
						}
					});
						
				});
					
			}); 
		},
		
		off : function () {
		
			vkhelper.mutationObserver.remove('suggestsWall');
			
		},
		
		messages : {
		
			'vkhelper_plugins_suggestsWall_init_success' : function (details) {
			
				var cnt = 0;
				
				var html = '';
				
				jQuery.each(details.groups, function(k,v) {
					html += '<a id="ui_rmenu_category_suggests_'+ v.id +'" href="#" class="ui_rmenu_subitem _ui_rmenu_subitem _ui_item_category1 groups_section_category1" onclick="uiRightMenu.switchMenu(this); vkhelper.plugins.suggestsWall.vk_script.functions.showGroup('+ v.id +', \''+ encodeURI(v.name) +'\', '+ v.count +'); return false;">\
  								<span class="fl_r '+ (v.count > 0 ? 'bold' : '') +'">'+ v.count +'</span>\
  								<span>'+ v.name +'</span>\
							</a>';
					cnt += v.count;
				});
				
				jQuery('#ui_rmenu_category0_suggests_list').html(html);
				
				hideProgress(ge('ui_rmenu_category0_suggests'));
				jQuery('#ui_rmenu_category0_suggests span.fl_r').html(cnt);
				
			}
			
		},
		
		params : {
		
			loadGid : 0,
			loading : false
			
		},
		
		
		functions : {
		
			createPage : function (name) {
				
				if (window.stManager) {
					stManager.add(["page.js", "page.css", "ui_media_selector.js"]);
				}
				
				jQuery('#wide_column').html('\
					<div class="page_block">\
						<h2 class="page_block_h2">\
							<div class="page_block_header clear_fix">\
								<div class="page_block_header_inner _header_inner">'+ name +'</div>\
							</div>\
						</h2>\
					</div>\
					<div class="wall_module">\
						<div id="groups_list_content_suggests" class="clear_fix wall_posts block"></div>\
					</div>');
			},
		
			nonePost : function () {
				
				jQuery('#groups_list_content_suggests').html('\
					<div class="page_block no_posts">\
						<div class="no_posts_cover"></div>\
						'+ vkhelper.lang.get('suggestsWall', 'nonePost') +' \
					</div>');
			},
			
			showGroup : function (gid, nameEncode, count) {
			
				if (count == 0) {
					if (vkhelper.plugins.suggestsWall.vk_script.params.loadGid != 0) {
						hideProgress(document.querySelector('#ui_rmenu_category_suggests_'+ vkhelper.plugins.suggestsWall.vk_script.params.loadGid +' span.fl_r'));
					}
					vkhelper.plugins.suggestsWall.vk_script.params.loading = false;
					vkhelper.plugins.suggestsWall.vk_script.params.loadGid = 0;
					vkhelper.plugins.suggestsWall.vk_script.functions.createPage(decodeURI(nameEncode));
					vkhelper.plugins.suggestsWall.vk_script.functions.nonePost();
					return false;
				}
				
				
				// если совершен второй клик по загружаемому сообществу
				if (vkhelper.plugins.suggestsWall.vk_script.params.loading == true && 
					vkhelper.plugins.suggestsWall.vk_script.params.loadGid == gid) {
					return;
				}
				
				if (vkhelper.plugins.suggestsWall.vk_script.params.loadGid != gid) {
					hideProgress(document.querySelector('#ui_rmenu_category_suggests_'+ vkhelper.plugins.suggestsWall.vk_script.params.loadGid +' span.fl_r'));
					showProgress(document.querySelector('#ui_rmenu_category_suggests_'+ gid +' span.fl_r'))
				}
				
				vkhelper.plugins.suggestsWall.vk_script.params.loading = true;
				vkhelper.plugins.suggestsWall.vk_script.params.loadGid = gid;
				
				var a = ajax.post('al_wall.php', {act: 'get_suggests', owner_id: -gid}, {
					onDone: function(rows, notAll, js, count) {
					
						vkhelper.plugins.suggestsWall.vk_script.params.loading = false;
						vkhelper.plugins.suggestsWall.vk_script.params.loadGid = 0;
				
						hideProgress(document.querySelector('#ui_rmenu_category_suggests_'+ gid +' span.fl_r'));
						
						if (js) {
							eval(js);
						}
						
						cur.wallMyDeleted = {};
						
						vkhelper.plugins.suggestsWall.vk_script.functions.createPage(decodeURI(nameEncode));
						val('groups_list_content_suggests', rows);
						
						jQuery('#groups_list_content_suggests div.page_block.no_posts').hide();
						jQuery('#groups_list_content_suggests > div.post').show();
					}
				});
				
				return false;
				
			}
		
		}
		
	},
	
	bg_script : {
		
		messages : {
		
			'vkhelper_plugins_suggestsWall_init' : function (details, tab_id, callback) {
			
				task.add('first', {
					initiator : 'suggestsWall.bg.msg.vkhelper_plugins_suggestsWall_init',
					isVisible : false
				}, function(task_id, task_callback) {
				
					var groups = [];

					function success() {
						
						messages.sendToVk({
							type : 'vkhelper_plugins_suggestsWall_init_success',
							details : {
								groups : groups
							}
						}, tab_id);
							
						task_callback();
						return false;		
					}

					function go() {
						
						// выбираем сообщества, в которых еще не определено кол-во постов
						
						var f = groups.filter(function(params) {
							return params.count == undefined;
						}).map(function(params) {
							return params.id;
						});
						
						// если таких сообществ нет, т.е. уже для всех определили
						if (f.length == 0) {
							success();
							return;
						}
						
						f = f.splice(0, 19);
						
						
						var code = '\
							var res = []; \
							var groups = ['+ f.join(',') +']; \
							var i = 0; \
							while (i < groups.length) { \
								var u = API.wall.get({"owner_id" : -groups[i], "count" : 1, "filter" : "suggests" }); \
								res.push(u.count); \
								i = i + 1; \
							} \
							return res; ';
						
						VK.api('execute', {
							code : code
						}, {
							uid : details.uid,
							task_id : task_id
						}, function(response) {
									
							if (response.status != 'success') {
								success();
								return false;
							}
							
							jQuery.each(groups, function (k,v) {
									
								var a = jQuery.inArray(v.id, f);
									
								if (a > -1) {
									groups[k].count = response.details[a]; 
								}
									
							});
								
							go();
							
						});
					
					}

					VK.api('groups.get', {
						extended : 1,
						filter : 'editor',
						count : 1000
					}, {
						uid : details.uid,
						task_id : task_id
					}, function(response) {
								
						if (response.status != 'success') {
							task_callback();
							return false;
						}
						
						groups = response.details.items.map(function(params) {
							return {
								id : params.id,
								name : params.name
							};
						});
						
						go();
						
					});
							
				});	
				
			}
			
		}
			
	}
	
};

vkhelper_plugins_list['imAutoPlayGif'] = {
	
	lang : {
		ru : {
			cat : 'Другое',
			title : 'Автоплей анимаций в диалогах',
			description : 'Автоматически воспроизводить GIF-анимации на странице с диалогами',
			
			aboutLink : 'http://vk-helper.pro/?p=page/instruction&type=58'
		},
		en : {
			cat : 'Other',
			title : 'Autoplay animations in dialogs'
		}
	},
	
	storage : {	
		enabled : false
	},
	
	vk_script : {
		
		on : function () {
		
			vkhelper.mutationObserver.add('imAutoPlayGif', function() {
					
				jQuery('#content a.photo.page_doc_photo_href:not([imAutoPlayGif])').each(function() {
				  	
				  	jQuery(this).attr('imAutoPlayGif', '1');
				  		
					Page.showGif(this);
					
				});
					
			}); 
			
		},
		
		off : function () {
		
			vkhelper.mutationObserver.remove('imAutoPlayGif');
			
		}
		
	}
	
};

vkhelper_plugins_list['updatePhoto'] = {
	
	lang : {
		ru : {
			cat : 'Другое',
			title : 'Замена фотографий без потери лайков',
			description : 'Вы сможете изменять фотографии без потери лайков и без изменения даты добавления.<br><br>Откройте нужную фотографию, нажмите "<b>Еще</b>" под фотографией и в открывшемся меню используйте пункт "<b>Загрузить новую фотографию</b>"<br><br><img src="https://vk-helper.pro/image/options/updatePhoto_1.jpg" width="412" height="310">',
			
			aboutLink : 'http://vk-helper.pro/?p=page/instruction&type=60',
			
			labelMenu : 'Загрузить новую фотографию',
			linkMainPhoto : 'Обновить текущую фотографию БЕЗ ПОТЕРИ ЛАЙКОВ',
			
			openBoxTitle : 'Обновить фотографию без потери лайков',
			openBoxContent : 'Выберите изображение в формате JPG, GIF или PNG.',
			openBoxButton : 'Выбрать изображение',
			openBoxError : '<b>К сожалению, произошла ошибка</b>.<br>Попробуйте загрузить изображение другого размера. Если ошибка не пропадает, то загрузите изображение точно таких же размеров как и предыдущее.'			
		},
		en : {
			cat : 'Other',
			title : 'Replacing photos without losing your likes',

			labelMenu : 'Upload a new photo',
			linkMainPhoto : 'Update current photo not changing the counter of likes',
			
			openBoxTitle : 'Update current photo not changing the counter of likes',
			openBoxContent : 'Select an image in JPG, GIF or PNG format.',
			openBoxButton : 'Select an image',
			openBoxError : '<b>Sorry, an error occurred.</b>.<br>Try uploading a different size image. If the error does not disappear, then load the image exactly the same size as the previous one.'			
		}
	},
	
	storage : {	
		enabled : false
	},
	
	css : function () {
		/*
		#pv_more_acts_tt .vkhelper_ph_copy_search.pv_more_act_item:before {\
    		display: none;\
		}\
		#pv_more_acts_tt .vkhelper_ph_copy_search.pv_more_act_item {\
    		padding: 8px 10px;\
		}\
		html.vkhelper_plugin_photoCopySearch .vkhelper_ph_copy_search_links {\
    		padding-left: 0px;\
		}\
		#pv_more_acts_tt div.pv_counter.vkhelper_ph_copy_search_label.pv_more_act_item:before {\
    		background-image: none;\
		}\
		html.vkhelper_plugin_photoCopySearch #pv_more_acts_tt div.pv_counter.vkhelper_ph_copy_search_label.pv_more_act_item {\
    		padding-left: 0px;\
    		cursor: default;\
		}\
		html:not(.vkhelper_plugin_photoCopySearch) .vkhelper_ph_copy_search_links, \
		html:not(.vkhelper_plugin_photoCopySearch) #pv_more_acts_tt div.pv_counter.vkhelper_ph_copy_search_label.pv_more_act_item {\
			display: none;\
		}
		*/
	},

	vk_script : {
		
		on : function () {
		
			vkhelper.mutationObserver.add('updatePhoto', function() {
					
				jQuery('#pv_more_act_pe:not([updatePhoto])').each(function() {
				  	
				  	var $this = jQuery(this).attr('updatePhoto', '1');
				  		
				  	$this
				  		.before('\
				  		<div class="pv_more_act_item" onmouseover="" onclick="vkhelper.plugins.updatePhoto.vk_script.functions.openBox(cur.pvCurPhoto.id);" id="pv_more_act_as_title">\
				  			'+ vkhelper.lang.get('updatePhoto', 'labelMenu') +'\
				  		</div>');
										
					new ElementTooltip(geByClass1("pv_actions_more")).show();
					
				});
				
				jQuery('#owner_photo_upload_desc:not([updatePhoto])').each(function() {
				  	
				  	var $this = jQuery(this).attr('updatePhoto', '1');
				  		
				  	$this.after('\
				  		<div class="owner_photo_desc">\
				  			<a href="#" onclick="vkhelper.plugins.updatePhoto.vk_script.functions.openBox(jQuery(\'#profile_photo_link\').attr(\'href\').substr(6)); return false;">\
				  				'+ vkhelper.lang.get('updatePhoto', 'linkMainPhoto') +'\
				  			</a>\
				  		</div>');
					
				});
					
			}); 
			
		},
		
		off : function () {
		
			vkhelper.mutationObserver.remove('updatePhoto');
			
		},
		
		functions : {
		
			openBox : function (pid) {
			
				var box = new MessageBox({
						title : vkhelper.lang.get('updatePhoto', 'openBoxTitle'), 
						width : 600, 
						hideButtons : 1, 
						grey : 1
					})
					.content('\
						<div class="owner_photo_box ">\
							<div class="owner_photo_content">\
								<div id="vkhelper_owner_photo_error" class="error" style="overflow: visible; margin-top: 18px; margin-bottom: 2px; padding-top: 7px; padding-bottom: 9px; display: none;">\
									<div class="msg_text">\
										'+ vkhelper.lang.get('updatePhoto', 'openBoxError') +'\
										<br><br><div data-info="1"></div>\
									</div>\
								</div>\
								<div id="vkhelper_owner_photo_upload_desc" class="owner_photo_desc" style="font-size: 14px; padding: 12px 0 15px; text-align: center; line-height: 150%;">\
									'+ vkhelper.lang.get('updatePhoto', 'openBoxContent') +'\
								</div>\
								<div class="owner_photo_input_wrap" style="margin: 20px auto; text-align: center;">\
									<div id="vkhelper_owner_photo_input"><center><img src="/images/progress7.gif"></center></div>\
								</div>\
								<div id="vkhelper_upd_photo_progress" style="display:none">\
									<center><img src="/images/progress7.gif"></center><br>\
								</div>\
							</div>\
						</div>')
					.show();
				
				
				if (window.stManager) {
					
					stManager.add('upload.js',function(){
				
						ajax.post('al_photos.php', {
							act: 'edit_photo',
							al: 1,
							photo: pid
						}, {
					
							onDone: function(a,b,t,d) {
						
								var upload_url=t.match(/"upload_url":"(.*)"/),
									hash=t.match(/', '([a-f0-9]{18})'\)/),
									aid=t.match(/selectedItems:\s*\[(-?\d+)\]/)[1],
									upload_url = upload_url[1].replace(/\\\//g, '/').split('"')[0];
									
								Upload.init('vkhelper_owner_photo_input', upload_url, {}, {
									file_name: 'photo',
									file_size_limit: 1024 * 1024 * 5,
									file_types_description: 'Image files (*.jpg, *.jpeg, *.png, *.gif)',
									file_types: '*.jpg;*.JPG;*.jpeg;*.JPEG;*.png;*.PNG;*.gif;*.GIF',
									onUploadStart:function(){
										jQuery('#vkhelper_upd_photo_progress').show();
										jQuery('#vkhelper_owner_photo_input').hide();
										jQuery('#vkhelper_owner_photo_error').hide();
									},
									onUploadComplete: function(u,res){
									
										var data = {};
										try{
											data = JSON.parse(res);
										}catch(e){ }
										
										if (data.error){
											jQuery('#vkhelper_upd_photo_progress').hide();
											jQuery('#vkhelper_owner_photo_input').show();
											jQuery('#vkhelper_owner_photo_error').show();
											jQuery('#vkhelper_owner_photo_error div[data-info="1"]').html(data.error);
											
											Upload.onUploadError(data.error);
											return;
										}
										
            	         				var params = {
            	            				'_query' 	 : res,
            	            				'act' 	 	 : 'save_desc',
            	            				'aid' 	 	 : aid,
            	            				'al' 	 	    : 1,
            	            				'conf' 	 	 : '///',
            	            				'cover'  	 : '',
            	            				'filter_num' : 0,
            	            				'hash' 		 : hash[1],
            	            				'photo'		 : pid,
            	            				'text' 		 :''
            	         				};
                     				
            	         				ajax.post('/al_photos.php', params,{
            	         					onDone: function(text, album, photoObj, thumb) {
            	         						box.hide();
                     						
            	         						showDoneBox('Успешно');
                     						
            	         						if (photoObj && thumb) {
            	         							if (typeof FiltersPE != 'undefined'){
            	         								FiltersPE.changeThumbs(thumb);
            	         							}
                	     							if (typeof Filters != 'undefined'){
                	     								Filters.changeThumbs(thumb);
                	     							}
                	     						}
                	     					}
                	     				});
                	     			
                	     			},
                	     			lang: { "button_browse": vkhelper.lang.get('updatePhoto', 'openBoxButton') }
                	     		});
                	     		
                	     	}
   				
   						});
						
   					});
   				}
   	
			}
			
		}
		
	}
	
};

vkhelper_plugins_list['nightTheme'] = {
	
	lang : {
		ru : {
			cat : 'Интерфейс',
			title : 'Ночная тема',
			description : 'Рекомендуется включать ночной режим при использовании соц. сети в ночное время.',
			
			aboutLink : 'http://vk-helper.pro/?p=page/instruction&type=57'
		},
		en : {
			cat : 'Interface',
			title : 'Night theme'
		}
	},
	
	storage : {	
		enabled : false
	},
	
	css : function () {
		/*
		body{background:#282B2F;color:#E0E0E0}a{color:#fff}*::selection{background:#9ECDFF}*::-moz-selection{background:#9ECDFF}#side_bar ol li .left_row{color:#fff}.fakeinput,.fakeinput~.placeholder .ph_input,div[contenteditable=true],div[contenteditable=true]~.placeholder .ph_input,input.big_text,input.big_text~.placeholder .ph_input,input.dark,input.dark~.placeholder .ph_input,input.search,input.search~.placeholder .ph_input,input.text,input.text~.placeholder .ph_input,textarea,textarea~.placeholder .ph_input{color:#fff}.im-page .im-page--mess-search{color:#FFF}.left_count_wrap{background:#484B4E;color:#FFF}.im-page .im-page--peer{color:#fff}.vkf-new-design #vkf-url-shortener-input{color:#fff}.post_video_title{color:#737578 !important}.nim-dialog .nim-dialog--name .nim-dialog--name-w{color:#fff}.nim-dialog--text-preview{color:#737578}.page_block{background:#373B3E}.nim-dialog.nim-dialog_unread.nim-dialog_muted .nim-dialog--unread,.nim-dialog.nim-dialog_unread.nim-dialog_prep-injected.nim-dialog_muted .nim-dialog--unread{background:#F05C44}.nim-dialog.nim-dialog_unread .nim-dialog--unread,.nim-dialog.nim-dialog_unread.nim-dialog_prep-injected .nim-dialog--unread{background:#F05C44}.nim-dialog_selected._im_dialog_selected.nim-dialog.nim-dialog_unread .nim-dialog--unread,.nim-dialog.nim-dialog_unread.nim-dialog_prep-injected .nim-dialog--unread{background-color:#fff}.im-page .im-page--center-empty{background:url(https://habrastorage.org/web/6f4/51e/a60/6f451ea606d24b528336b89ec8aa2b98.png)no-repeat top;color:#737578}.video_upload_separator_text{background-color:#373B3E;color:#777}.video_upload_separator_line{background-color:#494D50}.scrollbar_inner{background:#7E8082}.scrollbar_inner:hover{background:#BEBFC0}.ui_search_input_block{background:#373B3E}.im-page .im-page--dialogs-footer.ui_grey_block{background:#373B3E}.fakeinput,div[contenteditable=true],input.big_text,input.dark,input.search,input.text,textarea{background:#373B3E}.im-page .im-page--history-new-bar:after,.im-page .im-page--history-new-bar:before{background:#f66}.im-page .im-page--history-new-bar{color:#f66}.im-mess.im-mess_selected,.im-mess.im-mess_selected:hover{background:#494D50}.im-mess.im-mess_selected:last-child:before,.im-mess.im-mess_unread:last-child:before{background:#494D50}#side_bar ol li .left_row:hover{background:#3E4144}.im-mess.im-mess_selected+.im-mess:before,.im-mess.im-mess_unread+.im-mess:before{background:#494D50}.im-mess-stack .im-mess-stack--content .im-mess-stack--pname a{color:#7E8082}.nim-dialog.nim-dialog_muted.nim-dialog_selected,.nim-dialog.nim-dialog_selected{background:#7293b6 !important}.nim-dialog.nim-dialog_hovered,.nim-dialog:hover{background:#494D50}.nim-dialog:hover .nim-peer.nim-peer_online .nim-peer--online{border-color:#494D50}.nim-dialog:hover .nim-peer.online:after{border-color:#494D50}.nim-dialog.nim-dialog_hovered .nim-dialog--photo .online.mobile:after,.nim-dialog:hover .nim-dialog--photo .online.mobile:after{background-color:#494D50}.online.mobile:after{background-color:#373B3E}.nim-dialog.nim-dialog_hovered,.nim-dialog.nim-dialog_hovered+.nim-dialog,.nim-dialog:hover,.nim-dialog:hover+.nim-dialog{border-color:#484B4E}.vkf-new-design.vkf-highlight-unread-im .im-mess_unread{background:#494D50 !important}.nim-dialog.nim-dialog_selected .nim-peer.nim-peer_online .nim-peer--online{border-color:#7293b6}.nim-dialog.nim-dialog_selected .nim-peer.nim-peer_online .nim-peer--online .nim-dialog:hover .nim-peer.online:after{border-color:#7293B6}.im-mess.im-mess_light{background:#494D50;border-radius:2px}.im-mess .im-mess--btn{color:#737578}.im-page .im-page--history-new-bar{background:#373B3E}.im-page .im-page--history-new-bar>span{background:#373B3E}.im-fwd .im-fwd--messages{color:#737578}.im_rc_emojibtn:hover{background:#494D50}.ads_ad_box.redesign .ads_ad_description{color:#8C8F95}a._im_start_new{color:#ccc}.ads_ad_box_border{border-color:#484B4E}.page_doc_row .page_doc_title{color:#C4D1DE}.mention_tt_actions{background-color:#282B2F;border-top-color:#484B4E}.tt_w{color:#C4D1DE}.im-page .im-page--mess-search{border-top-color:#484B4E;border-bottom-color:#484B4E;background:#373B3E}.im-page .im-page--mess-search:hover{background:#494D50}.box_controls{background-color:#373B3E;border-top-color:#484B4E}.wall_reasons_list{color:#FFF;padding-top:11px;margin-bottom:-3px}.wall_module a.page_media_link_title,.wall_module span.page_media_link_title{color:#C4D1DE}.nim-dialog .nim-dialog--preview-attach{color:#C4D1DE}.wall_copy_more,.wall_post_more,.wall_reply_more{color:#C4D1DE}.wall_module .media_desc .a{color:#C4D1DE}.wall_tt .like_tt_bottom{background:#282B2F;border-top-color:#484B4E}.cal_table{color:#FFF;border-color:#484B4E;box-shadow:0 1px 3px rgba(0, 0, 0, .6);background-color:#373B3E}.cal_table .daysofweek{background-color:#282B2F;color:#FFF}.im-search .cal_table .past_day.day,.im-search .cal_table .today.day{color:#989898}.cal_table .day.sel,.cal_table .day.sel.hover{background-color:#484B4E;border-color:#8EA8C7;line-height:28px}.im-search .cal_table .day{color:#FFF}.im_cal_clear{background:#282B2F}.im_cal_clear_lnk{color:#B7B7B7}.im-mess.im-mess_search:hover{background:#494D50}.im-page .im-page--header{background:#373B3E}.cal_table .day.hover{background-color:#494D50}.nim-dialog.nim-dialog_typing .nim-dialog--typing{color:#C4D1DE}.video_item .video_item_thumb_wrap{background-color:#373B3E}.im-submit-tt .im-submit-tt--title{color:#FFF}.im-page .im-page--header,.im-page .im-page--search-header{background-color:#373b3e;border-bottom-color:#484b4e}.nim-dialog:not(.nim-dialog_deleted).nim-dialog.nim-dialog_classic.nim-dialog_unread,.nim-dialog:not(.nim-dialog_deleted).nim-dialog.nim-dialog_hovered,.nim-dialog:not(.nim-dialog_deleted).nim-dialog:hover,.nim-dialog:not(.nim-dialog_deleted).nim-dialog_hovered+.nim-dialog,.nim-dialog:not(.nim-dialog_deleted).nim-dialog_unread.nim-dialog_classic+.nim-dialog,.nim-dialog:not(.nim-dialog_deleted):hover+.nim-dialog{border-top-color:#494d50}.box_body .im_stickers_store_wrap .ui_tabs{border-color:#484B4E}.im_stickers_store_wrap .ui_tabs{background-color:#282B2F}.im_stickers_bl_wrap{background-color:#373B3E}.im_sticker_bl{background-color:#494D50}.im_sticker_bl_name{color:#fff}.ui_tab_plain{color:#C4D1DE}.im_stickers_my_tip{background-color:#282B2F;color:#fff}.im_stickers_my_row~.im_stickers_my_row{border-top-color:#484B4E}.im_stickers_my_name{color:#FFF}.im-chat-placeholder{background-color:#484B4E}.im-dropbox{background:#373B3E;color:#7E8082}.im-dropbox .im-dropbox--inner{border-color:#7E8082}.media_preview_has_medias{border-bottom-color:#484B4E}.im-dropbox.dropbox_over .im-dropbox--inner{background-color:#494D50}.im_stickers_my_row.sort_taken,.im_stickers_my_row.sort_taken:last-child{border-top-color:#494D50;background-color:#494D50}.im_stickers_buy_header{background-color:#282B2F;border-bottom-color:#484B4E}.im_stickerpack_name{color:#FFF}.im_stickers_store_wrap .flat_button.secondary,.im_stickers_store_wrap .flat_button.secondary:active,.im_stickers_store_wrap .flat_button.secondary:hover{background-color:#646A6F;color:#BBC8D2}.dropbox{background-color:#373B3E}#photos_choose_upl{background-color:#282B2F}.box_body{background-color:#373B3E}.web_cam_photo{background-color:#373B3E}.photo_upload_separator{background-color:#373B3E}.photos_choose_upload_area_enter .photos_choose_upload_area{background-color:#282B2F}.im-create{background:#373B3E}.ui_tabs{border-bottom-color:#484B4E}.im-create .im-create--tabs{background:#373B3E}.ui_grey_block{background:#373B3E;border-top-color:#484B4E}.ui_search{border-bottom-color:#484B4E}input.ui_search_field{color:#fff}.im-page-btn{color:#fff}.ui_multiselect_cnt .token .token_title,.ui_search_filters_pane .token .token_title{color:#fff}.ui_multiselect_cnt .token,.ui_search_filters_pane .token{background-color:#494D50}.im-mess.im-mess_unread{background:#494D50}.nim-dialog.nim-dialog_simple.nim-dialog_hovered,.nim-dialog.nim-dialog_simple:hover{background:#494D50}.ms_items_more{background:#373B3E;border-color:#484B4E}.ms_items_more_wrap.to_up .ms_items_more:before{border-top-color:#484B4E}.ms_items_more_wrap.to_up .ms_items_more:after{border-top-color:#373B3E}.media_selector .ms_items_more .ms_item:hover{background-color:#494D50}.page_block{box-shadow:0 1px 0 0 #484B4E, 0 0 0 1px #484B4E}#side_bar .more_div{border-top-color:#484B4E}.leave_redesign{border-top-color:#484B4E}.im-page .im-page--header{border-bottom-color:#484B4E}.nim-dialog .nim-dialog--content{border-top-color:#484B4E}.im-chat-input .im-chat-input--text{border-bottom-color:#484B4E}.im-chat-input .im-chat-input--text:focus{border-bottom-color:#7E8388}.im-page .im-page--dialogs-footer{border-top-color:#484B4E}.im-chat-input{border-top-color:#484B4E}.im-page .im-page--header-chat{border-bottom-color:#484B4E}.im_fwd_log_wrap,.im_wall_log_wrap{border-left-color:#484B4E}.wall_module .copy_quote{border-left-color:#484B4E}.nim-dialog .nim-dialog--photo{border-color:#373B3E}.nim-peer.nim-peer_online .nim-peer--online{border-color:#373B3E}input.text.ts_input:focus{background-color:#254469;color:#FFF}.ts_cont_wrap{background:#373B3E;border-color:#484B4E}.ts_contact_photo.online.mobile:after{background-color:#373B3E}.ts_contact_photo.online:after{border-color:#373B3E}a.ts_contact.active,a.ts_search_link.active{background:#494D50}.ts_contact.active .ts_contact_photo.online:after{border-color:#494D50}.ts_contact.active .ts_contact_photo.online.mobile:after{background-color:#494D50}.ts_contact_name{color:#FFFFFF}.ts_cont_wrap{box-shadow:0 1px 4px rgba(0, 0, 0, 0.47)}.ts_search_sep{border-top-color:#484B4E}em.ts_clist_hl{background:#494D50}.pv_liked .pv_like_count{color:#fff}.pv_like._like_wrap.pv_liked > span.pv_like_link._link{color:#fff}.pv_like_count{color:#C4D1DE}.wall_module .my_like .post_like_count,.wall_module .my_share .post_share_count{color:#fff}.groups_blocked img{border-radius:3px;-webkit-filter:grayscale(1) opacity(0.7);filter:grayscale(1) opacity(0.7)}.tt_default,.tt_default_right{border-color:#484B4E;background:#373B3E}.ui_actions_menu_item{color:#fff}
.tt_default.tt_down::before{border-top-color:#484B4E}.tt_default.tt_down::after{border-top-color:#373B3E}.ui_actions_menu_item:hover{background-color:#494D50}.ui_tabs.ui_tabs_box{border-color:#484B4E;background-color:#282B2F}.ui_tab_sel,.ui_tabs .ui_tab_sel,.ui_tabs_box .ui_tab_sel{color:#FFF}.tt_default.tt_up:before{border-bottom-color:#484B4E}.tt_default.tt_up:after{border-bottom-color:#373B3E}.emoji_sprite{background-image:url(https://habrastorage.org/web/2fb/fc1/c58/2fbfc1c586b54b4f81165d57b27df4f1.png);background-repeat:no-repeat}.emoji_tabs{background:#282B2F}.emoji_tabs_l_s,.emoji_tabs_r_s{background:#282B2F}.emoji_tab_sel,.emoji_tab_sel:hover{background:#373B3E}.emoji_bg{background:#494D50}.emoji_tt_wrap{background-color:#373B3E;border-color:#484B4E}.emoji_tab:hover{background:#494D50}.emoji_tabs_l_s:hover,.emoji_tabs_r_s:hover{background:#494D50}.emoji_tt_wrap.tt_down:after{border-top-color:#282B2F}.emoji_tt_wrap.tt_down:before{border-top-color:#484B4E}.emoji_shop:hover{background:#494D50}.emoji_shop_icon_badge{border-color:#282B2F}.emoji_shop:hover .emoji_shop_icon_badge{border-color:#494D50}.sticker_hints_tt{box-shadow:0 1px 3px rgba(0, 0, 0, .6);background-color:#373b3e;border-color:#484b4e}.sticker_hints_arrow{background-color:#373b3e;border-left-color:#484b4e}.sticker_hints_arrow:hover{background-color:#494d50}.ui_actions_menu{background:#373B3E;border-color:#484B4E}.ui_actions_menu_sep{border-top-color:#484B4E}.ui_actions_menu:before{border-bottom-color:#484B4E}.ui_actions_menu:after{border-bottom-color:#373B3E}#top_profile_menu:before{border-bottom-color:#484B4E}#top_profile_menu:after{border-bottom-color:#373B3E}.emoji_tt_wrap.emoji_no_tabs.tt_down:after{border-top-color:#373B3E}.emoji_sticker_item:hover{background:#494D50}.mott_header a,.verified_tt_header a{color:#FFF}.tt_default.verified_tt.tt_up:before{border-bottom-color:#484B4E}.tt_default.verified_tt.tt_up:after{border-bottom-color:#373B3E}#top_notify_wrap{background:#373B3E;border-color:#484B4E}.top_notify_show_all{background-color:#373B3E;border-top-color:#484B4E}.feed_row+.feed_row_fb_hidden .feedback_row:first-child,.feed_row~.feed_row .feedback_row,.feed_row~.feed_row .feedback_sticky_row,.feedback_sticky_rows:not(:empty)+.feed_row .feedback_row{border-top-color:#484B4E}.top_notify_header{background-color:#373B3E;color:#C4D1DE;border-bottom-color:#484B4E}.feedback_header .author,.feedback_header .group_link,.feedback_header .mem_link{color:#fff}.feedback_photo_icon{background-color:#373B3E;border-color:#373B3E}#top_notify_wrap{box-shadow:0 1px 3px rgba(0, 0, 0, 0.6)}#top_notify_wrap:before{border-bottom-color:#484B4E}#top_notify_wrap:after{border-bottom-color:#373B3E}.top_notify_show_all:hover{background-color:#494D50}.top_notify_cont .feedback_row:hover{background-color:#494D50}.feedback_row_wrap.unread{background-color:#373B3E}.feedback_row_wrap.unread .feedback_photo_icon{background-color:#373B3E;border-color:#373B3E}.feedback_row_clickable:not(.feedback_row_touched):hover{background-color:#494D50}.top_notify_cont .feedback_row:hover .feedback_photo_icon{border-color:#494D50}.feedback_sticky_row.unread{background-color:#494D50}.feedback_sticky_row.unread{background-color:#494D50}.feedback_sticky_row.unread{background-color:#494D50}.feedback_sticky_actions .feedback_sticky_menu .ui_actions_menu:before,.ui_actions_menu_dummy_wrap.feedback_sticky_menu .ui_actions_menu:before{border-bottom-color:#484B4E}.feedback_sticky_actions .feedback_sticky_menu .ui_actions_menu:after,.ui_actions_menu_dummy_wrap.feedback_sticky_menu .ui_actions_menu:after{border-bottom-color:#373B3E}.top_notify_cont{color:#FFF}.feedback_sticky_text .group_link,.feedback_sticky_text .mem_link{color:#C4D1DE}.feedback_sticky_row.hover,.feedback_sticky_row:hover{background-color:#494D50}.feed_row~.feed_row .feedback_row_clickable:not(.feedback_row_touched):hover{border-top-color:#484B4E}.feedback_row_clickable:not(.feedback_row_touched):hover{border-bottom-color:#484B4E}#all_shown{border-top-color:#484B4E}.feed_article_title{color:#C4D1DE}.wall_module td.page_media_link_thumb{box-shadow:0 0 0 1px rgb(94, 97, 100) inset}.top_notify_cont .feedback_header{color:#808080}.mention_tt_online{color:#BBE6AC}.mention_tt.mention_has_actions.tt_default.tt_down:after{border-top-color:#282B2F}.wl_replies_header_progress{background-color:#373B3E;border-color:#484B4E}.feedback_row_answer{background-color:#494D50;border-color:#5E6265}.feedback_row_answer:before{border-bottom-color:#5E6265}.feedback_row_answer:after{border-bottom-color:#494D50}.feedback_row_wrap.reply_box_open{background-color:#494D50;border-bottom-color:#484B4E}.feed_row~.feed_row .feedback_row_wrap.reply_box_open{border-top-color:#494D50}.feedback_row_wrap.reply_box_open .reply_box:before{border-bottom-color:#484B4E}.feedback_row_wrap.reply_box_open .reply_box:after{border-bottom-color:#373B3E}.feedback_row_wrap.reply_box_open .submit_post,.feedback_row_wrap.reply_box_open:hover{background-color:#494D50}.tt_w.top_notify_tt{background-color:#373b3e;border-color:#484b4e}.tt_w.top_notify_tt.tt_up:before{border-bottom-color:#484b4e}.tt_w.top_notify_tt.tt_up:after{border-bottom-color:#373b3e}.notify_tt_text .group_link,.notify_tt_text .mem_link{color:#fff}.page_block #all_shown{border-top-color:#484b4e}.feedback_unread_bar{border-top-color:#484b4e;border-bottom-color:#484b4e;background-color:#373b3e;color:#fff}.feedback_row_wrap.unread:not(.feedback_row_touched){background-color:#494d50}.top_notify_cont .feedback_row:not(.dld):hover{background-color:#494d50}.top_notify_cont .feedback_row:not(.dld):hover .feedback_photo_icon{border-color:#494d50}.top_notify_cont .feedback_row_menu .ui_actions_menu:before,.ui_actions_menu_dummy_wrap.feedback_row_menu .ui_actions_menu:before{border-bottom-color:#494d50}.top_notify_cont .feedback_row_menu .ui_actions_menu:after,.ui_actions_menu_dummy_wrap.feedback_row_menu .ui_actions_menu:after{border-bottom-color:#373b3e}#top_profile_menu{background:#373B3E;border-color:#484B4E;box-shadow:0 1px 3px rgba(0, 0, 0, 0.6)}.top_profile_mrow{color:#fff}.top_profile_sep{border-top-color:#484B4E}.top_profile_mrow:hover{background-color:#494D50}.audio_page_player{background-color:#373B3E;border-bottom-color:#484B4E}.audio_layout{color:#fff}.eltt{background-color:#373B3E;border-color:#484B4E;box-shadow:0 1px 3px rgba(0, 0, 0, 0.3)}.audio_layer_bottom{background-color:#373B3E;border-top-color:#484B4E}.audio_page_player .audio_page_player_title{color:#FFF}.audio_friends_list{background-color:#373B3E}.eltt.eltt_up:after{border-bottom-color:#373B3E}.eltt.eltt_up:before{border-bottom-color:#484B4E}.audio_page_player .audio_page_player_duration{color:#7E8082}.top_audio_layer .audio_layer_rows_cont{border-right-color:#484B4E}.ui_rmenu_item,.ui_rmenu_subitem{color:#E0E0E0}.ui_rmenu_item:hover,.ui_rmenu_subitem:hover,.ui_rmenu_item_sel,.ui_rmenu_item_sel:hover{background-color:#494D50}.ui_rmenu_item_sel,.ui_rmenu_item_sel:hover{color:#FFF}.audio_row.lyrics .audio_title_inner{color:#C0DBF7}.ui_suggester_results_list{background-color:#373B3E;border-color:#484B4E;box-shadow:0 1px 3px rgba(0, 0, 0, 0.6)}.ui_suggester_results_list ul li{color:#FFF}.audio_search_focused .audio_performer>em,.audio_search_focused .audio_title>em{background-color:#6E7275}.ui_suggester_results_list ul li.active,.ui_suggester_results_list ul li:hover{background:#494D50;color:#FFF}.ui_search_fltr{background:#373B3E;border-color:#484B4E;box-shadow:0 1px 3px rgba(0, 0, 0, .6);color:#fff}.ui_search_fltr_label{color:#FFF}.flat_button.ui_load_more_btn{color:#FFF;background-color:#494D50;border-top-color:#484B4E}.ui_search_filters_pane{border-top-color:#484B4E;background-color:#373B3E}.selector_container{background:#494D50}.selector_container td.selector input.focused,.selector_container td.selector input.selected{color:#FFF}.selector_container table.selector_table{border-color:#484B4E;background-color:#373B3E}.selector_focused table.selector_table{border-color:#484B4E;background-color:#373B3E}.ui_search_fltr:after{border-bottom-color:#373B3E}.ui_search_fltr:before{border-bottom-color:#484B4E}.friends_possible_block.button_gray button,.flat_button.secondary{background-color:#494d50;color:#FFF}.button_gray button.hover,.button_gray button:hover,.flat_button.secondary.hover,.flat_button.secondary:hover{background-color:#60758A}#audio_status_tt .audio_share_cont{background-color:#373B3E;border-top-color:#484B4E}.box_title_wrap.box_grey{background-color:#6287AE;color:#FFF;border-bottom-color:#484B4E}.box_title_wrap.box_grey .box_title{color:#FFF}.box_body{background-color:#373B3E}.subheader{color:#AFAFAF}.ui_tabs_header{background-color:#373B3E}#audio_new_cont ul.listing li span{color:#FFF}.tabbed_box .summary_tab .summary_tab3,.tabbed_box .summary_tab_sel .summary_tab3,.tabbed_box .summary_tab_sel a,.tabbed_box .summary_tab a{color:#65686c}.tabbed_box .summary_tab .summary_tab3,.tabbed_box .summary_tab_sel .summary_tab3,.tabbed_box .summary_tab_sel a,.tabbed_box .summary_tab a{color:#FFFFFF}.tabbed_box .summary_tabs{border-bottom-color:#484B4E}.olist_item_wrap{border-bottom-color:#484B4E}.olist.audio_album .olist_item_performer{color:#FFF}.olist.audio_album .olist_item_title{color:#BBB}.box_controls .flat_button.secondary,.flat_button.secondary.button_light{color:#bbb}.olist_item_wrap em{background:#47698F}.olist_item_wrap:hover{border-top-color:#373B3E;background-color:#494D50}.tabbed_box .summary_tab .summary_tab3:hover,.tabbed_box .summary_tab_sel .summary_tab3:hover,.tabbed_box .summary_tab_sel a:hover,.tabbed_box .summary_tab a:hover{background-color:#373B3E}.olist_botsh .box_controls{border-top-color:#484B4E}#album_name_wrap{background-color:#282B2F;border-bottom:1px solid #484B4E;padding:20px 0;text-align:center}.tabbed_box .summary_tab_sel .summary_tab2{background-color:#373B3E}.box_controls .flat_button.secondary:hover,.flat_button.secondary.button_light:hover{background-color:#494D50}
.ui_search.ui_search_fixed{border-color:#484B4E;box-shadow:0 2px 3px -1px rgba(0, 0, 0, 0.6)}.ui_search_custom_link{color:#c4d1de}.search_sep{border-top-color:#484B4E}.friends_import_header{color:#FFF}.invite_box_text{border-bottom-color:#484B4E;color:#FFF}.invite_box .label{color:#FFF}.ui_ownblock_label{color:#FFF}div.box_body.box_no_buttons{background-color:#373B3E !important}.audio_edit_label{color:#FFF}.audio_edit_input.chk{color:#FFF}.audio_page_player .audio_page_player_next .icon,.audio_page_player .audio_page_player_prev .icon{-webkit-filter:brightness(1.5) grayscale(0.2);filter:brightness(1.5) grayscale(0.2)}.audio_page_player .audio_page_player_btns .icon{-webkit-filter:brightness(1.5) grayscale(0.2);filter:brightness(1.5) grayscale(0.2)}.audio_hq_label{-webkit-filter:brightness(1.5) grayscale(0.2);filter:brightness(1.5) grayscale(0.2)}.eltt.eltt_bottom:after{border-bottom-color:#373B3E}.chat_onl_inner{background-color:#373B3E}.chat_tab_wrap:hover{background-color:#494D50}.chat_tab_imgcont.online:after{border-color:#373B3E}.chat_tab_wrap:hover .chat_tab_imgcont.online:after{border-color:#494D50}.chat_tab_imgcont.online.mobile:after{background-color:#373B3E}.chat_tab_wrap:hover .chat_tab_imgcont.online.mobile:after{background-color:#494D50}.fc_tab{border-color:#484B4E;background-color:#373B3E}.fc_msgs{background-color:#494D50;border-color:#282B2F}.fc_msgs_out .fc_msgs{background-color:rgb(83, 116, 150);border-color:#B3B3B3}div.fc_tab_txt{background:#373B3E;border-top-color:#484B4E}.fc_tab_pointer:before{border-left-color:#484B4E}.fc_tab_pointer.fc_tab_pointer_peer:after{border-left-color:#373B3E}#fc_contacts,.fc_content{background:#373B3E}div.fc_clist_filter_wrap{border-top-color:#484B4E;background:#373B3E}#fc_ctabs_cont{border-color:#484B4E}em.fc_clist_hl{background:#47698F}.fc_contact_name{color:#FFF}.chat_cont_sh_bottom,.chat_cont_sh_top{background:-o-linear-gradient(270deg, rgba(216, 223, 230, 0), #373B3E 80%);background:linear-gradient(180deg, rgba(216, 223, 230, 0), #373B3E 80%)}span.fc_contact_photo.online:after{border-color:#373B3E}span.fc_contact_photo.online.mobile:after{background-color:#373B3E}a.fc_contact_over{background-color:#494D50}a.fc_contact_over span.fc_contact_photo.online:after{border-color:#494D50}a.fc_contact_over span.fc_contact_photo.online.mobile:after{background-color:#494D50}.fc_tab_pointer:after{border-left-color:#373B3E}.fc_msgs_unread{background-color:#494D50}.fc_tab_notify{background-color:#494D50;border-bottom-color:#494D50}.fc_tab_wrap{box-shadow:0 1px 3px 0 rgba(0, 0, 0, 0.6)}.submit_post{background:#373B3E;border-top-color:#484B4E}.olist_item_name{color:#FFF}.ui_actions_menu_item:hover{background-color:#494D50}.feed_new_posts{color:#C4D1DE;border-bottom-color:#484B4E}.feed_new_posts:hover{background:#494D50}.post_author .author,.wall_module .author,.wall_module .copy_author{color:#C4D1DE}.post_full_like_wrap{border-top-color:#484B4E}.wall_module .replies_list{border-top-color:#484B4E}.wall_module .reply_box,.wall_module .reply_fakebox_wrap{border-top-color:#484B4E}.replies_open,.wr_header{color:#C4D1DE;background:#494D50}a.wall_reply_greeting{color:#C4D1DE}.post_like,.post_share{color:#C4D1DE}.wall_module .post_like:hover,.wall_module .post_share:hover{background-color:#494D50}.wall_module .reply_fakebox{background:#373B3E}.wall_module .post_like_count,.wall_module .post_share_count{color:#fff}.wall_module .reply~.reply .dld,.wall_module .reply~.reply .reply_wrap{border-top-color:#484B4E}.wall_module .like_count{color:#fff}.wall_module .my_like .like_count,.wall_module .my_share .share_count{color:#C4D1DE}.wall_module .media_desc .lnk .lnk_mail_description{color:#C4D1DE}.wall_module .media_desc .lnk.lnk_mail{border-left-color:#484B4E}.wall_module .media_desc .lnk .lnk_mail_title{color:#A3D1FF}.flat_button.secondary_dark:hover{background-color:#60758A}.flat_button.secondary_dark{background-color:#494D50;color:#fff}.wall_module .page_media_thumbed_link{background-color:#494D50;border-color:#484B4E}.wall_module a.page_media_thumbed_link{cursor:pointer;color:#C4D1DE}.wall_module div.page_media_link_desc{color:#FFF}.ui_actions_menu_sublist .ui_actions_menu_item.checked:hover{background-color:#494D50}.feed_lists_icon .ui_actions_menu:before{border-bottom-color:#484B4E}.feed_lists_icon .ui_actions_menu:after{border-bottom-color:#373B3E}.olist_topsh .olist_filter_wrap{border-color:#484B4E;box-shadow:0 1px 3px 0 rgba(0, 0, 0, 0.6)}.ui_tabs_box .ui_tab_sel .ui_tab_count{color:#C4D1DE}.feed_list_name_wrap{border-bottom-color:#484B4E}.feed_list_name_label{color:#FFF}.replies_side{border-color:#C4D1DE;box-shadow:0 1px 3px rgba(0, 0, 0, .6);background:#494D50 url(https://habrastorage.org/web/a43/ece/4d6/a43ece4d67c341a895458b083c7e6295.png) no-repeat 50% 50%}.replies_side:hover{background-color:#656565}.search_filters_minimized_text{background-color:#373B3E}.search_filter_main,.search_filter_open,.search_filter_shut{color:#FFF}.info_msg{background-color:#494D50;border-color:#737373}.right_list_header{color:#FFF}.ui_rmenu_subitem.ui_rmenu_item_sel,.ui_rmenu_subitem.ui_rmenu_item_sel:hover{color:#C4D1DE}.online:after{border-color:#373B3E}.photos_container .photos_row{border-color:#373B3E}.places_summary{color:#FFF}.pv_comments_header{background:#494D50;color:#C4D1DE}.pv_comments_header:hover{background:#60758A}.replies_open:hover,.wr_header:hover{background-color:#60758A}.mv_controls{background:#373B3E}.mv_title{color:#FFF}.idd_popup{border:1px solid #484B4E;box-shadow:0px 1px 3px rgba(0, 0, 0, .6)}.idd_popup .idd_header_wrap{background-color:#282B2F}.idd_popup .idd_header{color:#C4D1DE}.idd_popup .idd_items_content{background-color:#373B3E}.idd_popup .idd_item{color:#fff}.idd_popup .idd_item:active{background-color:#81888E !important}.idd_popup .idd_item.idd_hover,.idd_popup .idd_item.idd_hover_sublist_parent{background-color:#494D50}.box_controls .flat_button.secondary,.flat_button.secondary.button_light{color:#D2D2D2}.mv_actions_panel{border-bottom-color:#484B4E}.mv_wide_column{border-right-color:#484B4E}.mv_narrow_column{border-left-color:#484B4E}#mv_pl_tt .mv_tt_add_playlist{background-color:#373B3E;border-top-color:#484B4E}#mv_pl_tt .mv_tt_add_playlist:hover{background-color:#494D50}#mv_pl_tt .mv_tt_playlist{color:#FFF}.privacy_dropdown{border-color:#484B4E;box-shadow:0 1px 3px rgba(0, 0, 0, .6)}.privacy_dropdown .header{border-color:#484B4E;color:#DCE1E6;background-color:#282B2F}.privacy_dropdown .body{background:#373B3E}.privacy_dropdown .item,.privacy_dropdown .item_sel,.privacy_dropdown .item_sel_plus{color:#FFF}.privacy_dropdown .item_sel,.privacy_dropdown .item_sel_plus{background-color:#494D50}.privacy_dropdown .l_header .l_header_label{background-color:#282B2F;color:#CECECE}.privacy_dropdown .l_header{background-color:#282B2F}.privacy_dropdown .l_item,.privacy_dropdown .l_item_sel{background:#373B3E;color:#FFF}.flist_sel{background-color:#373B3E;border-bottom-color:#484B4E}.flist_summary{color:#bbb}.flist_item_wrap{border-bottom-color:#484B4E}.flist_item_wrap:hover{border-top-color:#484B4E;background-color:#494D50}.flist_item_name{color:#FFF}.flist_item_action{background:url(https://habrastorage.org/web/96b/5cd/b38/96b5cdb382764f17b7671ea230825248.png) no-repeat 0 -26px}em.highlight{background-color:rgba(126, 187, 255, 0.2)}.mv_recom_block .mv_recom_block_title{color:#FFF}#mv_comments_header{background:#494D50;color:#FFF}.mv_more,.mv_more.idd_wrap{color:#C4D1DE}.mv_comments_summary{border-bottom-color:#484B4E;color:#C4D1DE}.idd_popup .idd_item.idd_hl{background-color:#74797D}a:hover .left_count_wrap{background:#F05C44}.video_choosebox_bottom{background-color:#373B3E;border-top-color:#484B4E}.video_item_title em{background-color:rgba(98, 135, 174, 0.5)}.search_focused .highlight{background-color:#494D50}.mv_comments_restricted_msg{border-top-color:#484B4E}.mv_subscribe_block .mv_subscribe_btn_count{background-color:#494d50;color:#fff}.mv_subscribe_block .mv_subscribe_btn_count:after{border-left-color:#494d50}.mv_is_in_progress{color:#fff;background-color:#484b4e}.mv_desc .can_edit:hover{background-color:#484b4e}#mv_warning{background-color:#373b3e}.page_media_poll_wrap{border:1px solid rgba(255, 255, 255, .12);background-color:#494D50}.page_media_poll_title{color:#FFF}.page_media_poll .page_poll_percent{background:#9BB3CC}.page_media_poll .page_poll_row_percent{color:#FFF}.wall_module .reply~.reply .dld,.wall_module .reply~.reply .reply_wrap{border-top-color:#484B4E}.stl_active.over_fast #stl_bg{background-color:#373B3E}#stl_text{color:#FFF;background:url(https://habrastorage.org/web/9b5/1bb/1c4/9b51bb1c48824d918691e7bf6b4e04f8.png) no-repeat}
#wk_box{background:#373B3E;box-shadow:0 2px 10px rgba(0, 0, 0, 0.8)}.page_media_link_desc_td{border-color:rgba(255, 255, 255, 0.12)}.wk_extpage_footer_wrap{background:#373B3E;color:#C1C1C1;border-top-color:#484B4E}.wk_text blockquote{background-color:#494D50}.wl_replies_header{background:#373B3E;color:#E4E6E9;border-color:#484B4E}.wall_module .wl_reply_form_fixed .reply_box,.wall_module .wl_reply_form_fixed .reply_fakebox_wrap{border-top-color:#484B4E}.wk_external_content .wk_header,.wk_external_content .wk_sub_header,.wk_external_content .wk_sub_sub_header{color:#93ADC8}.wl_more_action.idd_wrap{color:#8D98A9}.wl_replies_header.wl_replies_header_clickable:hover{background-color:#494D50}.like_share_radio .wdd_text{color:#fff !important;background-color:#373B3E}div.wdd{background-color:#373B3E;border-color:#484B4E}.wddi_no{background-color:#494D50}.wddi,.wddi_over{background-color:#373B3E;border-top-color:#484B4E}.wdd_list{border-color:#484B4E;box-shadow:0 1px 3px rgba(0, 0, 0, 0.6)}.wddi_text{color:#FFF}.wddi_sub{color:#A5A5A5}#wpost_post{border-color:#C4D1DE}.wpost_owner_head_wrap{background-color:#494D50}a.wpost_owner_head_name{color:#FFF}a.wl_owner_head_date{color:#9C9C9C}a.wl_owner_head_date{color:#9C9C9C}#wpost_post{border-color:#C4D1DE;background-color:#494D50}#wpost_post .post_like,#wpost_post .post_share,#wpost_post .post_comments,#wpost_post .wpost_reply_to{background:#373B3E}#wpost_post .post_like:hover,#wpost_post .post_share:hover{background:rgba(95, 131, 173, 0.2)}.wdd_add2{background:#6F7477}.wdd_add3{color:#CACACA}.wddi_thumb.online.mobile:after{background-color:#394046;border-color:#394046}.wddi_thumb.online:after{border-color:#394046}.wddi,.wddi_over{background-color:#373B3E;border-top-color:rgba(0, 0, 0, 0)}.wddi_over{background-color:#494D50}.wddi_thumb.online:after{border-color:#373B3E}.wddi_over .wddi_thumb.online:after{border-color:#494D50}div.wdd.wdd_focused{border-color:#484B4E}.ms_items_more_wrap.to_down .ms_items_more:before{border-bottom-color:#484B4E}.ms_items_more_wrap.to_down .ms_items_more:after{border-bottom-color:#373B3E}.wddi_over .wddi_thumb.online.mobile:after{background-color:#494D50}.top_result_baloon{box-shadow:0 2px 15px #000}.page_block_header{background:#373B3E;border-bottom-color:#484B4E;color:#FFF}.docs_item{border-top-color:#484B4E}a.docs_item_name{color:#FFF}.docs_choose_upload_area{background-color:#282B2F;color:#FFF}.docs_choose_upload_area:hover{background-color:#494D50}.docs_choose_rows .docs_item:hover{background-color:#494D50}.docs_choose_rows .docs_item{border-bottom-color:#484B4E}.docs_choose_dropbox_wrap{border-color:#fff;background-color:#494D50}.docs_panel{background:#373B3E}a b,b a{color:#FFFFFF}ul.listing li span{color:#FFF}.photos_choose_upload_area{background:#282B2F;color:#FFF}.photos_choose_upload_area:hover{background:#494D50}.web_cam_photo{background-color:#282B2F;color:#FFF}.photos_container_albums .photos_album_thumb{background-color:#494D50}.web_cam_photo:hover{background:#494D50}.photos_choose_bottom{background-color:#373B3E;border-top-color:#484B4E}.choose_search_cont input{background:#373B3E url(https://habrastorage.org/web/7a8/deb/787/7a8deb7875e546ada8900f7ddd4bc8f8.png) no-repeat 5px 6px}.dropbox_over .photos_choose_upload_area_drop,.photos_choose_upload_area_enter .photos_choose_upload_area_drop{background-color:#494D50}.photos_choose_more,.photos_choose_more_albums{background:#373B3E;color:#FFF}.owner_photo_additional{background:#373B3E;color:#FFF;border-top-color:#484B4E}.owner_photo_additional{background:#373B3E;color:#FFF}.photos_container_albums .photos_album_no_cover .photos_album_title_wrap{color:#FFF}.graffiti_wrap{background-color:#373B3E}.graffiti_tools{background-color:#373B3E}.graffiti_resize{border-bottom-color:#484B4E}.graffiti_slider_caption{color:#FFF}.docs_tags_desc{color:#9CA0A7}.friends_user_row{border-top-color:#484B4E}.friends_user_row .online.mobile::after{background-color:#373B3E}.friends_user_row .online::after{border-color:#373B3E}.group1{background-color:rgba(196, 209, 222, 0.4);color:#C4D1DE}.group2{background-color:rgba(196, 209, 222, 0.4);color:#C4D1DE}.group3{background-color:rgba(196, 209, 222, 0.4);color:#C4D1DE}.group4{background-color:rgba(196, 209, 222, 0.4);color:#C4D1DE}.group5{background-color:rgba(196, 209, 222, 0.4);color:#C4D1DE}.friends_search_filters,.friends_search_import{background-color:rgb(55, 59, 62)}.friends_import_row:hover{background-color:#494D50}.friends_find_user_name{color:#fff}.result_list ul li.active{background:#484B4E;color:#fff}.result_list ul{background:#373B3E}.search_query_wrap .result_list{border-color:#484B4E;box-shadow:0 1px 3px rgba(0, 0, 0, 0.6)}.result_list ul li{color:#BDBDBD}.search_row{border-top-color:#484B4E}.search_row .online:after{border-color:#373B3E}.search_row .online.mobile:after{background-color:#373B3E}.friends_phonebook .friends_field{color:#C4D1DE}.ui_rmenu_sep{border-top-color:#484B4E}.tt_default.tt_left:before{border-right-color:#484B4E}.tt_default.tt_left:after{border-right-color:#373B3E}.friends_actions_menu .ui_actions_menu:before{border-bottom-color:#484B4E}.friends_actions_menu .ui_actions_menu:after{border-bottom-color:#373B3E}.flist_summary_sep .clear{border-bottom-color:#484B4E}.bd_header_info{color:#C4D1DE}.bd_name a{color:#fff}.bd_row{border-bottom-color:#484B4E}.bd_arrow{background-color:#282B2F}.bd_day_head{background-color:#282B2F;color:#fff;border-bottom-color:#282B2F}.bd_day_cell{background-color:#494D50;border-right-color:#282B2F;border-bottom-color:#282B2F}.bd_day_cell.left{border-left-color:#282B2F}.bd_day_num{color:#fff}.bd_day_cell.holiday{background-color:#494D50}.bd_day_cell.holiday.today .bd_day_events,.bd_day_cell.today .bd_day_events{border-color:#fff;background-color:#81909C}.mail_box_cont{background:#373B3E}.mail_box_label_peer{color:#FFF}.mbe_rc_emojibtn:hover{background:#494D50}#mail_box_editable{background-color:#494D50;color:#FFF;border-color:#81878C}.emoji_tt_wrap.emoji_shop_over.tt_down:after{border-top-color:#494D50}.group_list_row{border-bottom-color:#484B4E}.module_header .header_top{color:#FFF}.page_actions_dd_label,.page_actions_header_inner{color:#BFBFBF}.page_actions_header{background:#373B3E}.page_actions_inner{border-top-color:#484B4E}.page_actions_wrap{background-color:#373B3E;box-shadow:0 1px 3px rgba(0, 0, 0, 0.6);border-color:#282B2F}.page_actions_item{color:#FFF}.page_actions_item:hover{background-color:#494D50}.page_actions_separator{border-top-color:#484B4E}.group_wiki_hider:hover{background:#494D50}.wide_column .topics_module .topic_title{color:#C4D1DE}.topics_module .topic_inner_link{color:#CCC}.wide_column .topics_module .topic_row{border-top-color:#484B4E}.page_top{border-bottom-color:#484B4E}.module_header .header_top{border-color:#484B4E}.photos_period_delimiter_fixed{background-color:#373B3E}.bp_post{border-color:#484B4E}.ba_post{background:#373B3E;border-top-color:#484B4E}.bp_author{color:#C4D1DE}.pg_lnk_sel .pg_in{color:#FFF}.blst_row{border-bottom-color:#484B4E}.blst_title{color:#FFF}.blst_mem{color:#C4D1DE}.blst_last:hover{background-color:#494D50}.bt_header{border-bottom-color:#484B4E}.public_help_steps_module .public_help_steps_link:hover{background-color:#494D50}.my_current_info:hover,.no_current_info:hover{background-color:#494D50}.module.empty .module_body{border-top-color:#484B4E}.group_box_row{border-bottom-color:#484B4E}.group_box_row:last-child{border-bottom-color:#484B4E}.box_botsh .box_controls{border-top-color:#484B4E;box-shadow:0 -1px 3px 0 rgba(0, 0, 0, .6)}.video_sort_dd_wrap .video_sort_dd{color:#949494}h2{color:#fff}.im-mess.im-mess_gift{background-color:rgba(114, 147, 182, 0.1) !important}.im-mess.im-mess_gift.im-mess_selected,.im-mess.im-mess_gift.im-mess_selected:hover{background:#3D434A !important}.group_box_name{color:#C4D1DE}.medadd_c_pollh,.medadd_h{color:#FFF}.medadd_c_linkcon{background:#373B3E;border-color:#494D50}h4{color:#FFF}.group_box_name .group_link,.group_box_name .mem_link{color:#C4D1DE}#stats_cont h4,.stats_head{color:#c4d1de;border-top-color:#484B4E}.piechart_col_header th{background-color:#484B4E}.graph_menu_item:hover{color:#FFF;background:#484B4E}.piechart_table tr td{border-bottom-color:#484B4E}.stats_time_info{border-top-color:#484B4E}#stats_export_box .label{color:#FFF}#visitors_graph > div > div > div > div{background-color:#282B2F !important}#sex_age_graph > div > div > div > div{background-color:#282B2F !important}#sex_graph > div > div > div > div{background-color:#282B2F !important}a.groups_messages_block{color:#FFF}.im-page.im-page_group .im-page--dcontent{background-color:#373B3E;box-shadow:0 1px 0 0 #484B4E, 0 0 0 1px #484B4E}.im-page.im-page_group .im-page--header{border-color:#484B4E}.im-page.im-page_group .im-page--dialogs-search{box-shadow:0 1px 0 0 #484B4E, 0 0 0 1px #484B4E}.im-page.im-page_group .im-page--chat-body-wrap-inner{background-color:#373B3E}.im-chat-input.im-chat-input_group{box-shadow:0 1px 0 0 #484B4E, 0 0 0 1px #484B4E}.im-page.im-page_group .im-page--chat-input{border-color:#484B4E;background-color:#373B3E}.im-page.im-page_group .im-page--header-inner{background-color:#373B3E;box-shadow:0 1px 0 0 #484B4E, 0 0 0 1px #484B4E}.im-page.im-page_group .im-page--chat-body-abs{box-shadow:0 1px 0 0 #484B4E, 0 0 0 1px #484B4E}.im-page.im-page_group .im-page--header-chat{border-color:#484B4E}
.im-page a.im-page--back-button:hover{background-color:#494D50}a.groups_messages_block:hover{color:#C4D1DE}.nim-dialog:not(.nim-dialog_deleted).nim-dialog_hovered,.nim-dialog:not(.nim-dialog_deleted).nim-dialog_selected,.nim-dialog:not(.nim-dialog_deleted).nim-dialog_unread.nim-dialog_classic,.nim-dialog:not(.nim-dialog_deleted):hover{background-color:#494d50}.pv_cont .narrow_column{background-color:#373B3E}#pv_author_block{background-color:#282B2F;border-bottom-color:#484B4E}.pv_comments{border-top-color:#484B4E}.pv_closed_commments_placeholder,.pv_no_commments_placeholder{background-image:url("https://habrastorage.org/web/6f4/51e/a60/6f451ea606d24b528336b89ec8aa2b98.png")}.wall_module .reply_box,.wall_module .reply_fakebox_wrap{border-top-color:#484B4E}.pv_narrow_column_wrap{background-color:#373B3E}.pv_like{color:#C4D1DE}.pv_like:hover{background-color:#494D50}.pv_can_edit:hover{background-color:#494D50}.pv_reply_form_wrap,.pv_reply_form_wrap .reply_field{background-color:#373B3E}.photos_container .photos_row{background-color:#494D50}.page_group_name{color:#FFF}.pe_tabs_panel{background-color:#282B2F}.pe_actions{background-color:#494D50}.pe_actions .pe_action>div{-webkit-filter:brightness(1.5) grayscale(0.2);filter:brightness(1.5) grayscale(0.2)}.pe_blur_input,.pe_text_input{background-color:#494D50}.pe_text_input .pe_text_font_changer{-webkit-filter:brightness(1.5) grayscale(0.2);filter:brightness(1.5) grayscale(0.2)}.pe_type_chooser_item{color:#FFF}.pe_type_chooser_item:hover{background-color:#494D50}.pe_params_slider_label{color:#FFF}.pe_undo_wrap #pe_undo{color:#FFF}.pe_undo_wrap #pe_undo{color:#FFF}.pe_text_input textarea{color:#FFF}.ui_ownblock:hover{background-color:#494D50}.group_voting_title{color:#c1cddb}.bv_title{color:#c4d1de}.bv_wrap .bt_pages_wrap{border-bottom-color:#484b4e}.pv_white_bg{background:#373B3E}.counts_module{border-top-color:#484B4E}.page_counter .count{color:#C4D1DE}.page_counter:hover .label{color:#C4D1DE}.profile_more_info_link:hover{background-color:#494D50}.profile_info_header{background-color:#373B3E}.profile_info_edit{background-color:#373B3E}.profile_info_header_wrap a{color:#C4D1DE}.profile_info_block{border-top-color:#484B4E}.page_status_f .editor{border-color:#484B4E;background-color:#373B3E}.lang_box_row:hover{background-color:#494D50}.lang_selected .lang_box_row_label{color:#FFF}.lang_box_row_label{color:#969696}.mention_tt.tt_up:after{border-bottom-color:#373B3E}.mention_tt.tt_up:before{border-bottom-color:#484B4E}.fans_idol_lnk{color:#C4D1DE}.gifts_box_rows .post{border-bottom-color:#484B4E}.ui_crumb_count{color:#C3C3C3}.box_grey .box_title .divider:before,.box_grey .box_title .tab_link,.box_grey .box_title .toggle,.box_grey .box_title .toggle a{color:#FFF}.gifts_promo_descr{background-color:#373B3E}.box_error,.box_msg,.error,.info_msg,.msg,.ok_msg{border-color:#494D50}.gifts_section_header{color:#FFF}.gifts_section_row{border-bottom-color:#484B4E}.feed_updates .wall_module .feed_row .post{border-top-color:#484B4E}.page_album_nocover .page_album_title{color:#B1BFCC}.page_album_nocover{background-color:#484B4E}.profile_online{color:#BBE6AC}.blocked_image{border-radius:3px;-webkit-filter:grayscale(1) opacity(0.7);filter:grayscale(1) opacity(0.7)}.wl_post_reply_form_forbidden{background-color:#373B3E;border-top-color:#484B4E}.reply_submit_hint_title{color:#C4D1DE}.reply_submit_hint_opts .radiobtn{color:#FFF}.tt_default_right.tt_down:before{border-top-color:#484B4E}.tt_default_right.tt_down:after{border-top-color:#373B3E}.eltt.eltt_top:before{border-top-color:#484B4E;margin-left:-6px}.eltt.eltt_top:after{border-top-color:#373B3E;margin-left:-6px}.gift_tt_header{color:#fff}.gift_tt_show_all{background-color:#373b3e;border-top-color:#484b4e}.gift_tt_show_all:hover{background-color:#494d50}.page_album_thumb_wrap{background-color:#484b4e}.profile_warning_row{color:#fff}.page_block_sub_header{color:#FFF}.header_side_link,.header_side_link a{color:#C5C5C5}.app_link{color:#FFF}.apps_i_wrap{background-color:#373B3E}.apps_i_panel{background-color:#373B3E;border-bottom-color:#484B4E}.apps_i_policy{background-color:#373B3E;border-color:#484B4E}div#wk_content{background-color:#373B3E}h1{color:#FFF}.apps_i_users,.apps_ss_playing{color:#A1AAB1}.apps_access_item_info b{color:#fff}.apps_access_item{color:#A1AAB1}.apps_i_group .apps_i_group_name{color:#fff}.page_actions_cont.narrow .page_actions_header_inner{color:#FFF}.groups_actions_menu .ui_actions_menu:before{border-bottom-color:#484B4E}.groups_actions_menu .ui_actions_menu:after{border-bottom-color:#373B3E}.settings_line{border-bottom-color:#484B4E}.settings_block_footer{border-top-color:#484B4E;background:#373B3E}.box_msg,.msg{background-color:#494D50}.settings_label{color:#FFF}.settings_block_msg{border-bottom-color:#484B4E}.settings_bl_row{border-bottom-color:#484B4E}.settings_blb_row{border-bottom-color:#484B4E;background-color:#373B3E}a.settings_blb_title{color:#FFF}.settings_blb_row:last-child{border-bottom-color:#484B4E}.settings_blb_row:last-child{border-bottom-color:#484B4E}.settings_apps .app_settings_name,.settings_apps .app_settings_name a{color:#FFF}.subheader{color:#FFF}.apps_access_item_info b{display:block}.settings_table_row{border-bottom-color:#484B4E}.settings_line.unfolded{background-color:#373B3E;border-top-color:#484B4E}.fakeinput,div[contenteditable=true],input.big_text,input.dark,input.search,input.text,textarea{border-color:#484B4E}#payments_box .payments_about_votes,.payments_about_votes{border-top-color:#484B4E;background-color:#373B3E}#payments_box{color:#FFF}.payments_getvotes_method_opt.payments_getvotes_active_row,.payments_getvotes_method_opt:hover{background-color:#494D50}.payments_getvotes_method_opt{color:#8C8C8C}.payments_getvotes_method_title{color:#FFF}h2.payments_getvotes_title{color:#FFF;border-bottom-color:#484B4E}.payments_getvotes_amounts .radiobtn b{color:#FFF}.payments_getvotes_amounts .radiobtn .payments_opt_amount{color:#9E9E9E}td.selector input.selector_input.selected{color:#fff !important}.prefix_input_wrap{background-color:#373B3E}.prefix_input_border{border-color:#484B4E}.payments_getvotes_phone .payments_form_row,.payments_getvotes_phone .payments_form_row input{color:#fff}.prefix_input_prefix{color:#CCC}.payments_getvotes_ps_row.payments_getvotes_active_row,.payments_getvotes_ps_row:hover{background-color:#494D50}.payments_getvotes_ps_title{color:#FFF}.payments_getvotes_ps_title{color:#FFF}.payments_offer_row{border-top-color:#484B4E}.payments_offer_row .payments_offer_hover,.payments_offer_row:hover{background-color:#494D50;border-bottom-color:#494D50}.payments_offer_row_title{color:#FFF}.payments_offer_row_desc{color:#A9A9A9}.settings_apps .apps_settings_row_wrap{border-top:none;border-bottom-color:#484B4E}.settings_deact_header{color:#C4D1DE}.pedit_separator{border-top-color:#484B4E}.pedit_label,.pedit_label_box{color:#FFF}.result_list{border-color:#484B4E}.selector_container td.selector input.focused,.selector_container td.selector input.selected{color:#fff !important}.dividing_line ul li{border-bottom-color:#484B4E}.result_list li.disabled{background:#373B3E}.result_list ul li em{background-color:#484B4E}.selector_container td.selector .token{color:#C4D1DE}.disabled.selector_container table.selector_table{border-color:#484B4E}.disabled.selector_container{background-color:#373B3E}.faq_tabs.ui_tabs{background-color:#373B3E}.help_tile__title_a{color:#C4D1DE}.help_tile_faqs__row_a{color:#FFF}.help_tile__all{color:#BFBFBF}.help_table_questions__title{color:#FFF}.help_table_questions{border-right-color:#484B4E}.help_table_question{border-bottom-color:#484B4E}.help_table_question_visible{background-color:#494D50}.help_table_question_visible .help_table_question__q{color:#C4D1DE}.help_table_question_act{background-color:#646A6F;color:#BBC8D2}.help_table_question_act:hover{background-color:#899198}.tu_row{border-bottom-color:#484B4E}.tu_row_title__a{color:#FFF}.tu_row_comment{color:#C4D1DE}.tu_mem{color:#FFF}.tu_last:hover{background:#494D50;border-radius:2px}.tickets_header{color:#FFF;border-bottom-color:#484B4E}.tickets_author .mem_link{color:#C4D1DE}.tickets_author{color:#C4D1DE}.tickets_reply_text{color:#FFF}.tickets_reply_row{border-top-color:#484B4E}.tickets_thank_you_form{background:#373B3E;border-top-color:#484B4E}.tickets_suggests_wrap{background-color:#373B3E;border-color:#484B4E}.tickets_suggest{border-bottom-color:#484B4E}.tickets_suggest:hover{background-color:#494D50}.faq_search_form{box-shadow:0 0 0 1px rgb(72, 75, 78)}.tickets_suggests_all_results{color:#FFF}.tickets_suggests_all_results:hover{background-color:#494D50}.help_tile_alert_urgent .help_tile_alert__title{color:#fff}.help_tile_alert{border-bottom-color:#484b4e}.help_table_question_btn{color:#fff}.group_edit_label{color:#FFF}.fakeinput,input.big_text,input.file,input.search,input.text,input[type=button],input[type=password],input[type=search],input[type=submit],input[type=text],input[type~=email],input[type~=password],input[type~=search],input[type~=text],textarea{color:#fff;background:#373b3e}.group_edit_row_sep{border-bottom-color:#484B4E}.group_edit_labeled .idd_wrap .idd_selected_value{color:#C4D1DE}.tt_w.group_edit_obscene_words_hint .tt_text{color:#C5C5C5}.wk_print_view#wk_box{background-color:#373B3E}.wk_print_view .print_content{background-color:#373B3E}.print_header{background-color:#373B3E}
.wk_print_view #wk_summary .summary{color:#FFF}.print_search_header{color:#FFF}.group_l_row{border-bottom-color:#484B4E;background-color:#373B3E}a.group_l_title,a.group_u_title{color:#FFF}.group_u_photo.online:after{border-color:#373B3E}.group_l_row:last-child{border-bottom-color:#484B4E}.blog_entry_title,.blog_entry_text{color:#FFF}.blog_right_list_title{color:#FFF !important}.blog_redesign_title{color:#C4D1DE}.blog_redesign_descr{color:#959AA0}.blog_entry_like_widget{border-top-color:#484B4E}.blog_arhive_title a{color:#FFF}.blog_arhive_item{border-bottom-color:#484B4E}.blog_entry_text b{color:#C4D1DE}.blog_about_tabs_line,.blog_about_tabs_line2{background:-o-linear-gradient(right, #484B4E, rgba(238, 240, 243, 0));background:linear-gradient(270deg, #484B4E, rgba(238, 240, 243, 0))}.blog_about_tabs_line2{background:-o-linear-gradient(left, #484B4E, rgba(238, 240, 243, 0));background:linear-gradient(90deg, #484B4E, rgba(238, 240, 243, 0))}.blog_about_company_descr{color:#FFF}.blog_about_company_stats,.blog_about_press{background-color:#282B2F}.blog_about_company_stat_number{color:#C4D1DE}.blog_about_company_stat_descr{color:#FFF}.blog_about_big_title{color:#C4D1DE}.blog_about_company_office_city{color:#C4D1DE}.blog_about_link_title{color:#FFF}.blog_about_page .footer_wrap{background-color:#282B2F;border-top-color:#484B4E}#page_layout{background-color:#282B2F}.blog_products_page .blog_about_company_stats,.blog_products_page .blog_about_press{background-color:#373B3E}.blog_product,.blog_snapster{box-shadow:0px 1px 0px 0px #595D61, 0px 0px 0px 1px #595D61;background-color:#3F4448}.blog_product_title,.blog_snapster_title{color:#C4D1DE}.blog_snapster_photo{background-color:#41464A}.blog_snapster_descr{color:#FFF}.blog_job:hover{background:#494D50;border-radius:3px}.jobs_form .label{color:#FFF}.jobs_apply_form #jobs_apply_upload_cont .button_blue button{background-color:#484B4E;color:#FFF}.jobs_form hr{border-bottom-color:#484B4E}body.dev{background:#282B2F}#dev_page_wrap1,.dev_page_block{background-color:#373B3E;box-shadow:0 1px 0 0 #484B4E, 0 0 0 1px #484B4E;color:#FFF}.dev_page_cont .wk_header,.dev_page_cont .wk_sub_header,.dev_page_cont .wk_sub_sub_header{color:#C4D1DE}#dev_left_nav{background-color:#373B3E;box-shadow:0 1px 0 0 #484B4E, 0 0 0 1px #484B4E}.dev_nav a.nav.nav_selected,.dev_nav a.nav.nav_selected:hover{background-color:#494D50}.dev_nav .nav:hover{background-color:#494D50}.dev_nav a.nav.submenu.nav_selected,.dev_nav a.nav.submenu.nav_selected:hover{color:#FFF}body.dev .wk_text blockquote{background-color:#494D50}body.dev #stl_bg #stl_text{color:#FFF;background:url(https://habrastorage.org/web/9b5/1bb/1c4/9b51bb1c48824d918691e7bf6b4e04f8.png) no-repeat}body.dev .stl_active.over_fast #stl_bg{background-color:#494D50}.tt .tt_text{background-color:#373B3E;border-color:#484B4E;color:#fff}.tickets_side_tt.text .hint_wrap{color:#FFF}.tickets_tt_list,.tickets_tt_list_abuse{color:#FFF}.tickets_side_tt.extra_field:before,.tickets_side_tt.text:before,.tickets_side_tt.title:before{border-left-color:#484B4E}.tickets_side_tt.extra_field:after,.tickets_side_tt.text:after,.tickets_side_tt.title:after{border-left-color:#373B3E}.tickets_side_tt.title .hint_wrap{color:#FFF}.dev_sect_widgets{border-color:#484B4E}.dev_info_status_header{color:#C4D1DE}.dev_part_name{color:#C4D1DE}.dev_sect_label{color:#C4D1DE}.dev_info_uptime{border-top-color:#484B4E}.dev_part_desc{color:#FFF}.dev_info_header{color:#FFF}body.dev a.dev_platform_info{color:#969696}.community_wall{background:#373B3E}.color2{color:#C4D1DE}#community_groups_main .wall_post_text{color:#fff}.dev_part:hover{background-color:#494D50;border-radius:2px}.dev_nav a.nav.nav_selected,.dev_nav a.nav.nav_selected:hover{color:#FFF}.market_item_photo_container{background-color:#282B2F}.market_item_content{background-color:#373b3e}.market_item_owner{border-bottom-color:#484b4e}.market_item_title{color:#fff}.market_item_price{color:#ABD99A}.market_item_footer_wrap{border-top-color:#484b4e}.market_item_thumb_active{box-shadow:inset 0 0 0 3px #373b3e}.market_item_owner_name{color:#fff}.market_like:hover,.market_share:hover{background-color:#494D50}.market_like,.market_share{color:#C4D1DE}.market_like_count{color:#fff}.market_share_count{color:#fff}.market_comments_header{background-color:#494D50;color:#C4D1DE}.market_comments_header:hover{background-color:#60758A}.wk_header{color:#C4D1DE}.market_comments_summary{color:#C4D1DE;border-bottom-color:#484b4e}.my_like .market_like_count{color:#C4D1DE}.market_album_name_link{color:#fff}.microdata_price{color:#ABD99A}.wall_module .page_media_market .page_media_link_desc_td .page_media_link_desc{color:#a7a7a7}.wk_table th{background-color:#494d50;border-top-color:#484b4e;border-right-color:#484b4e}.wk_table td{border-top-color:#484b4e;border-right-color:#484b4e}.wk_table{border-color:#484b4e}.wk_gray,ul.listing li span .wk_gray{color:#adadad}.index_fbsign{border-top-color:#484b4e}.index_page .index_footer_wrap{border-top-color:#484b4e}.index_page .flat_button.secondary.button_light:hover{background-color:#494d50}.join_finish_page #footer_wrap{border-top-color:#484b4e}.bottom_row{color:#fff}.join_text{color:#a7a7a7}input.text.ts_input:focus{border-color:#254469 !important}.search_media_rows .header_side_link a,.search_results .header_side_link a{color:#c1cddb}.search_results_sep{border-bottom-color:#484b4e}.search_auto_results .search_auto_sep{border-top-color:#484b4e}.search_auto_results .post_full_like_wrap{border-bottom-color:#484b4e}.bottom_row a{color:#8EC5FF}.wall_post_text a{color:#8EC5FF}.im-mess-stack a{color:#8EC5FF}.mv_deleted_message a{color:#8EC5FF}.video_item_author a{color:#8EC5FF}.labeled_text a{color:#8EC5FF}.page_info_wrap a{color:#8EC5FF}.im-page.im-page_classic .im-page--header{border-top-color:#282b2f;border-left-color:#282b2f;border-right-color:#282b2f}.im-page.im-page_classic .im-page--dialogs-search{box-shadow:0 0 0 1px #484b4e}.im-page.im-page_classic .im-page--dcontent{background-color:#373b3e;box-shadow:0 1px 0 0 #484b4e, 0 0 0 1px #484b4e}.im-page.im-page_classic .im-page--header-chat{border-top-color:#282b2f;border-left-color:#282b2f;border-right-color:#282b2f}.im-page.im-page_classic .im-page--header-inner{background-color:#373b3e;box-shadow:0 0 0 1px #484b4e}.im-page.im-page_classic .im-page--chat-body-wrap-inner{background-color:#373b3e}.im-page.im-page_classic .im-page--chat-body-abs{box-shadow:0 1px 0 0 #484b4e, 0 0 0 1px #484b4e}.im-page.im-page_classic .im-page--chat-input{border-bottom-color:#282b2f;background-color:#373b3e;border-left-color:#282b2f}.im-page.im-page_classic .im-page--chat-input{border-bottom-color:#282b2f;background-color:#373b3e;border-left-color:#282b2f;border-right-color:#282b2f}.wall_comments_header{border-top-color:#484B4E;background-color:#373B3E}.audio_friend.audio_friend_selected{background-color:#494D50;border-left-color:#C4D1DE}.friends_list_bl{border-top-color:#484B4E}.im-member-item{border-bottom-color:#484B4E}.im-chat-input .nim-peer{border-color:#373B3E}textarea.page_poll_export_code{background-color:#373B3E}#pv_box .box_title_wrap a{color:#FFF}.sticker_extra_tt .stickers_extra_text>b{color:#C4D1DE}.sticker_extra_tt .tt_text,.subscribe_post_tt .tt_text{color:#A7A7A7}.no_posts_cover{background-image:url(https://habrastorage.org/web/34e/458/1b3/34e4581b385e4fc3852c8c31093cc02d.png)}.datepicker_control{border-color:#484B4E}.datepicker_text{background-color:#373B3E;color:#fff}.post_publish{border-top-color:#484B4E}.current_audio{color:#C4D1DE}.preq_tt{border-color:#484B4E;box-shadow:1px 1px 2px 0px rgba(0, 0, 0, 0.6)}.preq_friend{background-color:#373B3E}.preq_tt:before{border-bottom-color:#484B4E}.preq_tt:after{border-bottom-color:#373B3E}.im-page .im-page--members,.im-page .im-page--peer-online{color:#ABD99A}.mob_onl{background-image:url(https://habrastorage.org/web/b88/59c/ea6/b8859cea6ced4c0ba3b5f34058e28c35.png)}.login_about_mobile{background-color:#373B3E;color:#C4D1DE;border-top-color:#484B4E}.login_mobile_info{color:#FFF}.wall_post_source_icon{background-image:url(https://habrastorage.org/web/45a/504/55b/45a50455b88b4b0b90a28f3469d1c800.png)}
.fakeinput:focus,div[contenteditable=true]:focus,input.big_text:focus,input.dark:focus,input.search:focus,input.text:focus,textarea:focus{border-color:#787E84}.nim-dialog:not(.nim-dialog_deleted).nim-dialog_hovered,.nim-dialog:not(.nim-dialog_deleted):hover{background-color:#494D50}.nim-dialog:not(.nim-dialog_deleted).nim-dialog_hovered,.nim-dialog:not(.nim-dialog_deleted).nim-dialog_hovered+.nim-dialog,.nim-dialog:not(.nim-dialog_deleted):hover,.nim-dialog:not(.nim-dialog_deleted):hover+.nim-dialog{border-top-color:#484B4E}div#wk_history_more_link{border-top-color:#484B4E;color:#fff}.photos_album_intro .photos_album_intro_desc{color:#b9b9b9}.wall_tt.tt_default.tt_down:not(.post_source_tt):not(.fw_reply_tt):after{border-top-color:#282b2f}.page_doc_row{color:#c1cddb}.im-chat-input.im-chat-input_classic{box-shadow:0 1px 0 0 #484b4e, 0 0 0 1px #484b4e}.fans_rows .post_full_like_wrap{border-bottom-color:#484b4e}.fans_rows .wall_text+.replies{border-bottom-color:#484b4e}.top_nav_btn a b{color:#c1cddb}.chat_tab_typing_wrap{background-color:#494d50}.ui_gridsorter_cont .ui_gridsorter_moveable{background-color:#494d50}.nim-dialog:not(.nim-dialog_deleted).nim-dialog.nim-dialog_classic.nim-dialog_unread,.nim-dialog:not(.nim-dialog_deleted).nim-dialog.nim-dialog_hovered,.nim-dialog:not(.nim-dialog_deleted).nim-dialog:hover,.nim-dialog:not(.nim-dialog_deleted).nim-dialog_hovered+.im-page--messages-search,.nim-dialog:not(.nim-dialog_deleted).nim-dialog_hovered+.nim-dialog,.nim-dialog:not(.nim-dialog_deleted).nim-dialog_selected+.im-page--messages-search,.nim-dialog:not(.nim-dialog_deleted).nim-dialog_selected+.nim-dialog,.nim-dialog:not(.nim-dialog_deleted).nim-dialog_unread.nim-dialog_classic+.im-page--messages-search,.nim-dialog:not(.nim-dialog_deleted).nim-dialog_unread.nim-dialog_classic+.nim-dialog,.nim-dialog:not(.nim-dialog_deleted):hover+.im-page--messages-search,.nim-dialog:not(.nim-dialog_deleted):hover+.nim-dialog{border-top-color:#484b4e}.group_row_info{color:#808080}.page_media_link_addr,.page_media_link_addr a{color:#808080}.wk_poll_tabs{background:#373b3e;border-bottom-color:#484b4e}.wk_poll_dmgr{background-color:#373b3e;border-top-color:#484b4e}.summary_tab3{color:#fff}.summary_tab2:hover{background-color:#494d50}.wk_poll_extra_checkbox .idd_selected_value{color:#8EC5FF}.wdd_hl{background-color:#6e7479}.apps_notification_header a{color:#c1cddb}.im-page .im-page--top-date-bar{color:#fff}.im-page .im-page--top-date-bar-inner{background-color:#494d50}.im-page a.im-page--back-button:hover:before{background:-o-linear-gradient(right, #494d50, #484b4e 20%);background:linear-gradient(270deg, #494d50, #484b4e 20%)}.pv_author_block{background-color:#373b3e;border-bottom-color:#484b4e}.pv_cont .pv_comments_header{background-color:#494d50;color:#fff}.pv_cont .pv_comments_header:hover{background-color:#60758A}.ui_scroll_default_theme .ui_scroll_bar_inner{background-color:#7E8082}.ui_scroll_default_theme .ui_scroll_bar_container:hover .ui_scroll_bar_inner,.ui_scroll_default_theme.ui_scroll_dragging .ui_scroll_bar_inner{background-color:#BEBFC0}.wall_module .reply_box,.wall_module .reply_fakebox_wrap{border-top-color:#484b4e;background-color:#373b3e}.wall_module .reply_form{background-color:#373b3e}.pe_editor .pe_sticker_preview:hover{background-color:#494d50}.pe_editor .pe_bottom_actions{border-top-color:#484b4e}.pe_editor .pe_tabs{border-bottom-color:#373b3e}.pe_editor .pe_drawing_undo{color:#c1cddb}.pe_editor .pe_drawing_undo:hover{background-color:#494d50}.pe_editor .pe_label{color:#fff}.pe_editor .pe_sticker_packs_tabs{background-color:#282b2f}.pe_editor .pe_sticker_pack_tab_btn.pe_right{background:-o-linear-gradient(left, rgba(240,242,245,0) 0%, rgba(240,242,245,.84) 22%, #282b2f 37%, #282b2f 100%);background:linear-gradient(90deg, rgba(240,242,245,0) 0%, rgb(40, 43, 47) 22%, #282b2f 37%, #282b2f)}.pe_editor .pe_sticker_pack_tab.pe_selected{background-color:#373b3e}.pe_editor .pe_sticker_pack_tab:hover{background-color:#494d50}.feedback_header b{color:#c1cddb}.subheader,h4.subheader{color:#c1cddb}.feedback_header{color:#808080}.friends_cur_filters{border-bottom-color:#484b4e}.wall_module .published_by_quote,.wall_module .published_sec_quote{border-left-color:#484b4e}.page_market_album_title_text{color:#c1cddb}.page_market_album_wrap{border-color:rgb(72, 75, 78)}.mv_actions_block{border-bottom-color:#484b4e}.mv_info_wide_column{border-right-color:#484b4e}.pv_cont .pv_can_edit:hover{background-color:#494d50}.video_upload_ready_name{color:#c1cddb}.page_list_module .group_desc,.page_list_module .people_desc,.page_list_module .people_extra{color:#7b7b7b}.ui_scroll_emoji_theme .ui_scroll_shadow_bottom,.ui_scroll_emoji_theme .ui_scroll_shadow_top{background:url(https://habrastorage.org/web/2fb/fc1/c58/2fbfc1c586b54b4f81165d57b27df4f1.png) 0 -29px}.notify_tt_text{color:#a0a0a0}.mv_info{background-color:#373b3e}.mv_info_narrow_column{border-left-color:#484b4e}.pv_cont .pv_closed_commments_placeholder{background-image:url("https://habrastorage.org/web/951/fe1/157/951fe115760e4c95b9a634adcf2dc1c5.png")}.pv_desc_more{color:#C4D1DE}.module{border-color:#484b4e}.ui_scroll_default_theme.ui_scroll_emoji_theme .ui_scroll_shadow_bottom,.ui_scroll_default_theme.ui_scroll_emoji_theme .ui_scroll_shadow_top{background:url(https://habrastorage.org/web/2fb/fc1/c58/2fbfc1c586b54b4f81165d57b27df4f1.png) 0 -29px;box-shadow:none;height:10px}.apps_main .apps_i_panel{background-color:#373b3e}.apps_options_bar{background-color:#373b3e}.apps_options_bar .apps_options_bar_left .app_summary_name{color:#fff}.link_arrowed_bottom{color:#c1cddb}#apps_user_warning_cont,.apps_options_bar{border-bottom-color:#484b4e}.apps_footer{background-color:#373b3e;border-top-color:#484b4e}#payments_box_right_col{background-color:#373b3e}.payments_box_wide{background-color:#282b2f}.payments_box_wide .payments_getvotes_method_opt:hover{background-color:#494d50}.payments_getvotes_ps_row{color:#ABD99A}.button_cancel{color:#c1cddb}.button_cancel .button.hover,.button_cancel .button:hover,.button_cancel .button_hover,.button_cancel .leave_button:hover{background-color:#494d50}.notify_box p,.notifyBox{background:#373b3e}.button_cancel .button_hover,.button_cancel .button:hover,.button_cancel .button.hover,.button_cancel .leave_button:hover{background-color:#494d50}.notify_box p,.notifyBox{color:white}.app_edit_block_header{background-color:#373b3e;border-bottom-color:#484b4e}.dev_wide_input_wrap{border-bottom-color:#484b4e}.bugs_row_title a{color:#fff}#bugs_content #summary{border-bottom-color:#484b4e;color:#cecece}.dev .app_edit_block_header .app_edit_dev_header.app_header_sel{color:#fff}.bugs_row{border-bottom-color:#484b4e}.bugs_tag{background-color:#484b4e;color:#c1cddb}.bugs_filters{background-color:#494d50}.bugs_filter_label{color:#fff}.bugs_tags .summary_tab3{color:#c1cddb}.bugs_table .bugs_tag.over{background-color:#6f7377}.bugs_view_title{color:#c1cddb}.bugs_view_actions,.bugs_view_author,.bugs_view_subscribe{background-color:#494d50}.bugs_info_row{color:#a9a9a9}.bugs_author_link a{color:#c1cddb}.dev_nav a.nav.submenu{color:#808080}.validation_devices_wrap .radiobtn,.validation_row .radiobtn{color:#fff}.top_nav_btn b{color:#c1cddb}.apps_edit_nav_header{background-color:#373b3e;border-bottom-color:#484b4e}.apps_edit_nav_label{color:#fff}.apps_edit_screen_line{border-top-color:#484b4e;color:#c1cddb}.apps_edit_retina_info{background-color:#373b3e;color:#a7a7a7}.apps_edit_thumb_header{color:#c1cddb}.apps_edit_box .apps_restrictions{color:#c1cddb}.apps_edit_table .label,td.apps_edit_label{color:#fff}div.apps_edit_header{color:#c1cddb}.apps_edit_rows_review{color:#fff}.apps_edit_rows_empty{color:#fff}.app_edit_api_counter_wrap_center{border-color:#484b4e}.app_edit_api_counter_wrap{border-bottom-color:#484b4e}.apps_edit_api_block_selectors .round_tab{color:#fff}.round_tab:hover{background-color:#494d50}.apps_edit_stat_graph_wrap .summary{color:#fff}.app_edit_block_header{color:#fff}#app_edit_api_bottom_graphs_wrap{border-top-color:#484b4e}.app_edit_api_duration_graph{border-color:#484b4e}#apps_edit_admins{background-color:#373b3e}.apps_edit_user_type .main{color:#fff}.apps_edit_platform_status{border-bottom-color:#484b4e}.tickets_bottom_msg{border-top-color:#484b4e}
.dev_methods_list_desc{color:#c7c7c7}.dev_methods_list_row:hover{background-color:#494d50}.dev_mlist_item{background-color:#494d50}.dev_roadmap_timeline .dev_roadmap_timeline_past .dev_roadmap_timeline_row_time,.dev_roadmap_timeline .dev_roadmap_timeline_past .dev_roadmap_timeline_row_text a{color:#fff}.dev_mlist_item:hover{background-color:#6f7579}.dev_param_row{border-color:#484b4e}.dev_const_params{border-right-color:#484b4e;background-color:#282b2f}.dev_param_checkbox{background-color:#373b3e}.dev_req_result{background-color:#373b3e}.dev_req_result.has_res:hover{background-color:#494e52}.dev_result_key{color:#fff}.dev_result_num{color:#ae81ff}.dev_result_str,.dev_result_str a{color:#a6e22e}.dev_result_bracket{color:#66d9ef}.dev_result_highlight .dev_result_bracket,.dev_result_highlight .dev_result_lbracket{color:#b92659}#dev_edit_form{background-color:#373b3e}.dev_method_req_table{border-color:#484b4e}.dev_form_no_params{color:#fff}.dev_widget_fulldoc{background-color:#494d50}.dev_widget_fulldoc:hover{background-color:#6b7175;text-decoration:none}.separator,.separator div{border-color:#484b4e !important}.wauth_content{border-color:#484b4e}#page_wrap{background-color:#282b2f}.dev_mlist_item.nav_selected,.dev_mlist_item.nav_selected:hover{background:#6f7579;color:#c1cddb}.ui_search{border-bottom-color:#484b4e;background-color:#373b3e}#ads_left:empty+.left_menu_nav_wrap{border-top-color:#484b4e}.page_status_editor .editor{border-color:#484b4e;background-color:#373b3e;box-shadow:0 1px 3px rgba(0,0,0,.7)}#visitors_graph > div:nth-child(1) > canvas{-webkit-filter:brightness(10);filter:brightness(10)}#visitors_graph{color:#fff !important}#sex_age_chart_graph > div:nth-child(1) > canvas{-webkit-filter:brightness(10);filter:brightness(10)}#members_graph > div:nth-child(1) > canvas{-webkit-filter:brightness(10);filter:brightness(10)}#members_graph{color:#fff !important}.graph_menu_item{color:#fff}.audio_row .audio_duration_wrap{-webkit-filter:brightness(1.5) grayscale(0.2);filter:brightness(1.5) grayscale(0.2)}.audio_inline_player .slider .slider_back,.audio_page_player .slider .slider_back{background-color:#b3bfce}.page_block .im_stickers_bl_wrap{background:#373b3e}#ads_left{display:none !important}#ads_page{background-color:#373b3e}.exchange_title_head{border-bottom-color:#484b4e}.exchange_subtab1{color:#fff}.exchange_subtab1:hover{background-color:#494d50}#ads_page_bottom_info{border-top-color:#484b4e;background-color:#373b3e;color:#a0a0a0}.exchange_table th{background-color:#484b4e;color:#fff}.exchange_not_found.table{background-color:#373b3e}.exchange_post_info_row .label{color:#a0a0a0}.exchange_table tr:first-child{border-top-color:#484b4e}.exchange_table tr:last-child{border-bottom-color:#484b4e}.dark_box_cont{background-color:#373b3e}.dark_box_label{color:#fff}.exchange_hint_tt .hint_wrap{color:#fff}.exchange_hint_tt .tail{background:url(https://habrastorage.org/web/6f8/e31/40e/6f8e3140e9f548db9c3b9cea95cd7c45.png) -3px -5px no-repeat}.exchange_table tr{border-left-color:#484b4e;border-right-color:#484b4e}.exchange_table tr.even{background-color:#484b4e}.exchange_ad_post_club_commment,a.exchange_ad_post_link,a.exchange_ad_post_stats{background-color:#63676b}.exchange_ad_post_club_commment:hover,a.exchange_ad_post_link:hover,a.exchange_ad_post_stats:hover{background-color:#75797d}#exchange_comm_search_filters{background-color:#373b3e}.exchange_filter_label{color:#98a6b1}#exchange_comm_search_filters #exchange_search_input{background:#373b3e}#ads_unions_content h2{border-bottom-color:#484b4e}#admin_form_table_wrapper{background-color:#373b3e !important;border-top-color:#484b4e !important;border-bottom-color:#484b4e !important}#ads_user_link{background:#373b3e !important}.wk_sub_sub_header{color:#c1cddb}.ui_table tr.ui_table_row.header{border-color:#484b4e;background-color:#484b4e}.ui_table.wide td.ui_table_cell.right_wide,.ui_table.wide th.ui_table_cell.right_wide,.ui_table.wide td.ui_table_cell.left_wide,.ui_table.wide th.ui_table_cell.left_wide{color:#fff}.ui_table td.ui_table_cell_empty{background-color:#373b3e}.ui_table tr.ui_table_row.empty{border-bottom-color:#484b4e}.ui_table tr.ui_table_row{border-left-color:#484b4e;border-right-color:#484b4e}.ads_edit_page_wrap3{background-color:#373b3e}.ads_edit_link_type_item .ads_edit_link_type_item_title,.ads_edit_link_type_item.disabled .ads_edit_link_type_item_title,.ads_edit_link_type_item.disabled:hover .ads_edit_link_type_item_title{color:#fff}.ads_edit_value_header{color:#c1cddb}.ads_edit_link_type_item:hover{background-color:#494d50}.big.with_icons .result_list ul li.active{background-color:#494d50}.big.with_icons .result_list ul li{color:#fff}.ads_edit_separator_big{border-bottom-color:#484b4e}.ads_edit_label{color:#fff}.ads_edit_targeting_group_hider_title{color:#fff}#ads_edit_audience{background-color:#494d50}#ads_edit_audience_title,#ads_edit_recommended_cost_title{color:#c1cddb}.ads_ad_box.redesign .ads_ad_box_border{border-color:#494d50}.ads_edit_panel_preview .ads_ad_box.redesign .ads_ad_box_border{background-color:#494d50}.ads_ad_box.redesign .ads_ad_title_box{color:#fff}.ads_edit_panel_preview .ads_ad_box .ads_ad_box_border{background-color:#373b3e}.selector_container td.selector .token_inner,.selector_container td.selector .token_prefix{color:#fff;background-color:#494d50}.im-search--date-input .cal_table .past_day.day,.im-search--date-input .cal_table .today.day{color:#fff}.nim-dialog .nim-dialog--preview,.nim-dialog .nim-dialog--preview b{color:#808080}.im-chat-input .im-chat-input--text *{color:#fff !important}.emoji_tt_wrap.tt_up:after{border-bottom-color:#373b3e}.emoji_tt_wrap.tt_up:before{border-bottom-color:#484b4e}.ui_actions_menu_item.feed_new_list:hover{background-color:#494D50}.fans_fan_ph.online.mobile:after{background-color:#373b3e}.fans_fan_ph.online:after{border-color:#373b3e}.nim-dialog.nim-dialog_unread-out.nim-dialog_muted:not(.nim-dialog_failed) .nim-dialog--unread,.nim-dialog.nim-dialog_unread.nim-dialog_unread-out:not(.nim-dialog_failed) .nim-dialog--unread,.nim-dialog.nim-dialog_unread-out:not(.nim-dialog_failed) .nim-dialog--unread{background-color:#f05c44}.nim-dialog:not(.nim-dialog_deleted).nim-dialog_muted.nim-dialog_selected .nim-dialog--unread,.nim-dialog:not(.nim-dialog_deleted).nim-dialog_selected .nim-dialog--unread{background-color:#fff !important}.nim-dialog:not(.nim-dialog_deleted).nim-dialog_hovered .nim-dialog--preview, .nim-dialog:not(.nim-dialog_deleted):hover .nim-dialog--preview{color:#fff}.current_audio_cnt{opacity:1;color:#849ebd;-webkit-filter:brightness(1.5) grayscale(0.2);filter:brightness(1.5) grayscale(0.2)}.nim-dialog:not(.nim-dialog_deleted).nim-dialog_unread.nim-dialog_classic .nim-dialog--preview{color:#fff}.post_like:hover,.post_share:hover{color:#fff}.pva_period_fixed{background-color:#373B3E}.im-chat-input.im-chat-input_error{background-color:#373b3e}.im-page.im-page_classic .im-page--history_loading,.im-create.im-create_classic .im-create--table{box-shadow:0 1px 0 0 #484B4E, 0 0 0 1px #484B4E}.ui_scroll_default_theme.ui_scroll_emoji_theme>.ui_scroll_overflow>.ui_scroll_shadow_bottom,.ui_scroll_default_theme.ui_scroll_emoji_theme>.ui_scroll_overflow>.ui_scroll_shadow_top{background:url(https://habrastorage.org/web/2fb/fc1/c58/2fbfc1c586b54b4f81165d57b27df4f1.png) 0 -29px}.idd_wrap .idd_selected_value{color:#D2D2D2}.help_table_not_found_text{color:#fff}.help_table_not_found_text__l{color:#b7b7b7}.help_table_popular{border-top-color:#484b4e}.my_like{color:#fff !important}.videocat_channel_header .videocat_channel_title a{color:#fff}.ui_actions_menu_item.feed_custom_list:hover{background-color:#494d50}.im-to-end .im-to-end--label{border-color:#484b4e;box-shadow:0 1px 3px 0 rgba(0, 0, 0, 0.6);background-color:#373b3e}.im-to-end{color:#fff}.im-to-end:hover .im-to-end--label{background-color:#494d50}.im-page .im-page--top-date-bar:before{background-color:#373b3e}.nim-dialog:not(.nim-dialog_deleted).nim-dialog_hovered:last-child,.nim-dialog:not(.nim-dialog_deleted).nim-dialog_selected:last-child,.nim-dialog:not(.nim-dialog_deleted).nim-dialog_unread.nim-dialog_classic:last-child,.nim-dialog:not(.nim-dialog_deleted):hover:last-child{border-bottom-color:#484b4e}input.ui_search_field{background:url(https://habrastorage.org/web/d74/a87/660/d74a876607894351a1b5fec8f4aae01b.png) no-repeat;-ms-high-contrast-adjust:auto;padding-left:28px;border-left:20px solid transparent;background-position:0}.im-audio-message-input{border-top-color:#484b4e}.im-audio-message-input .im-audio-message-track{background-color:#494d50}.im_msg_audiomsg .audio-msg-track:not(.audio-msg-player):hover{background-color:#565b5f}.blog_entry_author_name,.blog_entry_author_name a{color:#c1cddb}.payments_money_transfer_amount_wrap{border-color:#494d50;background-color:#373b3e}.payments_money_transfer_comment{border-color:#494d50;background-color:#373b3e}
.payments_money_transfer_amount_wrap.money_error{border-color:#f05c44;background-color:#4f5458}.payments_money_transfer_amount_wrap.money_error .payments_money_transfer_amount{background-color:#4f5458}.pay-card-layout__notification_type_vk .info-block_type_notification,.pay-card-layout__notification_type_vk-p2p .info-block_type_notification{color:#fff;background-color:#373b3e}.nim-dialog:not(.nim-dialog_deleted):hover .nim-dialog--preview.nim-dialog--preview-attach{color:#c3c3c3}.ui_toggler{background-color:#6b7277}.ui_toggler:after{border-color:#6b7277;background-color:#fff}.ui_toggler.on{background-color:#efbfb7}.ui_toggler.on:after{background-color:#f05c44;border-color:#f05c44}.login_page #footer_wrap{border-top-color:#484b4e}.im-page_classic .im-page--top-notice{box-shadow:0 1px 0 0 #494d50, 0 0 0 1px #494d50;background-color:#373b3e}.im-page .im-page--dialogs.im-page--dialogs-notice .im-page--header{background-color:#282b2f}.im-notice--title{color:#fff}.im-page_classic .im-page--top-notice .im-notice--text{color:#E0E0E0}.landing .landing_section.dark{background-color:#282B2F}.landing .landing_section .landing_page_title{color:#C1CDDB}.landing_moneysend .landing_page_text{color:#e0e0e0}.landing .landing_section{border-bottom-color:#474b4e}.landing_moneysend_mastercard_block,.landing_moneysend_when{color:#e0e0e0}#header{background:#373b3e;border-color:#484b4e}#header_wrap1{border-color:#484b4e}.smartfeed_notification .notification_info .notification_title{color:#fff}.blog_more_but{color:#8EC5FF}.blog_entry_author_info_short,.blog_entry_author_info_short a{color:#afafaf}#pv_friends{box-shadow:rgba(0, 0, 0, 0.3) 0px 1px 3px 0px;background:#373b3e;border-color:#484b4e}#pv_friends .name_input input{border-color:#484b4e}#pv_friends .list_wrap a:hover{background-color:#494d50}.im-page .im-page--header-inner{background:#373b3e;border-bottom-color:#484b4e}.im-page .im-page--top-date-bar{background:#373b3e;border-color:#484b4e;box-shadow:0 1px 3px 0 rgba(0,0,0,.6)}html body .vkd-filterblock-title{color:#fff}.nim-dialog.nim-dialog_classic.nim-dialog_unread-out .nim-dialog--inner-text,.nim-dialog.nim-dialog_classic.nim-dialog_unread-out.nim-dialog_muted .nim-dialog--inner-text{background-color:#494d50}.nim-dialog.nim-dialog_classic.nim-dialog_unread-out .nim-dialog--inner-text,.nim-dialog.nim-dialog_classic.nim-dialog_unread-out.nim-dialog_muted .nim-dialog--inner-text{background-color:#494d50}.im-page .im-page--history-new-bar_days>span:before{border-color:#494d50}.im-page .im-page--top-date-bar.im-page--date-bar-transition.im-page--date-bar-transition-inverse{background-color:#373b3e;border-color:#494d50;box-shadow:0 1px 3px 0 rgba(0,0,0,.6)}.nim-dialog.nim-dialog_classic:not(.nim-dialog_deleted).nim-dialog_hovered.nim-dialog_unread-out .nim-dialog--inner-text,.nim-dialog.nim-dialog_classic:not(.nim-dialog_deleted).nim-dialog_hovered.nim-dialog_unread-out.nim-dialog_muted .nim-dialog--inner-text,.nim-dialog.nim-dialog_classic:not(.nim-dialog_deleted).nim-dialog_selected.nim-dialog_unread-out .nim-dialog--inner-text,.nim-dialog.nim-dialog_classic:not(.nim-dialog_deleted).nim-dialog_selected.nim-dialog_unread-out.nim-dialog_muted .nim-dialog--inner-text,.nim-dialog.nim-dialog_classic:not(.nim-dialog_deleted).nim-dialog_unread.nim-dialog_classic.nim-dialog_unread-out .nim-dialog--inner-text,.nim-dialog.nim-dialog_classic:not(.nim-dialog_deleted).nim-dialog_unread.nim-dialog_classic.nim-dialog_unread-out.nim-dialog_muted .nim-dialog--inner-text,.nim-dialog.nim-dialog_classic:not(.nim-dialog_deleted):hover.nim-dialog_unread-out .nim-dialog--inner-text,.nim-dialog.nim-dialog_classic:not(.nim-dialog_deleted):hover.nim-dialog_unread-out.nim-dialog_muted .nim-dialog--inner-text{background-color:#494d50}html body #ads_left:not(.vkd-enabled) + .left_menu_nav_wrap{border-top-color:#484b4e}.medadd_c_linkhead{color:#c1cddb}.medadd_c_linkdsc{color:#b9b9b9}.group_app_button{border-top-color:#484b4e}a.ui_crumb{color:#b3b3b3}.wide_column .page_top{border-bottom-color:#484b4e}.group_friends_image{border-color:#373b3e}.public_help_block{color:#fff}#group_apps_wrapper .ui_tabs_header{background-color:#373b3e}#group_apps_wrapper #apps_catalog .apps_catalog_row{border-bottom-color:#484b4e}a.group_app_button{color:#fff}.emoji_cats_title_helper:after{background:url(https://habrastorage.org/web/2fb/fc1/c58/2fbfc1c586b54b4f81165d57b27df4f1.png) 0 -29px}.emoji_cat_title{color:#fff;background-color:#373b3e}.ui_search_new .ui_search_input_inner{border-color:#494d50}.ui_search_new .ui_search_button_search{background-color:#494d50;border-color:#494d50}.ui_search_new.ui_search_field_empty .ui_search_button_search{background-color:#494d50}.ui_search_sugg_list{border-color:#494d50;border-top-color:#494d50;background-color:#373b3e;box-shadow:0px 1px 3px 0px rgba(0, 0, 0, 0.4)}.ui_search_sugg_list .ui_search_suggestion_selected{background-color:#494d50}.ui_search_new.ui_search_dark .ui_search_input_inner{background-color:#373b3e}.eltt.eltt_bottom:before{border-bottom-color:#484b4e}.ui_search_new .ui_search_button_search:hover{background-color:#63676b}.ui_search_new.ui_search_dark .ui_search_button_search{background-color:#494d50}.feed_wrap .explain{color:#adadad}h4.profile_online{color:#BBE6AC}.im-chat-input{border-top-color:#494d50;background-color:#373b3e}.im-chat-input .im-chat-input--txt-wrap{background-color:#373b3e;border-color:#494d50}.im-fwd .im-fwd--title{color:#c1cddb}.im-fwd.im-fwd_msg .im-fwd--messages{color:#fff}.im-audio-message-input{background-color:#373b3e;border-top-color:#484b4e}#group_apps_wrapper .apps_footer{background-color:#373b3e;border-top-color:#484b4e}.app_settings_name a{color:#c1cddb}#group_apps_wrapper #group_apps_edit .app_setting_header .group_edit_app_info .apps_settings_go_link{color:#fff}#apps_catalog .apps_catalog_row{border-bottom-color:#484b4e}.im-right-menu.ui_rmenu .im-right-menu--count{color:#fff;background:#f05c44;border-radius:3px}.feed_update_row .post_author{color:#a0a0a0}.help_table_question_visible.help_table_question_sa{background-color:#373b3e}body.dev a.dev_search_match_row{color:#fff}.dev_search_header{color:#c1cddb}.dev_search_match_row:hover{background:#494d50;border-radius:3px}.dev_products_block_descr{color:#fff}.dev_products_blocks_spliter:after{background-color:#494d50}.dev_widgets_row{border-top-color:#494d50}body.dev .paginated_table_header th.paginated_table_cell{background-color:#494d50}body.dev .paginated_table_header th.paginated_table_cell.unsortable:hover,body.dev .paginated_table_header th.paginated_table_cell:hover{background-color:#595d61}body.dev .paginated_table_header .paginated_table_cell,body.dev .paginated_table_header .paginated_table_cell *{color:#fff}.dev_status_okay{color:#f05c44}body.dev .paginated_table_row{border-bottom-color:#494d50}.summary_tabs{border-bottom-color:#494d50}#wrapper_delay_graph,#wrapper_uptime_graph{color:#dedede !important}#wrapper_delay_graph > div:nth-child(1) > canvas,#wrapper_uptime_graph > div:nth-child(1) > canvas{-webkit-filter:brightness(10);filter:brightness(10)}.dev_roadmap_timeline{color:#c1cddb}.dev_roadmap_timeline .dev_roadmap_timeline_row .dev_roadmap_timeline_row_text a{color:#c1cddb}.dev_main_featured .dev_main_featured_products .dev_main_featured_product .dev_main_featured_product_title{color:#fff}.dev_main_featured .dev_main_featured_products .dev_main_featured_product:hover .dev_main_featured_product_title,.dev_main_platforms .dev_main_platform:hover .dev_main_platform_title{color:#c1cddb}.dev_main_sep{background-color:#484b4e}.dev_main_content .dev_main_content_header,.dev_main_platforms .dev_main_platform .dev_main_platform_title{color:#fff}.dev_main_content .dev_main_content_breaker{border-bottom-color:#484b4e}.dev_main_footer .dev_main_footer_section .dev_main_footer_section_title{color:#6e8fb0}.dev_main_blog_post_more{color:#fff;margin-top:0px}.wide .dev_req_result.has_res:hover{background-color:#494d50}.dev_result_highlight .dev_result_block .dev_result_bracket,.dev_result_highlight .dev_result_block .dev_result_lbracket{color:#fff}body.is_page{background-color:#282B2F}.landing_desktop_messenger_description{color:#fff}.landing_desktop_messenger_tools .landing_desktop_messenger_tool .tool_title{color:#fff}.landing_desktop_messenger_tools .landing_desktop_messenger_tool .tool_caption{color:#ababab}.nim-dialog:not(.nim-dialog_deleted).nim-dialog_hovered .nim-dialog--photo .online.mobile:after,.nim-dialog:not(.nim-dialog_deleted):hover .nim-dialog--photo .online.mobile:after{background-color:#494D50;border-color:#494D50}.feed_row~.feed_row_fb_hidden .feed_row:first-child .feedback_row{border-top-color:#5a5f63}.im-create.im-create_classic .im-create--footer{background-color:#373b3e}.im-create .im-creation--item.im-creation--item_hovered,.im-create .im-creation--item:hover{border-top-color:#494d50;background-color:#494d50}.im-chat-input .eltt.page_video_autoplay_tt{box-shadow:0 1px 3px rgba(0, 0, 0, 0.39);border-color:#494d50}.composer_wdd .wdd_list{border-color:#494d50}.wdd_list{border-color:#494d50}.wddi_over .wddi_sub{color:#A5A5A5}.like_tt_bottom_page_friend_reply{background-color:#373b3e !important}.page_friend_reply{border-bottom-color:#484b4e}.feed_groups_hidden_list_show_btn{color:#fff;background-color:#494d50}.feed_groups_hidden_list_show_btn:hover{background-color:#6786ab}.im-page.im-page_classic .im-chat-history-resize{background-color:#282b2f}
#side_bar_inner{position:fixed !important;margin-left:0px !important;margin-top:42px !important;top:0px !important}.wall_module .reply{background:transparent !important;border-top-color:transparent !important;border-bottom-color:transparent !important}._wall_post_cont{background:transparent !important}.tt_w.tt_black{background:rgba(0, 0, 0, .7) !important}.tickets_post_form__panel{border-top-color:#484b4e}.tickets_post_field{background-color:#373b3e;border-top-color:#484b4e}#marketplace .market_content .link{color:#c1cddb}#marketplace .market_content .market_row.over{background-color:#494d50;box-shadow:0 1px 5px 0 rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(0, 0, 0, 0.12)}#marketplace .market_content .market_row .market_edit_actions{background-color:rgb(73, 77, 80)}.market_item_footer_info{border-bottom-color:#494d50}.market_edit_item_box .result_list li.disabled{border-top-color:#484b4e}.nim-peer.nim-peer_smaller.online:after{border-color:#373b3e}.im-page--chat-header-in{border-bottom-color:#484b4e}.im-page--toolsw{background-color:#373b3e}.im-page--title-main-in{color:#fff}.im-page_classic .im-page--chat-header{border-color:#282b2f;border-top-color:#282b2f;border-left-color:#282b2f}.im-page_classic .im-page--chat-header-in{box-shadow:0 0 0 1px #494d50}.dev_page_cont .wk_header.dev_wk_head_bordered{border-bottom-color:#484b4e}.wcm_chat{background-color:#373b3e}.wcm_send_form{background-color:#373b3e;border-top-color:#494d50}.wcm_msg_wrap_unread{background-color:#494d50}.wcm_msg{background-color:#537496}.im-page--back-btn:hover{background-color:#494d50}.bt_report_sidebar_wrap{background-color:#373b3e}.bt_report_title_link{color:#fff}.bt_report_row{border-bottom-color:#484b4e}.bt_tag_label{background-color:#484b4e;color:#b5b5b5}.bt_tag_label.bt_tag_label_dark{background-color:#484b4e}.bt_report_tags .bt_tag_label:hover{background-color:#65696d}.bt_report_tags .bt_tag_label.bt_tag_label_dark:hover{background-color:#65696d}.vk2017_snippet{background-color:#494d50;border:1px solid rgba(255, 255, 255, 0.12)}.landing_vk2017_title{color:#C1CDDB}.landing_vk2017_caption{color:#fff}.landing_vk2017_promise_name a{color:#C1CDDB}.landing_vk2017_total{color:#c1cddb}.landing_vk2017_form_info{color:#fff}#vk2017_info > a{color:#8EC5FF}.mott_header,.promoted_post_tt .header,.verified_tt_header,.wall_tt .header{color:#fff}.tt_default.verified_tt.tt_down:after{border-top-color:#373b3e}.tt_default.verified_tt.tt_down:before{border-top-color:#484b4e}.im-page--title-main-inner{color:#fff}.eltt.eltt_bottom.top_audio_layer:after{border-bottom-color:#373b3e}.im-page--chat-header{background-color:#373b3e}.im-page--toolsw{border-bottom-color:#484b4e;background-color:#373b3e}.im-page--back-btn:hover{background:url(https://habrastorage.org/web/80b/ca6/16b/80bca616b72943b8b5432ab782bb011c.png) 13px 16px no-repeat, linear-gradient(90deg, #494d50 50%, #494d50);background:url(https://habrastorage.org/web/80b/ca6/16b/80bca616b72943b8b5432ab782bb011c.png) 13px 16px no-repeat, -o-linear-gradient(90deg, #494d50 50%, #494d50)}a.ui_box_header_link{color:#fff}.wall_module .my_like .post_like_icon,.wall_module .my_share .post_share_icon{-webkit-filter:contrast(2.4) hue-rotate(127deg) !important;filter:contrast(2.4) hue-rotate(127deg) !important}.wall_module .my_like .like_icon,.wall_module .my_share .share_icon{-webkit-filter: contrast(10) hue-rotate(360deg) invert(1);filter: contrast(10) hue-rotate(360deg) invert(1);}.pv_liked .pv_like_icon{-webkit-filter: contrast(10) hue-rotate(360deg) invert(1);filter: contrast(10) hue-rotate(360deg) invert(1);}.post_like_icon,.post_reply_icon,.post_share_icon{-webkit-filter:brightness(2) !important;filter:brightness(2) !important}.post_upload_dropbox_inner{border-color:#494d50}.post_upload_dropbox{background-color:#373b3e;color:#fff}.post_upload_dropbox.dropbox_over .post_upload_dropbox_inner{background-color:#494d50}.right_list_field.right_list_field__common_text{color:#c1cddb}.medadd_c_linkimg_big .medadd_c_linkhead{color:#fff}.mv_subscribe_block .mv_subscribe_live_btn{border-left-color:#373b3e}.settings_privacy_row{border-color:#494d50}.post_author span.author{color:#C4D1DE}.post_like,.post_reply,.post_share{color:#C4D1DE}.wall_module .post_like:hover,.wall_module .post_reply:hover,.wall_module .post_share:hover{background-color:#494d50}.post_like:hover,.post_reply:hover,.post_share:hover{color:#ffffff}.shorten_list_row{background-color:#373b3e;border-bottom-color: #484b4e;}.im-page .im-page--chat-search-empty{background:url(https://habrastorage.org/web/6f4/51e/a60/6f451ea606d24b528336b89ec8aa2b98.png) no-repeat top;color:#909090}.shortener_stats_header{border-bottom-color:#484b4e}div.ui_actions_menu_wrap._ui_menu_wrap.shown > div.ui_actions_menu._ui_menu > a{color:#fff}#pv_tags span{color:#fff}.wl_post_actions_wrap .ui_actions_menu_more{color:#eaeaea}.wall_module.wl_post .reply .reply_wrap{border-top-color:#484b4e}.feed_blog_reminder_title a{color:#c1cddb}.wl_replies_header.wl_replies_header_clickable{color:#E4E6E9}.bt_comment_form{background-color:#373b3e}.bt_sb_block{border-top-color:#484b4e;color:#dedede}.bt_report_cmt_author_a{color:#c1cddb}.wall_module .post_like_count,.wall_module .post_like_link,.wall_module .post_reply_count,.wall_module .post_reply_link,.wall_module .post_share_count,.wall_module .post_share_link{color:#fff}.video_desktop_live_intro_wrap{background-color:#373b3e}.mv_live_gifts_block{border-bottom-color:#484b4e}.mv_live_gifts_arrow_left:before,.mv_live_gifts_arrow_right:before{background-color:#373b3e}.mv_live_gifts_arrow_left:hover:before,.mv_live_gifts_arrow_right:hover:before{background-image:-o-linear-gradient(90deg, #494D50, #494D50);background-image:linear-gradient(0deg, #494D50, #494D50)}.mv_live_gifts_arrow_right{border-left-color:#484b4e}.mv_live_gifts_supercomment{border-left-color:#484b4e;color:#fff}.mv_live_gifts_supercomment:hover{background-color:#494d50}.mv_live_gifts_item:hover{background-color:#494d50}.mv_live_gifts_arrow_left{border-right-color:#484b4e}.eltt.feature_intro_tt.eltt_top:before,.eltt.feature_intro_tt.eltt_top:after{background-color:#373b3e}.mv_live_gifts_item.active{background-color:#484b4e}.im-mess .im-mess--post{border-left-color:#484B4E}.mv_live_gifts_supercomment.active{background-color:#484b4e}.mv_live_gift_popup_description{color:#fff}.im-page .im-page--clear-recent{color:#fff}.settings_history_table tr td{border-bottom-color:#484b4e}.settings_votes_income .settings_history_amount{color:#939393}.gtop_complex_message .gtop_content .gtop_header{color:#c1cddb}.gtop_complex_message .gtop_content .gtop_message{color:#fff}.good_browser:hover{background-color:#494d50}#dev_left_nav,.dev_section_methods_wrap{background-color:#373b3e;box-shadow:0 1px 0 0 #484b4e, 0 0 0 1px #484b4e}.dev_section_methods_wrap .dev_section_search_wrap{border-bottom-color:#484b4e}.dev_section_methods_wrap .dev_section_search_input:hover{background-color:#494d50}.dev_section_methods_wrap .dev_section_search_result_wrap{box-shadow:0 1px 3px rgba(0,0,0,.6);border-color:#484b4e;background-color:#373b3e}.dev_section_methods_wrap .dev_section_search_result_item{color:#fff}.dev_section_methods_wrap .dev_section_search_result_item.over{background-color:#494d50}.dev_section_methods_wrap .dev_section_search_input:focus{color:#fff;background-color:#494d50}.dev_method_block .dev_method_block_title{border-bottom-color:#484b4e}.group_api_blockquote{background-color:#494d50}.dev_row_separator{border-bottom-color:#494d50;box-shadow:0 1px 0 0 #494d50}.group_help_desc{color:#bfbfbf}.medadd_inline_editable:hover{background-color:#494d50}#profile_groups_link:hover{background-color:#494d50}.audio_section_promo__title{color:#fff}.audio_page_layout .audio_item__title,.audio_page_layout .audio_item__title>a{color:#fff}.audio_page_layout .audio_friends_list{background-color:#373b3e}.audio_row:not(.audio_row_current):hover .audio_row_inner{background-color:#494d50}.audio_page_layout .audio_page_separator{background-color:#484b4e}.audio_page_layout .has_friends_block .audio_page__rows_wrap{border-right-color:#484b4e}.audio_row.audio_row_current .audio_row_inner,.audio_row.audio_row_playing .audio_row_inner,.audio_row.audio_row_current .audio_row_inner:hover,.audio_row.audio_row_playing .audio_row_inner:hover{background-color:#494d50}.audio_row.audio_row_current .audio_row_inner,.audio_row.audio_row_playing .audio_row_inner,.audio_row.audio_row_current .audio_row_inner:hover,.audio_row.audio_row_playing .audio_row_inner:hover{background-color:#494d50}.audio_page_player.audio_page_player_fixed{background-color:#373b3e;box-shadow:0 1px 0 0 rgb(73, 77, 80)}.audio_page_layout .audio_recoms_blocks .recoms_special_block_title,.audio_page_layout .audio_section__recoms .recoms_special_block_title{color:#fff}.audio_feed_post{border-bottom-color:#484b4e}.ui_tab,.ui_tabs .ui_tab{color:#b9b9b9}.eltt.eltt_bottom.eltt_arrow_size_normal .eltt_arrow_back{border-bottom-color:#494d50}.eltt.eltt_bottom.eltt_arrow_size_normal .eltt_arrow{border-bottom-color:#373b3e}#audio_status_tt .audio_status_sep{background-color:#494d50}.audio_layer_container .audio_page_player{background-color:#373b3e;border-bottom-color:#494d50}.audio_layer_container .audio_page__footer{border-top-color:#494d50}#audio_layer_tt>.eltt_arrow_back .eltt_arrow{border-bottom-color:#373b3e}
	
#vkhelper_control_msg_content,#vkhelper_control_fast_list{background-color:#373B3E;color:#C4D1DE;border-color:#484B4E}
span.post_like.vkhelper_postMenu { color: #c4d1de }

.audio_pl_edit_box .ape_header {
    background-color: #373b3e;
    border-bottom-color: #484b4e;
}
.audio_pl_edit_box .ape_add_audios_btn, .audio_pl_edit_box .ape_add_pl_audios_btn {
    border-bottom-color: #484b4e;
}
.audio_pl_edit_box .ape_add_audios_btn:hover, .audio_pl_edit_box .ape_add_pl_audios_btn:hover {
    background-color: #494d50;
}
.audio_pl_edit_box .ape_list_header {
    color: #fff;
    background-color: #373b3e;
}
.story_feed_new_item .stories_feed_item_ava {
    border-color: #fff;
}
.story_feed_new_item .stories_feed_item_name {
    color: #fff;
}
.feed_blog_reminder_large .feed_blog_reminder_text {
    color: #adadad;
}
.feed_blog_reminder_large .feed_blog_reminder_title {
    color: #fff;
}
.feed_blog_reminder_link {
    color: #fff;
}
.audio_layer_container .audio_friend:hover {
    background-color: #494d50;
}
.audio_pl_snippet .audio_pl_snippet__header {
    background-color: #494d50;
    border-bottom-color: #5f6265;
}
.audio_pl_snippet {
    border-color: #5f6265;
    background-color: #373b3e;
}
.audio_pl_snippet .audio_pl_snippet__more_btn {
    color: #c1cddb;
}
.audio_pl_snippet .audio_pl_snippet__info_title {
    color: #fff;
}
.audio_pl_snippet .audio_pl_snippet__info_author>a {
    color: #a9a9a9;
}
.audio_pl_snippet .audio_pl_snippet__info_line {
    color: #a9a9a9;
}
.story_view_answer_form_cont {
    background: #373b3e;
    border: 1px solid #5f6265;
}
.story_view_feedback_button_arrow {
    background: none;
}
.stories_feed_arrow_left, .stories_feed_arrow_right {
    border-color: rgb(72, 75, 78);
    background-color: #373b3e;
}
.stories_feed_arrow_left:hover, .stories_feed_arrow_right:hover {
    background: -o-linear-gradient(bottom, #373b3e, #494d50, #373b3e);
    background: linear-gradient(0deg, #373b3e, #494d50, #373b3e);
}
.audio_page_player .audio_page_player__cover {
    background-color: #282b2f;
}
.audio_pl_item .audio_pl__cover {
    background-color: #282b2f;
}
.stories_feed_item_name {
    color: #c1cddb;
}
.wdd_add3 {
    color: #fff;
}
.wdd_add_plus {
	-webkit-filter: brightness(5);
    filter: brightness(5);
}
.tt_default_right.tt_up:before {
    border-bottom-color: #484b4e;
}
.tt_default_right.tt_up:after {
    border-bottom-color: #373b3e;
}
.eltt.eltt_top.eltt_arrow_size_normal .eltt_arrow_back {
    border-top-color: #484b4e;
}
.eltt.eltt_top.eltt_arrow_size_normal .eltt_arrow {
    border-top-color: #373b3e;
}
.im-page .im-page--top-date-bar_visible .im-page--history-new-bar_days.im-page--date-bar-transition>span {
    border-color: #484b4e;
    box-shadow: 0 1px 3px 0 rgba(0,0,0,.3);
}
.audio_pl_edit_box .ape_audio_item_wrap .ape_attach {
    color: #fff;
}
.audio_pl_edit_box .ape_pl_item .ape_pl_item_inner {
    border-bottom-color: #484b4e;
}
.audio_pl_edit_box .ape_pl_item:hover {
    background-color: #494d50;
    border-top-color: #494d50;
    border-bottom-color: #494d50;
}
.ok_msg {
    background-color: #484b4e;
}
.video_upload_tc_wrap .video_tc_upload_btn {
    background-color: #484b4e;
    color: #fff;
}
.video_upload_tc_wrap .video_tc_item {
    background-color: #373b3e;
}
.video_upload_tc_wrap .video_tc_upload_btn:hover {
    background-color: #575b5f;
}
.video_upload_tc_wrap .video_tc_item:hover {
    background-color: #373b3e;
}
#video_playlists_edit_box .pl_size {
    color: #fff;
}
.videos_edit_main_album_description {
    color: #fff;
}
.video_item .video_restore {
    background-color: hsla(210, 4%, 29%, 0.6);
}
.video_upload_link_header {
    color: #c1cddb;
}
#mv_publish {
    background-color: #373b3e;
    border-bottom-color: #484b4e;
}
.audio_pl_snippet .audio_pl_snippet__description {
    color: #fff;
}
.bottom_row {
    border-top-color: #484b4e;
    background-color: #373b3e;
}
.post_friend_liked {
    border-color: #373b3e;
}
.post_top_info_wall_reply {
    box-shadow: 0 0 0 1px #484b4e, 0 1px 0 0 #484b4e;
}
.post_top_info_wall_reply_text, .post_top_info_wall_like_text {
    color: #fff;
}
.login_bad_link_header {
    color: #fff;
}
#mv_pl_tt .mv_tt_playlists.with_border {
    border-top: 1px solid #484b4e;
}
.flat_button {
    color: #fff!important;
}
.app_widget_matches {
    color: #fff;
}
.app_widget_matches_score, .app_widget_matches_team_a, .app_widget_matches_team_b {
    border-top-color: #494d50;
}
.audio_row:hover:not(.audio_row__current) .audio_row_content {
    background-color: #494d50;
}
._audio_section__search .audio_row.audio_has_lyrics .audio_row__title_inner, .ap_layer__content .audio_row.audio_has_lyrics .audio_row__title_inner, .audio_page__audio_rows .audio_row.audio_has_lyrics .audio_row__title_inner, .audio_section_global_search__audios_block .audio_row.audio_has_lyrics .audio_row__title_inner {
    color: #8ec5ff;
}
.audio_w_covers .audio_row.ui_gridsorter_moveable .audio_row_content{
	background-color: #494d50;
}
.audio_row .audio_row__lyrics .audio_row__lyrics_inner {
    color: #e2e2e2;
}
.audio_row.audio_row__current .audio_row_content {
    background-color: #494d50;
}
.audio_w_covers .audio_row .audio_row__cover {
    background-image: url(https://habrastorage.org/web/5fc/8e6/47f/5fc8e647fa1147259ef14e18bb6019d1.png);
}
.audio_row__more_actions .audio_row__more_action {
    color: #e2e2e2;
}
.audio_row__more_actions .audio_row__more_action:hover {
    background-color: #494d50;
}
.eltt.eltt_bottom.eltt_arrow_size_normal>.eltt_arrow_back .eltt_arrow {
    border-bottom-color: #373b3e;
}
.audio_row .audio_row__performer {
    color: #8EC5FF;
}
.ap_layer .audio_pl_snippet .audio_pl_snippet__header_inner {
    background-color: #494d50;
}
.audio_pl_snippet .audio_pl_snippet__stats {
    color: #fff;
}
.im-mess.im-mess_unread:not(.im-mess_light) {
    background-color: #494D50;
}
.im-page .im-search-results-head {
    color: #fff;
}
.im-page .nim-conversation-search-row .nim-dialog--name .nim-dialog--name-w {
    color: #c1cddb;
}
.post_top_info_wall_like {
	box-shadow: none;
	border-bottom: 1px solid #484B4E;
}
.top_notify_cont .top_notify_header {
    border-top-color: #484b4e;
}
.settings_separated_row+.settings_separated_row:after {
    background-color: #484b4e;
}
.im-popular--name {
    color: #d4d4d4;
}
.nim-dialog.nim-dialog_classic.nim-dialog_unread-out .nim-dialog--inner-text, .nim-dialog.nim-dialog_classic.nim-dialog_unread-out.nim-dialog_muted .nim-dialog--inner-text {
    color: #b1b1b1;
}
.im-right-menu .im-right-menu--count { 
	color: #fff; 
}
.ui_actions_menu_top .ui_actions_menu:before {
    border-top-color: #4a4c4f;
}
.ui_actions_menu_top .ui_actions_menu:after {
    border-top-color: #373c3e;
}
.im-dropbox--rect {
    border-color: #828282;
}
.im-dropbox--msg {
    color: #ccc;
}
.im-dropbox--rect.dropbox_over {
    background-color: #4b4e51;
}
.mail_box_group_first_message {
    color: #fff;
}
a.group_app_button, a.group_app_button_multi {
    color: #fff;
}
.im-mess.im-mess_selected:not(.im-mess_is_sebastianoving), .im-mess.im-mess_selected:not(.im-mess_is_sebastianoving):hover {
    background-color: #4a4d50;
}
.post_from_tt_row {
    color: #fff;
}
.post_from_tt_row:hover {
    background-color: #4a4d50;
}
.language_box_row .language_box_row_label {
    color: #fff;
}
.language_box_row:hover {
    background-color: #4a4d50;
}
.language_suggested {
    background-color: #4a4d50;
}
.language_selected,
.language_box_row.language_box_row_selected .language_box_row_label {
    color: #8EC5FF;
}
.im-page-pinned {
    border-bottom-color: #494b4e;
    background-color: #373c3e;
}
.im-page-pinned--name {
    color: #c4cedc;
}
.module_header.header_separated {
    border-bottom-color: #484b4e;
}
.feed_block_article:hover {
    background-color: #494d50;
}
.ui_actions_menu_item.ui_actions_menu_item_about:before {
    border-top-color: #484b4e;
}
a.group_app_button_multi {
    border-bottom-color: #484b4e;
}
.im-notice--messenger .im-notice--title, .im-notice--messenger_community .im-notice--title {
    color: #fff;
}
.audio_page__shuffle_all .audio_page__shuffle_all_button:hover {
    background-color: #494d50;
}
.audio_page__shuffle_all .audio_page__shuffle_all_button {
    color: #fff;
}
.wall_module .reply:hover .like_wrap.my_like .like_icon {
	-webkit-filter: contrast(10) hue-rotate(360deg) invert(1);filter: contrast(10) hue-rotate(360deg) invert(1);
}
.fans_fan_bl_wrap {
    background-color: #373b3e;
}
.app_widget_list_row {
    border-bottom-color: #484b4e;
}
.app_widget_list_row {
    color: #fff;
}
.im-chat-input--editing-head {
    color: #fff;
}
.payments_summary_header {
    color: #fff;
}
.payments_summary_bill_row_inall {
    color: #828282;
}
.payments_box_wide .payments_summary_cont {
    color: #828282;
}
.group_online_answer_status_title, .group_online_status_title {
    color: #8EC5FF;
}
.group_online_answer_status_description, .group_online_status_description {
    color: #cacaca;
}
.article_snippet .article_snippet__read_btn {
    background-color: #5181b8;
}
.article_snippet .article_snippet__read_btn:hover {
    background-color: #5b88bd;
}
.top_notify_cont .feedback_img{width:40px;height:40px;border-radius:50%;-moz-force-broken-image-icon:0;background-color:#282B2F;display:inline-block}.ui_photo_grid_1 img,.ui_photo_grid_2 img,.ui_photo_grid_3 img,.ui_photo_grid_4 img{position:relative;vertical-align:top;-moz-force-broken-image-icon:0;background-color:#282B2F;
}
.im-page.im-page_classic.im-page_group .im-group-online {
    background-color: #282b2f;
}
.im-page.im-page_classic.im-page_group .im-group-online .im-group-online--inner {
    background-color: #373b3e;
    box-shadow: 0 1px 0 0 #484b4e, 0 0 0 1px #282b2f;
}
.article {
    color: #fff;
    background-color: #373b3e;
}
.apps_install_header {
    background-color: #373b3e;
    border-bottom-color: #484b4e;
}
.eltt.eltt_top.eltt_arrow_size_normal>.eltt_arrow_back .eltt_arrow {
    border-top-color: #373b3e;
}
		*/
	},
	
	vk_script : {
	
		off : function() {
		
			jQuery('#vkhelper_style_nightTheme').remove();
			
		}
		
	}
	
};

    