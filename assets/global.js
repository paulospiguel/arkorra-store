$.cookie = function(key, value, options) {
    if (arguments.length > 1 && (!/Object/.test(Object.prototype.toString.call(value)) || value === null || value === undefined)) {
        options = $.extend({}, options);
        if (value === null || value === undefined) {
            options.expires = -1
        }
        if (typeof options.expires === 'number') {
            var days = options.expires,
                t = options.expires = new Date();
            t.setDate(t.getDate() + days)
        }
        value = String(value);
        return (document.cookie = [encodeURIComponent(key), '=', options.raw ? value : encodeURIComponent(value), options.expires ? '; expires=' + options.expires.toUTCString() : '', options.path ? '; path=' + options.path : '', options.domain ? '; domain=' + options.domain : '', options.secure ? '; secure' : ''].join(''))
    }
    options = value || {};
    var decode = options.raw ? function(s) {
        return s
    } : decodeURIComponent;
    var pairs = document.cookie.split('; ');
    for (var i = 0, pair; pair = pairs[i] && pairs[i].split('='); i++) {
        if (decode(pair[0]) === key) return decode(pair[1] || '')
    }
    return null
}
if ((typeof Shopify) === 'undefined') {
    Shopify = {};
}
if (!Shopify.formatMoney) {
    Shopify.formatMoney = function(cents, format) {
        var value = '',
            placeholderRegex = /\{\{\s*(\w+)\s*\}\}/,
            formatString = (format || this.money_format);
        if (typeof cents == 'string') {
            cents = cents.replace('.', '');
        }

        function defaultOption(opt, def) {
            return (typeof opt == 'undefined' ? def : opt);
        }

        function formatWithDelimiters(number, precision, thousands, decimal) {
            precision = defaultOption(precision, 2);
            thousands = defaultOption(thousands, ',');
            decimal = defaultOption(decimal, '.');
            if (isNaN(number) || number == null) {
                return 0;
            }
            number = (number / 100.0).toFixed(precision);
            var parts = number.split('.'),
                dollars = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + thousands),
                cents = parts[1] ? (decimal + parts[1]) : '';
            return dollars + cents;
        }
        switch (formatString.match(placeholderRegex)[1]) {
            case 'amount':
                value = formatWithDelimiters(cents, 2);
                break;
            case 'amount_no_decimals':
                value = formatWithDelimiters(cents, 0);
                break;
            case 'amount_with_comma_separator':
                value = formatWithDelimiters(cents, 2, '.', ',');
                break;
            case 'amount_no_decimals_with_comma_separator':
                value = formatWithDelimiters(cents, 0, '.', ',');
                break;
        }
        return formatString.replace(placeholderRegex, value);
    };
}
window.novtheme = window.novtheme || {};
var isLoggedIn;
isLoggedIn = false;
var current_width = $(window).width(),
    min_width = 768,
    responsive_mobile = current_width < min_width;
