/* globals define */
define(['knockout', 'jquery', 'css!./styles/design.css', 'text!./render.html'], function (ko, $, css, template) {
	'use strict';

	// ----------------------------------------------
	// Define a Knockout ViewModel for your template
	// ----------------------------------------------
	var SampleComponentViewModel = function (args) {
		var self = this,
			SitesSDK = args.SitesSDK;

		// store the args
		self.mode = args.viewMode;
		self.id = args.id;

		// create the observables
		self.taxonomyId = ko.observable();
		self.categories = ko.observableArray([]);
		self.relatedContent = ko.observableArray([]);

		async function getApiName(taxonomy, categoryId) {
			var apiName = "";
			if (categoryId !== undefined && taxonomy !== undefined) {
				var channelToken = window.SCS.siteInfo.properties.channelAccessTokens ? window.SCS.siteInfo.properties.channelAccessTokens[0].value : "";
				if (!channelToken)
					self.displayError(true);
				await $.ajax({
					type: 'GET',
					async: false,
					url: window.location.origin + '/content/published/api/v1.1/taxonomies/' + taxonomy + '/categories/' + categoryId + '?orderBy=position:asc&channelToken=' + channelToken + '&cb=' + SCSCacheKeys.caas,
					dataType: 'json',
					'headers': {
						'Authorization': self.authorization
					}
				}).done(async function (data) {
					apiName = data.apiName;
					//console.log("APINAME: " + apiName);


				}).fail(function (jqXHR, textStatus, errorThrown) {
					// Display error message to users in all modes except live mode if site has no taxonomies
					console.error("Unable to get categories ", jqXHR, textStatus, errorThrown);
				});
				return apiName;
			}

		};


		// To get list of categories for a taxonomy
		self.getCategoriesFromTaxonomy = function (taxonomy) {
			var categories = [];
			// Get the Categories assigned to the currently selected Taxonomy
			if (taxonomy !== undefined) {
				var channelToken = window.SCS.siteInfo.properties.channelAccessTokens ? window.SCS.siteInfo.properties.channelAccessTokens[0].value : "";
				if (!channelToken)
					self.displayError(true);
				$.ajax({
					type: 'GET',
					url: window.location.origin + '/content/published/api/v1.1/taxonomies/' + taxonomy + '/categories?orderBy=position:asc&fields=name,id,apiName,parent,description&channelToken=' + channelToken + '&cb=' + SCSCacheKeys.caas,
					dataType: 'json',
					'headers': {
						'Authorization': self.authorization
					}
				}).done(async function (data) {
					var childrenPages = SCS.structureMap[SCS.navigationRoot].children;
					if (!childrenPages) return; // No pages
					// Find the Category page
					for (var i = 0; i < childrenPages.length; i++) {
						var page = SCS.structureMap[childrenPages[i]];
						if (page.name === 'Category') {
							var linkData = SCSRenderAPI.getPageLinkData(page.id);
							if (linkData && linkData.href) {
								var href = linkData.href;
								href = href.replace(".html", "");
							}
						}
					}
					for (const category of data.items) {
						// var apiName = await getApiName(taxonomy, category.id);
						// console.log("apiname: " + apiName);
						category.href = href.concat("/", category.apiName);	
					}
					let parentCategories = data.items.filter(item =>{
						if(!item.parent){
							item['subCategories'] = [item];
							return item;
						}
					} );
					data.items.forEach(item => {
						if(item.parent){
							parentCategories.forEach(parentItem =>{
								if(parentItem.id === item.parent.id){
									
									parentItem.subCategories.push(item);
								}
							});
						}
					});
					console.log('parentcateogires', parentCategories)
					// categories = data.items;
					//console.log("Categories0: " + categories[0].name);
					
					
					// if(categories.length>0){
					// 	$('#categories-menu').show();
					// } else {
					// 	$('#categories-menu').hide();
					// }
					self.categories(parentCategories);
				}).fail(function (jqXHR, textStatus, errorThrown) {
					// Display error message to users in all modes except live mode if site has no taxonomies
					console.error("Unable to get categories ", jqXHR, textStatus, errorThrown);
				});
			}
		};


		// 
		// Handle property changes
		//
		self.updateCustomSettingsData = $.proxy(function (customData) {
			if (customData) {
				self.taxonomyId(customData && customData.taxonomyId);
				self.getCategoriesFromTaxonomy(self.taxonomyId());
			}
		}, self);

		self.updateSettings = function (settings) {
			if (settings.property === 'customSettingsData') {
				self.updateCustomSettingsData(settings.value);
			}
		};
		$(document).ready(function () {
			var relatedContent = [];
			for (let i = 1; i <= 20; i++) {
				if (typeof SCSRenderAPI.getCustomSiteProperty('MenuLink' + i) !== "undefined" && SCSRenderAPI.getCustomSiteProperty('MenuLink' + i)) {
					var linkArr = SCSRenderAPI.getCustomSiteProperty('MenuLink' + i).split(',')
					relatedContent.push({ name: linkArr[0], href: linkArr[1] });
				} else {
					break;
				}
			}
			self.relatedContent(relatedContent);
			
			
		});
		$(document).on('click', '#categories-menu .hasMenu', function (e) {
			e.preventDefault();
			$('.mainMenu').not(this).each(function(){
				$(this).hide();
			});
			// $('.hasMenu').hide();
		
			$('.categories-text').hide();
			$('.categ-menu').addClass('categ-active');
		   $(this).parent('.mainMenu').show();
		//    $(this).siblings('.sub-categories').show();
		   $(this).siblings('.sub-categories').addClass('active');
		   $(this).removeClass('active');
		   $('.back-btn').show();	
		});
		$(document).on('click', '.back-btn', function (e) {
			$('.mainMenu').show();
		
			$('.categories-text').show();
			// $('.sub-categories').hide();
			// $('.hasMenu').show();
			$('.back-btn').hide();
			$('.sub-categories').removeClass('active');
			$('.hasMenu').addClass('active');
			$('.categ-menu').removeClass('categ-active');
			
		});
		
		// listen for settings update
		SitesSDK.subscribe(SitesSDK.MESSAGE_TYPES.SETTINGS_UPDATED, $.proxy(self.updateSettings, self));


		//
		// Initialize the componentLayout & customSettingsData values
		//
		SitesSDK.getProperty('customSettingsData', self.updateCustomSettingsData);
	};
	
	$(document).ready(function () {
		$("#category-id").appendTo('#categories');
		if(SCS && SCS['siteId'] === "Blogs-Home"){
			$('#contentSearch').hide();
			$('#customSearch').show();
		} else {
			$('#customSearch').hide();
			$('#contentSearch').show();
		}
		var SubscribeHeading,
			SubscribeLink,
			SubscribeSearchBlogs,
			SubscribeButtonTop,
			SubscribeButtonFooter;
		if (typeof SCSRenderAPI.getCustomSiteProperty('BlogNavTitle') !== "undefined") {
			if (SCSRenderAPI.getCustomSiteProperty('BlogNavTitle') != '') {
				document.querySelectorAll('.blog-name').forEach(item => item.innerHTML = SCSRenderAPI.getCustomSiteProperty('BlogNavTitle'));
				var pathArray = window.location.pathname.split('/');
		
				if (pathArray[1] === "site") {
					document.querySelector('.blog-name').href = `${window.location.origin}/site/${pathArray[2]}/`
				} else if (pathArray[1] === "post" || pathArray[1] === "category" || pathArray[1] === "authors" || pathArray[1] === "search.html" || window.location.pathname =="/" || !window.location.pathname) {
					document.querySelector('.blog-name').href = `${window.location.origin}/`
				} else {
					document.querySelector('.blog-name').href = `${window.location.origin}/${pathArray[1]}/`
				}

			} else {
				console.log("blog nav title is blank.");
			}
		}
		if (typeof SCSRenderAPI.getCustomSiteProperty('Subtitle') !== "undefined" && SCSRenderAPI.getCustomSiteProperty('Subtitle') != '') {
			if(document.querySelector(".rh03subtitle p")){
				document.querySelector(".rh03subtitle p").innerHTML = SCSRenderAPI.getCustomSiteProperty('Subtitle');
			}
		} else {
			console.log("blog nav subtitle is blank.");
		}

		// if (typeof SCSRenderAPI.getCustomSiteProperty('BannerDescription') !== "undefined" && SCSRenderAPI.getCustomSiteProperty('BannerDescription') != '') {
		// 	document.getElementById("bannerDescription").innerHTML = SCSRenderAPI.getCustomSiteProperty('BannerDescription');
		// } else if (typeof SCSRenderAPI.getCustomSiteProperty('BlogNavTitle') !== "undefined" && SCSRenderAPI.getCustomSiteProperty('BlogNavTitle') != ''){
		// 	document.getElementById("bannerDescription").innerHTML = SCSRenderAPI.getCustomSiteProperty('BlogNavTitle');
		// }
		
		let rssUrl;
		if (pathArray[1] === "site") {
			rssUrl = `${window.location.origin}/site/${pathArray[2]}/rss.xml`
		} else if (pathArray[1] === "post" || pathArray[1] === "category" || pathArray[1] === "authors" || pathArray[1] === "search.html" || window.location.pathname =="/" || !window.location.pathname) {
			rssUrl = `${window.location.origin}/rss`
		} else {
			rssUrl = `${window.location.origin}/${pathArray[1]}/rss`
		}

		$('.rss-link').attr('href', rssUrl);


		var LangSelected,
			Globe;
		if (typeof SCSRenderAPI.getCustomSiteProperty('LanguageSelector1') !== "undefined") {

			// document.getElementById("globe").src= "_scs_theme_root_/assets/img/globe.png";	
			LangSelected = document.getElementsByClassName("u18-langselect");
			LangSelected[0].style.display = "block";
			// Globe = document.getElementsByClassName("globe");
			// Globe[0].style.display = "block";

		}
		else {

			LangSelected = document.getElementsByClassName("u18-langselect");
			LangSelected[0].style.display = "none";
			// Globe = document.getElementsByClassName("globe");
			// Globe[0].style.display = "none";

		}
		//Adding MutlipleLanguage blogs to LangaugeGlobe on the Menu
		for (var i = 1; i < 10; i++) {
			if (typeof SCSRenderAPI.getCustomSiteProperty('LanguageSelector' + [i]) !== "undefined") {
				var LanguageSelector = [];
				LanguageSelector[i] = SCSRenderAPI.getCustomSiteProperty('LanguageSelector' + [i]);
				var strArray = LanguageSelector[i].split(",");
				var a = document.createElement("a");
				var ulist = document.getElementById("languagelist");
				var newItem = document.createElement("li");

				a.append("class", "u18v1w5v1");
				a.textContent = strArray[0];
				a.setAttribute('href', strArray[1]);
				newItem.appendChild(a);
				ulist.appendChild(newItem);
			}

		}
		/*if (typeof SCSRenderAPI.getCustomSiteProperty('SubscribeHeading') !== "undefined") {
			if (SCSRenderAPI.getCustomSiteProperty('SubscribeHeading') != '') {			
				 SubscribeHeading = SCSRenderAPI.getCustomSiteProperty('SubscribeHeading');
				 document.querySelectorAll('.subscribeheading').forEach(item => item.innerHTML = SubscribeHeading);
			}else{
				console.log("Subscribe heading is blank.");
				document.querySelectorAll('.subscribeheading').forEach(item => item.innerHTML = "Subscribe to Oracle blogs for daily alerts and stay connected");
			}
		}*/
		if (typeof SCSRenderAPI.getCustomSiteProperty('SubscribeHeading') !== "undefined" && SCSRenderAPI.getCustomSiteProperty('SubscribeHeading') != '') {
			SubscribeHeading = SCSRenderAPI.getCustomSiteProperty('SubscribeHeading');
			document.querySelectorAll('.subscribeheading').forEach(item => item.innerHTML = SubscribeHeading);
		}
		else {
			//console.log("Subscribe heading is blank.");
			document.querySelectorAll('.subscribeheading').forEach(item => item.innerHTML = "Subscribe to receive the latest blog updates");
		}
		if (typeof SCSRenderAPI.getCustomSiteProperty('EmailSubscriptionURL') !== "undefined" && document.getElementById("subscribebuttonfooter") && SCSRenderAPI.getCustomSiteProperty('EmailSubscriptionURL') != '') {
			SubscribeLink = SCSRenderAPI.getCustomSiteProperty('EmailSubscriptionURL');
			document.getElementById("subscribebuttonfooter").href = SubscribeLink;
		}
		else if(document.getElementById("subscribebuttonfooter")){
			//console.log("Subscribe url is blank.");
			document.getElementById("subscribebuttonfooter").href = "https://go.oracle.com/LP=28277?elqCampaignId=124071&nsl=ocl&src1=:ow:o:bl:sb:::RC_WWMK210603P00162:Blogs_HP_FY22&intcmp=WWMK171102P00015:ow:o:bl:sb:::RC_WWMK210603P00162:Blogs_HP_FY22";
		}

		if (typeof SCSRenderAPI.getCustomSiteProperty('EmailSubscriptionURL') !== "undefined" && document.getElementById("subscribebuttontop") && SCSRenderAPI.getCustomSiteProperty('EmailSubscriptionURL') != '') {
			SubscribeLink = SCSRenderAPI.getCustomSiteProperty('EmailSubscriptionURL');
			document.getElementById("subscribebuttontop").href = SubscribeLink;
		}
		else if(document.getElementById("subscribebuttontop")){
			//console.log("Subscribe url is blank.");
			document.getElementById("subscribebuttontop").href = "https://go.oracle.com/LP=28277?elqCampaignId=124071&nsl=ocl&src1=:ow:o:bl:sb:::RC_WWMK210603P00162:Blogs_HP_FY22&intcmp=WWMK171102P00015:ow:o:bl:sb:::RC_WWMK210603P00162:Blogs_HP_FY22";
		}
		if (typeof SCSRenderAPI.getCustomSiteProperty('EmailSubscriptionText') !== "undefined" && document.getElementById("subscribebuttontop") && SCSRenderAPI.getCustomSiteProperty('EmailSubscriptionText') != '') {
			SubscribeButtonTop = SCSRenderAPI.getCustomSiteProperty('EmailSubscriptionText');
			document.getElementById("subscribebuttontop").innerHTML= SubscribeButtonTop;
				
		}
		else if(document.getElementById("subscribebuttontop")){
			document.getElementById("subscribebuttontop").innerHTML= "Subscribe to email updates";
		}
	

		if (typeof SCSRenderAPI.getCustomSiteProperty('EmailSubscriptionText') !== "undefined" && document.getElementById("subscribebuttonfooter") && SCSRenderAPI.getCustomSiteProperty('EmailSubscriptionText') != '') {
				SubscribeButtonFooter = SCSRenderAPI.getCustomSiteProperty('EmailSubscriptionText');
				document.getElementById("subscribebuttonfooter").innerHTML = SubscribeButtonFooter;
		}
		else if(document.getElementById("subscribebuttonfooter")){
				document.getElementById("subscribebuttonfooter").innerHTML = "Subscribe to email updates";
		}
		if (typeof SCSRenderAPI.getCustomSiteProperty('SubscribeSearchBlogs') !== "undefined" && document.getElementById("subscribesearchblogs") && SCSRenderAPI.getCustomSiteProperty('SubscribeSearchBlogs') != '') {
					
			SubscribeSearchBlogs = SCSRenderAPI.getCustomSiteProperty('SubscribeSearchBlogs');
			document.getElementById("subscribesearchblogs").innerHTML= SubscribeSearchBlogs;		
		}else if(document.getElementById("subscribesearchblogs")){
			document.getElementById("subscribesearchblogs").innerHTML= 'Search Oracle Blogs';
			
		}
	
	})
	
	// ----------------------------------------------
	// Create a knockout based component implemention
	// ----------------------------------------------
	var SampleComponentImpl = function (args) {
		// Initialze the custom component
		this.init(args);
	};
	// initialize all the values within the component from the given argument values
	SampleComponentImpl.prototype.init = function (args) {
		this.createViewModel(args);
		this.createTemplate(args);
		this.setupCallbacks();
	};
	// create the viewModel from the initial values
	SampleComponentImpl.prototype.createViewModel = function (args) {
		// create the viewModel
		this.viewModel = new SampleComponentViewModel(args);
	};
	// create the template based on the initial values
	SampleComponentImpl.prototype.createTemplate = function (args) {
		// create a unique ID for the div to add, this will be passed to the callback
		this.contentId = args.id + '_content_' + args.viewMode;
		// create a hidden custom component template that can be added to the DOM
		this.template = '<div id="' + this.contentId + '">' +
			template +
			'</div>';
	};
	//
	// SDK Callbacks
	// setup the callbacks expected by the SDK API
	//
	SampleComponentImpl.prototype.setupCallbacks = function () {
		//
		// callback - render: add the component into the page
		//
		this.render = $.proxy(function (container) {
			var $container = $(container);
			// add the custom component template to the DOM
			$container.append(this.template);
			// apply the bindings
			ko.applyBindings(this.viewModel, $('#' + this.contentId)[0]);
		}, this);
		//
		// callback - update: handle property change event
		//
		this.update = $.proxy(function (args) {
			var self = this;
			// deal with each property changed
			$.each(args.properties, function (index, property) {
				if (property) {
					if (property.name === 'customSettingsData') {
						self.viewModel.updateComponentData(property.value);
					} else if (property.name === 'componentLayout') {
						self.viewModel.updateLayout(property.value);
					}
				}
			});
		}, this);
		//
		// callback - dispose: cleanup after component when it is removed from the page
		//
		this.dispose = $.proxy(function () {
			// nothing required for this sample since knockout disposal will automatically clean up the node
		}, this);
	};
	// ----------------------------------------------
	// Create the factory object for your component
	// ----------------------------------------------
	var sampleComponentFactory = {
		createComponent: function (args, callback) {
			// return a new instance of the component
			return callback(new SampleComponentImpl(args));
		}
	};
	return sampleComponentFactory;
});
