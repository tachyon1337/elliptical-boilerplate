Elliptical(function () {

    $.element('elliptical.inputNumber', 'ui-input-number', {

        _events: function () {
            var self = this;
            var interValId = setInterval(function () {
                var element = self.element;
                if (element[0].childNodes.length > 0) {
                    clearInterval(interValId);
                    self._bindEvents();
                }
            },500);
        },

        _bindEvents:function(){
            var self = this;
            var press = this._press();
            var element = this.element;
            var label = element.find('label');
            var input = label.find('input');
            var min = label.attr('data-min');
            var max = label.attr('data-max');

            this._event(element, press, '.plus', function (event) {
                self._onInputPlus(max, input);
            });

            this._event(element, press, '.minus', function (event) {
                self._onInputMinus(min, input);
            });
        },

        /**
         * @param max {Number}
         * @param input {Object}
         * @private
        */
        _onInputPlus: function (max, input) {
            var val = input.val();
            if (typeof val === 'undefined') {
                val = 1;
            }
            if (typeof max != 'undefined') {
                if (val < max) {
                    val++
                }
            } else {
                val++;
            }
            input.val(val);
        },

        /**
         * @param min {Number}
         * @param input {Object}
         * @private
        */
        _onInputMinus: function (min, input) {
            var val = input.val();
            if (typeof val === 'undefined') {
                val = 1;
            }
            if (typeof min != 'undefined') {
                if (val > min) {
                    val--
                }
            } else {
                val--;
            }
            input.val(val);
        }
    });
});