Elliptical(function () {
    
    $.element('elliptical.alertNotification', 'alert-notification', {

        _initElement: function () {
            var message = this.options.message;
            var cssClass = this.options.componentCss;
            this._notify(cssClass, message, true,0,3000);
        }
    });
});