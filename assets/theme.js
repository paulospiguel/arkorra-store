window.theme = window.theme || {};
theme.Sections = function Sections() {
    this.constructors = {};
    this.instances = [];
    $(document).on('shopify:section:load', this._onSectionLoad.bind(this)).on('shopify:section:unload', this._onSectionUnload.bind(this)).on('shopify:section:select', this._onSelect.bind(this)).on('shopify:section:deselect', this._onDeselect.bind(this)).on('shopify:block:select', this._onBlockSelect.bind(this)).on('shopify:block:deselect', this._onBlockDeselect.bind(this));
};
theme.Sections.prototype = _.assignIn({}, theme.Sections.prototype, {
    _createInstance: function(container, constructor) {
        var $container = $(container);
        var id = $container.attr('data-section-id');
        var type = $container.attr('data-section-type');
        constructor = constructor || this.constructors[type];
        if (_.isUndefined(constructor)) {
            return;
        }
        var instance = _.assignIn(new constructor(container), {
            id: id,
            type: type,
            container: container
        });
        this.instances.push(instance);
    },
    _onSectionLoad: function(evt) {
        var container = $('[data-section-id]', evt.target)[0];
        if (container) {
            this._createInstance(container);
        }
    },
    _onSectionUnload: function(evt) {
        this.instances = _.filter(this.instances, function(instance) {
            var isEventInstance = instance.id === evt.detail.sectionId;
            if (isEventInstance) {
                if (_.isFunction(instance.onUnload)) {
                    instance.onUnload(evt);
                }
            }
            return !isEventInstance;
        });
    },
    _onSelect: function(evt) {
        var instance = _.find(this.instances, function(instance) {
            return instance.id === evt.detail.sectionId;
        });
        if (!_.isUndefined(instance) && _.isFunction(instance.onSelect)) {
            instance.onSelect(evt);
        }
    },
    _onDeselect: function(evt) {
        var instance = _.find(this.instances, function(instance) {
            return instance.id === evt.detail.sectionId;
        });
        if (!_.isUndefined(instance) && _.isFunction(instance.onDeselect)) {
            instance.onDeselect(evt);
        }
    },
    _onBlockSelect: function(evt) {
        var instance = _.find(this.instances, function(instance) {
            return instance.id === evt.detail.sectionId;
        });
        if (!_.isUndefined(instance) && _.isFunction(instance.onBlockSelect)) {
            instance.onBlockSelect(evt);
        }
    },
    _onBlockDeselect: function(evt) {
        var instance = _.find(this.instances, function(instance) {
            return instance.id === evt.detail.sectionId;
        });
        if (!_.isUndefined(instance) && _.isFunction(instance.onBlockDeselect)) {
            instance.onBlockDeselect(evt);
        }
    },
    register: function(type, constructor) {
        this.constructors[type] = constructor;
        $('[data-section-type=' + type + ']').each(function(index, container) {
            this._createInstance(container, constructor);
        }.bind(this));
    }
});
window.slate = window.slate || {};
slate.rte = {
    wrapTable: function(options) {
        options.$tables.wrap('<div class="' + options.tableWrapperClass + '"></div>');
    },
    wrapIframe: function(options) {
        options.$iframes.each(function() {
            $(this).wrap('<div class="' + options.iframeWrapperClass + '"></div>');
            this.src = this.src;
        });
    }
};
window.slate = window.slate || {};
slate.a11y = {
    pageLinkFocus: function($element) {
        var focusClass = 'js-focus-hidden';
        $element.first().attr('tabIndex', '-1').focus().addClass(focusClass).one('blur', callback);

        function callback() {
            $element.first().removeClass(focusClass).removeAttr('tabindex');
        }
    },
    focusHash: function() {
        var hash = window.location.hash;
        if (hash && document.getElementById(hash.slice(1))) {
            this.pageLinkFocus($(hash));
        }
    },
    bindInPageLinks: function() {
        $('a[href*=#]').on('click', function(evt) {
            this.pageLinkFocus($(evt.currentTarget.hash));
        }.bind(this));
    },
    trapFocus: function(options) {
        var eventName = options.namespace ? 'focusin.' + options.namespace : 'focusin';
        if (!options.$elementToFocus) {
            options.$elementToFocus = options.$container;
        }
        options.$container.attr('tabindex', '-1');
        options.$elementToFocus.focus();
        $(document).off('focusin');
        $(document).on(eventName, function(evt) {
            if (options.$container[0] !== evt.target && !options.$container.has(evt.target).length) {
                options.$container.focus();
            }
        });
    },
    removeTrapFocus: function(options) {
        var eventName = options.namespace ? 'focusin.' + options.namespace : 'focusin';
        if (options.$container && options.$container.length) {
            options.$container.removeAttr('tabindex');
        }
        $(document).off(eventName);
    }
};
theme.Images = (function() {
    function preload(images, size) {
        if (typeof images === 'string') {
            images = [images];
        }
        for (var i = 0; i < images.length; i++) {
            var image = images[i];
            this.loadImage(this.getSizedImageUrl(image, size));
        }
    }

    function loadImage(path) {
        new Image().src = path;
    }

    function switchImage(image, element, callback) {
        var size = this.imageSize(element.src);
        var imageUrl = this.getSizedImageUrl(image.src, size);
        if (callback) {
            callback(imageUrl, image, element);
        } else {
            element.src = imageUrl;
        }
    }

    function imageSize(src) {
        var match = src.match(/.+_((?:pico|icon|thumb|small|compact|medium|large|grande)|\d{1,4}x\d{0,4}|x\d{1,4})[_\\.@]/);
        if (match !== null) {
            if (match[2] !== undefined) {
                return match[1] + match[2];
            } else {
                return match[1];
            }
        } else {
            return null;
        }
    }

    function getSizedImageUrl(src, size) {
        if (size === null) {
            return src;
        }
        if (size === 'master') {
            return this.removeProtocol(src);
        }
        var match = src.match(/\.(jpg|jpeg|gif|png|bmp|bitmap|tiff|tif)(\?v=\d+)?$/i);
        if (match !== null) {
            var prefix = src.split(match[0]);
            var suffix = match[0];
            return this.removeProtocol(prefix[0] + '_' + size + suffix);
        }
        return null;
    }

    function removeProtocol(path) {
        return path.replace(/http(s)?:/, '');
    }
    return {
        preload: preload,
        loadImage: loadImage,
        switchImage: switchImage,
        imageSize: imageSize,
        getSizedImageUrl: getSizedImageUrl,
        removeProtocol: removeProtocol
    };
})();
theme.Currency = (function() {
    var moneyFormat = '${{amount}}';

    function formatMoney(cents, format) {
        if (typeof cents === 'string') {
            cents = cents.replace('.', '');
        }
        var value = '';
        var placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
        var formatString = format || moneyFormat;

        function formatWithDelimiters(number, precision, thousands, decimal) {
            thousands = thousands || ',';
            decimal = decimal || '.';
            if (isNaN(number) || number === null) {
                return 0;
            }
            number = (number / 100.0).toFixed(precision);
            var parts = number.split('.');
            var dollarsAmount = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + thousands);
            var centsAmount = parts[1] ? decimal + parts[1] : '';
            return dollarsAmount + centsAmount;
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
            case 'amount_no_decimals_with_space_separator':
                value = formatWithDelimiters(cents, 0, ' ');
                break;
        }
        return formatString.replace(placeholderRegex, value);
    }
    return {
        formatMoney: formatMoney
    };
})();
slate.Variants = (function() {
    function Variants(options) {
        this.$container = options.$container;
        this.product = options.product;
        this.singleOptionSelector = options.singleOptionSelector;
        this.originalSelectorId = options.originalSelectorId;
        this.enableHistoryState = options.enableHistoryState;
        this.currentVariant = this._getVariantFromOptions();
        $(this.singleOptionSelector, this.$container).on('change', this._onSelectChange.bind(this));
    }
    Variants.prototype = _.assignIn({}, Variants.prototype, {
        _getCurrentOptions: function() {
            var currentOptions = _.map($(this.singleOptionSelector, this.$container), function(element) {
                var $element = $(element);
                var type = $element.attr('type');
                var currentOption = {};
                if (type === 'radio' || type === 'checkbox') {
                    if ($element[0].checked) {
                        currentOption.value = $element.val();
                        currentOption.index = $element.data('index');
                        return currentOption;
                    } else {
                        return false;
                    }
                } else {
                    currentOption.value = $element.val();
                    currentOption.index = $element.data('index');
                    return currentOption;
                }
            });
            currentOptions = _.compact(currentOptions);
            return currentOptions;
        },
        _getVariantFromOptions: function() {
            var selectedValues = this._getCurrentOptions();
            var variants = this.product.variants;
            var found = _.find(variants, function(variant) {
                return selectedValues.every(function(values) {
                    return _.isEqual(variant[values.index], values.value);
                });
            });
            return found;
        },
        _onSelectChange: function() {
            var variant = this._getVariantFromOptions();
            this.$container.trigger({
                type: 'variantChange',
                variant: variant
            });
            if (!variant) {
                return;
            }
            this._updateMasterSelect(variant);
            this._updateImages(variant);
            this._updatePrice(variant);
            this._updateSKU(variant);
            this.currentVariant = variant;
            if (this.enableHistoryState) {
                this._updateHistoryState(variant);
            }
        },
        _updateImages: function(variant) {
            var variantImage = variant.featured_image || {};
            var currentVariantImage = this.currentVariant.featured_image || {};
            if (!variant.featured_image || variantImage.src === currentVariantImage.src) {
                return;
            }
            this.$container.trigger({
                type: 'variantImageChange',
                variant: variant
            });
        },
        _updatePrice: function(variant) {
            if (variant.price === this.currentVariant.price && variant.compare_at_price === this.currentVariant.compare_at_price) {
                return;
            }
            this.$container.trigger({
                type: 'variantPriceChange',
                variant: variant
            });
        },
        _updateSKU: function(variant) {
            if (variant.sku === this.currentVariant.sku) {
                return;
            }
            this.$container.trigger({
                type: 'variantSKUChange',
                variant: variant
            });
        },
        _updateHistoryState: function(variant) {
            if (!history.replaceState || !variant) {
                return;
            }
            var newurl = window.location.protocol + '//' + window.location.host + window.location.pathname + '?variant=' + variant.id;
            window.history.replaceState({
                path: newurl
            }, '', newurl);
        },
        _updateMasterSelect: function(variant) {
            $(this.originalSelectorId, this.$container).val(variant.id);
        }
    });
    return Variants;
})();
window.theme = theme || {};
// RecoverPassword Page Login
theme.customerTemplates = (function() {
    function initEventListeners() {
        // Show reset password form
        $('#RecoverPassword').on('click', function(evt) {
            evt.preventDefault();
            toggleRecoverPasswordForm();
        });

        // Hide reset password form
        $('#HideRecoverPasswordLink').on('click', function(evt) {
            evt.preventDefault();
            toggleRecoverPasswordForm();
        });
    }

    /* Show/Hide recover password form */
    function toggleRecoverPasswordForm() {
        $('#RecoverPasswordForm').toggleClass('hide');
        $('#CustomerLoginForm').toggleClass('hide');
    }

    /* Show reset password success message */
    function resetPasswordSuccess() {
        var $formState = $('.reset-password-success');

        // check if reset password form was successfully submited.
        if (!$formState.length) {
          return;
        }

        // show success message
        $('#ResetSuccess').removeClass('hide');
    }

    /* Show/hide customer address forms */
    function customerAddressForm() {
        var $newAddressForm = $('#AddressNewForm');

        if (!$newAddressForm.length) {
          return;
        }

        // Initialize observers on address selectors, defined in shopify_common.js
        if (Shopify) {
            // eslint-disable-next-line no-new
            new Shopify.CountryProvinceSelector(
                'AddressCountryNew',
                'AddressProvinceNew',
                {
                  hideElement: 'AddressProvinceContainerNew'
                }
            );
        }

        // Initialize each edit form's country/province selector
        $('.address-country-option').each(function() {
            var formId = $(this).data('form-id');
            var countrySelector = 'AddressCountry_' + formId;
            var provinceSelector = 'AddressProvince_' + formId;
            var containerSelector = 'AddressProvinceContainer_' + formId;

            // eslint-disable-next-line no-new
            new Shopify.CountryProvinceSelector(countrySelector, provinceSelector, {
                hideElement: containerSelector
            });
        });

        // Toggle new/edit address forms
        $('.address-new-toggle').on('click', function() {
            $newAddressForm.toggleClass('hide');
        });

        $('.address-edit-toggle').on('click', function() {
            var formId = $(this).data('form-id');
            $('#EditAddress_' + formId).toggleClass('hide');
        });

        $('.address-delete').on('click', function() {
            var $el = $(this);
            var formId = $el.data('form-id');
            var confirmMessage = $el.data('confirm-message');

            // eslint-disable-next-line no-alert
            if (
                confirm(
                    confirmMessage || 'Are you sure you wish to delete this address?'
                )
            ) {
                Shopify.postLink('/account/addresses/' + formId, {
                    parameters: { _method: 'delete' }
                });
            }
        });
    }

    /* Check URL for reset password hash */
    function checkUrlHash() {
        var hash = window.location.hash;

        // Allow deep linking to recover password form
        if (hash === '#recover') {
          toggleRecoverPasswordForm();
        }
    }

    return {
        init: function() {
            checkUrlHash();
            initEventListeners();
            resetPasswordSuccess();
            customerAddressForm();
        }
    };
})();
// RecoverPassword Popup Index
theme.customerloginTemplates = (function() {
    function initEventsListeners() {
        // Show reset password form
        $('#RecoversPassword').on('click', function(evt) {
            evt.preventDefault();
            toggleRecoverPasswordFormIndex();
        });

        // Hide reset password form
        $('#HideRecoverPasswordIndex').on('click', function(evt) {
            evt.preventDefault();
            toggleRecoverPasswordFormIndex();
        });
    }

    /* Show/Hide recover password form */
    function toggleRecoverPasswordFormIndex() {
        $('#RecoverPasswordFormIndex').slideToggle('fast');
    }
    return {
        init: function() {
            initEventsListeners();
        }
    };
})();
window.theme = window.theme || {};
theme.Cart = (function() {
    var selectors = {
        edit: '.js-edit-toggle'
    };
    var config = {
        showClass: 'cart__update--show',
        showEditClass: 'cart__edit--active',
        cartNoCookies: 'cart--no-cookies'
    };

    function Cart(container) {
        this.$container = $(container);
        this.$edit = $(selectors.edit, this.$container);
        if (!this.cookiesEnabled()) {
            this.$container.addClass(config.cartNoCookies);
        }
        this.$edit.on('click', this._onEditClick.bind(this));
    }
    Cart.prototype = _.assignIn({}, Cart.prototype, {
        onUnload: function() {
            this.$edit.off('click', this._onEditClick);
        },
        _onEditClick: function(evt) {
            var $evtTarget = $(evt.target);
            var $updateLine = $('.' + $evtTarget.data('target'));
            $evtTarget.toggleClass(config.showEditClass);
            $updateLine.toggleClass(config.showClass);
        },
        cookiesEnabled: function() {
            var cookieEnabled = navigator.cookieEnabled;
            if (!cookieEnabled) {
                document.cookie = 'testcookie';
                cookieEnabled = document.cookie.indexOf('testcookie') !== -1;
            }
            return cookieEnabled;
        }
    });
    return Cart;
})();
theme.Nov_Owlcarousel = (function() {
    function Nov_Owlcarousel(container) {
        var $container = (this.$container = $(container));
        var sectionId = $container.attr('data-section-id');
        var slider = (this.slider = '#shopify-section-' + sectionId + ' .nov-owl-carousel');
        if ($('html').hasClass('lang-rtl'))
            var rtl = true;
        else
            var rtl = false;
        var autoplay = $(slider).data('autoplay'),
            autoplaytimeout = $(slider).data('autoplaytimeout'),
            margin = $(slider).data('margin'),
            nav = $(slider).data('nav'),
            dots = $(slider).data('dots'),
            loop = $(slider).data('loop'),
            items = $(slider).data('items'),
            items_tablet = $(slider).data('items_tablet'),
            items_mobile = $(slider).data('items_mobile'),
            center = $(slider).data('center'),
            start = $(slider).data('start'),
            autowidth = $(slider).data('autowidth');
        $(slider).owlCarousel({
            navText: ['<i class="zmdi zmdi-chevron-left"></i>', '<i class="zmdi zmdi-chevron-right"></i>'],
            lazyLoad: true,
            lazyContent: true,
            loop: loop,
            autoplay: autoplay,
            autoplayTimeout: autoplaytimeout,
            items: items,
            margin: margin,
            rtl: rtl,
            dots: dots,
            nav: nav,
            center: center,
            autoWidth: autowidth,
            responsive: {
                0: {
                    items: items_mobile,
                    loop: true,
                    autoHeight: true,
                    autoWidth: false
                },
                768: {
                    items: items_tablet,
                    autoWidth: false
                },
                1200: {
                    items: items,
                    center: center
                },
            }
        });
    }
    return Nov_Owlcarousel;
})();
theme.Nov_Slickcarousel = (function() {
    function Nov_Slickcarousel(container) {
        var $container = (this.$container = $(container));
        var sectionId = $container.attr('data-section-id');
        var slider = (this.slider = '#shopify-section-' + sectionId + ' .nov-slick-carousel');
        var sliderNavfor = (this.slider = '#shopify-section-' + sectionId + ' .nov-slick-navfor-carousel');
        if ($('html').hasClass('lang-rtl')) {
            var rtl = true;
            var navrtl = true;
        } else {
            var rtl = false;
            var navrtl = false;
        }
        var autoplay = $(slider).data("autoplay"),
            autoplaytimeout = $(slider).data("autoplaytimeout"),
            infinite = $(slider).data("loop"),
            dots = $(slider).data("dots"),
            nav = $(slider).data("nav"),
            rows = $(slider).data("row"),
            row_mobile = $(slider).data("row_mobile") ? $(slider).data("row_mobile") : 1,
            fade = $(slider).data("fade"),
            items = $(slider).data("items"),
            items_xxl = $(slider).data("items_xxl") ? $(slider).data("items_xxl") : items,
            items_lg = $(slider).data("items_lg"),
            items_md = $(slider).data("items_md"),
            items_sm = $(slider).data("items_sm"),
            items_xs = $(slider).data("items_xs") ? $(slider).data("items_xs") : 1,
            unslick_xs = $(slider).data("unslick"),
            custnav = $(slider).data("custnav"),
            navfor = $(slider).data("navfor"),
            oneslider = $(slider).data("oneslider"),
            vertical = $(slider).data("vertical"),
            swipe = $(slider).data("swipe"),
            speed = $(slider).data("speed"),
            focus = $(slider).data("focus"),
            adaptiveheight = $(slider).data("adaptiveheight"),
            variablewidth = $(slider).data("variablewidth"),
            hover = $(slider).data("hover"),
            center = $(slider).data("center");
        if (typeof navfor!= "undefined" && navfor == true ) {
            syncing = sliderNavfor;
        } else {
            syncing = null;
        }

        if (typeof custnav!= "undefined" && $(window).width() > 1199) {
          nav = false;
        }
        if (vertical == true) {
            rtl = false
        }
        if ($(slider).hasClass('video-play')) {
            $(slider).on("init", function(slick) {
                $(slider).find('.slick-current video').trigger('play');
            });
        }
        
        $(slider).slick({
            nextArrow: '<div class="arrow-next"><i class="rbb-icon-direction-39"></i></div>',
            prevArrow: '<div class="arrow-prev"><i class="rbb-icon-direction-36"></i></div>',
            rtl: rtl,
            slidesToShow: items_xxl,
            slidesToScroll: $(slider).data("oneslider") ? $(slider).data("oneslider") : items_xxl,
            rows: rows,
            arrows: nav,
            dots: dots,
            infinite: infinite,
            fade: fade,
            speed: speed,
            autoplay: autoplay,
            autoplaySpeed: autoplaytimeout,
            vertical: vertical,
            asNavFor: syncing,
            pauseOnFocus: focus,
            pauseOnHover: hover,
            swipe: swipe,
            adaptiveHeight: adaptiveheight,
            variableWidth: variablewidth,
            centerMode: center,
            responsive: [
                {
                    breakpoint: 1440,
                    settings: {
                        slidesToShow: items,
                        slidesToScroll: $(slider).data("oneslider") ? 1 : items
                    }
                },
                {
                    breakpoint: 1200,
                    settings: {
                        slidesToShow: items_lg,
                        slidesToScroll: $(slider).data("oneslider") ? 1 : items_lg
                    }
                },
                {
                    breakpoint: 992,
                    settings: {
                        slidesToShow: items_md,
                        slidesToScroll: $(slider).data("oneslider") ? 1 : items_md
                    }
                },
                {
                    breakpoint: 768,
                    settings: {
                        slidesToShow: items_sm,
                        slidesToScroll: $(slider).data("oneslider") ? 1 : items_sm,
                        rows: row_mobile
                    }
                },
                {
                    breakpoint: 576,
                    settings: {
                        slidesToShow: items_xs,
                        slidesToScroll: $(slider).data("oneslider") ? 1 : items_xs,
                        rows: row_mobile
                    }
                }
            ]
        });

        var navautoplay = $(sliderNavfor).data("autoplay"),
            navautoplaytimeout = $(sliderNavfor).data("autoplaytimeout"),
            navinfinite = $(sliderNavfor).data("loop"),
            navdots = $(sliderNavfor).data("dots"),
            navnav = $(sliderNavfor).data("nav"),
            navfade = $(sliderNavfor).data("fade"),
            center = $(sliderNavfor).data("center"),
            variablewidth = $(sliderNavfor).data("variablewidth"),
            navitems_xl = $(sliderNavfor).data("items_xl"),
            navitems_lg = $(sliderNavfor).data("items_lg"),
            navitems_md = $(sliderNavfor).data("items_md"),
            navitems_sm = $(sliderNavfor).data("items_sm"),
            navitems_xs = $(sliderNavfor).data("items_xs") ? $(sliderNavfor).data("items_xs") : 1,
            navfor = $(sliderNavfor).data("navfor"),
            navspeed = $(sliderNavfor).data("speed"),
            navfocus = $(sliderNavfor).data("focus"),
            navswipe = $(sliderNavfor).data("swipe"),
            navhover = $(sliderNavfor).data("hover");
            if (typeof navfor!= "undefined" && navfor == true ) {
                syncing = slider;
            } else {
                syncing = null;
            }
        $(sliderNavfor).slick({
            nextArrow: '<div class="arrow-next"><i class="rbb-icon-direction-39"></i></div>',
            prevArrow: '<div class="arrow-prev"><i class="rbb-icon-direction-36"></i></div>',
            rtl: navrtl,
            slidesToShow: navitems_xl,
            slidesToScroll: navitems_xl,
            dots: navdots,
            arrows: navnav,
            infinite: navinfinite,
            fade: navfade,
            autoplay: navautoplay,
            autoplaySpeed: navautoplaytimeout,
            asNavFor: syncing,
            centerMode: center,
            variableWidth: variablewidth,
            speed: navspeed,
            pauseOnFocus: navfocus,
            pauseOnHover: navhover,
            swipe: navswipe,
            responsive: [
                {
                    breakpoint: 1440,
                    settings: {
                        slidesToShow: navitems_xl,
                        slidesToScroll: navitems_xl
                    }
                },
                {
                    breakpoint: 1200,
                    settings: {
                        slidesToShow: navitems_lg,
                        slidesToScroll: navitems_lg
                    }
                },
                {
                    breakpoint: 992,
                    settings: {
                        slidesToShow: navitems_md,
                        slidesToScroll: navitems_md
                    }
                },
                {
                    breakpoint: 768,
                    settings: {
                        slidesToShow: navitems_sm,
                        slidesToScroll: navitems_sm
                    }
                },
                {
                    breakpoint: 576,
                    settings: {
                        slidesToShow: navitems_xs,
                        slidesToScroll: navitems_xs
                    }
                }
            ]
        });

        checkClasses(slider);
        var currentSlide = $(slider).slick('slickCurrentSlide');
        if ($(slider).find('.slick-cloned').length == 0) {
            checkArrow(slider, currentSlide);
        }
        $(slider).on('afterChange', function(event, slick, currentSlide, nextSlide){
            checkClasses(slider);
            if (infinite == false) {
                checkArrow(slider, currentSlide);
            }
            if ($('#shopify-section-' + sectionId).find('[data-slick-to]').length > 0) {
                var index = $(slider).slick('slickCurrentSlide');
                $('[data-slick-to]').removeAttr('current');
                $('[data-slick-to][data-index='+ index +']').attr('current', '');
            }
            if ($(slider).hasClass('video-play')) {
                $(slider).find('video').trigger('pause');
                $(slider).find('.slick-current video').trigger('play');
            }
        });
        function checkClasses(class_parent) {
            if ($('html').hasClass('lang-rtl'))
                rtl = true;
            else
                rtl = false;
            var total = $('.slick-list .slick-active', class_parent).length;
            $('.slick-list .slick-slide', class_parent).removeClass('firstActiveItem lastActiveItem');

            $('.slick-list .slick-active', class_parent).each(function (index) {
                if (index === 0 && rtl === false) {
                    // this is the first one
                    $(this).addClass('firstActiveItem');
                } else if (index === 0 && rtl === true) {
                    $(this).addClass('lastActiveItem');
                }
                if (index === total - 1 && total > 1 && rtl === false) {
                    // this is the last one
                    $(this).addClass('lastActiveItem');
                } else if (index === total - 1 && total > 1 && rtl === true) {
                    $(this).addClass('firstActiveItem');
                }
            });
        }
        function checkArrow(el, current) {
            var num = $(el).find('.slick-slide').length,
                num_act = $(el).find('.slick-active').length,
                prev = $(el).parents('[data-section-type="nov-slick"]').find('.nav-slider--prev'),
                next = $(el).parents('[data-section-type="nov-slick"]').find('.nav-slider--next');
            if (num - num_act == 0) {
                prev.css('visibility', 'hidden');
                next.css('visibility', 'hidden');
            } else {
                prev.css('visibility', 'visible');
                next.css('visibility', 'visible');
            }
            if(current == 0) {
                prev.addClass('disabled');
            } else {
                prev.removeClass('disabled');
            }
            if (num - num_act <= current) {
                next.addClass('disabled');
            } else {
                next.removeClass('disabled');
            }
        };
        if (typeof custnav != "undefined") {
            $('.nav-slider--prev', '#shopify-section-' + sectionId).click(function(){
               $(slider).slick('slickPrev');
            });
            $('.nav-slider--next', '#shopify-section-' + sectionId).click(function(){
               $(slider).slick('slickNext');
            })
        }
        $('[data-slick-to]', '#shopify-section-' + sectionId).on('click', function(event) {
            event.preventDefault();
            $('[data-slick-to]', '#shopify-section-' + sectionId).removeAttr('current');
            $(this).attr('current', '');
            var goToSingleSlide = $(this).data('index');
            $(slider).slick('slickGoTo', goToSingleSlide);
        });
        if ($(window).width() < 576 && unslick_xs == true ) {
            $(slider).slick('unslick');
        }
    }
    return Nov_Slickcarousel;
})();
theme.Nov_SliderShow = (function() {
    function Nov_SliderShow(container) {
        var $container = (this.$container = $(container));
        var sectionId = $container.attr('data-section-id');
        var slideWrapper = (this.slideWrapper = '#shopify-section-' + sectionId + ' .main-slider');
        
        if($('html').hasClass('lang-rtl'))
            var rtl = true;
        else
            var rtl = false;

        var autoplay = $(slideWrapper).data('autoplay'),
            speed = $(slideWrapper).data('speed'),
            arrows = $(slideWrapper).data('arrows'),
            dots = $(slideWrapper).data('dots'),
            iframes = $(slideWrapper).find('.embed-player'),
            lazyImages = $(slideWrapper).find('.slide-image'),
            loadingBar = $(slideWrapper).data('loading-bar');
            zoom = $(slideWrapper).data('zoom');
        $(function() {
            $(".caption-animate", '.slick-current').each(function() {
                var caption = $(this).data("animate");
                $(this).removeClass(caption);
            });
            $(slideWrapper).on("init", function(slick) {
                slick = $(slick.currentTarget);
                if (autoplay == true && typeof loadingBar != "undefined") {
                    $(slideWrapper).find('.slick-current').addClass('timer');
                }
                $('[data-slick-to][data-index="0"]', '#shopify-section-' + sectionId).attr('current','');
                $(slideWrapper).find('.slick-current video').trigger('play');
                setTimeout(function() {
                    $(slideWrapper).find(".slick-current .slide-image").addClass("first-zoomin");
                    $(".caption-animate", '.slick-current').each(function() {
                        var caption = $(this).data("animate");
                        $(this).addClass(caption);
                    });
                }, 500);
            });
           $(slideWrapper).on("beforeChange", function(event, slick) {
                slick = $(slick.$slider);
                $(".caption-animate", '.slick-current').each(function() {
                    var caption = $(this).data("animate");
                    $(this).removeClass(caption);
                });
                if (zoom == true) {
                    $(slideWrapper).find(".slick-current .slide-image").removeClass("zoom_img");
                }
                if (autoplay == true && typeof loadingBar != "undefined") {
                    $(slideWrapper).find('.slick-current').removeClass('timer');
                }
                $(slideWrapper).find(".slide-image").removeClass('first-zoomin');
                $(slideWrapper).find(".slide-image").removeClass('first-scale');
            });
           $(slideWrapper).on("afterChange", function(event, slick, currentSlide) {
                $(".caption-animate", '.slick-current').each(function() {
                    var caption = $(this).data("animate");
                    $(this).addClass(caption);
                });
                if (zoom == true) {
                    $(slideWrapper).find(".slick-current .slide-image").addClass("zoom_img");
                }
                if (autoplay == true && typeof loadingBar != "undefined") {
                    $(slideWrapper).find('.slick-current').addClass('timer');
                }
                $(slideWrapper).find('video').trigger('pause');
                $(slideWrapper).find('.slick-current video').trigger('play');
                $('[data-slick-to]', '#shopify-section-' + sectionId).removeAttr('current');
                $('[data-slick-to][data-index="'+ currentSlide +'"]', '#shopify-section-' + sectionId).attr('current', '');

                slick = $(slick.$slider);
            });

            $(slideWrapper).slick({
                fade: true,
                nextArrow: '<div class="arrow-next"><i class="rbb-icon-direction-39"></i></div>',
                prevArrow: '<div class="arrow-prev"><i class="rbb-icon-direction-36"></i></div>',
                autoplay: autoplay,
                autoplaySpeed: speed,
                lazyLoad: "progressive",
                pauseOnHover: false,
                pauseOnFocus: false,
                speed: 600,
                arrows: arrows,
                dots: dots,
                cssEase: "cubic-bezier(0.87, 0.03, 0.41, 0.9)",
                rtl: rtl,
                adaptiveHeight: true,
            });
            $('[data-slick-to]', '#shopify-section-' + sectionId).on('click', function(event) {
                event.preventDefault();
                $('[data-slick-to]', '#shopify-section-' + sectionId).removeAttr('current');
                $(this).attr('current', '');
                var goToSingleSlide = $(this).data('index');
                $(slideWrapper).slick('slickGoTo', goToSingleSlide);
            });
        });
    }
    return Nov_SliderShow;
})();
$(document).ready(function() {
    var sections = new theme.Sections();
    sections.register('cart-template', theme.Cart);
    sections.register('slideshow-section', theme.Nov_SliderShow);
    sections.register('nov-owl', theme.Nov_Owlcarousel);
    sections.register('nov-slick', theme.Nov_Slickcarousel);
});
theme.init = function() {
    theme.customerTemplates.init();
    theme.customerloginTemplates.init();
    var tableSelectors = '.rte table,' + '.custom__item-inner--html table';
    slate.rte.wrapTable({
        $tables: $(tableSelectors),
        tableWrapperClass: 'scrollable-wrapper'
    });
    slate.a11y.pageLinkFocus($(window.location.hash));
    $('.in-page-link').on('click', function(evt) {
        slate.a11y.pageLinkFocus($(evt.currentTarget.hash));
    });
    $('a[href="#"]').on('click', function(evt) {
        evt.preventDefault();
    });
};
$(theme.init);