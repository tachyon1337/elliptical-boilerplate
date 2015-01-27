Elliptical(function () {
    $.controller('elliptical.facebookApi', {
        options: {
            dataBind: false,
            facebookAppId:null
        },

        _initController: function () {
            var appId = this.options.facebookAppId;
            this._loadApi(appId);
        },

        _loadApi: function (appId) {
            window.fbAsyncInit = function () {
                FB.init({
                    appId: appId,
                    xfbml: true,
                    version: 'v2.2'
                });
            };

            (function (d, s, id) {
                var js, fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) { return; }
                js = d.createElement(s); js.id = id;
                js.src = "//connect.facebook.net/en_US/sdk.js";
                fjs.parentNode.insertBefore(js, fjs);
            }(document, 'script', 'facebook-jssdk'));
        }
    });
});