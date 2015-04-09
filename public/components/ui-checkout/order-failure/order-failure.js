Elliptical(function () {
    $.controller('elliptical.orderFailure', 'order-failure', {
        _events: function () {
            var click=this._data.click;
            this._event(this.element, click, 'button', this._onResubmit.bind(this));
        },

        _subscriptions: function () {
            this._subscribe('order.failure', this._setScope.bind(this));
            this._subscribe('order.headers', this._headerElements.bind(this));
            this._subscribe('order.screens', this._screenElements.bind(this));
        },

        _setScope: function (transaction) {
            this.$scope = transaction;
            this.element.removeClass('hide');
        },

        _screenElements:function(data){
            this._data.checkoutScreen = data.checkoutScreen;
            this._data.processedScreen = data.processedScreen;
        },

        _headerElements: function (data) {
            this._data.headerElement = data.header;
            this._data.failureHeaderElement = data.failureHeader;
        },

        _onResubmit: function () {
            this._setScreens();
            this._setHeaders();
        },

        _setScreens: function () {
            this.element.addClass('hide');
            this._data.processedScreen.addClass('hide');
            this._data.checkoutScreen.show();
        },

        _setHeaders: function () {
            this._data.headerElement.show();
            this._data.failureHeaderElement.addClass('hide');
        }
    });
});
