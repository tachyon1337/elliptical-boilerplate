(function () {

    document.addEventListener('WebComponentsReady', function () {
        $.form('elliptical.orderReview','order-review',{
            _initForm: function () {
                this._screenButton();
                var self=this;
                setTimeout(function(){
                    self._setScope();
                },1000)
            },

            _screenButton:function(){
                var self=this;
                var click=this._data.click;
                var btn=this.element.find('[data-role="screen-button"]');
                this._event(btn,click,function(event){
                    self._submit();
                });
            },

            _setScope: function () {
                var transaction = this.$viewBag.transaction;
                var transactionShoppingBag = transaction.shoppingBag;
                if (transactionShoppingBag && transactionShoppingBag !== undefined) {
                    var transactionItems = transactionShoppingBag.items;
                    if (transactionItems && transactionItems.length > 0) {
                        this.$scope = transactionShoppingBag;
                    } else {
                        this.$scope = this.$viewBag.shoppingBag;
                    }
                } else {
                    this.$scope = this.$viewBag.shoppingBag;
                }
                
                //publish scope to main checkout listener
                this._publishScope();
            },

            _publishScope:function(){
                var self=this;
                setTimeout(function(){
                    var data={
                        prop:'shoppingBag',
                        value:self.$scope
                    };
                    self._publish('checkout.bag',data);
                },100);
            },

            _onSubmit:function(data){
                this._publish('checkout.order',{});
            }



        });
    });

})();
