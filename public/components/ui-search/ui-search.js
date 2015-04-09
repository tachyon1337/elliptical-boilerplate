Elliptical(function () {

    $.element('elliptical.search', 'ui-search', {


        _events: function () {
            var self=this;
            var search = this.element;
            var button = search.find('button');
            var input = search.find('input');
            search.keypress(function (event) {
                if (event.which == '13') {
                    event.preventDefault();
                    var keyword = input.val();
                    if (keyword != "") {
                        self._go(keyword);
                    }
                }
            });

            this._event(button, 'click', function (event) {
                var keyword = input.val();
                if (keyword != "") {
                    self._go(keyword);
                }
            });
        },

        _go: function (keyword) {
            var action = this.options.action;
            var appendPage = this.options.appendPage;
            var pagae = '';
            if (appendPage !== undefined && appendPage) {
                page = '1';
            }
            location.href = action + '/' + keyword + '/' + page;
        }
    });
});