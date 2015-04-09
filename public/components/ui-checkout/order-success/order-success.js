(function () {

    document.addEventListener('WebComponentsReady', function () {
        $.controller('elliptical.orderSuccess','order-success',{
            _initController: function () {

            },

            _subscriptions:function(){
                this._subscribe('order.success', this._setScope.bind(this));
                this._subscribe('order.email.html.request', this._onHtmlRequest.bind(this));
            },

            _setScope:function(transaction){
                var orderNotes = transaction.shoppingBag.notes;
                if(orderNotes==='' || orderNotes===undefined){
                    orderNotes='N/A';
                }
                transaction.shoppingBag.notes = orderNotes;
                this.$scope = transaction;
                this.element.removeClass('hide');
            },

            _onHtmlRequest: function () {
                var self = this;
                setTimeout(function () {
                    var templateNode = self._data.templateNode;
                    var html = templateNode.html();
                    self._publish('order.email.html.response', html);
                });
            }


        });
    });

})();
