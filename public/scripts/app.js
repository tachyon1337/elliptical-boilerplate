elliptical.module=(function (app) {

    app = elliptical();
    $.controller.config.template.autoRender = true;
    $.controller.config.template.bindHTML5Imports = true;

    var Service = elliptical.Service;
    var Provider = elliptical.Provider;
    var Location = elliptical.Router.Location;
    var Membership = elliptical.Membership;

    var Contact=Service.extend({
        "@resource":'Contact'
    },{});

    var Subscribe=Service.extend({
        "@resource":'Subscribe'
    },{});


    Contact.$provider=Provider.extend({
        post:function(params,resource,callback){
            var err={
                statusCode:501,
                message:'Not Implemented'
            };
            callback(err,null);
        }

    },{});

    Subscribe.$provider=Provider.extend({
        post:function(params,resource,callback){
            var err={
                statusCode:501,
                message:'Not Implemented'
            };
            callback(err,null);
        }

    },{});

    Membership.$provider = Provider.extend({
        login: function (params, callback) {
            var err={
                statusCode:501,
                message:'Not Implemented'
            };
            callback(err,null);
        },
        signUp: function (params, callback) {
            var err={
                statusCode:501,
                message:'Not Implemented'
            };
            callback(err,null);
        }
    }, {});


    // controller service injection
    $.controller.service(Service,Contact,Membership,Subscribe, Location);

    /* listen */
    app.listen();

    return app;

})(elliptical.module);
Elliptical(function(){
    $.controller('app.homeLink', {
        options:{
            dataBind:false
        },
        _events: function () {
            var press=this._press();
            this._event(this.element, press,'[data-id="home-link"]', function () {
                location.href = '/';
            });
        }
    });
});
Elliptical(function () {
    $.controller('app.subscribeInput', {
        _events: function () {
            var button = this.element.find('ui-button');
            var press = this._press();
            this._event(button, press, this._onPress.bind(this));
        },

        _onPress: function (event) {
            var input = this.element.find('input');
            var self = this;
            var val = input.val();
            if (val === "") {
                this._notify('error', 'Email Address Required', true);
            } else {
                var Subscribe = this.service('Subscribe');
                Subscribe.post({ email: val }, function (err, data) {
                    if (!err) {
                        self._notify('success', 'Your email adress has been successfully submitted', true);
                        input.val('');
                    } else {
                        var message = self._jsonParseMessage(err.message);
                        self._notify('error', message, true);
                    }
                });
            }
        }
    });
});