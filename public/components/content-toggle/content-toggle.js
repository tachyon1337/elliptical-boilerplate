Elliptical(function () {
    $.controller('elliptical.contentToggle', {
        options:{
            dataBind: false,
            maxHeight: 200,
            heightMargin:16
        },

        _initController: function () {
            var maxHeight = parseInt(this.options.maxHeight);
            var heightMargin = parseInt(this.options.heightMargin);
            var elements = this.element.find('[role="toggle"]');
            elements.readmore({maxHeight:maxHeight,heightMargin:heightMargin});
        }
    });
});