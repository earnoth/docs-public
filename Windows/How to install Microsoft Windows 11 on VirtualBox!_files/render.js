/**
 * Confidential and Proprietary for Oracle Corporation
 *
 * This computer program contains valuable, confidential, and
 * proprietary information. Disclosure, use, or reproduction
 * without the written authorization of Oracle is prohibited.
 * This unpublished work by Oracle is protected by the laws
 * of the United States and other countries. If publication
 * of this computer program should occur, the following notice
 * shall apply:
 *
 * @preserve Copyright (c) 2015, 2021, Oracle and/or its affiliates.
 */

/* globals define */
define([
	'knockout',
	'jquery',
	'css!./styles/design.css'
], function (ko, $, css) {
	'use strict';
	// ----------------------------------------------
	// Define a Knockout Template for your component
	// ----------------------------------------------
	var sampleComponentTemplate = `<!-- ko if: initialized -->
	<section class="rc83 rc83v0 rw-neutral-00bg cpad xwidth">
    <div class="rc83w1 cwidth">
        <div class="rc83pagenav">
		 
            <div class="rc83nav-lt" data-bind="if: prevPostTitle">
				<a data-bind="attr: { href: prevPostLink}" class="rc83arrow-lt">
                    <div class="icn-img icn-chevron-left"><br /></div>
                    <p id="PreviousPostText"></p>
                </a>
                <h4 data-bind="text: prevPostTitle"></h4>
                <div class="rc83sub">
                    <span><a data-bind="attr: {href:prevPostAuthorLink},text:prevPostAuthor"></a> | </span><span data-bind="text: prevPostTimeToRead"></span><span> min read</span>
                </div>
             </div>
			
			
            <div class="rc83nav-rt"  data-bind="if: nextPostTitle">
                <a data-bind="attr: { href: nextPostLink}" class="rc83arrow-rt">
                    <p id="NextPostText"></p>
                    <div class="icn-img icn-chevron-right"><br /></div>
                </a>
                <h4 data-bind="text: nextPostTitle"></h4>
                <div class="rc83sub">
                    <span><a data-bind="attr: {href:nextPostAuthorLink},text:nextPostAuthor"></a> | </span><span data-bind="text: nextPostTimeToRead"></span><span> min read</span>
                </div>
             </div>
			
        </div>
    </div>
</section>
<!-- /ko -->`;


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
		self.publishDate = ko.observable('');
		self.nextPostTitle = ko.observable('');
		self.nextPostLink = ko.observable('');
		self.prevPostTitle = ko.observable('');
		self.prevPostLink = ko.observable('');
		self.nextPostTimeToRead = ko.observable('');
		self.prevPostTimeToRead = ko.observable('');
		self.nextPostAuthor = ko.observable('');
		self.prevPostAuthor = ko.observable('');
		self.nextPostAuthorLink = ko.observable('placeholder.html');
		self.prevPostAuthorLink = ko.observable('placeholder.html');
		
		// handle initialization 
		self.initialized = ko.observable(false);		
		// 
		// Handle property changes
		//
		self.updateCustomSettingsData = function (data) {
			var customSettingsData = data && data.value || data;
			console.log('customSettingsData', customSettingsData);
            self.initialized(true);
		};
		
		//Get Next Post Details
		async function getNextPostDetails(publishDate) {
            var title = "";
			var postLink = "";
			var timetoread = "";
			var authorId = "";
			var authorLink = "";
            if (publishDate !== undefined) {
                var channelToken = window.SCS.siteInfo.properties.channelAccessTokens ? window.SCS.siteInfo.properties.channelAccessTokens[0].value : "";
                if(!channelToken)
                    self.displayError(true);
                await $.ajax({
                    type: 'GET',
					async: false,
                    url: window.location.origin + '/content/published/api/v1.1/items?q=(type eq \"Blog-Post\" AND fields.publish_date gt \"' + publishDate + '\")&orderBy=fields.publish_date%3Aasc&channelToken=' + channelToken + '&cb=' + SCSCacheKeys.caas + '&limit=1',
                    dataType: 'json',
                    'headers': {
                        'Authorization': self.authorization
                    }
                }).done(async function(data) {
                    title = data.items[0].fields.title;
					var slug = data.items[0].slug;
					timetoread = data.items[0].fields.time_to_read;
					authorId = data.items[0].fields.author[0].id;
					var childrenPages = SCS.structureMap[SCS.navigationRoot].children;
                    if (!childrenPages) return; // No pages
                    // Find the Category page
                    for (var i = 0; i < childrenPages.length; i++) {
                         var page = SCS.structureMap[childrenPages[i]];
                         if (page.name === 'Post Detail') {
                             var linkData = SCSRenderAPI.getPageLinkData(page.id);
                             if (linkData && linkData.href) {
                                 var href = linkData.href;
								 href = href.replace(".html","");
							 }
						 }
					}
					postLink = href.concat("/",slug);
					var nextPostAuthor=await getAuthorDetails(authorId);
					self.nextPostAuthor(nextPostAuthor[0]);
					var nextPostAuthorSlug = nextPostAuthor[1];
					for (var i = 0; i < childrenPages.length; i++) {
                         var page = SCS.structureMap[childrenPages[i]];
                         if (page.name === 'Authors') {
                             var linkData = SCSRenderAPI.getPageLinkData(page.id);
                             if (linkData && linkData.href) {
                                 var authorhref = linkData.href;
								 authorhref = authorhref.replace(".html","");
							 }
						 }
					}
					authorLink = authorhref + "/Blog-Author/" + authorId + "/" + nextPostAuthorSlug;
                    self.nextPostAuthorLink(authorLink);	
                }).fail(function(jqXHR, textStatus, errorThrown) {
                    console.error("Unable to get next post details ", jqXHR, textStatus, errorThrown);
                });
				return [title,postLink,timetoread];
            }
			
        };
		
		
		//Get Previous Post Details
		async function getPreviousPostDetails(publishDate) {
            var title = "";
			var postLink = "";
			var timetoread = "";
			var authorId = "";
			var authorLink = "";
            if (publishDate !== undefined) {
                var channelToken = window.SCS.siteInfo.properties.channelAccessTokens ? window.SCS.siteInfo.properties.channelAccessTokens[0].value : "";
                if(!channelToken)
                    self.displayError(true);
                await $.ajax({
                    type: 'GET',
					async: false,
                    url: window.location.origin + '/content/published/api/v1.1/items?q=(type eq \"Blog-Post\" AND fields.publish_date lt \"' + publishDate + '\")&orderBy=fields.publish_date%3Ades&channelToken=' + channelToken +'&cb=' + SCSCacheKeys.caas + '&limit=1',
                    dataType: 'json',
                    'headers': {
                        'Authorization': self.authorization
                    }
                }).done(async function(data) {
                    title = data.items[0].fields.title;
					var slug = data.items[0].slug;
					timetoread = data.items[0].fields.time_to_read;
					authorId = data.items[0].fields.author[0].id;
					var childrenPages = SCS.structureMap[SCS.navigationRoot].children;
                    if (!childrenPages) return; // No pages
                    // Find the Category page
                    for (var i = 0; i < childrenPages.length; i++) {
                         var page = SCS.structureMap[childrenPages[i]];
                         if (page.name === 'Post Detail') {
                             var linkData = SCSRenderAPI.getPageLinkData(page.id);
                             if (linkData && linkData.href) {
                                 var href = linkData.href;
								 href = href.replace(".html","");
							 }
						 }
					}
					postLink = href.concat("/",slug);
					console.log("AuthorID: " + authorId);
					var prevPostAuthor=await getAuthorDetails(authorId);
					var prevPostAuthorSlug = prevPostAuthor[1];
			        self.prevPostAuthor(prevPostAuthor[0]);
					for (var i = 0; i < childrenPages.length; i++) {
                         var page = SCS.structureMap[childrenPages[i]];
                         if (page.name === 'Authors') {
                             var linkData = SCSRenderAPI.getPageLinkData(page.id);
                             if (linkData && linkData.href) {
                                 var authorhref = linkData.href;
								 authorhref = authorhref.replace(".html","");
							 }
						 }
					}
					authorLink = authorhref + "/Blog-Author/" + authorId + "/" + prevPostAuthorSlug;
                    self.prevPostAuthorLink(authorLink);					
					console.log("Author: " + self.prevPostAuthor());
                }).fail(function(jqXHR, textStatus, errorThrown) {
                  
                    console.error("Unable to get previous post details ", jqXHR, textStatus, errorThrown);
                });
					return [title,postLink,timetoread];
            }
        };
		
		
		//Get Author Details
		async function getAuthorDetails(authorId) {
            var authorName = "";
			var authorSlug = "";
            if (authorId !== undefined) {
                var channelToken = window.SCS.siteInfo.properties.channelAccessTokens ? window.SCS.siteInfo.properties.channelAccessTokens[0].value : "";
                if(!channelToken)
                    self.displayError(true);
                await $.ajax({
                    type: 'GET',
					async: false,
                    url: window.location.origin + '/content/published/api/v1.1/items/' + authorId + '?channelToken=' + channelToken+'&cb=' + SCSCacheKeys.caas,
                    dataType: 'json',
                    'headers': {
                        'Authorization': self.authorization
                    }
                }).done(async function(data) {
                    authorName = data.name;
					authorSlug = data.slug;
                }).fail(function(jqXHR, textStatus, errorThrown) {
                  
                    console.error("Unable to get Author Details ", jqXHR, textStatus, errorThrown);
                });
					return [authorName,authorSlug];
            }
        };
		
		
		
	    self.executeActionsListener = async function (args) {

          // get action and payload
          var payload = $.isArray(args.payload) ? args.payload[0] : {};
          var action = args.action;	  
		  console.log("Action: " + action.actionName);
          // handle 'getPublishDate' actions
		  
		  if (action && action.actionName === 'getPublishDate') {
            self.publishDate(payload.payloadData);
			SCSMacros.blogFilter=payload.payloadData;
			console.log("Pub: " + self.publishDate());
			var nextPostDetails=await getNextPostDetails(self.publishDate());
			self.nextPostTitle(nextPostDetails[0]);
			console.log("TitleNext: " + self.nextPostTitle());
			self.nextPostLink(nextPostDetails[1]);
			self.nextPostTimeToRead(nextPostDetails[2]);
			var prevPostDetails=await getPreviousPostDetails(self.publishDate());
			self.prevPostTitle(prevPostDetails[0]);
			self.prevPostLink(prevPostDetails[1]);
			self.prevPostTimeToRead(prevPostDetails[2]);
         }
        }
		
		// listen for settings update
		SitesSDK.subscribe(SitesSDK.MESSAGE_TYPES.SETTINGS_UPDATED, $.proxy(self.updateCustomSettingsData, self));
		
		//listen for trigger for getting published date
		SitesSDK.subscribe('EXECUTE_ACTION', $.proxy(self.executeActionsListener, self));


		//
		// Initialize the componentLayout & customSettingsData values
		//
		SitesSDK.getProperty('customSettingsData', self.updateCustomSettingsData);
	};
	function getProperties(){
				var PreviousPostProperty,
                NextPostProperty;
                if (typeof SCSRenderAPI.getCustomSiteProperty('PreviousPostText') !== "undefined" && document.getElementById("PreviousPostText") && SCSRenderAPI.getCustomSiteProperty('PreviousPostText') != '') {
                    PreviousPostProperty = SCSRenderAPI.getCustomSiteProperty('PreviousPostText');
                    document.getElementById("PreviousPostText").innerHTML= PreviousPostProperty;        
                }else if(document.getElementById("PreviousPostText")){
                    document.getElementById("PreviousPostText").innerHTML= 'Previous Post';
                     
                }
                if (typeof SCSRenderAPI.getCustomSiteProperty('NextPostText') !== "undefined" && document.getElementById("NextPostText") && SCSRenderAPI.getCustomSiteProperty('NextPostText') != '') {
                     
                    NextPostProperty = SCSRenderAPI.getCustomSiteProperty('NextPostText');
                    document.getElementById("NextPostText").innerHTML= NextPostProperty;        
                }else if(document.getElementById("NextPostText")){
                    document.getElementById("NextPostText").innerHTML= 'Next Post';
                     
                }
	}


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
			sampleComponentTemplate +
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
			getProperties();
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