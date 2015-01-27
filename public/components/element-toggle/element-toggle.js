Elliptical(function () {
    var utils = elliptical.utils;
    $.controller('elliptical.elementToggle', {
        options: {
            dataBind:false
        },

        _initController: function () {
            this._setElement();
        },

        _events: function () {
            var click = this._data.click;
            this._event(this.element, click, this._onClick.bind(this));
        },

        _setElement: function () {
            var selector = this.options.elementSelector;
            selector = utils.camelCaseToDash(selector);
            this._data.selector = $(selector);
        },

        _onClick: function () {
            var selector = this._data.selector;
            (selector.hasClass('show')) ? selector.removeClass('show') : selector.addClass('show');
        }
    });
});