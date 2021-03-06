/**
 * UpSolution Widget: w-search
 */
(function ($) {
	"use strict";

	$.fn.wSearch = function () {

		return this.each(function(){
			var $this = $(this),
				searchForm = $this.find('.w-search-form'),
				searchShow = $this.find('.w-search-show'),
				searchClose = $this.find('.w-search-close'),
				searchInput = searchForm.find('.w-search-input input'),
				searchOverlay = $this.find('.w-search-form-overlay'),
				$window = $(window),
				searchOverlayInitRadius = 25,
				$body = document.body || document.documentElement,
				$bodyStyle = $body.style,
				showHideTimer = null,
				searchHide = function(){
					searchInput.blur();
					searchForm.css({
						'-webkit-transition': 'opacity 0.4s',
						transition: 'opacity 0.4s'
					});
					window.setTimeout(function(){
						searchOverlay
							.removeClass('overlay-on')
							.addClass('overlay-out')
							.css({
								"-webkit-transform": "scale(0.1)",
								"transform": "scale(0.1)"
							});
						searchForm.css('opacity', 0);
						clearTimeout(showHideTimer);
						showHideTimer = window.setTimeout(function(){
							searchForm.css('display', 'none');
							searchOverlay.css('display', 'none');
						}, 700);
					}, 25);
				};

			// Handling virtual keyboards at touch devices
			if (jQuery.isMobile){
				searchInput
					.on('focus', function(){
						// Transforming hex to rgba
						var originalColor = searchOverlay.css('background-color'),
							overlayOpacity = searchOverlay.css('opacity'),
							matches;
						// RGB Format
						if (matches = /^rgb\((\d+), (\d+), (\d+)\)$/.exec(originalColor)){
							searchForm.css('background-color', "rgba("+parseInt(matches[1])+","+parseInt(matches[2])+","+parseInt(matches[3])+", "+overlayOpacity+")");
						}
						// Hex format
						else if (matches = /^#([\da-fA-F]{2})([\da-fA-F]{2})([\da-fA-F]{2})$/.exec(originalColor)){
							searchForm.css('background-color', "rgba("+parseInt(matches[1], 16)+","+parseInt(matches[2], 16)+","+parseInt(matches[3], 16)+", "+overlayOpacity+")");
						}
						// Fault tolerance
						else {
							searchForm.css('background-color', originalColor);
						}
						searchOverlay.addClass('mobilefocus');
					})
					.on('blur', function(){
						searchOverlay.removeClass('mobilefocus');
						searchForm.css('background-color', 'transparent');
					});
			}

			searchShow.click(function(){
				var searchPos = searchShow.offset(),
					searchWidth = searchShow.width(),
					searchHeight = searchShow.height();
				// Preserving scroll position
				searchPos.top -= $window.scrollTop();
				searchPos.left -= $window.scrollLeft();
				var overlayX = searchPos.left+searchWidth/2,
					overlayY = searchPos.top+searchHeight/2,
					winWidth = $us.canvas.winWidth,
					winHeight = $us.canvas.winHeight,
				// Counting distance to the nearest screen corner
					overlayRadius = Math.sqrt(Math.pow(Math.max(winWidth - overlayX, overlayX), 2) + Math.pow(Math.max(winHeight - overlayY, overlayY), 2)),
					overlayScale = (overlayRadius+15)/searchOverlayInitRadius;

				searchOverlay.css({
					width: searchOverlayInitRadius*2,
					height: searchOverlayInitRadius*2,
					left: overlayX,
					top: overlayY,
					"margin-left": -searchOverlayInitRadius,
					"margin-top": -searchOverlayInitRadius
				});
				searchOverlay
					.removeClass('overlay-out')
					.show();
				searchForm.css({
					opacity: 0,
					display: 'block',
					'-webkit-transition': 'opacity 0.4s 0.3s',
					transition: 'opacity 0.4s 0.3s'
				});
				window.setTimeout(function(){
					searchOverlay
						.addClass('overlay-on')
						.css({
							"-webkit-transform": "scale(" + overlayScale + ")",
							"transform": "scale(" + overlayScale + ")"
						});
					searchForm.css('opacity', 1);
					clearInterval(showHideTimer);
					showHideTimer = window.setTimeout(function() {
						searchInput.focus();
					}, 700);
				}, 25);
			});

			searchInput.keyup(function(e) {
				if (e.keyCode == 27) searchHide();
			});

			searchClose.on('click touchstart', searchHide);
		});
	};

	$(function(){
		jQuery('.l-header .w-search').wSearch();
	});
})(jQuery);


/**
 * UpSolution Widget: w-tabs
 */
