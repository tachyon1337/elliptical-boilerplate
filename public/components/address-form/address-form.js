Elliptical(function () {
    
    $.form('elliptical.addressForm', 'address-form', {
        _initForm: function () {
            this._onSuccess();
        },

        _onSuccess: function () {
            var self = this;
            setTimeout(function () {
                self._assignStateSelect();
            }, 500);
        },

        _assignStateSelect: function () {
            var state = this.element.find('[data-ea-id="state"]');
            var val = this.$scope.state;
            state.val(val);
        }
    });
});