Elliptical(function () {
    $.form('elliptical.loginForm', 'ui-login-form', {

        options: {
            returnUrlQueryString: 'ReturnUrl'
        },

        _initForm: function () {
            this._getRedirectUrl();

        },

        

        __onSubmit: function(data){
            this._login(data.body);
        },

        _login: function (form) {
            var self = this;
            var Location = this.service('Location');
            var Membership = this.service('Membership');
            this._showLoader();
            Membership.login(form, function (err, data) {
                setTimeout(function () {
                    self._hideLoader();
                    if (!err) {
                        var returnUrl = (data.returnUrl && data.returnUrl !== undefined) ? data.returnUrl : self._data.returnUrl;
                        if (returnUrl == null) {
                            returnUrl = '/';
                        }
                        returnUrl = decodeURIComponent(returnUrl);
                        Location.redirect(returnUrl);
                    } else {
                        self._renderError({}, 'Invalid Login');
                    }

                }, 1000);

            });
        }
    });
});