!function( $ ){

	// Extending some of the methods for material design animations
	$us.WTabs.prototype._init = $us.WTabs.prototype.init;
	$us.WTabs.prototype.init = function(container, options){
		this.$tabsBar = $();
		this.curTabWidth = 0;
		this.tabHeights = [];
		this.tabTops = [];
		this._init(container, options);
	};
	$us.WTabs.prototype._cleanUpLayout = $us.WTabs.prototype.cleanUpLayout;
	$us.WTabs.prototype.cleanUpLayout = function(from){
		this._cleanUpLayout(from);
		if (from == 'default' || from == 'ver'){
			this.$tabsBar.remove();
		}
	};
	$us.WTabs.prototype._prepareLayout = $us.WTabs.prototype.prepareLayout;
	$us.WTabs.prototype.prepareLayout = function(to){
		this._prepareLayout(to);
		if (to == 'default' || to == 'ver'){
			this.$tabsBar = $('<div class="w-tabs-list-bar"></div>').appendTo(this.$tabsList);
		}
	};
	$us.WTabs.prototype._measure = $us.WTabs.prototype.measure;
	$us.WTabs.prototype.measure = function(){
		this._measure();
		if (this.basicLayout == 'default'){
			this.minWidth = Math.max.apply(this, this.tabWidths) * this.count;
			this.curTabWidth = this.tabs[0].outerWidth(true);
		}
		else if (this.basicLayout == 'ver'){
			this.tabHeights = [];
			for (var index = 0; index < this.tabs.length; index++){
				this.tabHeights.push(this.tabs[index].outerHeight(true));
				this.tabTops.push(index ? (this.tabTops[index-1] + this.tabHeights[index-1]) : 0);
			}
		}
	};
	// Counts bar position for certain element index and current layout
	$us.WTabs.prototype.barPosition = function(index){
		if (this.curLayout == 'default'){
			var barStartOffset = this.curTabWidth * index,
				barEndOffset = this.curTabWidth * (this.count - index - 1);
			return {
				left: this.isRtl ? barEndOffset : barStartOffset,
				right: this.isRtl ? barStartOffset : barEndOffset
			};
		}
		else if (this.curLayout == 'ver'){
			return {
				top: this.tabTops[index],
				height: this.tabHeights[index]
			};
		}
		else {
			return {};
		}
	};
	$us.WTabs.prototype._openSection = $us.WTabs.prototype.openSection;
	$us.WTabs.prototype.openSection = function(index){
		this._openSection(index);
		if (this.curLayout == 'default' || this.curLayout == 'ver'){
			this.$tabsBar.performCSSTransition(this.barPosition(index), this.options.duration, null, this.options.easing);
		}
	};
	$us.WTabs.prototype._resize = $us.WTabs.prototype.resize;
	$us.WTabs.prototype.resize = function(){
		this._resize();
		if (this.curLayout == 'default' || this.curLayout == 'ver'){
			this.$tabsBar.css(this.barPosition(this.active[0]), this.options.duration, null, this.options.easing);
		}
	};

	$(function(){
		jQuery('.w-tabs').wTabs();
	});

}(jQuery);

// Fixing contact form 7 semantics, when requested
jQuery('.wpcf7').each(function(){
	var $form = jQuery(this);

	// Removing excess wrappers
	$form.find('.w-form-field > .wpcf7-form-control-wrap > .wpcf7-form-control').each(function(){
		var $input = jQuery(this);
		if (($input.attr('type')||'').match(/^(text|email|url|tel|number|date|quiz|captcha)$/) || $input.is('textarea')){
			// Moving wrapper classes to .w-form-field, and removing the span wrapper
			var wrapperClasses = $input.parent().get(0).className;
			$input.unwrap();
			$input.parent().get(0).className += ' '+wrapperClasses;
		}
	});

	// Transforming submit button
	$form.find('.w-form-field > .wpcf7-submit').each(function(){
		var $input = jQuery(this),
			classes = $input.attr('class').split(' '),
			value = $input.attr('value') || '';
		$input.siblings('p').remove();
		if (jQuery.inArray('w-btn', classes) == -1){
			classes.push('w-btn');
		}
		var buttonHtml = '<button id="message_send" class="'+classes.join(' ')+'">' +
			'<div class="g-preloader style_2"></div>' +
			'<span class="w-btn-label">'+value+'</span>' +
			'<span class="ripple-container"></span>' +
			'</button>';
		$input.replaceWith(buttonHtml);
	});

	// Adjusting proper wrapper for select controller
	$form.find('.wpcf7-form-control-wrap > select').each(function(){
		var $select = jQuery(this);
		if ( ! $select.attr('multiple')) $select.parent().addClass('type_select');
	});
});


