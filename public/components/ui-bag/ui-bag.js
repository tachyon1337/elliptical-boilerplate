Elliptical(function () {

    var _containerSelector = 'bag-container';
    var _listSelector = 'bag-list';
    var _itemSelector = 'bag-item';
    var _thumbSelector = 'thumb-image';
    var _summarySelector = 'bag-summary';
    var _couponSelector = 'bag-coupon';
    var _totalsSelector = 'bag-totals';
    var _actionsSelector = 'bag-actions';
    var _phoneSelector = 'phone-display';

   
    $.element("elliptical.bag", "ui-bag", {

        /* Options to be used as defaults */
        options: {


        },

        _initElement: function () {
            this._initElements();
            this._baseEvents();
        },



        /*==========================================
         PRIVATE
         *===========================================*/

        _initElements: function () {
            var element = this.element;
            this._data.bagContainer = element.find(_containerSelector);
            this._data.bagList = this._data.bagContainer.find(_listSelector);
            this._data.bagItem = this._data.bagList.find(_itemSelector);
            this._data.bagSummary = this._data.bagContainer.find(_summarySelector);
            this._data.bagCoupon = this._data.bagSummary.find(_couponSelector);
            this._data.bagTotals = this._data.bagSummary.find(_totalsSelector);
            this._data.bagActions = this._data.bagSummary.find(_actionsSelector);

        },

        /**
         * product base events
         * @private
         */
        _baseEvents: function () {
            var click = this._data.click;
            var element = this.element;
            var altImages = this._data.altImages;
            var coupon = this._data.bagCoupon;
            var actions = this._data.bagActions;
            var footer = this._data.bagList.find('footer');
            this._event(actions, click, 'button', this._onButtonAction.bind(this));
            this._event(coupon, click, 'button', this._onCouponAction.bind(this));
            this._event(footer, click, 'button', this._onUpdateAction.bind(this));
        },

        _onCouponAction: $.noop,

        _onButtonAction: $.noop,

        _onUpdateAction: $.noop



    });
});