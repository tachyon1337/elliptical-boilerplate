Elliptical(function () {
    $.element.registerElement('pop-content');
    $.element('elliptical.popOver', 'ui-pop-over', {
        _initElement: function () {
            this._data.content = this.element.find('pop-content');
            if (this.options.eaWidth) {
                this._assignWidth(this.options.eaWidth);
            }
            if (this.options.eaTop) {
                this._assignTop(this.options.eaTop);
            }
        },

        _assignWidth: function (width) {
            var content = this._content();
            content.css({ width: width + 'px' });
        },

        _assignTop: function (top) {
            var content = this._content();
            content.css({ top: top + 'px' });
        },

        _content:function(){
            return this._data.content;
        },

        _events: function () {
            var click = this._data.click;
            this._event(this.element, click, this._onClick.bind(this));
        },

        _onClick: function () {
            var content = this._content();
            if (content.hasClass('show')) {
                this._hide();
            } else {
                this._show();
            }
        },

        _show: function () {
            var content = this._content();
            content.addClass('show');
            this._transitions(content, { opacity: 1, duration: 300 }, function () {

            });
        },

        _hide: function () {
            var content = this._content();
            content.removeClass('show');
            content.css({ opacity: '' });
        }
    });
});