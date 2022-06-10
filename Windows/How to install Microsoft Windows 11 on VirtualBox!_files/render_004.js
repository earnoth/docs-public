/* globals define,console,Promise */
define([
	"jquery",
	"mustache",
	"marked",
	"text!./layout.html",
	"css!./design.css",
	'knockout'
], function ($, Mustache, Marked, templateHtml, css, ko) {
	"use strict";

	// Content Layout constructor function.
	function ContentLayout(params) {
		this.contentItemData = params.contentItemData || {};
		this.scsData = params.scsData;
		this.contentClient = params.contentClient;
		// Backward compatibility for v1 API
		this.contentItemData.fields = this.contentClient.getInfo().contentVersion === 'v1' ? this.contentItemData.data : this.contentItemData.fields;
	}

	// Helper function to format a date field by locale.
	function dateToMDY(date) {
		if (!date) {
			return "";
		}

		var dateObj = new Date(date);

		var options = { year: "numeric", month: "long", day: "numeric" };
		var formattedDate = dateObj.toLocaleDateString("en-US", options);

		return formattedDate;
	}

	// Helper function to parse markdown text.
	function parseMarkdown(mdText) {
		if (mdText && /^<!---mde-->\n\r/i.test(mdText)) {
			mdText = mdText.replace("<!---mde-->\n\r", "");

			mdText = Marked(mdText);
		}

		return mdText;
	}
	// Helper function to parse markdown text.
	function updateContentURLs(contentClient, mdText) {
		return new Promise(function (resolve, reject) {
			// you may not need to add the cachebuster value when published, but just in case...
			var cacheBusterKeys = contentClient.getInfo().cacheBuster;
			var cacheBuster = typeof cacheBusterKeys === 'string' ? cacheBusterKeys : (cacheBusterKeys && cacheBusterKeys.contentKey || '');
			// parse the string and and any additional parameters to the URLs
			var regDigitalAsset = /\[!--\$\s*CEC_DIGITAL_ASSET\s*--\]\s*(.*?)\s*\[\/!--\$\s*CEC_DIGITAL_ASSET\s*--\]/g

			var contentIds = [];
			var updatedString = mdText.replace(regDigitalAsset, function (match, parameters) {
				var params = parameters.split(',');
				var contentId = params[0].trim();
				contentIds.push(contentId);
				
			});
			contentClient.getItems({
				'ids': contentIds
				
			}).then(function (contentItems) {
				
				
				var updatedString = mdText.replace(regDigitalAsset, function (match, parameters) {
					var params = parameters.split(',');
					var contentId = params[0].trim();
					var updatedImgUrl;
						var result = contentItems.items.find(function (entry) {
							
							return entry.id === contentId;
							
						});
						
					var Imagename = result.name;
					
					var FileType = Imagename.split(".");
					
					
					if(FileType[1] == 'jpeg'|| FileType[1] == 'jpg'|| FileType[1] == 'png'){
						updatedImgUrl = contentClient.getRenditionURL({"id":contentId,"type":'Medium',"format":'jpg'});
							
							
					}else{
						updatedImgUrl = contentClient.getRenditionURL({"id":contentId});
					
					}
					 return updatedImgUrl;
					
					
					
				}); 

				// find all the content URLs and add in rendition value
				return resolve(updatedString);
			});
		});
	}
	// Helper function to make an additional Content REST API call to retrieve all items referenced in the data by their ID.
	function getRefItems(contentClient, ids) {
		// Calling getItems() with no ‘ids’ returns all items.
		// If no items are requested, just return a resolved Promise.
		if (ids.length === 0) {
			return Promise.resolve({});
		} else {
			return contentClient.getItems({
				"ids": ids
			});
		}
	}

	//Fontsize functionality
	/*			 		console.log("addeventListener from renderjs");
	  //  if (event.target.readyState === "complete") {
			console.log("Inside binding fun from renderjs");
		! function($) {
		 console.log("test from renderjs", document.querySelectorAll(".rc84post")[0]);
		if (document.querySelectorAll(".rc84post")[0]) {
			var a = null != localStorage.getItem("ora_blog_fs") ? localStorage.getItem("ora_blog_fs") : 100,
				b = document,
				c = b.querySelectorAll(".rc84post")[0];
				console.log("printing C", c);
			c.style.fontSize = a + "%";
			b.getElementById("rc84fs").innerHTML = a + "%";
			b.querySelectorAll(".rc84-smaller").forEach(function(a) {
				a.addEventListener("click", function(a) {
					rc84adjust(c.style.fontSize, -10);
					a.preventDefault()
				})
			});
			b.querySelectorAll(".rc84-larger").forEach(function(a) {
				a.addEventListener("click", function(a) {
					rc84adjust(c.style.fontSize, 10);
					a.preventDefault()
				})
			});
	
			function rc84adjust(a, d) {
				var e = parseInt(a) + d;
				if (e >= 90 && e <= 140) {
					c.style.fontSize = e + "%";
					b.getElementById("rc84fs").innerHTML = e + "%";
					localStorage.setItem("ora_blog_fs", e)
				}
			}
		}
	}(jQuery);
	OCOM.register(function rt02($) {
		"use strict";
	
		function close(a) {
			var b = $(a).closest(".rt02w1");
			b.removeClass("rt02open");
			b.removeAttr("style")
		}
	
		function open(a) {
			var b, c = $(a).closest(".rt02w1");
			c.addClass("rt02open");
			b = c.find("ul li:last");
			c.css({
				height: b.position().top + b.outerHeight()
			})
		}
	
		function initialize() {
			$(".rt02").each(function(a, b) {
				$(b).find("ul").append($('<div class="rt02more"><div class="rt02open icn-img icn-overflow-horiz"></div><div class="rt02close icn-img icn-close"></div></div>'));
				$(b).find(".rt02open").on("click", function(a) {
					open(a.currentTarget)
				});
				$(b).find(".rt02close").on("click", function(a) {
					close(a.currentTarget)
				})
			});
			$(window).off("resize.rt02").on("resize.rt02", function() {
				$(".rt02").each(function(a, b) {
					$(b).find(".rt02open")[0] && close($(b).find(".rt02w1 ul li:first a")[0])
				})
			})
		}
		initialize()
	});
	}
	*/
	// Content Layout definition.
	ContentLayout.prototype = {
		// Specify the versions of the Content REST API that are supported by the this Content Layout.
		// The value for contentVersion follows Semantic Versioning syntax.
		// This allows applications that use the content layout to pass the data through in the expected format.
		contentVersion: ">=1.0.0 <2.0.0",

		// Main rendering function:
		// - Updates the data to handle any required additional requests and support both v1.0 and v1.1 Content REST APIs
		// - Expand the Mustache template with the updated data
		// - Appends the expanded template HTML to the parentObj DOM element
		hydrate: function (parentObj) {
			var authorId = $('.blog-author-container').attr('data-hydrate');
			//console.log("inauthorid" + authorId);

		},
		render: function (parentObj) {
			var template,
				content = $.extend({}, this.contentItemData),
				contentClient = this.contentClient,
				fields = this.contentItemData.fields,
				contentType,
				secureContent = false;

			// If used with CECS Sites, Sites will pass in context information via the scsData property.
			if (this.scsData) {
				content = $.extend(content, { "scsData": this.scsData });
				contentType = content.scsData.showPublishedContent === true ? "published" : "draft";
				secureContent = content.scsData.secureContent;
			}

			// Support both v1.0 and v1.1 Content REST API response formats.
			// User-defined fields are passed through the 'data' property in v1.0 and 'fields' property in v1.1.
			var data = !contentClient.getInfo().contentVersion || contentClient.getInfo().contentVersion === "v1" ? content.data : content.fields;

			// Massage the data so that the 'fields' property is always there.
			// The corresponding layout.html template only checks for the ‘fields’ property. 
			if (!contentClient.getInfo().contentVersion || contentClient.getInfo().contentVersion === "v1") {
				content["fields"] = content.data;
			}

			//
			// Handle fields specific to this content type.
			//

			var moreItems;

			var referedIds = [];

			//data["body"] = parseMarkdown(contentClient.expandMacros(updateContentURLs(contentClient,data["body"])));
			//data["body"] = contentClient.expandMacros(data["body"]);
			
			moreItems = data["author"] || [];
			moreItems.forEach(function (nxtItem) {
				// Get the IDs of any referenced assets, we will do an additional query to retrieve these so we can render them as well.
				// If you don’t want to render referenced assets, remove these block.
				referedIds[referedIds.length] = nxtItem.id;
			});
			//console.log("featuredimgsettings", data["featured_image_display_option"].value)
		/*	var featuredImgSettings = function () {
				if (data["featured_image_display_option"] == null) {
					document.getElementsByClassName("rc81photo")[0].style.display = "none";
				} else if (data["featured_image_display_option"][0] == "hidden") {
					document.getElementsByClassName("rc81photo")[0].style.display = "none";
					//var image = document.getElementsByClassName("rc81photo");
					//image[0].style.display = "none";
				} else {
					document.getElementsByClassName("rc81photo")[0].style.display = 'block';
				}
			};

			if (data["featured_image"]) {
				data["featured_image"]["url"] = contentClient.getRenditionURL({ "id": data["featured_image"].id, "type": "Large", "format": "jpg" });
			}
			*/
			if (data["publish_date"]) {
				data["publish_date"]["formated"] = dateToMDY(data["publish_date"].value);

			}
			if(data["time_to_read"]){
				data["time_to_read"] = data["time_to_read"];
			}
			window.SCSMacros = window.SCSMacros || {};
			window.SCSMacros.blogFilter = data["publish_date"].value;
			//console.log("publish date inside renderjs: " + window.SCSMacros.blogFilter);
			var self = this;
			var SitesSDK = this.scsData.SitesSDK;
			self.publishDate = ko.observable('');



			self.publishDate.subscribe(function () {
				SitesSDK.publish(SitesSDK.MESSAGE_TYPES.TRIGGER_ACTIONS, {
					'triggerName': 'setPublishDate', // can be any value
					'triggerPayload': [{
						payloadData: window.SCSMacros.blogFilter // update the additional query string to the latest value if the content list has already rendered
					}],
					'actions': ['getPublishDate']
				});
			});

			self.publishDate(data["publish_date"].value);

			//  console.log("Macr: " + window.SCSMacros.blogFilter1);

			moreItems = data["attachments"] || [];
			moreItems.forEach(function (nxtItem) {
				nxtItem["url"] = contentClient.getRenditionURL({ "id": nxtItem.id });
			});


			// Set Page Title
			var pageFunctions = function () {
				var title = "";
				if (data["title"]) {
					title = data["title"];
				}
				if (title) {
					document.title = data["title"];
					$(".pageName").text(typeof document.title != "undefined" ? document.title : "Error");
				}

			};

			function loadExternal() {
				$("#post-id script").each(function () {
					if($(this).attr('src') && $(this).attr('src').includes('gist')){
						$(this).replaceWith("<iframe srcdoc='"+$(this).prop('outerHTML')+"'></iframe>")
						   $('iframe').css({'width':'100%', 'border':'none'})
						$('iframe').on('load', function() {
							this.style.height =	this.contentWindow.document.body.offsetHeight + 30 + 'px';
						});
					}
				})

				$('#post-id pre').each(function () {
						if($(this).children('code').length>0){
							$(this).find('code').html($.parseHTML($(this).find('code').text()))		
						} else{
							$(this).html('<code>' + $(this).html() + '</code>');
						}
						$(this).wrap('<div class="ocode"></div>')
						$(this).before('<div class="ocode-bttn" data-success="Copied to Clipboard" data-error="Error: Could not Copy"><div><a href="#copy">Copy code snippet</a></div><div class="ocode-success">Copied to Clipboard</div><div class="ocode-error">Error: Could not Copy</div></div>');
						$(this).after('<textarea readonly="readonly" tabindex="-1"></textarea>');
				});

				$("#post-id iframe").each(function () {
					let srcAttribute = $(this).attr('src');
					if(srcAttribute && (srcAttribute.includes('embed') ||srcAttribute.includes('youtube') )){
						  if(srcAttribute.includes('https')){
							   $(this).attr('src', srcAttribute);
						   } else if(srcAttribute.includes('http')){
								 $(this).attr('src', srcAttribute.replace('https'));
						   } else{
							   $(this).attr('src', 'https://'+srcAttribute);
						   }         
					}
				})
				$("#pubDate").insertBefore($("#pubDate").prev(".rc81sub").find("span div"));
				if(window.TriggerAdditionalAdobePing){
					window.TriggerAdditionalAdobePing()
				}
				let elem = document.querySelector('.text-wrap')
			//	let elemHeight = elem.offsetHeight + "px"
			//	console.log("element height" + elemHeight);
				let div = document.createElement('div')
				div.classList.add('readmore')
				div.innerText = 'Show more'
				if (elem.offsetHeight >= 130) {
					elem.classList.add('text-wrap-short')
					elem.parentNode.appendChild(div)
				}
				function readMoreFunc() {
			//	console.log("readMoreFunc");
					let readmoreBtn = document.querySelector('.readmore')
					if(readmoreBtn){
						readmoreBtn.addEventListener('click', function () {
						  if(elem.classList.contains('text-wrap-short')){
							elem.classList.remove('text-wrap-short')
							readmoreBtn.innerText = "Show less"
						  }else{
							elem.classList.add('text-wrap-short');
							readmoreBtn.innerText = "Show more";
						  }
						})
					}
				}
				setTimeout(readMoreFunc, 2000);
			}
			$(document).ready(function () {

				if (data["canonical_url"]) {
					var linktags = document.getElementsByTagName("link");
					for (var i = 0; i < linktags.length; i++) {
						if (linktags[i].rel === "canonical") {
							document.getElementsByTagName("link")[i].href = data["canonical_url"];
						}
					}
				}
				else {
					var linktags = document.getElementsByTagName("link");
					for (var i = 0; i < linktags.length; i++) {
						if (linktags[i].rel === "canonical") {
							document.getElementsByTagName("link")[i].remove();
						}
					}
				}
				//Metatags to postpage	
				var hostname = window.location.hostname;
				var metatags = document.getElementsByTagName("meta");


				for (var i = 0; i < metatags.length; i++) {
					if (metatags[i].name === "description") {
						document.getElementsByTagName("meta")[i].content = data["desc"];
					}
					if (metatags[i].name === "title") {
						document.getElementsByTagName("meta")[i].content = data["title"];
					}
					if (metatags[i].name === "host_name") {
						document.getElementsByTagName("meta")[i].content = 'https://' + hostname;
					}
					if (metatags[i].name === "publish_date") {
						document.getElementsByTagName("meta")[i].content = dateToMDY(data["publish_date"].value);
					}
					if (typeof SCSRenderAPI.getCustomSiteProperty('GoogleSiteVerification') !== "undefined") {
						if (SCSRenderAPI.getCustomSiteProperty('GoogleSiteVerification') != '') {
							var GoogleSiteVerification = SCSRenderAPI.getCustomSiteProperty('GoogleSiteVerification');
							if (metatags[i].name === "google-site-verification") {
								document.getElementsByTagName("meta")[i].content = GoogleSiteVerification;
							}

						} else {
							//console.log("google1" + GoogleSiteVerification);
							//document.getElementsByTagName("meta")[i].remove();

						}
					}
					else {
						//console.log("google2" + GoogleSiteVerification);
						if (metatags[i].name === "google-site-verification") {
							document.getElementsByTagName("meta")[i].remove();
						}
					}

				}
				//og tags
				var posturl = window.location.href;
				if (data["featured_image"]) {
					data["featured_image"]["url"] = contentClient.getRenditionURL({ "id": data["featured_image"].id });
					document.querySelector('meta[property="og:image"]').setAttribute("content", data["featured_image"]["url"]);
				}
				document.querySelector('meta[property="og:title"]').setAttribute("content", data["title"]);
				document.querySelector('meta[property="og:description"]').setAttribute("content", data["desc"]);
				document.querySelector('meta[property="og:url"]').setAttribute("content", posturl);

			});




			// If any referenced items exist, fetch them before we render.
			Promise.all([
				updateContentURLs(contentClient, data["body"]),
				getRefItems(contentClient, referedIds)
			]).then(function (results) {

				data["body"] = parseMarkdown(contentClient.expandMacros(results[0]));		
				var author_id;
				var items = results[1] && results[1].items || [];
				//console.log("insidefun" + items.id);
				//var author = results && results.items && results.items[0] || [];
				//author.fields = contentClient.getInfo().contentVersion === 'v1' ? author.data : author.fields;

				//content.author_id = author.id;

				// Support v1 bulk query.
				if (!Array.isArray(items)) {
					var newItems = [];
					Object.keys(items).forEach(function (key) {
						newItems.push(items[key]);
					});
					items = newItems;
				}
				// Store the retrieved referenced items in the data used by the template.
				items.forEach(function (item) {
					// Massage the data so that the 'fields' property is always there.
					// The corresponding layout.html template only checks for the ‘fields’ property.
					if (!contentClient.getInfo().contentVersion || contentClient.getInfo().contentVersion === "v1") {
						item["fields"] = item.data;
					}

					moreItems = data["author"] || [];

					// Retrieve the reference item from the query result.
					moreItems.forEach(function (nxtItem) {
						if (nxtItem.id === item.id) {
							item.fields.detail_url = SCSRenderAPI.getPageLinkData(403, {
								'contentType': item.type,
								'contentId': item.id,
								'contentName': item.slug || item.name
							});
							const Default_Image = "/assets/img/ui_defaultuserimage.jpg";
							var default_profile_img = SCSRenderAPI.getThemeUrlPrefix() + Default_Image;
							//item.fields.profile_image_url = contentClient.getRenditionURL({"id":item.fields.profile_image.id,"type": "Thumbnail", "format": "jpg"});
							if (item.fields.profile_image != null) {
								item.fields.profile_image_url = contentClient.getRenditionURL({ "id": item.fields.profile_image.id, "type": "Thumbnail", "format": "jpg" });
								
							}
							else {
								item.fields.profile_image_url = default_profile_img;
							}
							if (item.fields.job_title != null){
								item.fields.Author_job_title = item.fields.job_title
								
							}
							
							var metatags = document.getElementsByTagName("meta");
							for (var i = 0; i < metatags.length; i++) {
								if (metatags[i].name === "author") {
									document.getElementsByTagName("meta")[i].content = item.name;
								}
								if (metatags[i].name === "blog_name") {
									document.getElementsByTagName("meta")[i].content = item.name;
								}
							}
							nxtItem["contentItem"] = item;
						}


					});

				});

				try {
					// Use Mustache to expand the HTML template with the data.
					template = Mustache.render(templateHtml, content);

					// Insert the expanded template into the passed in container.
					if (template) {
						$(parentObj).append(template);
						$("#category-id").appendTo('#categories');
						//getFontsize();
						loadExternal();
						//featuredImgSettings();
					}

				} catch (e) {
					console.error(e.stack);
				}
				pageFunctions();
			});
		}
	};

	return ContentLayout;
});