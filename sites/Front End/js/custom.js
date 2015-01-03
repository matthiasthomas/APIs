
	/*
	|--------------------------------------------------------------------------
	| GOOGLE ANALYTICS
	|--------------------------------------------------------------------------
	*/	
	/*************** REPLACE WITH YOUR OWN UA NUMBER ***********/
	window.onload = function () { "use strict"; gaSSDSLoad(); }; //load after page onload
	/*************** REPLACE WITH YOUR OWN UA NUMBER ***********/



$(document).ready(function() { 
	"use strict";
	$( ".neko-mega-menu" ).wrapInner( "<div></div>");

	/*
	|--------------------------------------------------------------------------
	| Revolution slider fullscreen
	|--------------------------------------------------------------------------
	*/	

	if($('#rs-slider-fullscreen').length){
		$('.tp-banner').show().revolution(
					{
						dottedOverlay:"twoxtwo",
						delay:16000,
						startwidth:1170,
						startheight:700,
						hideThumbs:200,
						
						thumbWidth:100,
						thumbHeight:50,
						thumbAmount:5,
						
						navigationType:"bullet",
						navigationArrows:"solo",
						navigationStyle:"preview4",
						
						touchenabled:"on",
						onHoverStop:"off",
						
						swipe_velocity: 0.7,
						swipe_min_touches: 1,
						swipe_max_touches: 1,
						drag_block_vertical: false,
												
						parallax:"mouse",
						parallaxBgFreeze:"on",
						parallaxLevels:[7,4,3,2,5,4,3,2,1,0],
												
						keyboardNavigation:"off",
						
						navigationHAlign:"center",
						navigationVAlign:"bottom",
						navigationHOffset:0,
						navigationVOffset:20,

						soloArrowLeftHalign:"left",
						soloArrowLeftValign:"center",
						soloArrowLeftHOffset:20,
						soloArrowLeftVOffset:0,

						soloArrowRightHalign:"right",
						soloArrowRightValign:"center",
						soloArrowRightHOffset:20,
						soloArrowRightVOffset:0,
								
						shadow:0,
						fullWidth:"off",
						fullScreen:"on",

						spinner:"spinner4",
						
						stopLoop:"off",
						stopAfterLoops:-1,
						stopAtSlide:-1,

						shuffle:"off",
						
						autoHeight:"off",						
						forceFullWidth:"off",						
												
												
												
						hideThumbsOnMobile:"off",
						hideNavDelayOnMobile:1500,						
						hideBulletsOnMobile:"off",
						hideArrowsOnMobile:"off",
						hideThumbsUnderResolution:0,
						
						hideSliderAtLimit:0,
						hideCaptionAtLimit:0,
						hideAllCaptionAtLilmit:0,
						startWithSlide:0,

						
					});
			$('#rs-slider-fullscreen').css('visibility', 'visible');
	}

	/*
	|--------------------------------------------------------------------------
	| Revolution slider fullwidth
	|--------------------------------------------------------------------------
	*/	

	if($('#rs-slider-fullwidth').length){
		$('.tp-banner').show().revolution(
					{
						dottedOverlay:"twoxtwo",
						delay:6000,
						startwidth:1170,
						startheight:700,
						hideThumbs:200,
						
						thumbWidth:100,
						thumbHeight:50,
						thumbAmount:5,
						
						navigationType:"bullet",
						navigationArrows:"solo",
						navigationStyle:"round",
						
						touchenabled:"on",
						onHoverStop:"off",
						
						swipe_velocity: 0.7,
						swipe_min_touches: 1,
						swipe_max_touches: 1,
						drag_block_vertical: false,
												
												
						keyboardNavigation:"on",
						
						navigationHAlign:"center",
						navigationVAlign:"bottom",
						navigationHOffset:0,
						navigationVOffset:20,

						soloArrowLeftHalign:"left",
						soloArrowLeftValign:"center",
						soloArrowLeftHOffset:20,
						soloArrowLeftVOffset:0,

						soloArrowRightHalign:"right",
						soloArrowRightValign:"center",
						soloArrowRightHOffset:20,
						soloArrowRightVOffset:0,
								
						shadow:0,
						fullWidth:"on",

						spinner:"spinner4",
						
						stopLoop:"off",
						stopAfterLoops:-1,
						stopAtSlide:-1,

						shuffle:"off",
						
						autoHeight:"off",						
						forceFullWidth:"off",						
												
												
												
						hideThumbsOnMobile:"off",
						hideNavDelayOnMobile:1500,						
						hideBulletsOnMobile:"off",
						hideArrowsOnMobile:"off",
						hideThumbsUnderResolution:0,
						
						hideSliderAtLimit:0,
						hideCaptionAtLimit:0,
						hideAllCaptionAtLilmit:0,
						startWithSlide:0,

						
					});
			$('#rs-slider-fullwidth').css('visibility', 'visible');
	}

	/*
	|--------------------------------------------------------------------------
	| Revolution slider fullwidth
	|--------------------------------------------------------------------------
	*/	

	if($('#rs-slider-elements').length){
		$('.tp-banner').show().revolution(
					{
						videoJsPath:"js-plugins/rs-plugin/videojs/",

						dottedOverlay:"none",
						delay:6000,
						startwidth:1170,
						startheight:700,
						hideThumbs:200,
						
						thumbWidth:100,
						thumbHeight:50,
						thumbAmount:5,
						
						navigationType:"bullet",
						navigationArrows:"solo",
						navigationStyle:"round",
						
						touchenabled:"on",
						onHoverStop:"off",
						
						swipe_velocity: 0.7,
						swipe_min_touches: 1,
						swipe_max_touches: 1,
						drag_block_vertical: false,
												
												
						keyboardNavigation:"on",
						
						navigationHAlign:"left",
						navigationVAlign:"bottom",
						navigationHOffset:0,
						navigationVOffset:20,

						soloArrowLeftHalign:"left",
						soloArrowLeftValign:"center",
						soloArrowLeftHOffset:20,
						soloArrowLeftVOffset:0,

						soloArrowRightHalign:"right",
						soloArrowRightValign:"center",
						soloArrowRightHOffset:20,
						soloArrowRightVOffset:0,
								
						shadow:0,
						fullWidth:"on",

						spinner:"spinner3",
						
						stopLoop:"off",
						stopAfterLoops:-1,
						stopAtSlide:-1,

						shuffle:"off",
						
						autoHeight:"off",						
						forceFullWidth:"off",						
												
												
												
						hideThumbsOnMobile:"off",
						hideNavDelayOnMobile:1500,						
						hideBulletsOnMobile:"off",
						hideArrowsOnMobile:"off",
						hideThumbsUnderResolution:0,
						
						hideSliderAtLimit:0,
						hideCaptionAtLimit:0,
						hideAllCaptionAtLilmit:0,
						startWithSlide:0,

						
					});
			$('#rs-slider-elements').css('visibility', 'visible');
	}

	


}); //End Doc Ready


/* ANALYTICS */
function gaSSDSLoad(acct) {
	"use strict";  
	var gaJsHost = (("https:" === document.location.protocol) ? "https://ssl." : "http://www."),
	pageTracker,
	s;
	s = document.createElement('script');
	s.src = gaJsHost + 'google-analytics.com/ga.js';
	s.type = 'text/javascript';
	s.onloadDone = false;
	function init () {
		pageTracker = _gat._getTracker(acct);
		pageTracker._trackPageview();
	}
	s.onload = function () {
		s.onloadDone = true;
		init();
	};
	s.onreadystatechange = function() {
		if (('loaded' === s.readyState || 'complete' === s.readyState) && !s.onloadDone) {
			s.onloadDone = true;
			init();
		}
	};
	document.getElementsByTagName('head')[0].appendChild(s);
}