
(function () {
    document.addEventListener('WebComponentsReady', function () {
        var _ = elliptical.utils._;

        $.form('elliptical.shippingMethod','shipping-method',{
            _initForm: function () {
                this._screenButton();
                this._setScope();
            },

            _screenButton:function(){
                var self=this;
                var click=this._data.click;
                var btn=this.element.find('[data-role="screen-button"]');
                this._event(btn, click, function (event) {
                    self._submit(true);
                });
            },

            _setScope: function () {
                var transaction = this.$viewBag.transaction;
                var shippingItem = transaction.shippingItem;
                var id = shippingItem.id;
                if (id !== null && id !== '' && id !== undefined) {
                    var scope = {};
                    scope[id] = true;
                    scope.shippingMethod = this.$viewBag.shippingMethod;
                    this.$scope = scope;
                    this._publishForm(shippingItem);
                } else {
                    this.$scope.shippingMethod = this.$viewBag.shippingMethod;
                } 
            },

            _publishForm:function(value){
                var self=this;
                setTimeout(function(){
                    var data={
                        prop:'shippingItem',
                        value:value
                    };
                    self._publish('checkout.shipMethod',data);
                },100);
            },

            _setModelById:function(id){
                var arr=this.$scope.shippingMethod;
                var length=arr.length;
                var value_;
                for(var i=0;i<length;i++){
                    if(arr[i].id===id){
                        value_=arr[i];
                    }
                }
                this._publishForm(value_);
            },

            _validateForm:function(body){
                if (_.isEmpty(body)) {
                    alert("Shipping Method Required");
                    return false;
                } else {
                    return true;
                }
            },

            _onSubmit: function (data) {
                if (!this._validateForm(data.body)){
                    return false;
                }
                var id=data.body.shippingMethod;
                this._setModelById(id);
                var evtData={
                    currentStepIndex:2,
                    stepIndex:3
                };
                this._publish('checkout.step',evtData);
            }

        });
    });

})();
