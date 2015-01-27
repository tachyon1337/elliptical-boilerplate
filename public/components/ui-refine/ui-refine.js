Elliptical(function () {
    $.element.registerElement('refine-label');
    $.element.registerElement('refine-button');

    var _refineFilters = 'refine-filters';
    var _refineSummary = 'refine-summary';
    var _refineButtonSelector = 'refine-button';
    var _selectionFilters = 'selection-filters';

    $.controller("elliptical.refine", "ui-refine", {

        _initController: function () {
            this._data.active = false;
            this._data.refineBtnSpan = null;
        },

        _subscriptions:function(){
            this._subscribe('refine.sync', this._onSync.bind(this));
        },

        _show: function () {
            var button = this.element.find(_refineButtonSelector);
            var refineFilters = $(_refineFilters);
            button.addClass('active');
            refineFilters.addClass('active');
            if (!refineFilters.hasClass('min-refine-height')) {//maintain a min height of refine filters container
                var height = refineFilters.height();
                refineFilters.css({ 'min-height': height + 'px' });
                refineFilters.addClass('min-refine-height');
            }
            this._data.active = true;
        },

        /**
         * hide refine filter row
         * @private
         */
        _hide: function () {
            var button = this.element.find(_refineButtonSelector);
            var refineFilters = $(_refineFilters);
            button.removeClass('active');
            refineFilters.removeClass('active');
            this._data.active = false;
        },

        _onClick: function (event) {
            var active = this._data.active;
            if (active) {
                this._hide();
            } else {
                this._show();
            }
        },

        _events: function () {
            var ele = this.element;
            var self = this;
            var click = this._data.click;
            this._event(ele, click, function (event) {
                self._onClick(event);
            });
        },

        _updateLabel: function () {
            var filters = this.$scope.filters;
            if (filters.length) {
                this._updateRefineButton(filters.length);
            } else {
                this._resetRefineButton();
            }
        },

        _updateRefineButton: function (length) {
            if (!this._data.refineBtnSpan) {
                var btn = this.element.find(_refineButtonSelector);
                btn.addClass('selections');
                var span = $('<span>' + length + '</span>');
                btn.append(span);
                this._data.refineBtnSpan = span;
            } else {
                var span = this._data.refineBtnSpan;
                span.html(length);
            }
        },

        _resetRefineButton: function () {
            var span = this._data.refineBtnSpan;
            if (span) {
                var btn = this.element.find(_refineButtonSelector);
                btn.removeClass('selections');
                span.remove();
                this._data.refineBtnSpan = null;
            }
        },

        _onSync: function (data) {
            this.$scope.filters = data;
            this._updateLabel();
        },

        _onScopeChange: function (result) {
            if (result.added.length > 0 || result.removed.length > 0) {
                this._updateLabel();
            }
        }

    });
});
