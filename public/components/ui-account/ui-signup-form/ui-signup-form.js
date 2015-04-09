Elliptical(function () {
    $.form('elliptical.signupForm', 'ui-signup-form', {

        _initForm: function () {
            this._getRedirectUrl();
        },

      
        __onSubmit: function (data) {
            this._signUp(data.body);
           
        },

        _signUp: function (form) {
            var self = this;
            var Location = this.service('Location');
            var Membership = this.service(this.options.service);
            this._showLoader();
            Membership.signUp(form, function (err, data) {
                setTimeout(function () {
                    self._hideLoader();
                    if (!err) {
                        var returnUrl = (data.returnUrl && data.returnUrl !== undefined) ? data.returnUrl : self._data.returnUrl;
                        if (returnUrl == null) {
                            returnUrl = '/';
                        }
                        returnUrl = decodeURIComponent(returnUrl);
                        (Location && Location.redirect) ? Location.redirect(returnUrl) : location.href = returnUrl;
                    } else {
                        self._renderError({}, err.message);
                    }

                }, 1000);

            });
        }
    });
});