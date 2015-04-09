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