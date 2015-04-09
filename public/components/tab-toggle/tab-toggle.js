Elliptical(function () {
    var utils = elliptical.utils;
    $.controller('elliptical.tabToggle','tab-toggle', {
        options:{
            dataBind:false
        },

        _initController: function () {
            this._setTabElement();
        },

        _setTabElement:function(){
            var selector = this.options.tabSelector;
            selector = utils.camelCaseToDash(selector);
            this._data.selector = $(selector);
        },

        _events: function () {
            var click = this._data.click;
            this._event(this.element, click, this._onClick.bind(this));
            this._event($(window),'tabs.selected', this._onSelected.bind(this));
        },

        _onSelected: function () {
            var selector = this._data.selector;
            selector.addClass('off');
        },

        _onClick: function () {
            var selector = this._data.selector;
            (selector.hasClass('off')) ? selector.removeClass('off') : selector.addClass('off');
        }

    });
});