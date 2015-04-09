Elliptical(function () {
    $.form('elliptical.profileForm', 'profile-form', {
        _initForm: function () {
            var self=this;
            setTimeout(function () {
                self._assignStateSelect();
            },500);
           
        },

        _onSuccess: function () {
            var self = this;
            setTimeout(function () {
                self._assignStateSelect();
                self._publishScope();
            }, 500);
        },

        _assignStateSelect: function () {
            var state = this.element.find('[data-ea-id="state"]');
            var val = this.$scope.state;
            state.val(val);
        },

        _publishScope: function () {
            var $scope = this.$scope;
            var clone = Object.create($scope);
            this._publish('profile.change', clone);
        }
    });
});