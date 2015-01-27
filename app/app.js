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