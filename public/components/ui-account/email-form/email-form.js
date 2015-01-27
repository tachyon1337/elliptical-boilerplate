Elliptical(function () {
    $.form('elliptical.emailForm', 'email-form', {
        _initForm: function () {
            
        },

        _onSuccess: function (result) {
            var email = this.$scope.email;
            this._publish('email.change', email);
        }
    });
});