var wishListsArr = localStorage.getItem('wishListsArr') ? JSON.parse(localStorage.getItem('wishListsArr')) : [];
localStorage.setItem('wishListsArr', JSON.stringify(wishListsArr));
if (wishListsArr.length) {
    wishListsArr = JSON.parse(localStorage.getItem('wishListsArr'));
};
novtheme.init = function() {
    novtheme.eventBlockCart();
    novtheme.VerticalThumbnailProductDetail();
    novtheme.ThumbnailProductDetail();
    novtheme.RelatedProduct();
    novtheme.load_canvas_menu();
    novtheme.NovTogglePage();
    novtheme.Countdown();
    novtheme.goToTop();
    novtheme.goToTopMobile();
    novtheme.MenuSidebar();
    novtheme.HideShowPassword();
    novtheme.NovSearchToggle();
    novtheme.NovSearchOverlay();
    novtheme.tooltip();
    novtheme.Nov_iframe_video();
    novtheme.MegaMenuSlider();
    novtheme.LoadmoreByButton();
    novtheme.Mainmenu();
    novtheme.CollectionPage();
    novtheme.CollectionPageLoadmore();
    novtheme.NovAccordion();
    novtheme.RunParallax();
    novtheme.LookBook();
    novtheme.Language();
    novtheme.CartExtent();
    novtheme.AddActive();
    novtheme.ProductStick();
    novtheme.Header_mobile();
    novtheme.Copy();
    novtheme.PageSizeGuild();
    novtheme.MobileSlider();
    novtheme.StickyHeader();
    novtheme.ProductSingleSlider();
    novtheme.NovSnow();
    novtheme.SlideShowParallax();
    novtheme.Vertical();
    novtheme.BtnSlider();
    novtheme.NavDropdownMobile();
    novtheme.NumberAnimate();
    novtheme.FakeOrder();
    novtheme.CookieGDPR();
};
//Tooltip, activated by hover event
novtheme.tooltip = function() {
    $("body").tooltip({   
        selector: "[data-toggle='tooltip']",
        container: "body"
    });
};
novtheme.swapChildren = function(obj1, obj2) {
    var temp = obj2.children().detach();
    obj2.empty().append(obj1.children().detach());
    obj1.append(temp);
};
novtheme.toggleMobileStyles = function() {
    if (responsive_mobile) {
        $("*[id^='_desktop_']").each(function(idx, el) {
            var target = $('#' + el.id.replace('_desktop_', '_mobile_'));
            if (target) {
                novtheme.swapChildren($(el), target);
            }
        });
    } else {
        $("*[id^='_mobile_']").each(function(idx, el) {
            var target = $('#' + el.id.replace('_mobile_', '_desktop_'));
            if (target) {
                novtheme.swapChildren($(el), target);
            }
        });
    }
};
novtheme.toggleSticky = function(action) {
    if (action == true) {
        $("*[class^='contentsticky_']").each(function(idx, el) {
            var target = $('.' + el.classList['0'].replace('contentsticky_', 'contentstickynew_'));
            if (target.length) {
                novtheme.swapChildren($(el), target);
            }
        });
    } else {
        $("*[class^='contentstickynew_']").each(function(idx, el) {
            var target = $('.' + el.classList['0'].replace('contentstickynew_', 'contentsticky_'));
            if (target.length) {
                novtheme.swapChildren($(el), target);
            }
        });
    }
};
novtheme.StickyHeader = function() {
    var flag_sticky = true;
    if ($(window).width() > 767) {
        if ($('.site-header').hasClass('sticky-header')) {
            if (flag_sticky == true) {
                var height = $('.site-header').height();
                var h_center = $('.header-center').height();
                var flag = true;
                var offsetTop = 0;
                $(window).scroll(function() {
                    var scrollTop = $(window).scrollTop();
                    if (scrollTop < offsetTop && scrollTop > height) {
                        if (flag == true) {
                            $('#header-sticky').addClass('sticky-header-active');
                            $('.header-center').css('height', h_center);
                            novtheme.toggleSticky(true);
                            flag = false;
                        }
                    } else {
                        if (flag == false) {
                            $('#header-sticky').removeClass('sticky-header-active');
                            novtheme.toggleSticky(false);
                            $('.header-center').css('height', 'auto');
                            flag = true;
                        }
                    }
                    offsetTop = scrollTop;
                });
            }
        }
    }
    if ($(window).width() < 768) {
        if ($('.header-mobile').hasClass('sticky-header-mobile')) {
            if (flag_sticky == true) {
                var height_m = $('.site-header').height();
                var flag_m = true;
                var offsetTop_m = 0;
                var height_promotion = 0;
                $(window).scroll(function() {
                    if ($('.section-promotion-bar').length > 0) {
                        var height_promotion = $('.section-promotion-bar').height();
                    }
                    var scrollTop_m = $(window).scrollTop();
                    if (scrollTop_m < offsetTop_m && scrollTop_m > height_m) {
                        if (flag_m == true) {
                            $('.header-mobile').addClass('sticky-header-active');
                            $('#mobile_menu').css('padding-top', '60px');
                            flag_m = false;
                        }
                    } else {
                        if (flag_m == false) {
                            $('.header-mobile').removeClass('sticky-header-active');
                            if ($('.section-promotion-bar .distance').hasClass('act')) {
                                $('#mobile_menu').css('padding-top', height_m + height_promotion);
                            } else {
                                $('#mobile_menu').css('padding-top', height_m);
                            }
                            flag_m = true;
                        }
                    }
                    offsetTop_m = scrollTop_m;
                    if ($(window).scrollTop() > height_m) {
                        $('.header-mobile').addClass('down');
                    } else {
                        $('.header-mobile').removeClass('down');
                    }
                });
            }
        }
    }
};
$(window).on('resize', function() {
    var _cw = current_width;
    var _mw = min_width;
    var _w = $(window).width();
    var _toggle = (_cw >= _mw && _w < _mw) || (_cw < _mw && _w >= _mw);
    responsive_mobile = _cw >= _mw;
    current_width = _w;
    if (_toggle) {
        novtheme.toggleMobileStyles();
        novtheme.load_canvas_menu();
        novtheme.NovTogglePage();
    }
});
novtheme.load_canvas_menu = function() {
    var $main_menu = $(".site-nav-mobile");
    if (current_width < 1200) {
        if ($("#canvas-main-menu").length < 1 && $main_menu.length > 0) {
            var $menu = $main_menu.parent().clone();
            $menu.attr("id", "canvas-main-menu");
            $($menu).find(".menu").removeAttr('id');
            $('.canvas-menu').append($menu);
            $menu.mmenu({
                offCanvas: false,
                "navbar": {
                    "title": false
                }
            });
        }
        $('.mm-next').click(function(){
            $('.navmenu-product .grid--view-items').slick('refresh');
        })
    }
};
novtheme.Header_mobile = function() {
    $('#show-megamenu').click(function(){
        if ($(this).hasClass('act')) {
            $(this).removeClass('act');
            $('body').css('overflow', 'auto');
            $('.sidebar-overlay, #mobile_menu').removeClass('act');
            $('.sidebar-overlay').css('z-index', '99')
        } else {
            $(this).addClass('act');
            $('body').css('overflow', 'hidden');
            $('.sidebar-overlay, #mobile_menu').addClass('act');
            $('.sidebar-overlay').css('z-index', '100')
        }
        $('.mobile-btn_search, #mobile_search').removeClass('act');
    });
    $('.mobile-btn_search').click(function(){
        if ($(this).hasClass('act')) {
            $(this).removeClass('act');
            $('#mobile_search').removeClass('act');
        } else {
            $(this).addClass('act');
            $('#mobile_search').addClass('act');
        }
        $('body').css('overflow', 'auto');
        $('.sidebar-overlay, #show-megamenu, #mobile_menu').removeClass('act');
    })
    var height = $('.site-header').outerHeight();
    var height_promotion = 0;
    if ($('.section-promotion-bar').length > 0) {
        var height_promotion = $('.section-promotion-bar').outerHeight();
    }
    $('#mobile_menu').css('padding-top', height + height_promotion);
    $('.promotion-close').click(function(){
        $('#mobile_menu').css('padding-top', height)
    })
};
novtheme.Copy = function () {
    $('.copy-btn').click(function() {
        const el = $(this);
        const copy = el.data('copy');
        const copied = el.data('copied');
        const input = el.siblings('input')[0];
        input.select();
        document.execCommand("copy");
        window.getSelection().removeAllRanges();
        el.text(copied);
        setTimeout(() => el.text(copy), 2500);
    });
}
novtheme.VerticalThumbnailProductDetail= function() {
    if ($(window).width() > 991 && $('.template-product').length > 0 ) {
        $(window).on('mousewheel DOMMouseScroll wheel', (function(e) {
            var proFeaturedImage = $('.product-template__scroll .proFeaturedImage');
            proFeaturedImage.find('.item.act').each(function(){
                var item = $(this),
                    p = item.data('position'),
                    hd = item.height()/2,
                    srt = $(window).scrollTop(),
                    y = e.originalEvent.deltaY,
                    offset_top = item.offset().top;
                if (y > 0) {
                    if (p < proFeaturedImage.find('.item').length) {
                        var npd = p + 1;
                    } else {
                        var npd = p;
                    }
                    if (srt > offset_top + hd) {
                       item.removeClass('act');
                       proFeaturedImage.find('.item[data-position="'+ npd +'"]').addClass('act');
                       $('.thumbItem[data-position="'+ p +'"]').removeClass('active');
                       $('.thumbItem[data-position="'+ npd +'"]').addClass('active');
                    } 
                } else {
                    if (p > 1) {
                        var npu = p - 1;
                    } else {
                        var npu = p;
                    }
                    if (srt < offset_top - hd) {
                        item.removeClass('act');
                        proFeaturedImage.find('.item[data-position="'+ npu +'"]').addClass('act');
                        $('.thumbItem[data-position="'+ p +'"]').removeClass('active');
                        $('.thumbItem[data-position="'+ npu +'"]').addClass('active');
                    }
                }
                $('.product-template__scroll .thumb_vertical_slick').slick('slickGoTo', p);
            });
        }));
        $('.product-template__scroll .thumbItem').click(function(){
            var p = $(this).data('position');
            $('.product-template__scroll .thumbItem').removeClass('active');
            $(this).addClass('active');
            $('.proFeaturedImage .item').removeClass('act');
            $('.proFeaturedImage .item[data-position="'+ p +'"]').addClass('act');
            var ost = $('.proFeaturedImage .item.act').offset().top;
            $("body,html").animate({scrollTop: ost - 60}, "normal");
        });
    }

    if ($(window).width() < 992 ) {
        $('.product-template__scroll .proFeaturedImage, .product-template__imggrid .proFeaturedImage').slick({
            slide: '.item',
            infinite: false,
            arrows: false,
            dots: true,
            slidesToShow: 1,
            slidesToScroll: 1
        }).on('afterChange',function(e,o){
            $('iframe').each(function(){
                $(this)[0].contentWindow.postMessage('{"event":"command","func":"' + 'stopVideo' + '","args":""}', '*');
            });
            $('.product-template__scroll .proFeaturedImage').find('.slick-slide:not(.slick-active) video').trigger('pause');
        });
        $('.product-template__scroll .proFeaturedImage').on('afterChange', function(event, slick, currentSlide) {
            $('#productThumbs .thumb_slick').slick('slickGoTo', currentSlide);
            $('#productThumbs .thumb_slick').find('.slick-slide').removeClass('active');
            $('#productThumbs .thumb_slick').find('.slick-slide[data-slick-index="' + currentSlide + '"]').addClass('active');
        });

        $('.product-template__scroll .thumb_slick').on('click', '.thumbItem', function(event) {
            event.preventDefault();
            $('.thumb_slick').find('.slick-slide').removeClass('active');
            $(this).addClass('active');
            var goToSingleSlide = $(this).data('slick-index');
            $('.product-template__scroll .proFeaturedImage').slick('slickGoTo', goToSingleSlide);
        });
        $('variant-radios label').click(function () {
            setTimeout(function() {
                var dindex = $('.product-template__scroll .proFeaturedImage, .product-template__imggrid .proFeaturedImage').find('.item.act').attr('data-slick-index');
                $('.product-template__scroll .proFeaturedImage, .product-template__imggrid .proFeaturedImage').slick('slickGoTo', dindex);
            }, 300);
        })
    }
};
novtheme.ThumbnailProductDetail = function() {
    var $FeaturedImage = $('.FeaturedImage_slick');
    var $ThumbImage = $('#productThumbs .thumb_slick');
    if ($('html').hasClass('lang-rtl'))
        var rtl = true;
    else
        var rtl = false;
    var dots = $FeaturedImage.data("dots"),
        nav = $FeaturedImage.data("nav"),
        draggable = $FeaturedImage.data("draggable"),
        fade = $FeaturedImage.data("fade"),
        items = $FeaturedImage.data("items"),
        items_lg = $FeaturedImage.data("items_lg"),
        items_md = $FeaturedImage.data("items_md"),
        items_sm = $FeaturedImage.data("items_sm"),
        items_xs = $FeaturedImage.data("items_xs"),
        qtyItem = $ThumbImage.find('.item').length;
        if (qtyItem < 20) {
            var dotXs = true;
        }else {
            var dotXs = false;
        }
    $FeaturedImage.slick({
        slide: '.item',
        nextArrow: '<div class="arrow-next"><i class="zmdi zmdi-chevron-right"></i></div>',
        prevArrow: '<div class="arrow-prev"><i class="zmdi zmdi-chevron-left"></i></div>',
        slidesToShow: items,
        slidesToScroll: items,
        dots: dots,
        arrows: nav,
        fade: false,
        adaptiveHeight: true,
        infinite: false,
        useTransform: true,
        speed: 500,
        cssEase: 'cubic-bezier(0.77, 0, 0.18, 1)',
        rtl: rtl,
        draggable: draggable,
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: items_lg,
                    slidesToScroll: items_lg,
                    vertical: vertical_lg,
                    verticalSwiping: vertical_lg,
                }
            },
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: items_md,
                    slidesToScroll: items_md
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: items_sm,
                    slidesToScroll: items_sm,
                    dots: false
                }
            },
            {
                breakpoint: 576,
                settings: {
                    slidesToShow: items_xs,
                    slidesToScroll: items_xs,
                    dots: dotXs
                }
            }
        ]
    });

    var autoplay = $ThumbImage.data("autoplay"),
        autoplaytimeout = $ThumbImage.data("autoplaytimeout"),
        infinite = $ThumbImage.data("loop"),
        dots = $ThumbImage.data("dots"),
        nav = $ThumbImage.data("nav"),
        loop = $ThumbImage.data('loop'),
        fade = $ThumbImage.data("fade"),
        vertical = $ThumbImage.data("vertical"),
        vertical_lg = $ThumbImage.data("vertical_lg"),
        vertical_md = $ThumbImage.data("vertical_md"),
        vertical_sm = $ThumbImage.data("vertical_sm"),
        items = $ThumbImage.data("items"),
        items_lg = $ThumbImage.data("items_lg"),
        items_md = $ThumbImage.data("items_md"),
        items_sm = $ThumbImage.data("items_sm"),
        items_xs = $ThumbImage.data("items_xs");
        if (vertical == true) {
            rtl = false;
        }
    $ThumbImage.on('init', function(event, slick) {
        $(this).find('.slick-slide.slick-current').addClass('active');
    })
    .slick({
        nextArrow: '<div class="arrow-next"><i class="zmdi zmdi-chevron-right"></i></div>',
        prevArrow: '<div class="arrow-prev"><i class="zmdi zmdi-chevron-left"></i></div>',
        slide: '.item',
        infinite: infinite,
        slidesToShow: items,
        slidesToScroll: items,
        dots: dots,
        arrows: nav,
        rtl: rtl,
        vertical: vertical,
        verticalSwiping: vertical,
        focusOnSelect: false,
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: items_lg,
                    slidesToScroll: items_lg,
                    vertical: vertical_lg,
                    verticalSwiping: vertical_lg,
                }
            },
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: items_md,
                    slidesToScroll: items_md,
                    vertical: vertical_md,
                    verticalSwiping: vertical_md,
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: items_sm,
                    slidesToScroll: items_sm,
                    vertical: vertical_sm,
                    verticalSwiping: vertical_sm,
                }
            },
            {
                breakpoint: 576,
                settings: {
                    slidesToShow: items_xs,
                    slidesToScroll: items_xs,
                    vertical: false,
                    verticalSwiping: false
                }
            }
        ]
    });
    $FeaturedImage.on('afterChange', function(event, slick, currentSlide) {
        $ThumbImage.slick('slickGoTo', currentSlide);
        $ThumbImage.find('.slick-slide.active').removeClass('active');
        $ThumbImage.find('.slick-slide[data-slick-index="' + currentSlide + '"]').addClass('active');
        $FeaturedImage.find('.slick-slide:not(.slick-active) iframe').each(function(){
            $(this)[0].contentWindow.postMessage('{"event":"command","func":"' + 'stopVideo' + '","args":""}', '*');
        });
        $FeaturedImage.find('.slick-slide:not(.slick-active) video').trigger('pause');
        // Type thumb grid
        $('.thumbgrid .thumbItem').removeClass('active');
        $('.thumbgrid .thumbItem[data-position="' + currentSlide + '"]').addClass('active');
    });
    $ThumbImage.on('click', '.slick-slide', function(event) {
        event.preventDefault();
        var goToSingleSlide = $(this).data('slick-index');
        $FeaturedImage.slick('slickGoTo', goToSingleSlide);
    });
    // Type thumb grid
    $('.thumbgrid .thumbItem').on('click', function(event) {
        event.preventDefault();
        var position = $(this).data('position');
        $FeaturedImage.slick('slickGoTo', position);
    });
    $('variant-radios label').click(function () {
        setTimeout(function() {
            var dindex = $FeaturedImage.find('.item.act').attr('data-slick-index');
            $FeaturedImage.slick('slickGoTo', dindex);
        }, 300);
    })

    if ($(window).width() < 768 ) {
        $('.thumbgrid .thumblist').slick({
            infinite: false,
            arrows: false,
            dots: false,
            slidesToShow: 4,
            slidesToScroll: 4
        })
    }
};
novtheme.RelatedProduct = function() {
    if ($('html').hasClass('lang-rtl'))
        rtl = true;
    else
        rtl = false;
    var $this = $('.slick-relatedproduct');
    var nav = $($this).data('nav');
    var dots = $($this).data('dots');
    var loop = $($this).data('loop');
    var items = $($this).data('items');
    var lg = $($this).data('lg');
    var md = $($this).data('md');
    var sm = $($this).data('sm');
    var xs = $($this).data('xs');
    $($this).slick({
        nextArrow: '<div class="arrow-next"><i class="zmdi zmdi-chevron-right"></i></div>',
        prevArrow: '<div class="arrow-prev"><i class="zmdi zmdi-chevron-left"></i></i></div>',
        infinite: loop,
        slidesToShow: items,
        slidesToScroll: items,
        rtl: rtl,
        dots: dots,
        arrows: nav,
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: lg,
                    slidesToScroll: lg
                }
            },
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: md,
                    slidesToScroll: md
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: sm,
                    slidesToScroll: sm,
                    arrows: false,
                    dot: false
                }
            },
            {
                breakpoint: 576,
                settings: {
                    slidesToShow: xs,
                    slidesToScroll: xs,
                    arrows: false,
                    dot: false
                }
            }
        ]
    });
};
//Countdown
novtheme.Countdown = function() {
    function startCountdown($countdown, showDays, restartCountdown) {
        var finalDate = $countdown.data('countdown');
        var showDays = showDays || false;
        var restartCountdown = restartCountdown || false;
        var finalDateGetTime = new Date(finalDate).getTime();
        var NewfinalDate = "";
        var now = new Date();
        if (finalDateGetTime - now.getTime() < 0 && restartCountdown == true) {
            NewfinalDate = new Date(now.getTime() + (86400 - (now.getHours() * 60 * 60) - (now.getMinutes() * 60) - now.getSeconds()) * 1000);
        } else {
            NewfinalDate = finalDate;
        }
        var dayString = showDays ? '<div class="item-time"><span class="data-number">%D</span><span class="name-time">'+ theme.strings.days +'</span></div>' : '';
        var countdown_format = dayString
                           + '<div class="item-time"><span class="data-number">%H</span><span class="name-time">'+ theme.strings.hours +'</span></div>'
                           + '<div class="item-time"><span class="data-number">%M</span><span class="name-time">'+ theme.strings.minutes +'</span></div>'
                           + '<div class="item-time"><span class="data-number">%S</span><span class="name-time">'+ theme.strings.seconds +'</span></div>';
        $countdown.countdown(NewfinalDate, function(event) {
            $countdown.html(event.strftime(countdown_format));
            $countdown.css('opacity', '1');
        }).on('finish.countdown', function() {
            if (restartCountdown) {
                startCountdown($countdown, showDays, restartCountdown);
            }
        });
    }

    $('[data-countdown]').each(function() {
        var showDays = $(this).data('show-days') || false;
        var restartCountdown = $(this).data('restart') || false;
        startCountdown($(this), showDays, restartCountdown);
    });
};
novtheme.eventBlockCart = function(e) {
    $('.cart_canvas .header-cart').click(function(){
        $(".sidebar-overlay").addClass('act');
        $("#desktop_cart").addClass('active');
        $('[nov-item-act], [nov-btn-act]').removeClass('act');
        if ($(window).width() < 768) {
            $('body').addClass('open-canvans-cart');
            $('#show-megamenu, #mobile_menu').removeClass('act');
        }
    });
    $('.close_cart').click(function(){
        $(".sidebar-overlay").removeClass('act');
        $('#desktop_cart').removeClass('active');
        $('.cart_extend').removeClass('act');
        $('.extend--label__item').removeClass('act');
        $('.cart_extend--label').removeClass('act');
        $('[nov-item-act], [nov-btn-act]').removeClass('act');
        if ($(window).width() < 768) {
            $('body').removeClass('open-canvans-cart');
        }
    });
};
novtheme.NovTogglePage = function() {
    $('.nov-toggle-page[data-target="#mobile-pageaccount"]').on('click', function(e) {
        var target = $(this).data('target');
        $(target).hasClass('active') ? ($(target).removeClass('active'), $('.sidebar-overlay').removeClass('act').css('z-index', '99')) : ($(target).addClass('active'), $('.sidebar-overlay').addClass('act').css('z-index', '999'));
        e.preventDefault();
    });
    $('.mobile-boxpage .close-box').on('click', function(e) {
        $(this).parents('.mobile-boxpage').removeClass('active');
        $('.sidebar-overlay').removeClass('act')
        e.preventDefault();
    });
};
novtheme.HideShowPassword = function() {
    $('.hide_show_password').show();
    $('.hide_show_password span').addClass('show') 
    $('.hide_show_password span').click(function(){
        if( $(this).hasClass('show')) {
            $(this).html('<i class="zmdi zmdi-eye"></i>');
            $('input[name="customer[password]"]').attr('type','text');
            $(this).removeClass('show');
        } else {
            $(this).html('<i class="zmdi zmdi-eye-off"></i>');
            $('input[name="customer[password]"]').attr('type','password');
            $(this).addClass('show');
        }
    });
        
    $('form button[type="submit"]').on('click', function(){
        $('.hide_show_password span').text('Show').addClass('show');
        $('.hide_show_password').parent().find('input[name="customer[password]"]').attr('type','password');
    });
    $('.login_switch').on('click', function() {
        if ($(this).hasClass('login-btn')) {
            $('.login_switch_register--toggle').css('transform', 'translate(0)');
            $('#p_login').slideDown();
            $('#p_register').slideUp();
        } else {
            if ($('html').hasClass('lang-rtl')) {
                $('.login_switch_register--toggle').css('transform', 'translate(-100%)');
            }
            else {
                $('.login_switch_register--toggle').css('transform', 'translate(100%)');
            }
            $('#p_login').slideUp();
            $('#p_register').slideDown();
        }
    });
};
novtheme.NovSearchToggle = function() {
    $('.search-button').on("click", function(e) {
        $(this).parent(".site-header__search").hasClass("search-active") ? ($(this).removeClass('active').parent(".site-header__search").removeClass('search-active')) : ($(this).addClass('active').parent(".site-header__search").addClass('search-active'));
        e.stopPropagation()
    });
    $(document).on('click', function(event) {
        if ($(event.target).is('.site-header__search input') == !1) {
            $('.site-header__search').removeClass("search-active");
            $('.search-button').removeClass('active');
        }
    })
    var words = $('.search-header__input').attr('placeholder'),
    arrayString = [''+ words + ''],
    part,
    i = 0,
    offset = 0,
    len = 1,
    forwards = true,
    skip_count = 0,
    skip_delay = 15,
    speed = 70;
    var wordflick = function () {
        setInterval(function () {
            if (forwards) {
                if (offset >= arrayString[i].length) {
                    ++skip_count;
                if (skip_count == skip_delay) {
                    forwards = false;
                    skip_count = 0;
                    }
                }
            }
            else {
                if (offset == 0) {
                    forwards = true;
                    i++;
                    offset = 0;
                    if (i >= len) {
                        i = 0;
                    }
                }
            }
            part = arrayString[i].substr(0, offset);
            if (skip_count == 0) {
                if (forwards) {
                offset++;
                }
                else {
                offset--;
                }
            }
            $('.search-w__animate').text(part);
        },speed);
    };
    wordflick();
    $('.search-w__animate').click(function() {
        $('.search-header__input').focus();
    })
};
novtheme.NovSearchOverlay = function() {
    $('.search__btn-overlay').on('click.break', function(event) {
        $('.site-overlay__search .search-header__input').focus();
        $('.overlay-search').addClass('open');

    });
    $('.site-overlay__close').click(function () {
        $('.overlay-search').removeClass('open');
    })
};
novtheme.goToTop = function() {
    $(window).scroll(function () {
        if ($(window).scrollTop() >= $(window).height()) {
            $('#_desktop_back_top').fadeIn(500);
        } else {
            $('#_desktop_back_top').fadeOut(100);
        }

    });
    $("#_desktop_back_top").click(function () {
        $("body,html").animate({scrollTop: 0}, "normal");
    });
};
novtheme.goToTopMobile = function() {
    if ($(window).width() < 768) {
        var timer;
        $(window).scroll(function() {
            if (timer) clearTimeout(timer)
            timer = setTimeout(function() {
                $('#back_top').fadeIn();
            }, 200);
        });
        $("#back_top").click(function() {
            $("body,html").animate({
                scrollTop: 0
            }, "normal");
            return !1
        });
    }
};
novtheme.PopupNewletter = function() {
    var date = new Date();
    var minutes = 60;
    date.setTime(date.getTime() + (minutes * 60 * 1000));
    if ($.cookie('popupNewLetterStatus') != 'closed' && $('body').outerWidth() > 768) {
        $("#popup-subscribe").modal({
            show: !0
        });
    }
    if ($.cookie('popupNewLetterStatus') != 'closed' && $("#popup-subscribe").data('sm') == true && $(window).width() < 768) {
        $("#popup-subscribe").modal({
            show: !0
        });
    }
    $('input.no-view').change(function() {
        if ($('input.no-view').prop("checked") == 1) {
            $.cookie("popupNewLetterStatus", "closed", {
                'expires': date,
                'path': '/'
            })
        } else {
            $.cookie("popupNewLetterStatus", "", {
                'expires': date,
                'path': '/'
            })
        }
    })
    $('#popup-subscribe.promotion').click(function(){
        $.cookie("popupNewLetterStatus", "closed", {
            'expires': date,
            'path': '/'
        })
    })
};
novtheme.MenuSidebar = function() {
    $('.categories__sidebar .hasSubCategory a').each(function(index) {
        if ($(this).hasClass('active')) {
            $(this).parent().children('.collapse').collapse('show');
        }
    })
};
//nov-IFRAME_VIDEO
novtheme.Nov_iframe_video = function() {
    var $videoSrc; 
    $('.icon_play').click(function() {
        $videoSrc = $(this).data( "src" );
    });
    $('#ModalVideo').on('shown.bs.modal', function (e) {
        $('#video').attr('src',$videoSrc ); 
    })
    $('#ModalVideo').on('hide.bs.modal', function (e) {
        $('#video').attr('src',''); 
    })
    $('.btn-video__play').each(function(){
        var id = $(this).data('id');
        $(this).click(function(){
            $(this).fadeOut();
            $('.bg-video__cover[data-id="'+ id +'"]').fadeOut();
            $('video[data-id="'+ id +'"]').trigger('play');
        })
        if ($(window).width() < 992) {
            $('video[data-id="'+ id +'"]').trigger('play');
        }
    })
}
novtheme.MegaMenuSlider = function() {
    if ($('html').hasClass('lang-rtl'))
        var rtl = true;
    else
        var rtl = false;
    var autoplay = $(".nav--product .grid--view-items").data("autoplay");
    $('.nav--product .grid--view-items').slick({
        autoplay: autoplay,
        autoplaySpeed: 2000,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        dots: false,
        arrows: false,
        rtl: rtl
    });
};
novtheme.SliderSyncing = function() {
    if ($('html').hasClass('lang-rtl'))
        var rtl = true;
    else
        var rtl = false;
    var arrows = $(".nov-slick-for").data('nav');
    var dots = $(".nov-slick-for").data('dots');
    $('.nov-slick-for').slick({
        nextArrow: '<div class="arrow-next"><i class="zmdi zmdi-long-arrow-right"></i></div>',
        prevArrow: '<div class="arrow-prev"><i class="zmdi zmdi-long-arrow-left"></i></div>',
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: arrows,
        dots: dots,
        asNavFor: '.nov-slick-nav',
        rtl: rtl
    });
    $('.nov-slick-nav').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        dots: false,
        asNavFor: '.nov-slick-for',
        rtl: rtl
    });
};
novtheme.LoadmoreByButton = function(){
    var moreButon =  $('.btn_loadmore');
    var data = $(moreButon).parents('.grid--view-items'),
        xxl = $(data).data('xxl'),
        xl = $(data).data('xl'),
        lg = $(data).data('lg'),
        md = $(data).data('md'),
        sm = $(data).data('sm'),
        xs = $(data).data('xs');
    $(data).find('.item').each(function () {
        index = $(this).index() + 1;
        if($(document).width() > 1439 ) {
            var n = xxl;
        }
        if($(document).width() < 1440 && $(document).width() > 1199 ) {
            var n = xl;
        }
        if($(document).width() < 1200 && $(document).width() > 991 ) {
            var n = lg;
        }
        if($(document).width() < 992 && $(document).width() > 767 ) {
            var n = lg;
        }
        if($(document).width() < 768 && $(document).width() > 575 ) {
            var n = sm;
        }
        if($(document).width() < 576 ) {
            var n = xs;
        }
        var modulo = index % n * 0.3;
        $(this).attr('data-wow-duration', modulo+'s');
        if (index % n == 0) {
            var modulo0 = index % n + n *0.3;
            $(this).attr('data-wow-duration', modulo0+'s');
        } 
    });
    $(moreButon).each(function(){
        var btnHandle = $(this).attr('btn-handle');
        var nextUrl = $(this).attr("link");
        $('body').on('click', '.'+btnHandle+'', function(){
            $.ajax({
                url: nextUrl,
                type: 'GET',
                dataType: 'html',
                beforeSend: function() {
                    $('.'+btnHandle).addClass('loading');
                }
            }).done(function(data) {
                $('.product__loadmore-'+btnHandle).append($(data).find('.product__loadmore-'+btnHandle).html());
                var m = $('.pagination__bar'+btnHandle+'').data('max');
                var dataitem = $('.product__loadmore-'+btnHandle),
                    xxl = $(dataitem).data('xxl'),
                    xl = $(dataitem).data('xl'),
                    lg = $(dataitem).data('lg'),
                    md = $(dataitem).data('md'),
                    sm = $(dataitem).data('sm'),
                    xs = $(dataitem).data('xs');
                $(dataitem).find('.item').each(function () {
                    index = $(this).index() + 1;
                    if($(document).width() > 1439 ) {
                        var n = xxl;
                    }
                    if($(document).width() < 1440 && $(document).width() > 1199 ) {
                        var n = xl;
                    }
                    if($(document).width() < 1200 && $(document).width() > 991 ) {
                        var n = lg;
                    }
                    if($(document).width() < 992 && $(document).width() > 767 ) {
                        var n = lg;
                    }
                    if($(document).width() < 768 && $(document).width() > 575 ) {
                        var n = sm;
                    }
                    if($(document).width() < 576 ) {
                        var n = xs;
                    }
                    var modulo = index % n * 0.3;
                    $(this).attr('data-wow-duration', modulo+'s');
                    if (index % n == 0) {
                        var modulo0 = index % n + n *0.3;
                        $(this).attr('data-wow-duration', modulo0+'s');
                    } 
                })
                jdgm.customizeBadges();
                nextUrl = $(data).find('.btn_loadmore').attr("link");
                var n = $('.product__loadmore-'+btnHandle).find('.item').length;
                $('.pagination__count'+btnHandle+' .count').text(n);
                $('.pagination__bar'+btnHandle+' .progress').css('width',  n/m*100 + '%');
                if (n < m) {
                    $('.'+btnHandle).removeClass('loading');
                } else {
                    $('.'+btnHandle).remove();
                }
            });
        });
    });
};
novtheme.Mainmenu = function() {
    if($(document).width() >= 1200) {
        $('.site-nav--btn').click(function(){
            $(this).toggleClass('act');
            $('#AccessibleNav').toggleClass('act');
        })
    }
    if($(document).width() < 1200 && $(document).width() > 767 ) {
        $('.site-nav--btn').click(function(){
            if ($(this).hasClass('act')) {
                $(this).removeClass('act');
                $('.sidebar-overlay, #mobile_menu').removeClass('act');
            } else {
                $(this).addClass('act');
                $('.sidebar-overlay, #mobile_menu').addClass('act');
            }
            $('.mobile-btn_search, #mobile_search').removeClass('act');
        });
        // Show sub menu canvas tablet
        $('.parent--lv1 .site-nav__link--main').click(function(e){
            e.preventDefault();
            if ($(this).hasClass('active')) {
                $(this).removeClass('active');
                $(this).parent().find('.nav-dropdown--lv1').slideUp(300);
                $(this).find('.site-nav--direc i').addClass('zmdi-chevron-down').removeClass('zmdi-chevron-up');
            } else {
                $('.nav-dropdown--lv1').slideUp(300);
                $('.site-nav__link--main').removeClass('active');
                $(this).addClass('active');
                $(this).parent().find('.nav-dropdown--lv1').slideDown(300);
                $('.site-nav__link--main .site-nav--direc i').addClass('zmdi-chevron-down').removeClass('zmdi-chevron-up');
                $(this).find('.site-nav--direc i').addClass('zmdi-chevron-up').removeClass('zmdi-chevron-down');
            }
            $('#AccessibleNav .grid--view-items').slick('refresh');
        });

        // Show sub children menu canvas tablet
        $('.parent--lv2 .site-nav__link--second').click(function(e){
            e.preventDefault();
            if ($(this).hasClass('active')) {
                $(this).removeClass('active');
                $(this).parent().find('.nav-dropdown--lv2').slideUp(300);
                $(this).find('.site-nav--direc i').addClass('zmdi-chevron-down').removeClass('zmdi-chevron-up');
            } else {
                $('.nav-dropdown--lv2').slideUp(300);
                $('.site-nav__link--second').removeClass('active');
                $(this).addClass('active');
                $(this).parent().find('.nav-dropdown--lv2').slideDown(300);
                $('.site-nav__link--second .site-nav--direc i').addClass('zmdi-chevron-down').removeClass('zmdi-chevron-up');
                $(this).find('.site-nav--direc i').addClass('zmdi-chevron-up').removeClass('zmdi-chevron-down');
            }
        });
    }
};
novtheme.CollectionPage = function() {
    if (localStorage.getItem('view_collection')) {
       $('.gridlist-toggle a').removeClass('active');
       if ($('.gridlist-toggle [data-type="'+ localStorage.getItem('view_collection') +'"]').length > 0) {
            $('.gridlist-toggle [data-type="'+ localStorage.getItem('view_collection') +'"]').addClass('active');
            $('.collection__product-content').attr('data-grid', localStorage.getItem('view_collection'));
       } else {
            $('.gridlist-toggle a:first-child').addClass('active');
            $('.collection__product-content').attr('data-grid', $('.gridlist-toggle a:first-child').data('type'));
       }
    }
    $('.gridlist-toggle a').click(function(e) {
        e.preventDefault();
        var typeview = $(this).data('type');
        if (!$(this).hasClass('active')) {
            $('.collection__product-content').attr('data-grid', typeview);
            $('.gridlist-toggle a').removeClass('active');
            $(this).addClass('active');
        }
        localStorage.setItem('view_collection', $('.collection__product-content').attr('data-grid'));
    });
    if($(document).width() <992 ) {
        $('.collection__product-content').attr('data-grid', 'grid-3');
        $('.gridlist-toggle a').removeClass('active');
        $('.gridlist-toggle #grid-3').addClass('active');
        $('.collection-topsidebar .facets__label').addClass('act')
    }
    if($(document).width() <768 ) {
        $('.collection__product-content').attr('data-grid', 'grid-2');
        $('.gridlist-toggle a').removeClass('active');
        $('.gridlist-toggle #grid-2').addClass('active');
    };
    // Click filter sort by
    var text = $('.FacetsWrapperDesktop [name="sort_by"] [selected="selected"]').text();
    var val = $('.FacetsWrapperDesktop [name="sort_by"] [selected="selected"]').attr('value');
    $('[data-sortby-filter] .sort-by__label').text(text);
    $('[data-sortby-filter] [value="'+ val +'"]').addClass('act');
    $('[data-sortby-item]').click(function () {
        var valuesort = $(this).attr('value');
        var newtext = $(this).text();
        $('[data-sortby-item]').removeClass('act');
        $(this).addClass('act');
        $('[data-sortby-filter] .sort-by__label').text(newtext);
        $('[name="sort_by"]').val(valuesort);
        const form = document.querySelector('facet-filters-form');
        form.onSubmitHandlerSortBy(event, form.querySelector('form'));
    });
    $('.collection__category-seemore').click(function(){
        $('.collection__category-item.hide').slideToggle(300);
    })
};
novtheme.CollectionPageLoadmore = function() {
    var product_grid = $('.collection__grid-loadmore'),
        next_url = product_grid.data('next-url');
    if (next_url) {
        $('.collection__btn-loadmore').click(function(){
            CollectionLoadmore();
        });
    }
    function CollectionLoadmore() {
        $.ajax (
            {
                url: next_url,
                type: 'GET',
                dataType: 'html',
                beforeSend: function(){
                    $('.collection__btn-loadmore').addClass('loading');
                }
            }
        ).done(function (next_page) {
            var new_page = $(next_page).find('.collection__grid-loadmore'),
                new_url = new_page.data('next-url'),
                m = $('.pagination__bar').data('max');
            next_url = new_url;
            if (typeof next_url !== "undefined") {
                $('.collection__btn-loadmore').removeClass('loading');
            } else {
                $('.collection__btn-loadmore').remove();
            }
            product_grid.append(new_page.html());
            var n = product_grid.find('.product--item').length;
            $('.pagination__count .count').text(n);
            $('.pagination__bar .progress').css('width',  n/m*100 + '%');
            if ($('.jdgm-widget').length) {
                jdgm.customizeBadges()
            }
            Currency.convertAll(shopCurrency, $('#currencies span.selected').attr('data-currency'));
        })
    }
};
novtheme.NovAccordion = function() {
    $('.nov-accordion__title').each(function(){
        if ($(window).width() < 768) {
            $(this).removeClass('act');
            $(this).parent().find('.nov-accordion__content').hide();
        }
        if ($(this).hasClass('act')) {
            $(this).parent().find('.nov-accordion__content').show();
        }
        $(this).click(function () {
            if ($(this).hasClass("act")) {
                $(this).removeClass("act")
                $(this).parent().find('.nov-accordion__content').slideUp()
            } else {
                $(this).parents('.nov-accordion').find('.nov-accordion__title').removeClass('act');
                $(this).parents('.nov-accordion').find('.nov-accordion__content').slideUp();
                $(this).addClass('act');
                $(this).parent().find('.nov-accordion__content').slideDown()
            }
        })
    })
};
novtheme.RunParallax = function() {
    var winHeight = $(window).height();
    if ($('.block__parallax').length) {
        $('.block__parallax').each(function(){
            var Event = false,
                offset_top = $(this).offset().top,
                distance = offset_top - winHeight;
            $(window).on('scroll', function() {
                var currentPosition = $(document).scrollTop();
                if (currentPosition > distance && Event === false) {
                    Event = true;
                    novtheme.Parallax()
                }   
            });
        });
    }
}
novtheme.Parallax = function() {
    $(window).scroll(function(){
        $('.block__parallax').each(function(){
            var winHeight = $(window).height(),
                currentPosition = $(window).scrollTop(),
                section_id = $(this).children().data('section-id'),
                offset_top = $(this).offset().top,
                distanceY = offset_top - winHeight,
                scrolled = (currentPosition - distanceY)*0.22;
            $('#shopify-section-'+section_id+' .itemY_parallax').css('transform', 'translateY(-'+ scrolled+'px)');
            $('#shopify-section-'+section_id+' .reverseY_parallax').css('transform', 'translateY('+ scrolled+'px)');
            $('#shopify-section-'+section_id+' .itemX_parallax').css('transform', 'translateX(-'+ scrolled+'px)');
            $('#shopify-section-'+section_id+' .reverseX_parallax').css('transform', 'translateX('+ scrolled+'px)');
        })
    });
}
novtheme.LookBook = function() {
    if ($('html').hasClass('lang-rtl'))
        var rtl = true;
    else
        var rtl = false;
    $('.nov-content-lookbook').each(function() {
        var el = $(this),
            $Carousel = el.find('.Lookbook__carousel'),
            btn = el.find('.lb_btn'),
            number = el.find('.number-lookbook');
        btn.click(function () {
            if ($Carousel.not('.owl-loaded')) {
                $Carousel.owlCarousel({
                    navText: ['<i class="zmdi zmdi-chevron-left"></i>', '<i class="zmdi zmdi-chevron-right"></i>'],
                    nav:true,
                    dots: false,
                    items:1,
                    margin: 10,
                    stagePadding: 0,
                    animateIn: 'fadeInDown',
                    animateOut: 'fadeOutRight',
                    lazyLoad:true,
                    mouseDrag : true,
                    touchDrag : true,
                    autoHeight: true,
                    rtl: rtl,
                    responsive: {
                        0: {
                            nav: false
                        },
                        1200: {
                            nav: true
                        }
                    }
                });
                $Carousel.on('changed.owl.carousel', function(event) {
                    var position = event.item.index;
                    number.removeClass('active');
                    number.parent().find('[data-position='+ position +']').addClass('active');
                })
            }
        })
        number.click(function(){
            var position = $(this).data('position');
            number.removeClass('active');
            $(this).addClass("active");
            $Carousel.trigger('to.owl.carousel', position);
        });  
    });
    $('.Look__content').each(function(){
        var el = $(this);
            xl = el.data('xl');
        el.find('.btn_loadmore').click(function() {
            var s = el.find('.item.show').length + xl;
            el.find('.item.hide').each(function(){
                var p = $(this).data('position');
                if (p <= s) {
                    $(this).slideDown('700', 'linear').removeClass('hide').addClass('show');
                    if (el.find('.item.hide').length == 0) {
                        el.find('.btn_loadmore').parent().hide();
                        el.parents('.distance').removeClass('h_sm');
                    }
                }
            });
        })
    });
    if ($('.item-lookbook').length > 0) {
        $('.item-lookbook').each(function () {
            var el = $(this),
            el_c = $(this).children('.content-lookbook'),
            t = el.position().top,
            l = el.position().left,
            ew = el.outerWidth(),
            h = el.offsetParent().height(),
            w = el.offsetParent().width(),
            c = el_c.width();
            if (w/2 < l) {
                el_c.css('right', (ew - 40)/2 + 40)
                if (w - l + c > w) {
                    el_c.css('margin-right', (w - l + c - w) * -1)
                }
            } else {
                el_c.css('left', (ew - 40)/2 + 40)
                if (l + ew + c > w) {
                    el_c.css('margin-left', (l + ew + c - w) * -1)
                }
            }
            if (h/2 < t) {
                el_c.css('bottom', '60px')
            } else {
                el_c.css('top', '60px')
            }
        })
    }
};
novtheme.Language = function() {
    $('.nov-language').each(function () {
        var form = $(this),
            input = $(this).find('input[name="locale_code"], input[name="country_code"]'),
            item =  $(this).find('.lang__item');
        item.click(function() {
            var value = $(this).data('value');
            input.val(value);
            form.submit();
        });
    })
};
novtheme.CartExtent = function() {
    var close = theme.strings.close_mini_canvas;
    $(document).on('click', '.extend--label__item', function(){
        var label = $(this).data('label');
        if ($(this).hasClass("act")) {
            $(this).removeClass('act');
            $('.cart_extend').removeClass('act');
            $('.cart_extend--label').removeClass('act');
            $(this).attr('data-original-title', label);
        } else {
            var siblings = $(this).siblings();
            siblings.each(function () {
               var sibTitle = $(this).data('title');
               siblings.removeClass('act');
               siblings.attr('data-original-title', sibTitle);
            })
            $('.cart_extend').removeClass('act');
            $('.cart_extend--label').removeClass('act');
            $(this).addClass('act');
            $(this).attr('data-original-title', close);
            $('.cart_extend[data-content="'+ label +'"]').addClass('act');
            $('.cart_extend--label').addClass('act');
        }
        if ($(window).width() < 768) {
            $('.block_cart_canvas #desktop_cart').addClass('open-extend');
        }
    });
    $('.extend--label__item').hover(function(){
        var title = $(this).attr('title');
        if ($(this).hasClass("act")) {
            $(this).attr('data-original-title', close);
        } else {
            $(this).attr('data-original-title', title);
        }
    },function(){
        if ($(this).hasClass("act") && typeof title !== "undefined") {
            $(this).attr('data-original-title', title);
        } else {
            $(this).attr('data-original-title', close);
        }
    });
    $(document).on('click', '.cart_extend--btn', function(){
        $('.cart_extend').removeClass('act');
        $('.cart_extend--label').removeClass('act');
        $('.extend--label__item').removeClass('act');
        if ($(window).width() < 768) {
            $('.block_cart_canvas #desktop_cart').removeClass('open-extend');
        }
    });
    $('.btn_save--discount').click(function () {
        var val = $(this).parent().find('input').val();
        $('.js-form-discount').val(val);
    });
    // Get paramaters from the URL
    function getParameterByName(name, url) {
        if (!url) {
          url = window.location.href;
        }
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }
    $discountInput = $("input.js-form-discount");
    $coupon = getParameterByName('coupon');
    if($coupon){
    $.cookie('discountCode', $coupon, 30);
    }
    $discountCode = $.cookie('discountCode');
    if($discountCode){
        if ($discountInput.length > 0) { 
          $discountInput.val( $discountCode );
        }
    }
    if ($(window).width() < 768) {
        var height = $('#desktop_cart.item_count .block_cart_top').height();
        var flag = true;
        var offsetTop = 0;
        $('#desktop_cart').scroll(function() {
            var scrollTop = $('#desktop_cart').scrollTop();
            if (scrollTop > height) {
                $('#desktop_cart.item_count .block_cart_top').addClass('scroll-down');
            } else {
                $('#desktop_cart.item_count .block_cart_top').removeClass('scroll-down');
            }
            if (scrollTop < offsetTop && scrollTop > height) {
                if (flag == true) {
                    $('#desktop_cart.item_count .block_cart_top').removeClass('scroll-down').addClass('sticky-sm');
                    flag = false;
                }
            } else {
                if (flag == false) {
                    $('#desktop_cart.item_count .block_cart_top').addClass('scroll-down').removeClass('sticky-sm');
                    flag = true;
                }
            }
            offsetTop = scrollTop;
        });
    }
};
novtheme.AddActive = function() {
    $('[nov-btn-act]').click(function(){
        var data = $(this).data('toggle');
        if ($(this).hasClass('act')) {
            $(this).removeClass('act');
            $('[data-act="'+ data +'"]').removeClass('act');
            $('body').removeClass(''+ data +'-open');
            if ($(this).is('[overlay]')) {
                $('.sidebar-overlay').removeClass('act').removeAttr('data-close');
            }
        } else {
            $('[nov-btn-act]').removeClass('act');
            $(this).addClass('act');
            $('[nov-item-act]').removeClass('act');
            $('[data-act="'+ data +'"]').addClass('act');
            $('body').addClass(''+ data +'-open');
            if ($(this).is('[overlay]')) {
                $('.sidebar-overlay').addClass('act').attr('data-close', data);
            }
        }
    });
    $('[nov-btn-close]').click(function(){
        var data = $(this).data('close');
        $('[data-act="'+ data +'"], .sidebar-overlay, [nov-btn-act]').removeClass('act');
        $('.sidebar-overlay').removeAttr('data-close');
        $('body').removeClass(''+ data +'-open');
    });
    $('[data-toggle="modal"]').click(function() {
        $('[nov-btn-act], [nov-item-act]').removeClass('act');
        $('.sidebar-overlay').removeClass('act');
    })
    $('[btn-toggle]').click(function () {
        var toggle = $(this).data('toggle');
        $(this).toggleClass('act');
        $('[nov-toggle="'+ toggle +'"]').slideToggle(400);
    })
};
novtheme.ProductStick = function() {
    var winHeight = $(window).height();
    $(window).scroll(function() {
        if ($(window).scrollTop() > winHeight) {
            $('.product-single__stick-add').addClass('act');
        } else {
            $('.product-single__stick-add').removeClass('act');
        }
    });
    $(window).on('load', function() {
        if($('.product-single__stick-add').length > 0 && $(window).width()>=768) {
            var h = $('.product-single__stick-add').height();
            $('body').css('padding-bottom', h)
        }
    })
};
novtheme.PageSizeGuild = function() {
    $('.size-guide__btn-switch').on('click', function() {
        var sizeGuide = $(this).closest('.size-guides__container');
        if ($(this).hasClass('act')) {
            sizeGuide.find('.size-guides__switch').css('transform', 'translate(0)');
            sizeGuide.find('.size-chart__1').show();
            sizeGuide.find('.size-chart__2').hide();
        } else {
            if ($('html').hasClass('lang-rtl')) {
                sizeGuide.find('.size-guides__switch').css('transform', 'translate(-100%)');
            } else {
                sizeGuide.find('.size-guides__switch').css('transform', 'translate(100%)');
            }
            sizeGuide.find('.size-chart__1').hide();
            sizeGuide.find('.size-chart__2').show();
        }
    });
    $('.size-guides__links-division').on('click','a',function(e){
        e.preventDefault;
        var body = $("html, body"),
        link = $(this).attr('data-scroll');
        if ($('#nov-sizeguide-product').length > 0) {
            $('#nov-sizeguide-product').animate({scrollTop: $('.size-guides__container[data-scrolled="'+link+'"]').position().top}, '5000', 'swing');
        } else {
            body.animate({scrollTop: $('.size-guides__container[data-scrolled="'+link+'"]').offset().top}, '5000', 'swing');
        }
    });
};
novtheme.MobileSlider = function() {
    if ($(window).width() < 768) {
        $('.nov-slide-mobile').each(function(){
            if ($('html').hasClass('lang-rtl')) {
                var rtl = true
            } else {
                var rtl = false
            }
            var el = $(this);
            el.slick({
                autoplaySpeed: 2000,
                slidesToShow: 2,
                slidesToScroll: 2,
                arrows: false,
                dots: true,
                rtl: rtl,
                responsive: [
                    {
                        breakpoint: 576,
                        settings: {
                            slidesToShow: 1,
                            slidesToScroll: 1
                        }
                    }
                ]
            });
        })
    }
}
novtheme.ProductSingleSlider = function() {
    $('.nov-product__single-slide').each(function(){
        if ($('html').hasClass('lang-rtl')) {
            var rtl = true
        } else {
            var rtl = false
        }
        var el = $(this);
        var autoplay = el.data('autoplay');
        var speed = el.data('speed');
        el.slick({
            autoplay: autoplay,
            autoplaySpeed: speed,
            speed: 500,
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: false,
            dots: true,
            rtl: rtl,
            pauseOnHover: false,
            pauseOnFocus: false,
            adaptiveHeight: true
        });
    })
}
novtheme.NovSnow = function() {
    var snows = $('.nov-snow');
    snows.each(function() {
        var s = $(this);
        var l = s.data('limit');
        for (var i = 0; i < l; i++) {
            s.append('<div></div>');
        };
    });
    const snow = document.querySelector('.nov-snow');
    if (snow) {
        function handler(entries, observer) {
            if(entries[0].isIntersecting) {
                snow.classList.add('act');
            }else {
                snow.classList.remove('act');
            }
        }
        new IntersectionObserver(handler,).observe(snow);
    }
}
novtheme.SlideShowParallax = function() {
    if ($(window).width() > 1023) {
        var scene = $('.section-slideshow .img_animate');
        scene.parallax();
    }
};
novtheme.Vertical = function() {
    var el = $(".site-nav-vertical"),
        number = el.find('.vertical-item').length,
        count = el.data('count'),
        hide = count - 1,
        count_xxl = el.data('count_xxl'),
        hi_xxl = count_xxl - 1,
        count_xl = el.data('count_xl'),
        hi_xl = count_xl - 1,
        count_lg = el.data('count_lg'),
        hi_lg = count_lg - 1,
        text_sm = el.data('textshowmore'),
        text_less = el.data('textless'),
        btn = el.find('.ver-show__more'),
        width = $(document).width();
    $('.btn-vertical').click(function(){
        if (width > 991) {
            if (!$(this).hasClass('disable_click')) {
                $(".site-nav-vertical").slideToggle(400);
            } else if(width < 1200) {
                $(".site-nav-vertical").slideToggle(400);
            }
        }
        if($(document).width() < 992 ) {
            $(".site-nav-vertical").addClass('active');
            $(".sidebar-overlay").addClass('act');
        }
    });
    if($(document).width() > 991) {
        $('body').not('.template-index').find('.site-nav-vertical').hide();
    }
    if($(document).width() < 1200 && $(document).width() > 991) {
        $('.site-nav-vertical').hide();
    }
    if (number > count && width > 1599) {
        btn.removeClass('hide');
        el.find('.vertical-item:gt('+hide+')').addClass('hide');
    } else if (number > count_xxl && width < 1600 && width > 1439) {
        btn.removeClass('hide');
        el.find('.vertical-item:gt('+hi_xxl+')').addClass('hide');
    } else if (number > count_xl && width < 1440 && width > 1199) {
        btn.removeClass('hide');
        el.find('.vertical-item:gt('+hi_xl+')').addClass('hide');
    } else if (number > count_lg && width < 1200 && width > 991) {
        btn.removeClass('hide');
        el.find('.vertical-item:gt('+hi_lg+')').addClass('hide');
    } else {
        btn.addClass('hide');
        el.find('.vertical-item').removeClass('hide');
    }
    btn.click(function() {
        if ($(this).hasClass('active')) {
            $(this).removeClass('active');
            $(this).find('.show-more__text').text(text_sm);
        } else {
            $(this).addClass('active');
            $(this).find('.show-more__text').text(text_less);
        }
        el.find('li.hide').slideToggle(300);
    });
};
novtheme.BtnSlider = function() {
    $('.nov-btn-click-slider').each(function() {
        var el = $(this),
            w = el.width(),
            slider = el.find('.el-slider'),
            btn = el.find('.btn-slider__el'),
            w_act = el.find('.active').outerWidth(),
            h = el.find('.active').outerHeight(),
            left = el.find('.active').parent().position().left;
            slider.css({'width': w_act, 'height': h, 'left': left}); 
        btn.click(function(){
            var n_left = $(this).parent().position().left,
                n_width = $(this).outerWidth();
            slider.css({'left': n_left, 'width': n_width});
        })
    })
}
novtheme.NavDropdownMobile = function() {
    $('.nav-mobile').each(function(){
        el = $(this);
        var t = el.find('.active').text();
        var h = el.find('.nav-mobile__title');
        h.text(t);
        el.find('.nav-link').click(function(){
            h.text($(this).text());
        })
    })
}
novtheme.NumberAnimate = function() {
    var winHeight = $(window).height();
    $('.number-animate').each(function () {
        var el = $(this);
        var Event = false,
            offset_top = el.offset().top,
            distance = offset_top - winHeight;
        $(window).on('scroll', function() {
            var currentPosition = $(this).scrollTop();
            if (currentPosition > distance && !Event) {
                Event = true;
                function NovRunNumber() {
                    el.prop('number', 0).animate({
                        number: el.text()
                    }, {
                        duration: 2000,
                        easing: 'swing',
                        step: function (e) {
                            $(this).text(Math.ceil(e));
                        }
                    });
                }
                NovRunNumber();
            }
        });
    });
}
novtheme.FakeOrder = function() {
    if ($('#nov-popup-fake-order').length > 0) {
        var fakeOrder = $('#nov-popup-fake-order');
        var orderData = $('#fake-order-data');
        var closefakeOrder = fakeOrder.find('.close-popup');
        var mobile = $('#nov-popup-fake-order').data('xs');
        var date = new Date();
        var time = fakeOrder.data('time');
        date.setTime(date.getTime() + time);
        var intervalId = setInterval(function() {
          insertRandomData(fakeOrder, orderData);
        }, time);
        if ($.cookie('FakeOrder') != 'closed') {
            intervalId
        } else {
            clearInterval(intervalId);
        }
        closefakeOrder.click(function() {
            $.cookie('FakeOrder', 'closed', {expires:1, path:'/'});
            fakeOrder.removeClass('act');
            clearInterval(intervalId);
        })
        if (mobile === false) {
           fakeOrder.remove(); 
        }
        function insertRandomData(fakeOrder, orderData) {
            if (fakeOrder.hasClass('act')) {
                fakeOrder.removeClass('act')
            } else {
                var productImage = fakeOrder.find('.product-image');
                var productTitle = fakeOrder.find('.product-title');
                var productTime = fakeOrder.find('.time');
                var productName = fakeOrder.find('.name');
                var productLocal = fakeOrder.find('.local');

                var productItems = $(orderData).find('.product-item');
                var randomIndex = Math.floor(Math.random() * productItems.length);
                var randomProductItem = productItems.eq(randomIndex);
                var imgSrc = randomProductItem.data('img');
                var title = randomProductItem.data('title');
                var productLink = randomProductItem.data('src');

                var dataTime = $(orderData).find('.time-item');
                var randomIndex = Math.floor(Math.random() * dataTime.length);
                var randomTimeItem = dataTime.eq(randomIndex);
                var time = randomTimeItem.data('time');

                var dataLocal = $(orderData).find('.location-item');
                var randomIndex = Math.floor(Math.random() * dataLocal.length);
                var randomLocalItem = dataLocal.eq(randomIndex);
                var local = randomLocalItem.data('local');

                var dataName = $(orderData).find('.name-item');
                var randomIndex = Math.floor(Math.random() * dataName.length);
                var randomNameItem = dataName.eq(randomIndex);
                var name = randomNameItem.data('name');

                productImage.attr('href', productLink);
                productImage.find('img').attr('src',imgSrc);
                productTitle.html(title).attr('href', productLink);
                productTime.html(time);
                productName.html(name);
                productLocal.html(local);
                fakeOrder.addClass('act');
            }
        }
    }
};
novtheme.CookieGDPR = function() {
    var date = new Date();
    date.setTime(date.getTime() + (24 * 60 * 60 * 1000));
    if ($.cookie('CookieGDPR') !== 'closed') { 
        $('#popup-CookieGDPR').addClass('act');
    }
    $('.btn-cookie-GDPR').click(function() {
        $.cookie("CookieGDPR", "closed", {
            'expires': date,
            'path': '/'
        })
        $('#popup-CookieGDPR').removeClass('act');
    })
};
$(document).ready(function() {
    var d = $(this),
        mobile = false;
    $(novtheme.init);
    if (responsive_mobile) {
        novtheme.toggleMobileStyles();
    }
    if ($("#popup-subscribe").length) {
        $(window).on('load', function() {
            setTimeout(function() {
                novtheme.PopupNewletter();
            }, 2000);
        });
    }
    if ($("#popupAlert").length) {
        $(window).on('load', function() {
            $('#popupAlert').modal();
        });
        $("#popupAlert").click(function(){
            const url = window.location.href;
            const questionMarkIndex = url.indexOf('?customer');
            if (questionMarkIndex !== -1) {
                const previousLink = url.slice(0, questionMarkIndex);
                history.pushState({}, '', previousLink);
            }
        })
    }
    var currentHeight = window.innerHeight;
    $(window).on('resize', function() {
        if (window.innerHeight - currentHeight > 200) {
            novtheme.CollectionPage();
        }
        if (d.width() <= 980 && mobile == false) {
            mobile = true;
        } else if (d.width() > 980) {
            mobile = false;
        }
    });

    $(".sidebar-overlay").on('click', function() {
        var data = $(this).data('close');
        $(this).removeClass('act');
        $('.cart_extend, .extend--label__item, .cart_extend--label, #mobile_menu, #show-megamenu, .site-nav--btn, [nov-item-act], [nov-btn-act]').removeClass('act');
        $("#desktop_cart, #AccessibleNav, .block_account_canvas, #_desktop_vertical__menu, #_mobile_vertical__menu, #mobile-pageaccount, .site-nav-vertical").removeClass('active');
        $('body').css('overflow', 'auto').removeClass('open-canvans-cart, '+ data +'-open');
        $(this).removeAttr('data-close');
    });

    // Animate load wislist page detail
    $('.group-quantity .btnProductWishlist').click(function () {
        if($(this).hasClass('whislist-added')) {
            $('#popup-Wishlist').removeClass('novload')
        } else {
            $('#popup-Wishlist').addClass('novload')
        }
    })

    // Zoom Product Image Page Detail
    if ($(window).width()>=992) {
        var productImageZoom = $('.image-zoom');
        $('.image-zoom').each(function () {
            productImageZoom = $(this);
            productImageZoom.trigger('zoom.destroy');
            productImageZoom.wrap('<span class="w-100" style="display:block"></span>').css('display', 'block').parent().zoom({
                url: productImageZoom.attr('data-zoom')
            });
        })
    }

    // Product item button sold out
    $('.no-view').click(function () {
        if($('.contact-form').hasClass('add')) {
            $('.contact-form').removeClass('add')
        } else {
            $('.contact-form').addClass('add')
        }
    });
    // Accordion footer mobile
    $(".f_btn_sl").click(function(e) {
        if ($(this).hasClass("active")) {
            $(this).removeClass('active');
            $(this).parents('.block_footer').find('.block-content.h_t').slideUp(300);
        } else {
            $(".f_btn_sl").removeClass('active');
            $('.block_footer .block-content.h_t').slideUp(300);
            $(this).addClass('active');
            $(this).parents('.block_footer').find('.block-content.h_t').slideDown(300);
        }
    });

    $(".faqs-main .panel-header").click(function(e) {
        if ($(this).hasClass("collapsed")) {
            $(".faqs-main").removeClass('active');
            $(this).parents('.faqs-main').addClass('active');
        } else {
            $(this).parents('.faqs-main').removeClass('active');
        }
    });
    $('.promotion-close').click(function () {
        $('[promationBar]').slideUp(300).removeClass('act');
    })
    new WOW().init();
})