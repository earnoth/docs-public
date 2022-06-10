

window.onload = function () {
	$(".u18v1").find("*").removeClass("scs-row")
	if ($(".search1-input .scs-search-input").val()) {
		$('.oclear').addClass('clearit')
	}
	if($('.u18 .search-input').val()){
		$('#u18clearsearch').addClass('u18clearit');
	}

	// var pageValue;
	// if (window.location.search.includes('page')) {
	// 	var url = new URL(window.location.href);
	// 	var pageValue = url.searchParams.get("page");
	// }

	if (SCS && SCS['siteId'] === "Blogs-Home") {
		$('#contentSearch').hide();
		$('#customSearch').show();
		if (window.location.origin.includes('orasites')) {
			$('form#u18-search-form').attr('action', '/site/Blogs-Home/search.html');
		} else {
			$('form#u18-search-form').attr('action', '/search.html');
		}
	} else {
		$('#customSearch').hide();
		$('#contentSearch').show();
	}

};

$(document).ready(function () {
	// clear search input
	// clear search input

	
	$('#u18clearsearch').on("click", function (e) {
		$('.u18 .scs-search-input').val('').focus();
		$('#u18clearsearch').attr('tabindex', -1).removeClass('u18clearit')
		e.preventDefault();
	});

	// close search if drop down is focused		
	$('.u18w2 a').on("focus", function () {
		u18closesearch();
		u18closedd();
	});

	// close search if drop down is focused		
	$('div.u18-ddlink a').on("focus", function () {
		if (!$(this).closest('.u18-dd-open')[0]) {
			u18closedd();
		}
		u18closesearch();
	});

	// hide/show search clear on input change

	$(document).off('input', '.search1-input .scs-search-input').on('input', '.search1-input .scs-search-input', function () {
		if ($(this).val() != '') {
			$('.oclear').attr('tabindex', 0).addClass('clearit')
		} else {
			$('.oclear').attr('tabindex', -1).removeClass('clearit')
		}
	});

	$(document).off('input', '.u18 #search .scs-search-input, #content-search .scs-search-input').on('input', '.u18 #search .scs-search-input', function () {
		if ($(this).val() != '') {
			$('#u18clearsearch').attr('tabindex', 0).addClass('u18clearit')
		} else {
			$('#u18clearsearch').attr('tabindex', -1).removeClass('u18clearit')
		}
	});
	$('div.u18-searchlink a').on("click", function (e) {
		if ($(".u18 #search .scs-search-input, #content-search .scs-search-input").val() != '') {
			$('#u18clearsearch').attr('tabindex', 0).addClass('u18clearit')
		} else {
			$('#u18clearsearch').attr('tabindex', -1).removeClass('u18clearit')
		}
	})
	$('div.oclear').on("click", function (e) {
		$('.search1-input .scs-search-input').val('').focus();
		$('.oclear').attr('tabindex', -1).removeClass('clearit')

		// if ($(".search1-input .scs-search-input").val() != '') {
		// 	$('.oclear').attr('tabindex', 0).addClass('clearit')
		// } else {
		// }
	})
	// try to focus on next link after header
	function u18focusnext() {
		var u18v2 = $('.u18v2');
		if (u18v2.next('section').find('a').first()[0]) {
			u18v2.next('section').find('a').first().focus()
		} else {
			$('#maincontent').focus();
		}
	}

	// drop down close function
	function u18closedd() {
		if ($('.u18-dd-open')[0]) {
			var om = $('.u18-dd-open');
			om.find('.u18-menu').attr('aria-hidden', 'true');
			om.removeClass('u18-dd-open').addClass('u18-dd-closing');
			setTimeout(function () {
				om.removeClass('u18-dd-closing');
			}, 200);
		}
	}

	// search close function
	function u18closesearch() {
		var sdiv = $('.u18-search-open');
		if (sdiv.is('.u18-search-open') && !sdiv.is('.u18-search-closing')) {
			sdiv.removeClass('u18-search-open').addClass('u18-search-closing');
			$('.u18 .scs-search-input').val('').blur();
			$('.u18-searchform').attr('aria-hidden', 'true');
			$('.u18-searchlink a').removeAttr('tabindex');
			setTimeout(function () {
				sdiv.removeClass('u18-search-closing');
				//				$('.u18 .scs-search-input').val('');
				$('#u18clearsearch').attr('tabindex', -1).removeClass('u18clearit');
			}, 250);
		}
	}
})