// Zephyr special Material Design animations
jQuery(function($){
	"use strict";

	/**
	 * Material Design Ripples
	 */
	var $body = document.body || document.documentElement,
		$bodyStyle = $body.style,
		isTransitionsSupported = $bodyStyle.transition !== undefined || $bodyStyle.WebkitTransition !== undefined;
	var removeRipple = function($ripple) {
		$ripple.off();
		if (isTransitionsSupported) {
			$ripple.addClass("ripple-out");
		} else {
			$ripple.animate({
				"opacity": 0
			}, 100, function() {
				$ripple.trigger("transitionend");
			});
		}
		$ripple.on("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function(){
			$ripple.remove();
		});
	};

	$.fn.mdRipple = function(){
		return this.each(function(){
			var $element = $(this),
				$container, containerOffset,
				startTimer = null;

			if ( ! $element.find('.ripple-container').length){
				$element.append('<span class="ripple-container"></span>');
			}

			$container = $element.find(".ripple-container");

			// Storing last touch event for touchEnd coordinates
			var lastTouch = null;
			if ($.isMobile){
				$element.on('touchstart touchmove', function(e){
					e = e.originalEvent;
					if (e.touches.length === 1) {
						lastTouch = e.touches[0];
					}
				});
			}

			$element.on($.isMobile ? 'touchend' : 'mouseup', function(e){
				var offsetLeft, offsetTop, offsetRight,
					$ripple = $('<span class="ripple"></span>'),
					rippleSize = Math.max($element.outerWidth(), $element.outerHeight()) / Math.max(20, $ripple.outerWidth()) * 2.5;

				containerOffset = $container.offset();

				// get pointer position
				if ( ! $.isMobile){
					offsetLeft = e.pageX - containerOffset.left;
					offsetTop = e.pageY - containerOffset.top;
				} else if (lastTouch !== null) {
					offsetLeft = lastTouch.pageX - containerOffset.left;
					offsetTop = lastTouch.pageY - containerOffset.top;
					lastTouch = null;
				} else {
					return;
				}

				if ($('body').hasClass('rtl')) {
					offsetRight = $container.width() - offsetLeft;
					$ripple.css({right: offsetRight, top: offsetTop});
				}else{
					$ripple.css({left: offsetLeft, top: offsetTop});
				}

				(function() { return window.getComputedStyle($ripple[0]).opacity; })();
				$container.append($ripple);

				startTimer = setTimeout(function(){
					$ripple.css({
						"-webkit-transform": "scale(" + rippleSize + ")",
						"transform": "scale(" + rippleSize + ")"
					});
					$ripple.addClass('ripple-on');
					$ripple.data('animating', 'on');
					$ripple.data('mousedown', 'on');
				}, 25);

				setTimeout(function() {
					$ripple.data('animating', 'off');
					removeRipple($ripple);
				}, 700);

			});
		});
	};

	// Initialize MD Ripples
	jQuery('.w-btn, .l-header .w-nav-anchor, .w-portfolio-item-anchor, .w-tabs-item').mdRipple();


	/**
	 * Material Design Reveal Grid: Show grid items with hierarchical timing
	 */
	$.fn.revealGridMD = function(){
		var items = $(this),
			shown = false,
			isRTL = $('.l-body').hasClass('rtl');
		if (items.length == 0) return;
		var countSz = function(){
			// The vector between the first item and the opposite x/y
			var mx = isRTL ? 100000 : 0,
				my = 0;
			// Retrieving items positions
			var sz = items.map(function(){
				var $this = jQuery(this),
					pos = $this.position();
				pos.width = $this.width();
				pos.height = $this.height();
				// Center point
				pos.cx = pos.left + parseInt(pos.width / 2);
				pos.cy = pos.top + parseInt(pos.height / 2);
				mx = Math[isRTL?'min':'max'](mx, pos.cx);
				my = Math.max(my, pos.cy);
				return pos;
			});
			var wx = mx - sz[0].cx,
				wy = my - sz[0].cy,
				wlen = Math.abs(wx * wx + wy * wy);
			// Counting projection lengths
			for (var i = 0; i < sz.length; i++) {
				// Counting vector to this item
				var vx = sz[i].cx - sz[0].cx,
					vy = sz[i].cy - sz[0].cy;
				sz[i].delta = (vx * wx + vy * wy) / wlen;
			}
			return sz;
		};
		var sz = countSz();
		items.css('opacity', 0).each(function(i, item){
			var $item = $(item);
			$item.performCSSTransition({
				opacity: 1
			}, 400, function(){
				$item.removeClass('animate_reveal');
			}, null, 750 * sz[i].delta);
		});
	};

	if ($.fn.waypoint) {
		$('.animate_revealgrid').each(function(){
			var $elm = $(this);
			new Waypoint({
				element: this,
				handler: function(){
					var $items = $elm.find('.animate_reveal');
					if ($us.canvas.$body.hasClass('disable_effects')) return $items.removeClass('animate_reveal');
					$items.revealGridMD();
					this.destroy();
				},
				offset : '85%'
			});
		});
	}
	else {
		// Fallback for waypoints script turned off
		$('.animate_revealgrid').removeClass('animate_revealgrid').find('animate_reveal').removeClass('animate_reveal');
	}
});
