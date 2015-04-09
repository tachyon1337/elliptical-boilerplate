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